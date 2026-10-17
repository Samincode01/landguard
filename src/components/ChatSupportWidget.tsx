"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { findBestFaqMatch } from "@/lib/faq-matcher";

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  source?: "GEMINI_AI" | "FAQ_MATCH" | "FALLBACK" | "OFFLINE_CLIENT";
  suggestedQuestions?: string[];
  notice?: string;
  isError?: boolean;
}

interface ChatSupportWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const INITIAL_SUGGESTIONS = [
  "খতিয়ান বা পর্চা কী?",
  "নামজারি কেন জরুরি?",
  "বায়া দলিল ও বালাম তল্লাশি কীভাবে করব?",
  "CS, SA, RS ও BS জরিপ কী?",
  "দাগ নম্বর কী?",
];

let globalMsgSequence = 0;
function generateUniqueId(prefix: string): string {
  globalMsgSequence += 1;
  return `${prefix}-${globalMsgSequence}`;
}

function getLocalBengaliTime(): string {
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    return "এইমাত্র";
  }
}

export default function ChatSupportWidget({
  isOpen,
  onClose,
  onOpen,
}: ChatSupportWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-welcome",
      sender: "bot",
      text:
        "স্বাগতম! আমি ল্যান্ডগার্ড বিডির বাংলা ভূমি সহায়তা সহকারী।\n\nজমি ক্রয়ের পূর্বে খতিয়ান, দাগ, মৌজা, নামজারি, বায়া দলিল বা জরিপের প্রকারভেদ (CS, SA, RS, BS) সম্পর্কে যেকোনো সাধারণ জিজ্ঞাসা করতে পারেন।\n\n(উল্লেখ্য: এটি সাধারণ নাগরিক সচেতনতামূলক সহায়তা; কোনো সরকারি প্রত্যায়ন বা আইনি মতামত নয়।)",
      timestamp: "এইমাত্র",
      source: "FAQ_MATCH",
      suggestedQuestions: INITIAL_SUGGESTIONS.slice(0, 3),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

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
        timestamp: getLocalBengaliTime(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputMessage("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `সার্ভার এরর: ${response.status}`);
        }

        const data = await response.json();

        const botMsg: ChatMessage = {
          id: generateUniqueId("bot"),
          sender: "bot",
          text: data.reply,
          timestamp: getLocalBengaliTime(),
          source: data.source,
          suggestedQuestions: data.suggestedQuestions,
          notice: data.notice,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        // Resilient client-side fallback if network or API fails
        const offlineResult = findBestFaqMatch(query);

        const fallbackMsg: ChatMessage = {
          id: generateUniqueId("bot-fallback"),
          sender: "bot",
          text: offlineResult.formattedResponseBn,
          timestamp: getLocalBengaliTime(),
          source: "OFFLINE_CLIENT",
          suggestedQuestions: offlineResult.suggestedQuestions,
          notice:
            "নেটওয়ার্ক সংযোগ বিঘ্নিত হওয়ায় অফলাইন সংরক্ষিত প্রশ্নোত্তর থেকে উত্তর প্রদান করা হয়েছে।",
        };

        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [inputMessage, isLoading]
  );

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        id: generateUniqueId("msg-welcome"),
        sender: "bot",
        text:
          "কথোপকথন মুছে ফেলা হয়েছে। আপনি নতুন কোনো প্রশ্ন করতে পারেন বা নিচের প্রস্তাবিত প্রশ্নগুলো নির্বাচন করতে পারেন।",
        timestamp: "এইমাত্র",
        source: "FAQ_MATCH",
        suggestedQuestions: INITIAL_SUGGESTIONS.slice(0, 3),
      },
    ]);
  }, []);

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
          aria-label="জমি সহায়তা চ্যাটবট খুলুন"
          className="no-print fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-3 text-white shadow-lg hover:bg-emerald-900 active:scale-95 transition-all focus:outline-none focus:ring-3 focus:ring-emerald-700/50"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.818-.818 5.977 5.977 0 011.057-3.035C4.646 15.65 4 13.91 4 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <span className="text-xs sm:text-sm font-bold tracking-wide">
            জমি জিজ্ঞাসা (AI)
          </span>
        </button>
      )}

      {/* ── EXPANDED CHAT PANEL (Hidden in print) ── */}
      {isOpen && (
        <div
          id="landguard-chat-widget"
          role="dialog"
          aria-label="ল্যান্ডগার্ড ভূমি সহায়তা সহকারী"
          className="no-print fixed bottom-4 right-4 z-50 flex flex-col w-[94vw] sm:w-[420px] max-w-full h-[580px] max-h-[88vh] rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden transition-all animate-in slide-in-from-bottom-5 duration-200 text-slate-900"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-800/10 bg-emerald-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-emerald-300">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white leading-none">
                    ভূমি সহায়তা সহকারী
                  </h3>
                  <span className="rounded-full bg-emerald-700/80 px-1.5 py-0.2 text-[10px] text-emerald-100 font-medium">
                    বাংলা
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  খতিয়ান, দাগ, জরিপ ও নামজারি পরিভাষা
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="কথোপকথন মুছে ফেলুন"
                aria-label="কথোপকথন পরিষ্কার করুন"
                className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 hover:text-white transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={onClose}
                title="বন্ধ করুন"
                aria-label="চ্যাটবট বন্ধ করুন"
                className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 hover:text-white transition"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Educational Disclaimer Pill */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-3 py-1.5 text-[11px] text-amber-900 leading-tight flex items-center gap-1.5">
            <span className="text-amber-700 font-bold">ℹ️</span>
            <span>
              এটি সাধারণ শিক্ষামূলক সহায়িকা। কোনো সরকারি প্রত্যয়ন বা চূড়ান্ত আইনি পরামর্শ নয়।
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-emerald-800 text-white rounded-br-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Notice indicator */}
                  {msg.notice && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 italic">
                      {msg.notice}
                    </div>
                  )}

                  {/* Metadata source tag */}
                  {msg.sender === "bot" && msg.source && (
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>
                        {msg.source === "GEMINI_AI"
                          ? "✦ এআই সহকারী"
                          : msg.source === "FAQ_MATCH"
                          ? "✓ সংরক্ষিত তথ্যভাণ্ডার"
                          : "ℹ️ সাধারণ সহায়িকা"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {/* Suggested prompt chips */}
                {msg.sender === "bot" &&
                  msg.suggestedQuestions &&
                  msg.suggestedQuestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {msg.suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendMessage(q)}
                          disabled={isLoading}
                          className="rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-medium transition shadow-2xs hover:border-emerald-300 disabled:opacity-50"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {/* Typing animation */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 rounded-2xl px-3 py-2 w-fit shadow-2xs">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span className="text-[11px]">উত্তরের প্রস্তুতি চলছে...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Action Bar */}
          <div className="border-t border-slate-200 bg-white p-2.5 sm:p-3">
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
                placeholder="ভূমি পরিভাষা বা দলিল সম্পর্কে লিখুন..."
                maxLength={500}
                disabled={isLoading}
                aria-label="ভূমি সংক্রান্ত প্রশ্ন লিখুন"
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 disabled:opacity-50 transition"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="বার্তা পাঠান"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs hover:bg-emerald-900 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>

            <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span>Enter চাপুন অথবা পাঠাতে ক্লিক করুন</span>
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
