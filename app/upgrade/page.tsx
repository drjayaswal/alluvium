"use client";

import { AnimatedButton } from "@/components/ui/animated-button";
import {
  CheckIcon,
  CurrencyCircleDollarIcon,
  CoffeeIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const UpgradePage = () => {
  const handlePayment = (planName: string) => {
    toast.loading(`Redirecting to payment for ${planName}...`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="text-white min-h-screen"
    >
      <div className="max-w-full grid grid-cols-1 lg:grid-cols-10 h-full lg:h-screen">
        <div className="lg:col-span-5 p-8 lg:p-18 flex flex-col justify-between border-r border-white/10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <h3 className="text-[12px] font-black text-white/40 uppercase tracking-[0.2em]">
                Support Program
              </h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">
                  BUY ME A <span className="text-amber-500">COFFEE</span>
                </h2>
                <p className="text-white/50 leading-relaxed max-w-md">
                  Love the tool? Help keep the servers running and the coffee
                  brewing. Every contribution helps us ship new features faster.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "One-time contribution",
                  "Early access to beta features",
                  "A warm fuzzy feeling",
                  "Supporter badge in profile",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <CoffeeIcon
                      weight="fill"
                      className="w-5 h-5 text-amber-500"
                    />
                    <span className="text-sm font-mono uppercase tracking-wider">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <button
              onClick={() => toast.loading(`Brewing Coffee...`)}
              className="group/btn cursor-pointer relative flex items-center justify-between overflow-hidden px-6 py-3 font-bold text-white transition-all duration-500 hover:bg-amber-700 hover:text-white"
            >
              <span className="relative z-10 transition-all duration-500 group-hover/btn:tracking-widest mr-4">
                Buy A Coffee{" "}
              </span>
              <div className="relative flex items-center overflow-hidden h-6 w-6 px-1">
                <CoffeeIcon
                  weight="fill"
                  className={cn(
                    "transform transition-all duration-500 -translate-x-full scale-150 opacity-0 absolute",
                    "group-hover/btn:translate-x-0 group-hover/btn:opacity-100",
                  )}
                />
                <CoffeeIcon
                  weight="fill"
                  className={cn(
                    "transition-all duration-500 opacity-100  scale-150",
                    "group-hover/btn:translate-x-full group-hover/btn:opacity-0",
                  )}
                />
              </div>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover/btn:translate-x-full" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 p-8 lg:p-18 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-3">
              <h3 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.2em]">
                Premium Program
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-2">
                    PRO <span className="text-indigo-500">PLAN</span>
                  </h2>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-mono text-white/40">₹</span>
                  <span className="text-5xl font-black">999</span>
                  <span className="text-white/40 font-mono">/month</span>
                </div>
                <p className="text-white/50 leading-relaxed max-w-md">
                  Unlock the full potential of AI-driven resume analysis with
                  unlimited credits and advanced export capabilities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Unlimited Credits",
                  "Priority Processing",
                  "Advanced CSV Exports",
                  "Lifetime History",
                  "Deep Skill Analysis",
                  "24/7 Support",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-colors">
                      <CheckIcon
                        weight="fill"
                        className="w-3 h-3 text-indigo-400"
                      />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 relative z-10">
            <button
              onClick={() => toast.loading(`Redirecting to payment...`)}
              className="group/btn cursor-pointer relative flex items-center justify-between overflow-hidden px-6 py-3 font-bold text-white transition-all duration-500 hover:bg-white hover:text-black"
            >
              <span className="relative z-10 transition-all duration-500 group-hover/btn:tracking-widest mr-4">
                Upgrade to Pro
              </span>
              <div className="relative flex items-center overflow-hidden h-6 w-6 px-1">
                <CurrencyCircleDollarIcon
                weight="fill"
                className={cn(
                  "transform transition-all duration-500 -translate-x-full scale-150 opacity-0 absolute",
                  "group-hover/btn:translate-x-0 group-hover/btn:opacity-100",
                )}
                />
                <CurrencyCircleDollarIcon
                weight="fill"
                  className={cn(
                    "transition-all duration-500 opacity-100  scale-150",
                    "group-hover/btn:translate-x-full group-hover/btn:opacity-0",
                  )}
                />
              </div>
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover/btn:translate-x-full" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradePage;
