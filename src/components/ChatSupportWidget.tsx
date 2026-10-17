"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { findBestFaqMatch } from "@/lib/faq-matcher";
import { useLanguage } from "@/context/LanguageContext";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  source?:
    | "GEMINI_AI"
    | "FAQ_MATCH"
    | "FALLBACK"
    | "GREETING"
    | "SAFETY_REDIRECT"
    | "TOPIC_REDIRECT"
    | "CLARIFICATION"
    | "OFFLINE_CLIENT";
  suggestedQuestions?: string[];
  notice?: string;
  isError?: boolean;
  failedQuery?: string;
}

interface ChatSupportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const INITIAL_SUGGESTIONS_BN = [
  "খতিয়ান বা পর্চা কী?",
  "দাগ নম্বর কীভাবে খুঁজে পাব?",
  "খতিয়ান ও দাগ নম্বরের পার্থক্য কী?",
  "জমির দলিলের সম্ভাব্য প্রতারণা কীভাবে চিনব?",
];

const INITIAL_SUGGESTIONS_EN = [
  "What is a khatian?",
  "How do I find a dag number?",
  "What is the difference between khatian and dag?",
  "How can I recognize possible land-document fraud?",
];

let globalMsgSequence = 0;
function generateUniqueId(prefix: string): string {
  globalMsgSequence += 1;
  return `${prefix}-${Date.now()}-${globalMsgSequence}`;
}

function getFormattedTime(language: "bn" | "en"): string {
  try {
    if (language === "bn") {
      return new Intl.DateTimeFormat("bn-BD", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date());
    }
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return language === "en" ? "Just now" : "এইমাত্র";
  }
}

function getWelcomeMessage(language: "bn" | "en"): ChatMessage {
  return {
    id: "msg-welcome",
    sender: "bot",
    text:
      language === "en"
        ? "Hello! I'm Bhumi Sathi, your LandGuard BD assistant. How can I help you understand khatian, dag, or land documents today?"
        : "হ্যালো! আমি ভূমিসাথী, LandGuard BD-এর AI সহকারী। খতিয়ান, দাগ বা জমির দলিল সংক্রান্ত তথ্যে কীভাবে সাহায্য করতে পারি?",
    timestamp: language === "en" ? "Just now" : "এইমাত্র",
    source: "GREETING",
    suggestedQuestions: language === "en" ? INITIAL_SUGGESTIONS_EN : INITIAL_SUGGESTIONS_BN,
  };
}

/**
 * Safe markdown-like text formatter for assistant replies.
 * Parses markdown headings (#, ##, ###), bold (**text**), code (`text`), bullet points (* or -), numbered lists, and paragraphs.
 */
