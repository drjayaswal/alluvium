"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  UserData,
  Source,
  Message,
  Conversation as ConversationI,
} from "@/lib/interface";
import { useRouter } from "next/navigation";
import { formatDateTime, getBaseUrl } from "@/lib/utils";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  ChatCircleDotsIcon,
  CheckIcon,
  CircleNotchIcon,
  ClockCounterClockwiseIcon,
  CopyIcon,
  FileDocIcon,
  FilePdfIcon,
  FileTxtIcon,
  ListIcon,
  PaperPlaneTiltIcon,
  PenNibIcon,
  PlusCircleIcon,
  XIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

export default function Conversation({ user }: { user: UserData }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onFlight = () => {
    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusedIndex !== null) {
        setFocusedIndex(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [focusedIndex]);

  const toggleCollapse = (id: number) => {
    setCollapsedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initChat = async () => {
      setIsSidebarLoading(true);
      setIsInitialLoading(true);
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
            await loadConversation(convData[0].id);
          }
        } else {
          toast.info("No Source Available", {
            action: {
              label: "Ingest",
              onClick: () => {
                const toastId = toast.loading("Redirecting...");
                setTimeout(() => {
                  toast.dismiss(toastId);
                  router.push("/ingest");
                }, 1500);
              },
            },
          });
        }
      } catch (error) {
        toast.error("Failed to sync library.");
      } finally {
        setIsSidebarLoading(false);
        setIsInitialLoading(false);
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
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMsg, created_at: new Date().toISOString() },
    ]);
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
        {
          role: "assistant",
          content: data.answer,
          created_at: new Date().toISOString(),
        },
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
      className="relative flex h-screen w-full font-sans overflow-hidden bg-black"
    >
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <div
        className={`flex h-full w-full transition-all duration-500 ${focusedIndex !== null ? "blur-sm scale-[0.98] pointer-events-none" : ""}`}
      >
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-70 bg-black border-r border-white/20 transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
        >
          <header className="p-4 md:p-6 border-b border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h1 className="text-xl font-black text-white uppercase tracking-tighter">
                Sources
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden cursor-pointer text-rose-500"
            >
              <XIcon size={20} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-2">
              Library
            </span>
            <div className="mt-3">
              {sources.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSourceId(s.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full group text-white flex items-center gap-3 px-3 py-2 text-xs font-medium transition-all"
                >
                  {getSourceIcon(s)}
                  <span className="truncate">{s.source_name}</span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-2">
                History
              </span>
              <div className="mt-3">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => loadConversation(c.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-[10px]  cursor-pointer transition-all ${activeConversationId === c.id ? "bg-red-700 text-white" : "text-white/40 hover:bg-white/5"}`}
                  >
                    <ChatCircleDotsIcon size={14} weight="fill" />
                    <span className="truncate">{c.title || "Untitled"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-white/20">
            <button
              onClick={() => {
                setActiveConversationId(null);
                setMessages([]);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 text-[10px] text-white uppercase tracking-widest cursor-pointer  font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all"
            >
              <PlusCircleIcon size={14} weight="fill" /> New Conversation
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative min-w-0">
          <header className="px-4 py-4 md:px-6 md:py-6 border-b border-white/5 flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden  cursor-pointer text-white"
            >
              <ClockCounterClockwiseIcon size={24} />
            </button>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">
                  Conversations
                </h1>
                <h4 className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  Chat with your sources
                </h4>
              </div>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar scroll-smooth pb-17"
          >
            {isInitialLoading ? (
              <div className="h-full flex items-center justify-center">
                <CircleNotchIcon
                  className="animate-spin text-white"
                  size={32}
                  weight="bold"
                />
              </div>
            ) : (
              <>
                {messages.length === 0 && !isLoading ? (
                  <MessageEmptyState
                    hasSources={sources.length > 0}
                    onSetInput={setInput}
                  />
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <MessageItem
                            msg={msg}
                            index={i}
                            isCollapsed={collapsedIds[i]}
                            toggleCollapse={toggleCollapse}
                            onFocus={() => setFocusedIndex(i)}
                          />
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-center p-4">
                        <CircleNotchIcon
                          className="animate-spin text-white"
                          size={20}
                          weight="bold"
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {sources.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-white/20 p-[5.5px]">
              <form
                onSubmit={handleSendMessage}
                className="w-full mx-auto flex items-center pl-4 py-1 pr-1"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your source anything..."
                  className="flex-1 bg-transparent py-2 text-xs md:text-sm text-white outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  onClick={onFlight}
                  className={`p-2 transition-all cursor-pointer duration-500 ${isFlying ? "-translate-y-16 translate-x-16 opacity-0 scale-150" : "text-white hover:bg-white hover:text-black hover:rounded-full"}`}
                >
                  <PaperPlaneTiltIcon size={18} weight="fill" />
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
      {focusedIndex !== null && messages[focusedIndex] && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={() => setFocusedIndex(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto no-scrollbar pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageItem
              msg={messages[focusedIndex]}
              index={focusedIndex}
              isCollapsed={false}
              toggleCollapse={() => setFocusedIndex(null)}
              isFocused={true}
              onFocus={() => {}}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

const MessageItem = ({
  msg,
  index,
  isCollapsed,
  toggleCollapse,
  isFocused,
  onFocus,
}: any) => {
  const [isShining, setIsShining] = useState(false);

  const triggerShine = () => {
    setIsShining(true);
    setTimeout(() => setIsShining(false), 700);
  };

  const transformedContent = msg.content.replace(
    /\[Source:.*?\]/g,
    "==SRC_START==Document==SRC_END==",
  );

  return (
    <div
      onClick={() => !isFocused && onFocus?.()}
      className={`relative overflow-hidden max-w-[95%] rounded-b-2xl md:max-w-[85%] transition-all duration-500 ${!isFocused && "cursor-pointer"} ${
        msg.role === "user"
          ? "bg-white text-black pt-8 pb-2 px-6 ml-auto"
          : "bg-red-700 border-white/15 border-[1.5px] text-white pt-8 pb-2 px-6 mr-auto"
      } ${isCollapsed ? "h-5 overflow-hidden opacity-50 w-40" : "h-auto"}`}
    >
      {isShining && (
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-1/2 z-10 pointer-events-none bg-linear-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
        />
      )}

      <div className={isCollapsed ? "invisible" : "visible"}>
        {msg.role === "assistant" && (
          <CopyButton
            content={msg.content}
            isFocused={isFocused}
            onCopy={triggerShine}
          />
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, children, ...props }) => {
              const content = React.Children.map(children, (child) => {
                if (
                  typeof child === "string" &&
                  child.includes("==SRC_START==")
                ) {
                  const parts = child.split(/==SRC_START==|==SRC_END==/);
                  return parts.map((part, i) =>
                    part === "Document" ? (
                      <span
                        key={i}
                        className="inline-flex items-center px-1.5 py-0.5 m-1 bg-white text-black text-[9px] font-black uppercase tracking-tighter rounded-sm border border-white/20"
                      >
                        Source: {part}
                      </span>
                    ) : (
                      part
                    ),
                  );
                }
                return child;
              });

              return (
                <p
                  className="mb-2 last:mb-0 text-xs md:text-sm wrap-break-word leading-relaxed"
                  {...props}
                >
                  {content}
                </p>
              );
            },
            li: ({ node, ...props }) => (
              <li className="text-xs md:text-sm" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre
                className="bg-black/20 p-2 overflow-x-auto my-2"
                {...props}
              />
            ),
          }}
        >
          {transformedContent}
        </ReactMarkdown>
        {msg.created_at &&
          (msg.role === "assistant" ? (
            <div className="text-[8px] font-bold absolute top-0 left-0 text-white py-1 px-2 w-fit bg-white/20">
              {formatDateTime(msg.created_at)}
            </div>
          ) : (
            <div className="text-[8px] font-bold absolute top-px left-px text-white py-1 px-2 w-fit bg-black">
              {formatDateTime(msg.created_at)}
            </div>
          ))}
      </div>
      {isCollapsed && (
        <span
          className={`absolute left-2 top-1/3 text-[10px] ${msg.role === "assistant" ? "text-white" : "text-black"}`}
        >
          {msg.content.substring(0, 20)}...
        </span>
      )}
      {!isFocused && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCollapse(index);
          }}
          className={`absolute cursor-pointer top-0 right-0 p-1 ${msg.role === "user" ? "border-t-white border-r-white border-t border-r border-b-black border-l-black bg-black text-white" : "hover:bg-white bg-white/20 border-transparent hover:text-black"} text-[8px] uppercase font-bold`}
        >
          {isCollapsed ? "Show" : "Hide"}
        </button>
      )}
    </div>
  );
};

const CopyButton = ({
  content,
  onCopy,
  isFocused,
}: {
  content: string;
  onCopy: () => void;
  isFocused?: boolean;
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
      className={`absolute ${!isFocused ? "top-0 right-8" : "top-0 right-0"} cursor-pointer bg-transparent text-white hover:bg-white/20 transition-all duration-200 p-0.75`}
    >
      {copied ? (
        <CheckIcon size={isFocused ? 16 : 14} weight="fill" />
      ) : (
        <CopyIcon size={isFocused ? 16 : 14} weight="fill" />
      )}
    </button>
  );
};

const MessageEmptyState = ({ hasSources, onSetInput }: any) => (
  <div className="h-full flex flex-col items-center justify-center p-6 space-y-6">
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <Image
          className="invert w-10 h-10"
          src="/logo.png"
          alt="logo"
          width={40}
          height={40}
        />
        <h3 className="text-3xl font-medium text-white tracking-tighter">
          Alluvium<span className="text-red-600">.</span>
        </h3>
      </div>
      <div className="h-0.5 w-full bg-red-700" />
    </div>
    {hasSources && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px w-full max-w-sm">
        {[
          "Summarize document",
          "Key insights",
          "Find mentions",
          "Analyze sentiment",
        ].map((s) => (
          <button
            key={s}
            onClick={() => onSetInput(s)}
            className="bg-black border border-white/10 cursor-pointer  py-4 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:bg-red-700 hover:text-white transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    )}
  </div>
);

const getSourceIcon = (source: any) => {
  const name = source.source_name.toLowerCase();
  if (name.includes("youtube") || name.includes("youtu.be"))
    return (
      <YoutubeLogoIcon
        weight="fill"
        className="text-white scale-180"
        size={25}
      />
    );
  if (name.includes(".pdf"))
    return (
      <FilePdfIcon weight="fill" className="text-white scale-180" size={25} />
    );
  if (name.includes(".doc"))
    return (
      <FileDocIcon weight="fill" className="text-white scale-180" size={25} />
    );
  return <FileTxtIcon weight="fill" className="text-white" size={16} />;
};
