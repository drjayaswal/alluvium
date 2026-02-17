"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowBendRightUpIcon,
  BellIcon,
  CheckIcon,
  ClockCounterClockwiseIcon,
  CopyIcon,
  PiggyBankIcon,
  SignOutIcon,
  UserIcon,
} from "@phosphor-icons/react";

import { ProfileProps } from "@/lib/interface";
import { useState } from "react";
import Image from "next/image";

export function Profile({ user }: ProfileProps) {
  const router = useRouter();

  const handleLogout = () => {
    toast.info("Logout?", {
      description: "You will be logged out of your account",
      action: {
        label: "Logout",
        onClick: () => {
          localStorage.removeItem("token");
          localStorage.removeItem("user_email");
          toast.success("Logged out successfully");
          window.dispatchEvent(new Event("storage_change"));
          router.push("/connect");
        },
      },
    });
  };

  if (!user) return null;

  const isLowCredits = user.credits < 10;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="w-full text-white flex-col py-6 min-[375px]:py-7 sm:py-8 md:py-10 lg:py-12"
    >
      <div className="max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto w-full px-3 min-[375px]:px-4 sm:px-5 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 min-[375px]:gap-7 sm:gap-8 md:gap-8 lg:gap-10">
          <div className="flex justify-between items-center gap-3 min-[375px]:gap-4">
            <div className="flex items-center gap-2 min-[375px]:gap-2.5 sm:gap-3">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[60px] lg:h-[60px] shrink-0"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl min-[375px]:text-3xl min-[400px]:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-none">
                  Profile
                </h1>
                <h4 className="font-bold text-white/50 text-xs min-[375px]:text-sm sm:text-sm md:text-base lg:text-lg tracking-tight">
                  Manage your account
                </h4>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group cursor-pointer flex flex-col items-center gap-1 min-[375px]:gap-1.5 sm:gap-2 transition-all shrink-0"
            >
              <div className="p-2 min-[375px]:p-2.5 sm:p-2.5 md:p-3 bg-white/5 rounded-xl group-hover:rounded-2xl text-white/70 group-hover:text-white group-hover:bg-red-800 transition-all duration-300">
                <SignOutIcon className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-[22px] md:h-[22px]" weight="fill" />
              </div>
              <span className="text-[9px] min-[375px]:text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                Sign Out
              </span>
            </button>
          </div>
        </div>
        <div className="space-y-4 min-[375px]:space-y-5 sm:space-y-6 md:space-y-6 lg:space-y-8 pt-8 min-[375px]:pt-9 sm:pt-10 md:pt-12 lg:pt-14">
          <section className="grid grid-cols-1 gap-3 min-[375px]:gap-4 sm:gap-4 md:gap-5">
            <div className="flex items-center gap-3 min-[375px]:gap-4 sm:gap-4 md:gap-4 lg:gap-5 group">
              <div className="h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <UserIcon
                  className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white/30 transition-colors"
                  weight="fill"
                />
              </div>
              <p className="text-xs min-[375px]:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/50 truncate transition-colors flex-1 min-w-0">
                {user.email}
              </p>
              <CopyButton onCopy={() => {}} content={user.email} />
            </div>
            <div className="flex items-center gap-3 min-[375px]:gap-4 sm:gap-4 md:gap-4 lg:gap-5 group">
              <div className="h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <PiggyBankIcon className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white/30" weight="fill" />
              </div>
              <div
                className={`px-3 min-[375px]:px-4 sm:px-4 md:px-5 lg:px-6 py-1 min-[375px]:py-1.5 sm:py-1.5 md:py-2 text-white transition-all ${
                  isLowCredits ? "bg-red-800" : "bg-green-800"
                }`}
              >
                <span className="text-xs min-[375px]:text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                  {user.credits} Credits
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 min-[375px]:gap-4 sm:gap-4 md:gap-4 lg:gap-5 group">
              <div className="h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0 relative">
                <BellIcon className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white/30" weight="fill" />
                <span className="absolute -top-0.5 min-[375px]:-top-1 -right-0.5 min-[375px]:-right-1 flex h-4 w-4 min-[375px]:h-5 min-[375px]:w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-white text-[8px] min-[375px]:text-[9px] sm:text-[10px] md:text-xs font-black text-black">
                  {user.total_conversations}
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-[375px]:gap-2 sm:gap-2 md:gap-3 flex-1 min-w-0">
                <p className="text-xs min-[375px]:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/30 italic truncate">
                  conversations
                </p>
                <button
                  onClick={() => router.push("/conversations")}
                  className="text-white/50 cursor-pointer hover:text-white hover:scale-110 transition-all p-1 shrink-0"
                >
                  <ArrowBendRightUpIcon className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" weight="fill" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 min-[375px]:gap-4 sm:gap-4 md:gap-4 lg:gap-5 group">
              <div className="h-10 w-10 min-[375px]:h-11 min-[375px]:w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <ClockCounterClockwiseIcon
                  className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white/30"
                />
              </div>
              <p className="text-xs min-[375px]:text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/30 truncate flex-1 min-w-0">
                {user.updated_at
                  ? new Date(user.updated_at).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

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
      className="cursor-pointer p-1 min-[375px]:p-1.5 sm:p-1.5 md:p-2 bg-transparent text-white/50 hover:bg-white/20 hover:text-white transition-all duration-200 z-30 shrink-0"
    >
      {copied ? (
        <CheckIcon className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" weight="fill" />
      ) : (
        <CopyIcon className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" weight="fill" />
      )}
    </button>
  );
};
