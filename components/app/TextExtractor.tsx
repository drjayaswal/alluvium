"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import {
  FileTextIcon,
  UploadSimpleIcon,
  CopyIcon,
  FilePdfIcon,
  FileDocIcon,
  FileTxtIcon,
  TrashIcon,
  CaretDownIcon,
  MinusIcon,
  SquareIcon,
  XIcon
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyCheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import Image from "next/image";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const DOWNLOAD_FORMATS = [
  { id: "txt", label: "Text (.TXT)", icon: FileTxtIcon },
  { id: "pdf", label: "PDF Document", icon: FilePdfIcon },
  { id: "docx", label: "Word Document", icon: FileDocIcon },
];

export default function TextExtractor({ user }: { user: UserData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [platform, setPlatform] = useState<"mac" | "win">("win");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const os = window.navigator.userAgent.toLowerCase();
      if (os.includes("mac")) setPlatform("mac");
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user.credits === 0) {
      toast.info("Insufficient credits", {
        action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Unsupported file format");
      return;
    }

    const toastId = toast.loading("Processing file...");
    const formData = new FormData();
    formData.append("file", file);
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${getBaseUrl()}/file-to-text`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      toast.dismiss(toastId);
      if (response.status === 402) {
        toast.error("Insufficient credits!", {
          action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
        });
        return;
      }
      if (response.ok && data.text) {
        setExtractedText(data.text);
        toast.success("Text extracted successfully");
      } else {
        toast.error(data.message || "Could not read file");
      }
    } catch (error) {
      toast.error("Server connection error");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: string) => {
    if (!extractedText) return;
    setIsDownloading(true);
    const filename = `FTTT_File-${new Date().getTime()}`;

    try {
      if (format === "pdf") {
        const doc = new jsPDF();
        const splitText = doc.splitTextToSize(extractedText, 180);
        doc.text(splitText, 10, 10);
        doc.save(`${filename}.pdf`);
      } else if (format === "docx") {
        const wordDoc = new Document({
          sections: [{
            children: [new Paragraph({ children: [new TextRun(extractedText)] })],
          }],
        });
        const blob = await Packer.toBlob(wordDoc);
        saveAs(blob, `${filename}.docx`);
      } else {
        const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${filename}.txt`);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to generate file");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">File to Text</h1>
          <p className="text-white/50 text-sm">Convert PDF, Word, and Text documents into editable text.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-white/50">Credits</span>
          <span className="text-sm font-bold text-white">{user?.credits || 0}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group">
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              accept=".pdf,.doc,.docx,.txt"
            />
            <motion.div
              className={`h-50 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
                ${isProcessing ? "border-white/10" : "border-white/20 hover:border-white/40 cursor-pointer"}`}
              whileHover={{ scale: 1.02 }}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-3 border-black border-t-white rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-white">Processing...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center px-6">
                  <UploadSimpleIcon size={40} className="text-white/30" weight="light" />
                  <div>
                    <p className="text-sm font-semibold text-white/30 mb-1">Upload Your Document</p>
                    <p className="text-xs text-white/20">Drag & drop or click to browse</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            className="overflow-hidden bg-black border flex flex-col h-120 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={`flex items-center px-4 py-1 bg-white z-10 
              ${platform === "mac" ? "flex-row" : "flex-row-reverse"}`}>
              <div className={`flex items-center gap-2 ${platform === "mac" && "w-14 mr-2"}`}>
                {platform === "mac" ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </>
                ) : (
                  <>
                    <MinusIcon size={14} className="text-[#ff5f56]" weight="bold" />
                    <SquareIcon size={12} className="text-[#ffbd2e]" weight="bold" />
                    <XIcon size={14} className="text-[#27c93f]" weight="bold" />
                  </>
                )}
              </div>
              <div className="flex-1 text-center mb-2">
                <Image src="/logo.png" alt="Alluvium Logo" width={20} height={20} className="inline-block mr-2 invert" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">Alluvium Tools</span>
              </div>
              {platform === "mac" && <div className="w-12" />}
            </div>

            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-1">
                {extractedText && (
                  <div className="flex items-center gap-1">
                    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden h-9">
                      <motion.button
                        onClick={() => handleDownload("txt")}
                        className="px-3 h-full flex cursor-pointer items-center gap-2 transition-colors text-white/40 border-r border-white/10"
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">Download</span>
                      </motion.button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.button className="px-2 h-full flex cursor-pointer items-center justify-center hover:bg-white/10 transition-colors text-white/50 outline-none">
                            <CaretDownIcon weight="bold" size={14} />
                          </motion.button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-fit rounded-none bg-black border border-white/15 text-white font-mono p-1">
                          <div className="p-1">
                            {DOWNLOAD_FORMATS.map((format) => (
                              <div
                                key={format.id}
                                onClick={() => handleDownload(format.id)}
                                className={`flex gap-2 items-center p-2 rounded-none focus:text-black cursor-pointer ${format.id === "pdf" && " hover:bg-red-500"} ${format.id === "docx" && "hover:bg-indigo-500"} ${format.id === "txt" && "hover:bg-blue-500"}`}
                              >
                                <div className="flex gap-2 items-center">
                                <format.icon size={16}/>
                                <span className="text-[10px] uppercase font-bold tracking-widest flex-1">{format.id.toUpperCase()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <motion.button onClick={copyText} className="p-2 hover:bg-white/10 cursor-pointer rounded-lg text-white/50 transition-all">
                      {copied ? <CopyCheckIcon size={18} className="text-white" /> : <CopyIcon size={18} />}
                    </motion.button>
                    <motion.button onClick={() => setExtractedText("")} className="p-2 hover:bg-red-600/20 cursor-pointer rounded-lg text-white/40 hover:text-red-600 transition-all">
                      <TrashIcon size={18} />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {extractedText ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-6 pt-0 text-sm text-white leading-relaxed font-mono whitespace-pre-wrap overflow-y-auto custom-scrollbar selection:bg-white selection:text-black"
                  >
                    {extractedText}
                  </motion.div>
                ) : (
                  <motion.div key="placeholder" className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-4">
                    <FileTextIcon size={48} weight="thin" className="text-white/30" />
                    <p className="text-xs font-medium">Extracted text will appear here</p>
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