function renderFormattedMessage(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listType: "ul" | "ol" = "ul";

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === "ul") {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-1.5 space-y-1 pl-4 list-disc marker:text-emerald-700">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-1.5 space-y-1 pl-4 list-decimal marker:font-semibold marker:text-emerald-800">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ol>
        );
      }
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Empty line separates paragraphs
    if (!line) {
      flushList();
      continue;
    }

    // Markdown heading check (### Heading or ## Heading)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushList();
      elements.push(
        <div key={`h-${elements.length}`} className="font-bold text-slate-900 mt-2 mb-1 text-xs sm:text-[13px] border-b border-slate-100 pb-0.5">
          {parseInlineFormatting(headingMatch[2])}
        </div>
      );
      continue;
    }

    // Bullet point check
    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      if (currentList.length > 0 && listType !== "ul") {
        flushList();
      }
      listType = "ul";
      currentList.push(bulletMatch[1]);
      continue;
    }

    // Numbered list check
    const numberMatch = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberMatch) {
      if (currentList.length > 0 && listType !== "ol") {
        flushList();
      }
      listType = "ol";
      currentList.push(numberMatch[2]);
      continue;
    }

    // Regular line
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="mb-1.5 last:mb-0 leading-relaxed">
        {parseInlineFormatting(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

/**
 * Parses bold text (**text**) and inline code (`code`)
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      // Bold
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-slate-900">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={`code-${match.index}`}
          className="rounded bg-slate-100 px-1 py-0.2 font-mono text-[11px] text-emerald-800"
        >
          {match[3]}
        </code>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function ChatSupportWidget({
  isOpen,
  onClose,
  onOpen,
}: ChatSupportWidgetProps) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [getWelcomeMessage(language)]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Dynamically auto-expand multiline textarea between 36px and 88px
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = `${Math.min(Math.max(scrollHeight, 36), 88)}px`;
    }
  }, [inputMessage]);

  // Auto-scroll to bottom on new message
  // If the conversation only contains the welcome message, adapt dynamically to active language
  const displayedMessages = useMemo(() => {
    return messages.length === 1 && messages[0].id === "msg-welcome"
      ? [getWelcomeMessage(language)]
      : messages;
  }, [messages, language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayedMessages, isOpen, isLoading]);

  // Focus input when opened and listen to Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);

    const handleKeyDownEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDownEsc);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDownEsc);
    };
  }, [isOpen, onClose]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || inputMessage).trim();
      if (!query || isLoading) return;

      const userMessageId = generateUniqueId("user");
      const userMsg: ChatMessage = {
        id: userMessageId,
        sender: "user",
        text: query,
        timestamp: getFormattedTime(language),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputMessage("");
      setIsLoading(true);

      // Build sanitized recent conversation history (up to last 6 messages, excluding welcome and errors)
      const recentHistory = messagesRef.current
        .filter((m) => m.id !== "msg-welcome" && !m.isError && m.text.trim().length > 0)
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? ("user" as const) : ("model" as const),
          text: m.text,
        }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, language, history: recentHistory }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `Server error: ${response.status}`);
        }

        const data = await response.json();

        const botMsg: ChatMessage = {
          id: generateUniqueId("bot"),
          sender: "bot",
          text: data.reply,
          timestamp: getFormattedTime(language),
          source: data.source,
          suggestedQuestions: data.suggestedQuestions,
          notice: data.notice,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err: unknown) {
        console.warn("[Bhumi Sathi] Query failed, using resilient offline fallback:", err);
        // Resilient client-side fallback if network or server error occurs
        const offlineResult = findBestFaqMatch(query, 4, language);

        const fallbackMsg: ChatMessage = {
          id: generateUniqueId("bot-fallback"),
          sender: "bot",
          text: offlineResult.formattedResponseBn,
          timestamp: getFormattedTime(language),
          source: "OFFLINE_CLIENT",
          suggestedQuestions: offlineResult.suggestedQuestions,
          notice:
            language === "en"
              ? "Live AI temporarily unavailable. Response served from curated offline land knowledge base."
              : "লাইভ এআই সাময়িকভাবে অনুপলব্ধ থাকায় অফলাইন সংরক্ষিত তথ্যভাণ্ডার থেকে উত্তরটি দেখানো হলো।",
          isError: true,
          failedQuery: query,
        };

        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputMessage, isLoading, language]
  );

  const handleClearChat = useCallback(() => {
    setMessages([getWelcomeMessage(language)]);
    setShowAllSuggestions(false);
  }, [language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ── 1. CLOSED STATE: LAUNCHER (Zendesk-style floating trigger) ── */}
      {/* Mobile: Compact circular FAB that never covers page buttons */}
      {/* Desktop: Polished pill launcher with icon, title, and live pulse dot */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          id="btn-open-chatbot"
          aria-label={
            language === "en"
              ? "Chat with Bhumi Sathi, AI Land Assistant"
              : "ভূমিসাথী এআই সহকারীর সাথে চ্যাট করুন"
          }
          className="no-print fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center gap-2 rounded-full bg-emerald-800 text-white shadow-xl hover:bg-emerald-900 active:scale-95 transition-all duration-150 focus:outline-none focus-visible:ring-3 focus-visible:ring-emerald-600/50 cursor-pointer border border-emerald-700/60 h-12 w-12 sm:h-auto sm:w-auto sm:px-4.5 sm:py-3"
        >
          {/* Support chat icon */}
          <div className="relative flex h-6 w-6 shrink-0 items-center justify-center text-emerald-200">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {/* Live active indicator */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>

          {/* Desktop text label */}
          <span className="hidden sm:inline-block text-sm font-bold tracking-tight">
            {language === "en" ? "Bhumi Sathi" : "ভূমিসাথী"}
          </span>
        </button>
      )}

      {/* ── 2. OPEN STATE: SUPPORT CONVERSATION WINDOW ── */}
      {/* Mobile: Compact right-aligned floating chat window (min(360px, 100vw-24px) x min(520px, 100dvh-100px)) */}
      {/* Desktop: Compact 390px x 580px floating conversation panel in bottom-right corner */}
      {isOpen && (
        <div
          id="landguard-chat-widget"
          role="dialog"
          aria-modal="true"
          aria-label={language === "en" ? "Bhumi Sathi AI Land Assistant" : "ভূমিসাথী এআই ভূমি সহকারী"}
          className="no-print fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 flex flex-col w-[min(360px,calc(100vw-24px))] sm:w-[390px] h-[min(520px,calc(100dvh-100px))] sm:h-[580px] rounded-2xl bg-white border border-slate-200/90 shadow-xl sm:shadow-2xl overflow-hidden transition-all duration-200 text-slate-900"
        >
          {/* Header: Compact single row (44px on mobile, 48px on desktop), permanently pinned */}
          <div className="flex h-11 sm:h-12 shrink-0 items-center justify-between border-b border-emerald-800/30 bg-emerald-900 px-3 sm:px-3.5 text-white">
            <div className="flex items-center gap-2 min-w-0">
              {/* Bot Avatar with online dot */}
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-emerald-200 border border-emerald-700/60 shadow-xs">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1.5 ring-emerald-950" />
              </div>

              {/* Title and status */}
              <div className="min-w-0 flex items-center gap-1.5 leading-none">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                  {language === "en" ? "Bhumi Sathi" : "ভূমিসাথী"}
                </h3>
                <span className="rounded-full bg-emerald-800/90 px-1.5 py-0.5 text-[9px] text-emerald-200 font-semibold border border-emerald-700/50 shrink-0">
                  {language === "en" ? "AI Assistant" : "AI সহকারী"}
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] text-emerald-300/80 ml-0.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  <span>{language === "en" ? "Online" : "সক্রিয়"}</span>
                </span>
              </div>
            </div>

            {/* Header Controls: Restart conversation & Minimize/Close */}
            <div className="flex items-center gap-1 shrink-0 ml-1.5">
              <button
                type="button"
                onClick={handleClearChat}
                title={language === "en" ? "Restart conversation" : "নতুন কথোপকথন শুরু করুন"}
                aria-label={language === "en" ? "Restart conversation" : "কথোপকথন পরিষ্কার করুন"}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={onClose}
                title={language === "en" ? "Minimize chat" : "চ্যাটবট মিনিমাইজ করুন"}
                aria-label={language === "en" ? "Minimize chat" : "চ্যাটবট মিনিমাইজ করুন"}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                {/* On mobile: ChevronDown signals minimizing down to the launcher; on desktop: X */}
                <svg
                  className="h-4 w-4 sm:hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <svg
                  className="hidden sm:block h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Conversation Stream: only this area scrolls independently */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain overflow-x-hidden p-2.5 sm:p-3 space-y-2 bg-slate-50/70 text-xs">
            {/* Subtle due diligence system pill */}
            <div className="flex justify-center mb-0.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/90 border border-slate-200/80 px-2.5 py-0.5 text-center text-[9.5px] text-slate-500 font-medium leading-tight shadow-2xs">
                <span className="text-emerald-700 font-bold">ℹ</span>
                <span>
                  {language === "en"
                    ? "Educational assistant • Not official title certification"
                    : "নাগরিক সচেতনতামূলক সহায়িকা • কোনো সরকারি স্বত্ব প্রত্যয়ন নয়"}
                </span>
              </span>
            </div>

            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-2.5 sm:p-3 leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-emerald-800 text-white rounded-br-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {/* Message body */}
                  <div className="text-xs sm:text-[13px]">
                    {renderFormattedMessage(msg.text)}
                  </div>

                  {/* Fallback Notice Indicator */}
                  {msg.notice && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-200/60 leading-tight">
                      {msg.notice}
                    </div>
                  )}

                  {/* Retry Action on Error */}
                  {msg.isError && msg.failedQuery && (
                    <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleSendMessage(msg.failedQuery)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2 cursor-pointer"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span>{language === "en" ? "Retry question" : "পুনরায় চেষ্টা করুন"}</span>
                      </button>
                    </div>
                  )}

                  {/* Source and timestamp footer (omitted on welcome message to keep it a simple, compact chat bubble) */}
                  {msg.sender === "bot" && msg.id !== "msg-welcome" && (
                    <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-medium">
                        {msg.source === "GEMINI_AI" ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span>✦</span>
                            <span>{language === "en" ? "Bhumi Sathi AI (Live)" : "ভূমিসাথী এআই (লাইভ)"}</span>
                          </span>
                        ) : msg.source === "GREETING" ? (
                          <span className="text-emerald-700 font-semibold">
                            {language === "en" ? "Bhumi Sathi" : "ভূমিসাথী"}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {language === "en" ? "Knowledge Base" : "সংরক্ষিত তথ্য"}
                          </span>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {/* Suggested prompt chips: small, clean, less visually dominant; at most 2 initially */}
                {msg.sender === "bot" &&
                  msg.suggestedQuestions &&
                  msg.suggestedQuestions.length > 0 &&
                  (msg.id !== "msg-welcome" || messages.length === 1) && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 max-w-[95%]">
                      {(msg.id === "msg-welcome" && !showAllSuggestions
                        ? msg.suggestedQuestions.slice(0, 2)
                        : msg.suggestedQuestions
                      ).map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          disabled={isLoading}
                          className="group inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/90 hover:border-emerald-300 px-2.5 py-1 text-[11px] font-normal transition shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95 text-left max-w-full"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600/70 shrink-0" />
                          <span className="leading-snug">{q}</span>
                        </button>
                      ))}

                      {msg.id === "msg-welcome" && msg.suggestedQuestions.length > 2 && (
                        <button
                          type="button"
                          id="btn-more-suggestions"
                          onClick={() => setShowAllSuggestions((prev) => !prev)}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 border border-slate-200/80 px-2 py-0.5 text-[10.5px] font-medium transition cursor-pointer active:scale-95"
                        >
                          <span>
                            {showAllSuggestions
                              ? language === "en"
                                ? "Show fewer"
                                : "কম দেখান"
                              : language === "en"
                              ? `+${msg.suggestedQuestions.length - 2} more`
                              : `+${msg.suggestedQuestions.length - 2}টি আরও প্রশ্ন`}
                          </span>
                          <svg
                            className={`h-2.5 w-2.5 transition-transform ${showAllSuggestions ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
              </div>
            ))}

            {/* Subtle typing indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200/90 rounded-2xl px-3 py-1.5 w-fit shadow-2xs">
                <span className="inline-flex gap-1 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[11px] font-medium text-emerald-900">
                  {language === "en" ? "Bhumi Sathi is checking..." : "ভূমিসাথী তথ্য যাচাই করছে..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer: Integrated support input box pinned to bottom with safe-area padding */}
          <div className="shrink-0 border-t border-slate-200/90 bg-white px-3 pt-2 pb-2 sm:px-3.5 sm:pt-2.5 sm:pb-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300/90 bg-slate-50/70 px-2 py-1 focus-within:border-emerald-700 focus-within:bg-white focus-within:ring-1 focus-within:ring-emerald-700/25 transition-all"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                placeholder={
                  language === "en"
                    ? "Ask about khatian, dag, deeds..."
                    : "খতিয়ান, দাগ বা দলিল নিয়ে জিজ্ঞাসা করুন..."
                }
                maxLength={500}
                disabled={isLoading}
                aria-label={
                  language === "en"
                    ? "Ask Bhumi Sathi a land-related question"
                    : "ভূমিসাথীকে ভূমি সংক্রান্ত প্রশ্ন লিখুন"
                }
                className="flex-1 bg-transparent px-1 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 resize-none max-h-24 min-h-[32px] sm:min-h-[34px] leading-snug overflow-y-auto"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label={language === "en" ? "Send message" : "বার্তা পাঠান"}
                className="flex h-7.5 w-7.5 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-2xs hover:bg-emerald-900 active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>

            <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-slate-400 leading-tight">
              <span className="truncate">
                {language === "en"
                  ? "Enter to send • Shift+Enter for newline"
                  : "Enter চেপে পাঠান • নতুন লাইনের জন্য Shift+Enter"}
              </span>
              {inputMessage.length > 350 && (
                <span className={`shrink-0 ml-1 ${inputMessage.length > 480 ? "text-rose-600 font-bold" : ""}`}>
                  {inputMessage.length}/500
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


