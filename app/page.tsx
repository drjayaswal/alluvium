"use client";

import {
  UserCog2,
  FilePen,
  User2,
  NonBinaryIcon,
  MessageCircle,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

export default function HeroSection() {
  const router = useRouter();

  return (
    <div className="relative mb-1 flex flex-col items-center justify-center text-white font-mono">
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <section className="relative z-10 max-w-195 mx-auto border border-white/15 bg-black text-center px-8 py-10.75">
        <div className="flex flex-wrap items-center justify-center w-fit mx-auto py-[6.9px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatedButton
              label="Services"
              onClick={() => router.push("/services")}
              Icon={Wrench}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatedButton
              label="Profile"
              onClick={() => router.push("/profile")}
              Icon={User2}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatedButton
              label="Developers"
              onClick={() => router.push("/developers")}
              Icon={UserCog2}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatedButton
              label="Feedback"
              onClick={() => router.push("/feedback")}
              Icon={FilePen}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <AnimatedButton
              label="Ingest" 
              onClick={() => router.push("/ingest")} 
              Icon={NonBinaryIcon} 
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <AnimatedButton
              label="Conversations" 
              onClick={() => router.push("/conversations")} 
              Icon={MessageCircle} 
            />
          </motion.div>
          
        </div>
      </section>
    </div>
  );
}
