"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import {
  FileCsvIcon,
  ArrowsLeftRightIcon,
  CopyIcon,
  DownloadSimpleIcon,
  TrashIcon,
  MinusIcon,
  SquareIcon,
  XIcon,
  CodeIcon,
  BracketsCurlyIcon as BracesIcon,
  UploadSimpleIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyCheckIcon } from "lucide-react";
import Image from "next/image";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export default function Convertor({ user }: { user: UserData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputData, setOutputData] = useState<string>("");
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json");
  const [prettify, setPrettify] = useState(true);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<"mac" | "win">("win");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const os = window.navigator.userAgent.toLowerCase();
      if (os.includes("mac")) setPlatform("mac");
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user.credits <= 0) {
      toast.info("Insufficient credits", {
        action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const toastId = toast.loading("Processing conversion...");

    try {
      const token = localStorage.getItem("token");
      const creditRes = await fetch(`${getBaseUrl()}/deduct-credit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!creditRes.ok) throw new Error("Credit error");

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;

        if (mode === "csv2json") {
          const parsed = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
          });
          setOutputData(JSON.stringify(parsed.data, null, prettify ? 2 : 0));
        } else {
          try {
            const json = JSON.parse(content);
            const csv = Papa.unparse(json);
            setOutputData(csv);
          } catch (err) {
            toast.error("Invalid JSON format");
          }
        }
        toast.success("Conversion complete", { id: toastId });
        setIsProcessing(false);
      };
      reader.readAsText(file);
    } catch (error) {
      toast.error("Operation failed", { id: toastId });
      setIsProcessing(false);
    }
  };

  const togglePrettify = () => {
    if (mode === "csv2json" && outputData) {
      const currentObj = JSON.parse(outputData);
      setOutputData(JSON.stringify(currentObj, null, !prettify ? 2 : 0));
    }
    setPrettify(!prettify);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputData);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([outputData], { type: "text/plain;charset=utf-8" });
    const extension = mode === "csv2json" ? "json" : "csv";
    saveAs(blob, `transformed_data.${extension}`);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Convertor
          </h1>
          <p className="text-white/50 text-sm">
            Professional CSV ↔ JSON converter with built-in prettifier.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-white/50">
            Credits
          </span>
          <span className="text-sm font-bold text-white">
            {user?.credits || 0}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={() =>
                setMode(mode === "csv2json" ? "json2csv" : "csv2json")
              }
              className="flex items-center justify-between p-4 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {mode === "csv2json" ? (
                  <FileCsvIcon size={24} />
                ) : (
                  <BracesIcon size={24} />
                )}
                <span className="text-xs font-bold uppercase tracking-widest">
                  {mode === "csv2json" ? "CSV to JSON" : "JSON to CSV"}
                </span>
              </div>
              <ArrowsLeftRightIcon size={20} className="text-white" />
            </button>

            <div className="relative group">
              <input
                type="file"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                accept={mode === "csv2json" ? ".csv" : ".json"}
              />
              <motion.div
                className="h-40 w-full border-2 border-dashed border-white/20 flex flex-col items-center justify-center"
                whileHover={{ scale: 1.01 }}
              >
                <UploadSimpleIcon size={32} className="text-white/20 mb-3" />
                <p className="text-sm font-semibold text-white/30 mb-1">
                  Upload {mode === "csv2json" ? ".csv" : ".json"} file
                </p>
                <p className="text-xs text-white/20">
                  Drag & drop or click to browse
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            className="overflow-hidden bg-black border flex flex-col h-120 relative shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className={`flex items-center px-4 py-1 bg-white z-10 ${platform === "mac" ? "flex-row" : "flex-row-reverse"}`}
            >
              <div
                className={`flex items-center gap-2 ${platform === "mac" && "w-14 mr-2"}`}
              >
                {platform === "mac" ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </>
                ) : (
                  <>
                    <MinusIcon
                      size={14}
                      className="text-[#ff5f56]"
                      weight="bold"
                    />
                    <SquareIcon
                      size={12}
                      className="text-[#ffbd2e]"
                      weight="bold"
                    />
                    <XIcon size={14} className="text-[#27c93f]" weight="bold" />
                  </>
                )}
              </div>
              <div className="flex-1 text-center mb-2">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="inline-block mr-2 invert"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                  Alluvium Tools
                </span>
              </div>
              {platform === "mac" && <div className="w-12" />}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex gap-4">
                <button
                  onClick={togglePrettify}
                  className={`flex items-center gap-2 cursor-pointer text-[10px] font-bold uppercase tracking-tighter px-2 py-1 transition-all ${prettify ? "text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800" : "text-white/50 bg-pink-600/50"}`}
                >
                  <BracesIcon size={14} /> Prettify
                </button>
              </div>

              {outputData && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-white/10 hover:text-white cursor-pointer rounded-lg text-white/40 transition-all"
                  >
                    {copied ? (
                      <CopyCheckIcon size={16} className="text-white" />
                    ) : (
                      <CopyIcon size={16} />
                    )}
                  </button>
                  <button
                    onClick={downloadFile}
                    className="p-2 hover:bg-white/10 hover:text-white cursor-pointer text-white/40 transition-all"
                  >
                    <DownloadSimpleIcon size={16} />
                  </button>
                  <button
                    onClick={() => setOutputData("")}
                    className="p-2 hover:text-red-600 hover:bg-red-600/20 cursor-pointer text-white/40 transition-all"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {outputData ? (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 p-6 font-mono text-[11px] text-white/80 whitespace-pre overflow-auto custom-scrollbar selection:bg-white selection:text-black"
                  >
                    {outputData}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="absolute inset-0 flex flex-col items-center justify-center text-white/10 gap-4"
                  >
                    <CodeIcon size={48} weight="thin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">
                      Awaiting Data Input
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
