"use client";

import { motion } from "framer-motion";
import { UserData } from "@/lib/interface";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getBaseUrl } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import {
  CircleNotchIcon,
  ClockAfternoonIcon,
  FolderOpenIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react";

const getCategoryStyles = (category: string) => {
  const cat = (category || "GENERAL").toUpperCase();
  if (cat.includes("BUG"))
    return {
      color: "text-red-500",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
    };
  if (cat.includes("FEATURE"))
    return {
      color: "text-blue-500",
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
    };
  if (cat.includes("URGENT"))
    return {
      color: "text-amber-500",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
    };
  return {
    color: "text-pink-500",
    border: "border-pink-500/30",
    bg: "bg-pink-500/20",
  };
};

export default function Feedbacks({ user }: { user: UserData }) {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const isAdmin = (user?.role || "user") === "admin";

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) {
      router.push("/");
      return;
    }
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${getBaseUrl()}/get-feedbacks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error("System Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [user, isAdmin, router]);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${getBaseUrl()}/resolve-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
        toast.success("Feedback resolved.");
        setSelectedFeedback(null);
      } else {
        toast.error("Failed to resolve.");
      }
    } catch (err) {
      toast.error("Transmission failed.");
    } finally {
      setResolvingId(null);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    if (activeCategory === "ALL") return feedbacks;
    return feedbacks.filter(
      (f) => (f.category || "GENERAL").toUpperCase() === activeCategory,
    );
  }, [feedbacks, activeCategory]);

  const categories = useMemo(() => {
    const cats = new Set(
      feedbacks.map((f) => f.category?.toUpperCase() || "GENERAL"),
    );
    return ["ALL", ...Array.from(cats)];
  }, [feedbacks]);

  if (!user || !isAdmin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="mb-8 space-y-2 text-white font-mono relative"
    >
      <div className="max-w-6xl min-h-screen py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 mx-auto">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="flex items-center gap-1.5 sm:gap-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            />
            <span className="underline text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter uppercase underline-offset-4 decoration-pink-600">
              Feedbacks
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-600 -ml-1 sm:-ml-2 mb-1.25 decoration-none decoration-transparent">
              •
            </span>
          </h1>
          <div className="flex flex-wrap mt-6 sm:mt-8 md:mt-10 gap-px">
            {filteredFeedbacks.length > 0 &&
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer px-2 sm:px-3 md:px-4 text-[10px] sm:text-[11px] md:text-[12px] font-bold tracking-widest transition-none uppercase ${activeCategory === cat ? "bg-white/10 text-white py-1" : "text-white/50 py-1"}`}
                >
                  {cat}
                </button>
              ))}
          </div>
        </header>
        {loading ? (
          <div className="border-dashed border-2 border-white/20 py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center">
            <CircleNotchIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/50 mb-3 sm:mb-4 stroke-[1px] animate-spin" weight="bold" />
            <p className="text-xs sm:text-sm md:text-[14px] text-white/50">Searching Records...</p>
          </div>
        ) : filteredFeedbacks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
            {filteredFeedbacks.map((fb) => {
              const styles = getCategoryStyles(fb.category);
              return (
                <div
                  key={fb.id}
                  onClick={() => setSelectedFeedback(fb)}
                  className="bg-black p-4 sm:p-6 md:p-8 group hover:bg-black border border-transparent hover:border-white/15 transition-all cursor-pointer flex flex-col"
                >
                  <div
                    className={`text-[9px] sm:text-[10px] w-fit px-1.5 sm:px-2 py-0.5 sm:py-1 mb-3 sm:mb-4 font-black ${styles.color} ${styles.bg} uppercase tracking-[0.2em]`}
                  >
                    {fb.category || "General"}
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 line-clamp-3 mb-4 sm:mb-6 italic">
                    "{fb.content}"
                  </p>
                  <div className="mt-auto flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-gray-500">
                    <UserIcon size={12} className="sm:w-[14px] sm:h-[14px]" weight="fill" /> 
                    <span className="truncate">{fb.email}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border-dashed border-2 border-white/20 py-20 sm:py-24 md:py-32 flex flex-col items-center justify-center">
            <FolderOpenIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white/50 mb-3 sm:mb-4 stroke-[1px]" weight="fill" />
            <p className="text-xs sm:text-sm md:text-[14px] text-white/50">Zero Records</p>
          </div>
        )}
      </div>
      {selectedFeedback && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedFeedback(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-black border border-white/20 w-full max-w-lg max-h-[90vh] flex flex-col relative rounded-sm shadow-2xl"
          >
            <div className="flex items-start justify-between p-6 border-b border-white/10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`text-[11px] px-3 py-1 font-black uppercase tracking-wider ${getCategoryStyles(selectedFeedback.category).color} ${getCategoryStyles(selectedFeedback.category).bg}`}
                  >
                    {selectedFeedback.category || "General"}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <UserIcon size={16} weight="fill" />
                  <span>{selectedFeedback.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <XIcon size={20} weight="regular" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <p className="text-sm leading-relaxed text-white/90 whitespace-pre-wrap mb-6">
                {selectedFeedback.content}
              </p>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <ClockAfternoonIcon size={14} weight="fill" />
                <span>{new Date(selectedFeedback.created_at).toLocaleString()}</span>
              </div>
            </div>
            <div className="p-6 border-t border-white/10">
              <button
                onClick={() => handleResolve(selectedFeedback.id)}
                disabled={resolvingId === selectedFeedback.id}
                className="w-full bg-white text-black font-bold py-3 px-4 cursor-pointer uppercase text-sm hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resolvingId === selectedFeedback.id && (
                  <CircleNotchIcon size={18} className="animate-spin" weight="bold" />
                )}
                {resolvingId === selectedFeedback.id ? "Resolving..." : "Mark as Resolved"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
