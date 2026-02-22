"use client";

import { motion } from "framer-motion";
import {
  ArrowsInLineVerticalIcon,
  CursorClickIcon,
} from "@phosphor-icons/react";

export default function Tools() {
  return (
    <div className="h-full w-full flex items-center justify-center p-6 lg:p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-md w-full flex flex-col items-center text-center"
      >
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tighter text-white/60">
            Tools<span className="text-xl text-white/20">.</span>explore
          </h2>
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/10 text-white/60">
            <CursorClickIcon size={18} />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Select a tool from the sidebar to begin
            </span>
          </div>
        </div>

        <div className="mt-5 w-full grid grid-cols-3 items-center opacity-20">
          <div className="h-px bg-white w-full" />
          <ArrowsInLineVerticalIcon
            weight="bold"
            size={12}
            className="mx-auto"
          />
          <div className="h-px bg-white w-full" />
        </div>
      </motion.div>
    </div>
  );
}
