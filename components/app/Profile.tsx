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
      className="w-full text-white flex-col py-10"
    >
      <div className="max-w-2xl mx-auto w-full px-4">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="shrink-0"
              />
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-none">
                  Profile
                </h1>
                <h4 className="font-bold text-white/50 text-sm sm:text-base tracking-tight">
                  Manage your account
                </h4>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group cursor-pointer flex flex-col items-center gap-1.5 transition-all"
            >
              <div className="p-2.5 bg-white/5 rounded-xl group-hover:rounded-2xl text-white/70 group-hover:text-white group-hover:bg-red-800 transition-all duration-300">
                <SignOutIcon size={22} weight="fill" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                Sign Out
              </span>
            </button>
          </div>
        </div>
        <div className="space-y-6 pt-12">
          <section className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <UserIcon
                  size={24}
                  weight="fill"
                  className="text-white/30 transition-colors"
                />
              </div>
              <p className="text-sm sm:text-lg font-medium text-white/50 truncate transition-colors">
                {user.email}
              </p>
              <CopyButton onCopy={() => {}} content={user.email} />
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <PiggyBankIcon size={24} className="text-white/30" weight="fill" />
              </div>
              <div
                className={`px-4 py-1 text-white transition-all ${
                  isLowCredits ? "bg-red-800" : "bg-green-800"
                }`}
              >
                <span className="text-sm sm:text-lg font-bold">
                  {user.credits} Credits
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0 relative">
                <BellIcon size={24} className="text-white/30" weight="fill" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-black">
                  {user.total_conversations}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm sm:text-lg font-medium text-white/30 italic">
                  conversations
                </p>
                <button
                  onClick={() => router.push("/conversations")}
                  className="text-white/50 cursor-pointer hover:text-white hover:scale-110 transition-all p-1"
                >
                  <ArrowBendRightUpIcon size={20} weight="fill" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                <ClockCounterClockwiseIcon
                  size={24}
                  className="text-white/30"
                />
              </div>
              <p className="text-sm sm:text-lg font-medium text-white/30">
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
      className=" cursor-pointer p-1.5 bg-transparent text-white/50 hover:bg-white/20 hover:text-white transition-all duration-200 z-30"
    >
      {copied ? <CheckIcon size={16} weight="fill" /> : <CopyIcon size={16} weight="fill" />}
    </button>
  );
};
