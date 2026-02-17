"use client";

import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  UserData,
  Source,
  Message,
  Conversation as ConversationI,
} from "@/lib/interface";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  ChatCircleDotsIcon,
  CheckIcon,
  CircleNotchIcon,
  CopyIcon,
  EmptyIcon,
  FileDocIcon,
  FilePdfIcon,
  FileTxtIcon,
  PaperPlaneTiltIcon,
  PlusCircleIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

export default function Conversation({ user }: { user: UserData }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [conversations, setConversations] = useState<ConversationI[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isFlying, setIsFlying] = useState(false);
  const hasInitialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collapsedIds, setCollapsedIds] = useState<Record<number, boolean>>({});

  const onFlight = () => {
    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleCollapse = (id: number) => {
    setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initChat = async () => {
      setIsSidebarLoading(true);
      const token = localStorage.getItem("token");
      try {
        const [srcRes, convRes] = await Promise.all([
          fetch(`${getBaseUrl()}/get-sources`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${getBaseUrl()}/conversations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sourcesData = await srcRes.json();
        const convData = await convRes.json();

        setSources(sourcesData);
        setConversations(convData);

        if (sourcesData && sourcesData.length > 0) {
          setSelectedSourceId(sourcesData[0].id);
          if (convData && convData.length > 0) {
            loadConversation(convData[0].id);
          }
        } else {
          toast.info("No Source Available");
        }
      } catch (error) {
        toast.error("Failed to sync library.");
      } finally {
        setIsSidebarLoading(false);
      }
    };
    initChat();
  }, [router]);

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    setActiveConversationId(id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${getBaseUrl()}/conversations/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const history = await res.json();
      console.log(history);
      setMessages(history);
    } catch (error) {
      toast.error("Could not load history.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.credits <= 0) {
      toast.error("Insufficient credits!", {
        action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
      });
      return;
    }
    if (!input.trim() || !selectedSourceId) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${getBaseUrl()}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: userMsg,
          conversation_id: activeConversationId,
        }),
      });
      if (response.status === 402) {
        setMessages((prev) => prev.slice(0, -1));
        setInput(userMsg);
        toast.error("Insufficient credits!", {
          action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
        });
        return;
      }
      if (!response.ok) throw new Error("Server Error");
      const data = await response.json();
      if (!activeConversationId && data.conversation_id) {
        setActiveConversationId(data.conversation_id);
        const convRes = await fetch(`${getBaseUrl()}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversations(await convRes.json());
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (error) {
      toast.error("Bridge Connection Failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="relative flex h-screen w-full font-sans overflow-hidden"
    >
      {focusedIndex !== null && (
        <div
          onClick={() => setFocusedIndex(null)}
          className="fixed inset-0 z-80 bg-black/10 backdrop-blur-xs animate-in fade-in duration-300 pointer-events-auto"
        />
      )}

      <div
        className={`flex h-full w-full transition-all duration-500 ${
          focusedIndex !== null
            ? "blur-sm scale-[0.98] pointer-events-none"
            : ""
        }`}
      >
        <aside className="w-70 mb-12 hidden md:flex flex-col border-r border-white/20 bg-transparent">
          <header className="p-4 md:p-6 px-2 md:px-3 border-b border-white/20 flex flex-col">
            <div className="flex items-center gap-2 md:gap-3">
              <Image
                src="/logo.png"
                alt="logo"
                width={50}
                height={50}
                className="shrink-0 w-8 h-8 md:w-[50px] md:h-[50px]"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-xl md:text-2xl font-black text-white leading-none uppercase tracking-tighter">
                  Sources
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-white/50">
                    Available Sources
                  </span>
                </div>
              </div>
            </div>
          </header>
          <div className="p-4 md:p-6 px-2">
            <span className="text-[10px] md:text-[12px] font-bold text-white">
              {sources.length <= 2
                ? `Source (${sources.length.toString().padStart(2, "0")})`
                : `Source(s) [${sources.length.toString().padStart(2, "0")}]`}
            </span>{" "}
            <div className="mt-3 md:mt-4">
              {isSidebarLoading ? (
                [1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-8 md:h-9 w-full bg-white/10 animate-pulse mb-px"
                  />
                ))
              ) : sources.length > 0 ? (
                sources.map((s) => (
                  <div key={s.id} className="relative group/tooltip">
                    <button
                      onClick={() => setSelectedSourceId(s.id)}
                      className={`w-full group hover:text-white flex cursor-pointer items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium transition-all duration-200 ${
                        selectedSourceId === s.id
                          ? "bg-red-700 text-white pl-3 md:pl-4"
                          : "hover:bg-white/10 text-white/60"
                      }`}
                    >
                      <div
                        className={`transition-colors ${selectedSourceId === s.id ? "text-white" : "text-white fill-red-600"}`}
                      >
                        {getSourceIcon(s)}
                      </div>
                      {getSourceLabel(s)}
                    </button>
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 hidden md:block">
                      <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap border border-white/20">
                        {s.source_name}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <SourceEmptyState onIngest={() => router.push("/ingest")} />
              )}
            </div>
          </div>
          <div className="px-2 flex-1 overflow-y-auto no-scrollbar">
            <span className="text-[10px] md:text-[12px] font-bold text-white">
              History
            </span>
            <div className="mt-3 md:mt-4">
              {isSidebarLoading ? (
                [1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-8 md:h-9 w-full bg-white/10 animate-pulse mb-px"
                  />
                ))
              ) : conversations.length > 0 ? (
                conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => loadConversation(c.id)}
                    className={`w-full group cursor-pointer flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 text-[10px] md:text-xs transition-all relative ${
                      activeConversationId === c.id
                        ? "text-white bg-red-700"
                        : "text-white/40 hover:bg-white/10"
                    }`}
                  >
                    <ChatCircleDotsIcon size={12} className="md:w-[14px] md:h-[14px] shrink-0" weight="fill" />
                    <span className="truncate text-left">
                      {c.title || "Untitled Conversations"}
                    </span>

                    <div className="fixed translate-x-64.5 z-100 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                      <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 flex items-center">
                        {c.title || "Untitled Conversation"}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white" />
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <ConversationsEmptyState />
              )}
            </div>
          </div>
          <div
            className={`pt-[6px] md:pt-[8.5px] pb-3 md:pb-4 px-2 mt-auto ${sources.length > 0 && "border-t border-white/20"}`}
          >
            {sources.length > 0 && (
              <button
                onClick={() => {
                  setActiveConversationId(null);
                  setMessages([]);
                }}
                className="w-full cursor-pointer py-2 md:py-3 text-[10px] md:text-[11px] text-white uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 md:gap-2 hover:bg-white hover:text-black transition-all duration-300"
              >
                <PlusCircleIcon size={12} className="md:w-[14px] md:h-[14px]" weight="fill" /> New Conversation
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative">
          <header className="px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 border-b border-white/5 flex items-center justify-between top-0 z-30">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/logo.png"
                alt="logo"
                width={50}
                height={50}
                className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px]"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none uppercase tracking-tighter">
                  Conversations
                </h1>
                <h4 className="font-bold text-white/50 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest mt-0.5 sm:mt-1">
                  Chat with your sources
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span
                  className={`text-xs sm:text-sm md:text-[14px] font-mono ${isLoading || isSidebarLoading ? "text-white" : "text-emerald-500"} flex items-center gap-1 sm:gap-1.5`}
                >
                  <div
                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isLoading || isSidebarLoading ? "bg-white" : "bg-emerald-500 animate-pulse"}`}
                  />
                  {isLoading || isSidebarLoading
                    ? "Connecting..."
                    : "Connected"}
                </span>
              </div>
            </div>
          </header>
          <div
            ref={scrollRef}
            className="flex-1 mb-16 sm:mb-18 md:mb-20.5 overflow-y-auto py-4 sm:py-5 md:py-6 lg:py-10 px-2 sm:px-3 md:px-4 space-y-4 sm:space-y-6 md:space-y-8 no-scrollbar scroll-smooth"
          >
            {isSidebarLoading && messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <CircleNotchIcon
                  className="animate-spin text-white w-8 h-8 sm:w-10 sm:h-10"
                  size={40}
                  weight="bold"
                />
                <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white">
                  Searching Conversations...
                </p>
              </div>
            ) : (
              <>
                {messages.length === 0 && !isLoading && (
                  <MessageEmptyState
                    hasSources={sources.length > 0}
                    onSetInput={(val) => setInput(val)}
                  />
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-500`}
                  >
                    <div
                      className={`flex max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <MessageItem
                        msg={msg}
                        index={i}
                        isCollapsed={collapsedIds[i]}
                        toggleCollapse={toggleCollapse}
                        isFocused={false}
                        onFocus={() => setFocusedIndex(i)}
                      />
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-center p-3 sm:p-4">
                    <CircleNotchIcon
                      className="animate-spin text-white w-4 h-4 sm:w-[18px] sm:h-[18px]"
                      size={18}
                      weight="bold"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {sources.length > 0 && (
            <div className="absolute z-20 bottom-10 sm:bottom-4 md:bottom-5 bg-black border-t border-white/20 w-full pt-1 sm:pt-1.25 px-2 sm:px-3 md:px-4 pb-4 sm:pb-5 md:pb-10">
              <form
                onSubmit={handleSendMessage}
                className="group relative flex items-center focus-within:border-white/30 pl-3 sm:pl-4 md:pl-6 py-0.5 pr-1 sm:pr-1.5 transition-all duration-300"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your source anything..."
                  className="flex-1 bg-transparent border-none outline-none py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm text-white placeholder:text-white/70"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  onClick={onFlight}
                  className={`p-2 sm:p-2.5 cursor-pointer bg-transparent text-white hover:text-black hover:bg-white hover:rounded-4xl transition-all duration-500 ease-in-out transform disabled:opacity-20 ${isFlying ? "-translate-y-16 translate-x-16 opacity-0 scale-150" : "active:scale-95 hover:bg-black"}`}
                >
                  <PaperPlaneTiltIcon size={16} className="sm:w-[18px] sm:h-[18px]" weight="fill" />
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {focusedIndex !== null && messages[focusedIndex] && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 md:p-8 lg:p-12 pointer-events-none">
          <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl pointer-events-auto animate-in zoom-in-95 duration-300">
            <MessageItem
              msg={messages[focusedIndex]}
              index={focusedIndex}
              isCollapsed={false}
              toggleCollapse={() => setFocusedIndex(null)}
              isFocused={true}
              onFocus={() => {}}
            />
            <p className="text-white/70 text-[9px] sm:text-[10px] uppercase text-center mt-3 sm:mt-4 tracking-widest font-bold">
              Click background to dismiss
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

const MessageEmptyState = ({
  hasSources,
  onSetInput,
}: {
  hasSources: boolean;
  onSetInput: (val: string) => void;
}) => {
  if (!hasSources) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative group">
          <EmptyIcon className="text-white/40 w-8 h-8 sm:w-10 sm:h-10" size={40} weight="fill" />
        </div>
        <div className="mt-2 text-center max-w-xs">
          <h3 className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold text-white/40 uppercase">
            No Source Available
          </h3>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col items-center justify-center bg-black p-4 sm:p-5 md:p-6 animate-in fade-in duration-1000">
  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
    <div className="flex items-center gap-2 sm:gap-3">
      <Image
        className="invert w-8 h-8 sm:w-10 sm:h-10 md:w-[40px] md:h-[40px]"
        src="/logo.png"
        alt="logo"
        width={40}
        height={40}
      />
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tighter text-white">
        Alluvium<span className="text-red-600">.</span>
      </h3>
    </div>
    <div className="h-[2px] sm:h-[2.5px] md:h-[2.75px] w-full rounded-4xl bg-red-700" />
  </div>
  <div className="mt-4 sm:mt-5 w-full max-w-xs sm:max-w-sm">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-px">
      {[
        "Summarize document",
        "Extract key insights",
        "Find specific mentions",
        "Analyze sentiment",
      ].map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSetInput(suggestion)}
          className="flex cursor-pointer items-center justify-center bg-black py-3 sm:py-4 px-2 sm:px-3
                     text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/50
                     transition-all duration-200 
                     hover:bg-red-700 hover:text-white
                     active:bg-red-600"
        >
          {suggestion}
        </button>
      ))}
    </div>
  </div>
</div>
  );
};

const CopyButton = ({
  content,
  onCopy,
}: {
  content: string;
  onCopy: () => void;
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy();
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-0 right-0 cursor-pointer p-1 sm:p-1.5 bg-transparent text-white hover:bg-white/20 transition-all duration-200 z-30"
    >
      {copied ? <CheckIcon size={14} className="sm:w-4 sm:h-4" weight="fill" /> : <CopyIcon size={14} className="sm:w-4 sm:h-4" weight="fill" />}
    </button>
  );
};

const MessageItem = ({
  msg,
  index,
  isCollapsed,
  toggleCollapse,
  isFocused,
  onFocus,
}: {
  msg: any;
  index: number;
  isCollapsed: boolean;
  toggleCollapse: (id: number) => void;
  isFocused?: boolean;
  onFocus?: () => void;
}) => {
  const [isShining, setIsShining] = useState(false);
  const triggerShine = () => {
    setIsShining(true);
    setTimeout(() => setIsShining(false), 850);
  };
  return (
    <div className={`${isFocused && "h-48 sm:h-56 md:h-60 p-4 sm:p-6 md:p-8 mx-1 sm:mx-2"} overflow-y-auto overflow-x-hidden scrollbar-thick scrollbar-thumb-red-200 scrollbar-track-transparent`}>
    <div
      onClick={(e) => {
        onFocus?.();
      }}
      className={`relative group text-xs sm:text-sm leading-relaxed font-medium transition-all duration-500 cursor-pointer ${
        msg.role === "user"
          ? "bg-white text-black p-1.5 sm:p-2 pl-2 sm:pl-3 pr-8 sm:pr-10"
          : "text-white bg-red-700 p-2 sm:p-3 pl-3 sm:pl-4 md:pl-5 pr-5 sm:pr-6 md:pr-6.5 pt-3 sm:pt-4"
      } ${isCollapsed ? "h-8 sm:h-9 md:h-10 opacity-80" : "h-auto"} ${isFocused ? " border border-white scale-105" : "z-10"}`}
    >
      {isShining && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shine" />
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          isFocused ? toggleCollapse(-1) : toggleCollapse(index);
        }}
        className={`absolute top-0 z-20 bg-white w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 cursor-pointer flex items-center justify-center ${msg.role === "user" ? "right-0" : "left-0"}`}
      >
        <div
          className={`w-1.5 sm:w-2 h-0.5 bg-black transition-transform ${isCollapsed ? "rotate-90" : ""}`}
        />
      </button>
      <div className={isCollapsed ? "invisible" : "visible"}>
        {msg.role === "assistant" && (
          <CopyButton content={msg.content} onCopy={triggerShine} />
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p className="mb-2 sm:mb-2.5 md:mb-3 last:mb-0" {...props} />
            ),
          }}
        >
          {msg.content}
        </ReactMarkdown>
      </div>
      {isCollapsed && (
        <span className="text-xs sm:text-sm md:text-[14px] absolute left-4 sm:left-5 md:left-6 text-black top-1.5 sm:top-2 truncate max-w-[65%] sm:max-w-[70%]">
          message is collapsed
        </span>
      )}
    </div>
    </div>
  );
};

const SourceEmptyState = ({ onIngest }: { onIngest: () => void }) => (
  <button
    onClick={onIngest}
    className="w-full cursor-pointer group relative flex items-center justify-center py-4 sm:py-5 px-3 sm:px-4 border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 gap-2 sm:gap-3"
  >
    <div className="p-1.5 sm:p-2 bg-white/5 group-hover:bg-white/20 transition-colors">
      <PlusCircleIcon
        size={14}
        className="sm:w-4 sm:h-4 text-white/40 group-hover:text-white"
      />
    </div>
    <div className="text-center">
      <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest group-hover:text-white/60">
        No Sources Found
      </p>
    </div>
  </button>
);

const ConversationsEmptyState = () => (
  <div className="w-full group relative flex flex-col items-center justify-center py-3 sm:py-4 px-3 sm:px-4 border-2 border-dashed border-white/20 gap-1.5 sm:gap-2">
    <div className="text-center">
      <p className="text-[9px] sm:text-[10px] font-bold text-white/30 uppercase tracking-widest">
        Empty History
      </p>
    </div>
  </div>
);

const getSourceIcon = (source: any) => {
  const name = source.source_name.toLowerCase();
  if (
    source.source_type === "video" ||
    name.includes("youtube.com") ||
    name.includes("youtu.be")
  ) {
    return (
      <Link
        target="_blank"
        href={source.source_name}
        className="flex items-center justify-center"
      >
        <YoutubeLogoIcon
          weight="fill"
          className="fill-white shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
          size={16}
        />
      </Link>
    );
  }
  return (
    <div className="flex items-center justify-center">
      {(() => {
        const n = String(source.source_name).toLowerCase();
        if (n.includes(".pdf"))
          return (
            <FilePdfIcon
              weight="fill"
              className="text-white shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
              size={16}
            />
          );
        if (["doc", "docs", "docx"].some((ext) => n.includes(ext)))
          return (
            <FileDocIcon
              weight="fill"
              className="text-white shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
              size={16}
            />
          );
        return (
          <FileTxtIcon
            weight="fill"
            className="text-white shrink-0 w-3.5 h-3.5 sm:w-4 sm:h-4"
            size={16}
          />
        );
      })()}
    </div>
  );
};

const getSourceLabel = (source: any) => {
  const name = source.source_name.toLowerCase();
  const label =
    name.includes("youtube.com") || name.includes("youtu.be")
      ? "Video"
      : "Document";
  return (
    <span className="truncate flex-1 text-left">
      {label} <span className="text-[8px] sm:text-[9px] opacity-60">{name}</span>
    </span>
  );
};
