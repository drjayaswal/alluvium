"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import {
  PaletteIcon,
  UploadSimpleIcon,
  CopyIcon,
  TrashIcon,
  MinusIcon,
  SquareIcon,
  XIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyCheckIcon } from "lucide-react";
import Image from "next/image";

type PrecisionLevel = "Low" | "Medium" | "High";

const PRECISION_MASKS = {
  Low: 0xf0,
  Medium: 0xf8,
  High: 0xff,
};

export default function ColorPaletteExtractor({ user }: { user: UserData }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [precision, setPrecision] = useState<PrecisionLevel>("Low");
  const [platform, setPlatform] = useState<"mac" | "win">("win");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const os = window.navigator.userAgent.toLowerCase();
      if (os.includes("mac")) setPlatform("mac");
    }
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user.credits <= 0) {
      toast.info("Insufficient credits", {
        action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Processing credits...");
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${getBaseUrl()}/deduct-credit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 402) {
        toast.dismiss(toastId);
        toast.error("Insufficient credits!", {
          action: { label: "Upgrade", onClick: () => router.push("/upgrade") },
        });
        setIsProcessing(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Credit deduction failed");
      }

      toast.loading("Analyzing image...", { id: toastId });
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          setSourceImage(event.target?.result as string);
          extractColors(img, precision);
          toast.dismiss(toastId);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Server connection error");
      setIsProcessing(false);
    }
  };

  const extractColors = (img: HTMLImageElement, level: PrecisionLevel) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 150;
    canvas.height = 150;
    ctx.drawImage(img, 0, 0, 150, 150);

    const imageData = ctx.getImageData(0, 0, 150, 150).data;
    const uniqueColors = new Set<string>();
    const mask = PRECISION_MASKS[level];

    for (let i = 0; i < imageData.length; i += 4) {
      let r = imageData[i];
      let g = imageData[i + 1];
      let b = imageData[i + 2];
      const a = imageData[i + 3];

      if (a < 255) continue;

      r = r & mask;
      g = g & mask;
      b = b & mask;

      const hex =
        `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`.toUpperCase();
      uniqueColors.add(hex);
    }

    setColors(Array.from(uniqueColors));
    setIsProcessing(false);
    toast.success(`Extracted ${uniqueColors.size} visual colors`);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
            Color Extractor
          </h1>
          <p className="text-white/50 text-sm">
            Analyze images to extract unique color codes with adjustable
            accuracy.
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
              onChange={handleImageUpload}
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              accept="image/*"
            />
            <motion.div
              className={`h-50 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 overflow-hidden relative
                ${isProcessing ? "border-white/10" : "border-white/20 hover:border-white/40 cursor-pointer"}`}
              whileHover={{ scale: 1.01 }}
            >
              {sourceImage && (
                <img
                  src={sourceImage}
                  alt="Source"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md"
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
                {isProcessing ? (
                  <div className="w-10 h-10 border-3 border-black border-t-white rounded-full animate-spin" />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-center px-6">
                    <UploadSimpleIcon
                      size={40}
                      className="text-white/30"
                      weight="light"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white/30 mb-1">
                        {" "}
                        {isProcessing ? "Processing..." : "Upload Image"}
                      </p>
                      <p className="text-xs text-white/20">
                        Drag & drop or click to browse
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
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
              <div className="flex flex-col gap-1">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest text-white/30 ${colors.length > 0 && "text-white"}`}
                >
                  {colors.length > 0
                    ? `${colors.length} Unique Colors`
                    : "Select Accuracy"}
                </span>
                <div className="flex items-center mt-1">
                  {(["Low", "Medium", "High"] as const).map((level) => (
                    <button
                      key={level}
                      disabled={isProcessing}
                      onClick={() => {
                        setPrecision(level);
                        if (sourceImage) {
                          const img = new window.Image();
                          img.onload = () => extractColors(img, level);
                          img.src = sourceImage;
                        }
                      }}
                      className={`text-[8px] uppercase cursor-pointer font-bold p-2 border-y border-white/20 transition-all ${
                        precision === level
                          ? "bg-white text-black border-white"
                          : "text-white"
                      } ${isProcessing && "opacity-50 cursor-not-allowed"}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              {colors.length > 0 && (
                <button
                  onClick={() => setColors([])}
                  className="p-1 hover:text-red-600 cursor-pointer hover:bg-red-600/20 transition-colors text-white/40"
                >
                  <TrashIcon size={18} />
                </button>
              )}
            </div>

            <div className="flex-1 relative overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                {colors.length > 0 ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 p-4 pt-0 overflow-y-auto custom-scrollbar"
                  >
                    <div className="divide-y divide-white/5">
                      {colors.map((color) => (
                        <div
                          key={color}
                          className="flex items-center justify-between py-2 group hover:bg-white/5 px-2 transition-colors cursor-pointer"
                          onClick={() => copyColor(color)}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-8 h-8 rounded-sm border border-white/10 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs font-mono text-white/80 tracking-tighter">
                              {color}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-white/10 uppercase group-hover:text-white/40 transition-colors">
                              {copiedColor === color
                                ? "Copied"
                                : "Click to Copy"}
                            </span>
                            {copiedColor === color ? (
                              <CopyCheckIcon size={14} className="text-white" />
                            ) : (
                              <CopyIcon
                                size={14}
                                className="text-white/20 group-hover:text-white transition-colors"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4"
                  >
                    <PaletteIcon size={48} weight="thin" />
                    <p className="text-xs font-medium uppercase tracking-widest">
                      Awaiting Image
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
