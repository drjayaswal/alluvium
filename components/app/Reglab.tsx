"use client";

import React, { useState, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import {
  TrashIcon,
  TerminalWindowIcon,
  FloppyDiskIcon,
  CaretRightIcon,
  BugBeetleIcon,
  PaperclipIcon,
} from "@phosphor-icons/react";

export default function Reglab({ user }: { user: UserData }) {
  const [pattern, setPattern] = useState<string>(
    "",
  );
  const [flags, setFlags] = useState<string>("g");
  const [testText, setTestText] = useState<string>(
    "",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const regexResult = useMemo(() => {
    if (!pattern) return { html: testText, count: 0, error: null };
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      let matchCount = 0;

      const escapedText = testText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const highlighted = escapedText.replace(re, (match) => {
        matchCount++;
        return `<span class="bg-pink-600 text-white px-0.5 font-bold">${match}</span>`;
      });

      return { html: highlighted, count: matchCount, error: null };
    } catch (e: any) {
      return { html: testText, count: 0, error: e.message };
    }
  }, [pattern, flags, testText]);

  const handleSave = async () => {
    if (user.credits <= 0) {
      toast.info("CREDITS_EXHAUSTED", {
        action: { label: "REFILL", onClick: () => router.push("/upgrade") },
      });
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch(`${getBaseUrl()}/deduct-credit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) toast.success("PATTERN_COMMITTED_TO_MEMORY");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (user.credits <= 0) {
      toast.info("Insufficient credits", {
        action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
      });
      return;
    }

    const toastId = toast.loading("Processing document...");
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const creditRes = await fetch(`${getBaseUrl()}/deduct-credit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!creditRes.ok) throw new Error("Credit deduction failed");

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setTestText(content);
        toast.success("Document loaded into buffer", { id: toastId });
        setIsProcessing(false);
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error("Operation failed", { id: toastId });
      setIsProcessing(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-black text-white p-4 md:p-8 font-mono selection:bg-white selection:text-black">
      <div className="flex flex-col md:flex-row justify-between p-4 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center">
            <BugBeetleIcon size={24} className="text-white" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase leading-none">
              REGLAB
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-6 border-l-0 md:border-l-2 border-white/20 pl-0 md:pl-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-white/50">
              Credits
            </span>
            <span className="text-sm font-bold text-white">
              {user?.credits || 0}
            </span>
          </div>
          {!regexResult.error && (
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="cursor-pointer hover:bg-white hover:text-black h-full px-3 py-1 text-[11px] font-black text-white transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FloppyDiskIcon size={16} weight="bold" /> Save
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 border-2 border-white/20 bg-black">
          <div className="bg-white/20 px-4 py-1 flex justify-between items-center">
            <span className="text-white text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
              #<CaretRightIcon size={14} className="-ml-3" weight="bold" />{" "}
              Pattern
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white text-[9px] font-bold uppercase">
                Flag
              </span>
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="bg-black text-white uppercase px-2 py-0.5 text-[10px] w-12 border-none focus:ring-0 outline-none"
              />
            </div>
          </div>
          <div className="p-6 flex items-baseline gap-4">
            <span className="text-4xl font-light opacity-20">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter_Expression..."
              className="w-full bg-transparent text-2xl md:text-4xl font-bold outline-none placeholder:text-white/20 tracking-tight"
            />
            <span className="text-4xl font-light opacity-20">/{flags}</span>
          </div>
          {regexResult.error && (
            <div className="bg-red-600 text-white p-2 px-6 text-[10px] font-black uppercase tracking-widest">
              Error: {regexResult.error}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 border-2 border-white/20 flex flex-col h-110">
          <div className="border-b-2 border-white/20 pl-4 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase flex items-center gap-2">
              <TerminalWindowIcon size={14} />Editor
            </span>
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.doc,.docs,.docx"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="cursor-pointer p-2 hover:text-white hover:bg-white/10 transition-all text-white/40"
                title="Upload Document"
              >
                <PaperclipIcon size={16} />
              </button>
              <button
                onClick={() => setTestText("")}
                className="cursor-pointer p-2 m-2 hover:text-red-600 hover:bg-red-600/20 transition-opacity text-white/40"
                title="Clear Editor"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-black p-6 outline-none placeholder:text-white/30 resize-none text-[13px] leading-relaxed custom-scrollbar disabled:opacity-50"
            placeholder="Enter text to test..."
          />
        </div>

        <div className="lg:col-span-6 flex flex-col h-110 text-white border-2 border-white/20">
          <div className="p-4 flex justify-between items-center border-b-2 border-white/20">
            <span className="text-[10px] font-black uppercase flex items-center gap-2">
              <BugBeetleIcon size={14} weight="fill" /> Output
            </span>
            {regexResult.count > 0 && (
              <div className="bg-pink-500 text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                {regexResult.count} Matches
              </div>
            )}
          </div>
          <div className="flex-1 p-6 text-[13px] leading-relaxed overflow-auto custom-scrollbar overflow-x-hidden break-all">
            <div
              dangerouslySetInnerHTML={{ __html: regexResult.html }}
              className="whitespace-pre-wrap font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
