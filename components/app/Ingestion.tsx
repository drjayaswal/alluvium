"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { toast } from "sonner";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  CircleNotchIcon,
  CloudArrowUpIcon,
  FileDocIcon,
  FilePdfIcon,
  FileTxtIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

interface AIProps {
  user: UserData;
}

export default function Ingestion({ user }: AIProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleVideoIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return toast.error("Paste Video URL");
    const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((?:\w|-){11})(?:\S+)?$/;
    if (!youtubeRegex.test(videoUrl)) return toast.error("Invalid YouTube URL");
    const token = localStorage.getItem("token");
    setVideoLoading(true);
    try {
      const res = await fetch(`${getBaseUrl()}/ingest-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: videoUrl, user_id: user.id }),
      });

      if (res.status === 401) {
        toast.error("Please log in again.");
        router.push("/connect");
      }

      const response = await res.json();
      if (res.ok) {
        if (response.status !== "ready") {
          toast.info("Resource will be ready soon", {
            id: "ingest-status",
            action: {
              label: "Continue to Conversation",
              onClick: () => {
                const toastId = toast.loading("Redirecting...");
                setTimeout(() => {
                  toast.dismiss(toastId);
                  router.push("/conversations");
                }, 1500);
              },
            },
          });
        } else {
          setVideoUrl("");
          toast.info("Resource is Ready", {
            id: "ingest-status",
            action: {
              label: "Continue to Conversation",
              onClick: () => {
                const toastId = toast.loading("Redirecting...");
                setTimeout(() => {
                  toast.dismiss(toastId);
                  router.push("/conversations");
                }, 1500);
              },
            },
          });
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setVideoLoading(false);
    }
  };
  const handleFileIngest = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Upload Document");

    setFileName(file.name);
    setFileLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${getBaseUrl()}/ingest-document`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        toast.error("Please log in again.");
        router.push("/connect");
      }
      const response = await res.json();

      if (res.ok) {
        if (response.status !== "ready") {
          toast.info("Resource will be ready soon", {
            id: "ingest-status",
            action: {
              label: "Continue to Conversation",
              onClick: () => {
                const toastId = toast.loading("Redirecting...");
                setTimeout(() => {
                  toast.dismiss(toastId);
                  router.push("/conversations");
                }, 1500);
              },
            },
          });
        } else {
          setVideoUrl("");
          toast.info("Resource is Ready", {
            id: "ingest-status",
            action: {
              label: "Continue to Conversation",
              onClick: () => {
                const toastId = toast.loading("Redirecting...");
                setTimeout(() => {
                  toast.dismiss(toastId);
                  router.push("/conversations");
                }, 1500);
              },
            },
          });
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="min-h-screen w-full flex items-center justify-center p-2 min-[375px]:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10"
    >
      <div className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <header className="mb-6 min-[375px]:mb-7 sm:mb-8 md:mb-10 lg:mb-12 flex items-center gap-2 min-[375px]:gap-2.5 sm:gap-3">
          <Image
            src="/logo.png"
            alt="logo"
            width={60}
            height={60}
            className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px] -mr-1 min-[375px]:-mr-1.5 sm:-mr-2 shrink-0"
          />
          <div>
            <h1 className="text-2xl min-[375px]:text-3xl min-[400px]:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter text-white">
              <span className="uppercase">Ingest</span>
            </h1>
            <span className="text-xs min-[375px]:text-sm sm:text-sm md:text-base text-white/50">Add Context</span>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/20 gap-0.5 md:gap-0">
          <div className="p-4 min-[375px]:p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 space-y-4 min-[375px]:space-y-5 sm:space-y-6 md:space-y-6 lg:space-y-7">
            <div className="flex items-center justify-between">
              <YoutubeLogoIcon
                weight="fill"
                className={`w-6 h-6 min-[375px]:w-7 min-[375px]:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 ${videoLoading || videoUrl ? " text-white" : "text-white/30"}`}
              />
              <span className="text-xs min-[375px]:text-xs sm:text-sm md:text-sm lg:text-base text-white/30 font-bold uppercase">
                Video
              </span>
            </div>

            <form onSubmit={handleVideoIngest} className="space-y-3 min-[375px]:space-y-3.5 sm:space-y-4 md:space-y-4 lg:space-y-5">
              <input
                disabled={videoLoading}
                className="w-full bg-transparent border-b border-white/20 py-2 min-[375px]:py-2.5 sm:py-3 md:py-3 text-sm min-[375px]:text-sm sm:text-base md:text-base text-white outline-none focus:border-white transition-colors placeholder:text-white/20"
                placeholder="https://www.youtube.com/YOUTUEVIDEOURL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <button
                disabled={videoLoading || !videoUrl}
                className={`cursor-pointer group w-full bg-white/80 text-black py-2.5 min-[375px]:py-3 sm:py-3 md:py-3.5 lg:py-4 text-xs min-[375px]:text-xs sm:text-sm md:text-sm font-bold uppercase ${videoUrl && "hover:bg-white hover:text-black"} transition-all flex items-center justify-center gap-2 disabled:opacity-30`}
              >
                {videoLoading ? (
                  <>
                    <CircleNotchIcon className="animate-spin w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-4 sm:h-4" weight="bold" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process
                    <ArrowRightIcon
                      className={`w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-4 sm:h-4 ${videoUrl && "group-hover:translate-x-1 transition-transform"}`}
                      weight="fill"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="p-4 min-[375px]:p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 space-y-4 min-[375px]:space-y-5 sm:space-y-6 md:space-y-6 lg:space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 min-[375px]:gap-1.5 sm:gap-2">
                <FilePdfIcon
                  weight="fill"
                  className={`w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 ${fileLoading ? "text-white" : "text-white/50"}`}
                />
                <FileDocIcon
                  weight="fill"
                  className={`w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 ${fileLoading ? "text-white" : "text-white/50"}`}
                />
                <FileTxtIcon
                  weight="fill"
                  className={`w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 ${fileLoading ? "text-white" : "text-white/50"}`}
                />
              </div>
              <span className="text-xs min-[375px]:text-xs sm:text-sm md:text-sm lg:text-base text-white/30 font-bold uppercase">
                Document
              </span>
            </div>

            <label
              className={`
              border border-dashed p-6 min-[375px]:p-7 sm:p-8 md:p-9 lg:p-10 xl:p-12 flex flex-col items-center justify-center cursor-pointer transition-all
              ${fileLoading ? "border-white bg-white/10" : "border-white/50 hover:border-white/80 hover:bg-white/5"}
            `}
            >
              {fileLoading ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <CircleNotchIcon
                    className="animate-spin text-white w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    weight="bold"
                  />
                  <span className="text-xs min-[375px]:text-xs sm:text-sm md:text-sm uppercase text-white font-bold">
                    Uploading...
                  </span>
                  <span className="text-[9px] min-[375px]:text-[10px] sm:text-xs text-white/50 truncate max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                    {fileName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CloudArrowUpIcon className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-1 text-white" weight="fill" />
                  <span className="text-xs min-[375px]:text-xs sm:text-sm md:text-sm text-white uppercase font-bold tracking-widest">
                    Upload
                  </span>
                  <span className="text-[9px] min-[375px]:text-[10px] sm:text-xs text-white/40 italic">
                    Max size: 10MB
                  </span>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileIngest}
                disabled={fileLoading}
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
