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
        ? "Hello! I'm Bhumi Sathi, your LandGuard BD assistant. I can help you understand khatian, dag numbers, mouza, land documents, verification results, and common land-fraud warning signs. What would you like to know?"
        : "আসসালামু আলাইকুম! আমি ভূমিসাথী, LandGuard BD-এর AI সহকারী। খতিয়ান, দাগ নম্বর, মৌজা, জমির কাগজপত্র, যাচাইয়ের ফলাফল এবং ভূমি জালিয়াতির সাধারণ ঝুঁকি বুঝতে আমি সাহায্য করতে পারি। আপনি কী জানতে চান?",
    timestamp: language === "en" ? "Just now" : "এইমাত্র",
    source: "GREETING",
    suggestedQuestions: language === "en" ? INITIAL_SUGGESTIONS_EN : INITIAL_SUGGESTIONS_BN,
  };
}

/**
 * Safe markdown-like text formatter for assistant replies.
 * Parses bold (**text**), bullet points (* or -), numbered lists, and paragraphs.
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
 * Parses bold text (**text**) and clickable links
 */
function parseInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold**
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="font-bold text-slate-900">
        {match[1]}
      </strong>
    );
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
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

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

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

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, language }),
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
  }, [language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON (Bottom-Right, Hidden in print) ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          id="btn-open-chatbot"
          aria-label={language === "en" ? "Ask Bhumi Sathi, the Land Assistant" : "ভূমিসাথীকে জিজ্ঞাসা করুন"}
          className="no-print fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2.5 rounded-full bg-emerald-800 px-4 py-2.5 sm:px-4.5 sm:py-3 text-white shadow-xl hover:bg-emerald-900 active:scale-95 transition-all focus:outline-none focus:ring-3 focus:ring-emerald-600/40 cursor-pointer border border-emerald-700/50"
        >
          {/* Friendly Land Assistant Badge */}
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700/80 text-emerald-200">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>

          <div className="text-left">
            <span className="block text-xs sm:text-sm font-bold tracking-tight">
              {language === "en" ? "Ask Bhumi Sathi" : "ভূমিসাথীকে জিজ্ঞাসা করুন"}
            </span>
            <span className="block text-[10px] text-emerald-200 font-medium leading-none">
              {language === "en" ? "AI Land Assistant" : "এআই ভূমি সহকারী"}
            </span>
          </div>
        </button>
      )}

      {/* ── EXPANDED CHAT PANEL (Hidden in print) ── */}
      {isOpen && (
        <div
          id="landguard-chat-widget"
          role="dialog"
          aria-label={language === "en" ? "Bhumi Sathi AI Land Assistant" : "ভূমিসাথী এআই ভূমি সহকারী"}
          className="no-print fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex flex-col w-[calc(100vw-1.5rem)] sm:w-[410px] max-w-full h-[540px] max-h-[85vh] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden transition-all animate-in slide-in-from-bottom-5 duration-200 text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-800/10 bg-emerald-900 px-3.5 py-2.5 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Friendly Assistant Avatar */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-emerald-200 border border-emerald-700/60 shadow-xs">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                    {language === "en" ? "Bhumi Sathi" : "ভূমিসাথী"}
                  </h3>
                  <span className="rounded-full bg-emerald-800/90 px-1.5 py-0.2 text-[9px] text-emerald-200 font-semibold border border-emerald-700/50 shrink-0">
                    {language === "en" ? "AI Assistant" : "AI সহকারী"}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-emerald-200/80 truncate">
                  {language === "en"
                    ? "Your friendly land assistant"
                    : "আপনার ভূমি-তথ্য সহায়ক"}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-0.5 shrink-0 ml-1">
              <button
                type="button"
                onClick={handleClearChat}
                title={language === "en" ? "Start new conversation" : "নতুন কথোপকথন শুরু করুন"}
                aria-label={language === "en" ? "Clear conversation" : "কথোপকথন পরিষ্কার করুন"}
                className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
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
                title={language === "en" ? "Close assistant" : "বন্ধ করুন"}
                aria-label={language === "en" ? "Close assistant" : "চ্যাটবট বন্ধ করুন"}
                className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Educational Disclaimer Banner */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-3 py-1.5 text-[10px] sm:text-[11px] text-amber-900 leading-tight flex items-start gap-1.5 shrink-0">
            <span className="text-amber-700 font-bold shrink-0 mt-0.5">ℹ️</span>
            <span>
              {language === "en"
                ? "Educational assistant for due diligence. Not a government title certificate or formal legal advice."
                : "সাধারণ নাগরিক সচেতনতামূলক সহায়িকা। কোনো সরকারি স্বত্ব প্রত্যয়ন বা আনুষ্ঠানিক আইনি মতামত নয়।"}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-3 bg-slate-50/70 text-xs">
            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 leading-relaxed ${
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
                    <div className="mt-2.5 pt-1.5 border-t border-slate-100 text-[10px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded-md border border-amber-200/60 leading-tight">
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

                  {/* Source and timestamp footer */}
                  {msg.sender === "bot" && (
                    <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-medium">
                        {msg.source === "GEMINI_AI" ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span>✦</span>
                            <span>{language === "en" ? "Bhumi Sathi AI (Live)" : "ভূমিসাথী এআই (লাইভ)"}</span>
                          </span>
                        ) : msg.source === "GREETING" ? (
                          <span className="text-emerald-700 font-semibold">
                            {language === "en" ? "Bhumi Sathi Assistant" : "ভূমিসাথী সহকারী"}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {language === "en" ? "Knowledge Base (Offline)" : "সংরক্ষিত তথ্যভাণ্ডার"}
                          </span>
                        )}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {/* Clickable suggested prompt chips */}
                {msg.sender === "bot" &&
                  msg.suggestedQuestions &&
                  msg.suggestedQuestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          disabled={isLoading}
                          className="rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200/90 hover:border-emerald-400 px-3 py-1 text-[11px] font-medium transition shadow-2xs disabled:opacity-50 cursor-pointer active:scale-95 text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Subtle typing indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-600 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2 w-fit shadow-2xs">
                <span className="inline-flex gap-1 items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[11px] font-medium text-emerald-900">
                  {language === "en" ? "Bhumi Sathi is thinking..." : "ভূমিসাথী চিন্তা করছে..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Action Bar */}
          <div className="border-t border-slate-200 bg-white p-2.5 sm:p-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  language === "en"
                    ? "Ask Bhumi Sathi about khatian, dag, deeds..."
                    : "ভূমিসাথীকে খতিয়ান, দাগ বা দলিল নিয়ে জিজ্ঞাসা করুন..."
                }
                maxLength={500}
                disabled={isLoading}
                aria-label={
                  language === "en"
                    ? "Ask Bhumi Sathi a land-related question"
                    : "ভূমিসাথীকে ভূমি সংক্রান্ত প্রশ্ন লিখুন"
                }
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50/60 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 disabled:opacity-50 transition"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label={language === "en" ? "Send message" : "বার্তা পাঠান"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs hover:bg-emerald-900 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>

            <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span>{language === "en" ? "Press Enter to send" : "Enter চেপে পাঠান"}</span>
              {inputMessage.length > 350 && (
                <span className={inputMessage.length > 480 ? "text-rose-600 font-bold" : ""}>
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

