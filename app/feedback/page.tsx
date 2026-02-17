"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ChatDotsIcon,
  CircleNotchIcon,
  EnvelopeSimpleIcon,
  PaperPlaneTiltIcon,
  Tag,
  TagIcon,
} from "@phosphor-icons/react";

export default function FeedbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    category: "General",
    message: "",
  });
  const categoryMap = {
    General: "GENERAL",
    "Bug Report": "BUG",
    "Feature Request": "FEATURE",
    "UI/UX": "UIUX",
    Other: "OTHER",
  };
  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message)
      return toast.error("Required fields missing");

    setIsLoading(true);

    try {
      const shortCategory =
        categoryMap[formData.category as keyof typeof categoryMap];
      const response = await fetch(`${getBaseUrl()}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          category: shortCategory.toUpperCase(),
          content: formData.message,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("Feedback received.");
      setFormData({ email: "", category: "General", message: "" });
    } catch (error) {
      toast.error("Transmission failed.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="min-h-screen text-white font-sans flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="relative p-4 px-4 sm:p-6 sm:px-6 md:px-10 z-10 w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-160 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <button
          onClick={() => router.back()}
          className="cursor-pointer flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-6 sm:mb-8 group"
        >
          <ArrowLeftIcon
            size={16}
            weight="fill"
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">
            Go Back
          </span>
        </button>

        <div className="mb-3 sm:mb-4 text-center md:text-left">
          <h1 className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap sm:flex-nowrap">
            <Image
              className="invert w-8 h-8 sm:w-10 sm:h-10"
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
            />
            <span className="underline text-2xl sm:text-3xl font-bold tracking-tighter uppercase underline-offset-4 decoration-white/50">
              Feedback
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-white/50 -ml-2 sm:-ml-3 mb-1.25 decoration-none decoration-transparent">
              •
            </span>
          </h1>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
            Help us bridge the gap
          </p>
        </div>
        <form onSubmit={handleFeedback} className="space-y-4 sm:space-y-6 md:-mr-1 p-4 sm:p-6 md:p-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/30 tracking-widest">
              <EnvelopeSimpleIcon size={12} weight="fill" /> Email Address
            </label>
            <input
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              data-1p-ignore
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="user@example.com"
              className="w-full border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-white/50 outline-none transition-all placeholder:text-white/30"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/30 tracking-widest">
              <TagIcon size={12} weight="fill" /> Category
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-transparent text-white border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-white/50 focus:bg-white/5 outline-none appearance-none cursor-pointer transition-all rounded-none"
              >
                {Object.keys(categoryMap).map((label) => (
                  <option key={label} value={label} className="bg-neutral-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/60 text-xs">
                ▼
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/30 tracking-widest">
              <ChatDotsIcon size={12} weight="fill" /> Your Thoughts
            </label>
            <textarea
              required
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              data-1p-ignore
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="How can we improve the experience?"
              className="w-full border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:border-white/50 outline-none transition-all resize-none placeholder:text-white/30"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group/btn cursor-pointer relative flex items-center justify-center sm:justify-between w-full sm:w-auto overflow-hidden px-4 sm:px-5 py-2.5 sm:py-2 font-bold transition-colors duration-500 bg-white text-black sm:bg-transparent sm:text-white sm:hover:bg-white sm:hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="relative text-sm flex items-center justify-center gap-2 z-10 transition-all duration-500">
              {isLoading ? (
                <>
                  Submiting...{" "}
                  <CircleNotchIcon className="animate-spin" size={16} weight="bold" />
                </>
              ) : (
                <>
                  Submit <PaperPlaneTiltIcon size={14} weight="fill" />
                </>
              )}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-black/40 to-transparent transition-transform duration-1000 ease-in-out group-hover/btn:translate-x-full sm:block hidden" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
