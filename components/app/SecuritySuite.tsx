"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import {
  CopyIcon,
  FingerprintIcon,
  ShieldWarningIcon,
  ClockIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyCheckIcon } from "lucide-react";
import Image from "next/image";
import { saveAs } from "file-saver";

export default function SecuritySuite({ user }: { user: UserData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [platform, setPlatform] = useState<"mac" | "win">("win");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const os = window.navigator.userAgent.toLowerCase();
      if (os.includes("mac")) setPlatform("mac");
    }
  }, []);

  // --- PASSWORD GENERATOR LOGIC ---
  const generatePassword = () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let retVal = "";
    for (let i = 0; i < 24; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(retVal);
    setTimeLeft(30);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setPassword("");
      setTimeLeft(null);
      toast.info("Buffer self-destructed for security.");
    }
    if (timeLeft === null) return;
    const intervalId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // --- METADATA STRIPPER LOGIC (HIGH RES FIX) ---
  const handleMetadataStrip = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (user.credits <= 0) {
      toast.info("Insufficient credits", {
        action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Stripping metadata...");
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");

      const creditRes = await fetch(`${getBaseUrl()}/deduct-credit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!creditRes.ok) throw new Error("Credit error");

      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                saveAs(blob, `CLEANED_${file.name}`);
                toast.success(
                  `Success: ${img.naturalWidth}x${img.naturalHeight} stripped`,
                  { id: toastId },
                );
              }
              URL.revokeObjectURL(objectUrl); // Clean memory
            },
            file.type,
            1.0,
          ); // 1.0 ensures maximum quality
        }
        setIsProcessing(false);
      };
      img.src = objectUrl;
    } catch (error) {
      toast.error("Operation failed", { id: toastId });
      setIsProcessing(false);
    } finally {
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Security Suite
          </h1>
          <p className="text-white/50 text-sm">
            Strip image fingerprints and generate high-entropy secrets.
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
          <div className="relative group">
            <input
              type="file"
              onChange={handleMetadataStrip}
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              accept="image/jpeg,image/png"
            />
            <motion.div
              className={`h-60 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden
                ${isProcessing ? "hover:border-white/40 border-white/10" : "border-white/20 hover:border-white/40 cursor-pointer"}`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
                {isProcessing ? (
                  <div className="w-10 h-10 border-3 border-black border-t-white rounded-full animate-spin" />
                ) : (
                  <FingerprintIcon
                    size={40}
                    className="text-white/30"
                    weight="light"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-white/30 mb-1">
                    Strip Image Metadata
                  </p>
                  <p className="text-[10px] text-white/30">
                    Maintain Original Resolution
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 text-white/40 mb-2">
              <ShieldWarningIcon size={18} weight="fill" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Privacy Note
              </span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Metadata stripping removes EXIF, GPS, and camera profiles. Your
              pixels remain untouched, but the identity of the file is erased.
            </p>
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
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
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
              <div className="flex items-center gap-4">
                {timeLeft !== null && (
                  <div className="flex items-center gap-2 text-amber-500">
                    <ClockIcon size={14} weight="bold" />
                    <span className="text-[10px] font-mono font-bold">
                      {timeLeft}s
                    </span>
                  </div>
                )}
                <button
                  onClick={generatePassword}
                  className="p-1 hover:text-black hover:bg-white px-2 py-1 text-white transition-colors cursor-pointer flex items-center gap-2 uppercase text-[10px] font-bold"
                >
                  <ArrowClockwiseIcon
                    weight="bold"
                    size={14}
                    className={isProcessing ? "animate-spin" : ""}
                  />
                  Regenerate
                </button>
              </div>
            </div>

            <div className="flex-1 relative flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {password && (
                  <motion.div
                    key="pass"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-8 flex flex-col items-center"
                  >
                    <div className="p-6 w-full rounded-none text-center group relative overflow-hidden">
                      <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <span className="relative z-10 text-xl md:text-2xl font-mono group-hover:text-black transition-colors duration-1000 text-white tracking-widest break-all">
                        {password}
                      </span>
                    </div>

                    <div className="flex">
                      <motion.button
                        onClick={copyPassword}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 hover:border-white border-transparent border cursor-pointer text-white font-black uppercase text-[11px] tracking-[0.2em] flex items-center gap-3 duration-300 transition-colors"
                      >
                        {copied ? (
                          <CopyCheckIcon size={16} />
                        ) : (
                          <CopyIcon size={16} weight="bold" />
                        )}
                        {copied ? "Copied" : "Copy Secret"}
                      </motion.button>

                      <button
                        onClick={() => {
                          setPassword("");
                          setTimeLeft(null);
                        }}
                        className="px-6 py-3 border cursor-pointer border-transparent text-red-500 font-bold uppercase text-[11px] hover:border-red-500 hover:text-red-500 transition-all"
                      >
                        Destroy
                      </button>
                    </div>
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
