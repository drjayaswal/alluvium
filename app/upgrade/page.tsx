"use client";

import {
  CheckIcon,
  CurrencyCircleDollarIcon,
  CoffeeIcon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "support",
    title: "Support Program",
    header: (
      <>
        BUY ME A <span className="text-amber-500">COFFEE</span>
      </>
    ),
    description:
      "Love the tool? Help keep the servers running and the coffee brewing. Every contribution helps us ship new features faster.",
    features: [
      "One-time contribution",
      "Early access to beta features",
      "A warm fuzzy feeling",
      "Supporter badge in profile",
    ],
    featureIcon: CoffeeIcon,
    featureIconProps: {
      className:
        "w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-500 sm:text-amber-500 lg:text-white/30 lg:group-hover/btn:text-amber-500",
    },
    featureTextClass:
      "text-xs sm:text-sm font-mono uppercase tracking-wider break-words",
    button: {
      label: "Buy A Coffee",
      onClick: () => toast.loading(`Brewing Coffee...`),
      className: cn(
        "group/btn cursor-pointer relative flex items-center justify-between overflow-hidden w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition-all duration-500",
        "bg-amber-700 sm:bg-white/10",
        "hover:bg-amber-800 sm:hover:bg-amber-700",
        "sm:text-amber-300 sm:hover:text-white",
        "sm:text-amber-400"
      ),
      spanClass: cn(
        "relative z-10 transition-all duration-500 lg:group-hover/btn:tracking-widest mr-2 sm:mr-4",
        "lg:text-white/30 lg:group-hover/btn:text-white"
      ),
      iconLeft: (
        <CoffeeIcon
          weight="fill"
          className={cn(
            "transform transition-all duration-500 -translate-x-full scale-150 opacity-0 absolute",
            "lg:group-hover/btn:translate-x-0 lg:group-hover/btn:opacity-100",
            "text-white sm:text-white lg:text-white/30",
            "sm:text-white lg:text-white/30 lg:group-hover/btn:text-white"
          )}
        />
      ),
      iconRight: (
        <CoffeeIcon
          weight="fill"
          className={cn(
            "transition-all duration-500 opacity-100 scale-150",
            "lg:group-hover/btn:translate-x-full lg:group-hover/btn:opacity-0",
            "sm:text-amber-500 lg:text-white/30 lg:group-hover/btn:text-amber-500" 
          )}
        />
      ),
    },
    wrapperClass:
      "lg:col-span-5 p-4 sm:p-6 md:p-8 lg:p-16 xl:p-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0",
    headerClass:
      "text-[10px] sm:text-[11px] md:text-[12px] font-black text-white/40 uppercase tracking-[0.2em]",
    priceSection: null,
    name: "Buy Me A Coffee",
  },
  {
    id: "premium",
    title: "Premium Program",
    header: (
      <>
        PRO <span className="text-indigo-500">PLAN</span>
      </>
    ),
    priceSection: (
      <div className="flex items-baseline gap-1 mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl font-mono text-white/40">₹</span>
        <span className="text-4xl sm:text-5xl md:text-6xl font-black">
          999
        </span>
        <span className="text-sm sm:text-base text-white/40 font-mono">
          /month
        </span>
      </div>
    ),
    description:
      "Unlock the full potential of AI-driven resume analysis with unlimited credits and advanced export capabilities.",
    features: [
      "Unlimited Credits",
      "Priority Processing",
      "Advanced CSV Exports",
      "Lifetime History",
      "Deep Skill Analysis",
      "24/7 Support",
    ],
    featureIcon: CheckIcon,
    featureIconProps: {
      className:
        "w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-400 sm:text-indigo-400",
    },
    featureTextClass:
      "text-[10px] sm:text-[11px] font-bold uppercase tracking-widest break-words text-white/50 sm:text-white/60",
    button: {
      label: "Upgrade to Pro",
      onClick: () => toast.loading(`Redirecting to payment...`),
      className: cn(
        "group/btn cursor-pointer relative flex items-center justify-between overflow-hidden w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white transition-all duration-500",
        "bg-indigo-700 sm:bg-white/10",
        "hover:bg-indigo-800 sm:hover:bg-indigo-700",
        "sm:text-indigo-300 sm:hover:text-white",
        "sm:text-indigo-400"
      ),
      spanClass: cn(
        "relative z-10 transition-all duration-500 lg:group-hover/btn:tracking-widest mr-2 sm:mr-4",
        "lg:text-white/30 lg:group-hover/btn:text-white"
      ),
      iconLeft: (
        <CurrencyCircleDollarIcon
          weight="fill"
          className={cn(
            "transform transition-all duration-500 -translate-x-full scale-150 opacity-0 absolute",
            "lg:group-hover/btn:translate-x-0 lg:group-hover/btn:opacity-100",
            "sm:text-indigo-500 lg:text-white/30 lg:group-hover/btn:text-white"
          )}
        />
      ),
      iconRight: (
        <CurrencyCircleDollarIcon
          weight="fill"
          className={cn(
            "transition-all duration-500 opacity-100 scale-150",
            "lg:group-hover/btn:translate-x-full lg:group-hover/btn:opacity-0",
            "sm:text-indigo-500 lg:text-white/30 lg:group-hover/btn:text-indigo-500"
          )}
        />
      ),
    },
    wrapperClass:
      "lg:col-span-5 p-4 sm:p-6 md:p-8 lg:p-16 xl:p-20 flex flex-col justify-between relative overflow-hidden pt-8 lg:pt-16 xl:pt-20",
    headerClass: cn(
      "text-[10px] sm:text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em]",
      "text-white/40 sm:text-indigo-400"
    ),
    name: "Pro",
  },
];

const UpgradePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="text-white min-h-screen"
    >
      <div className="max-w-full mb-14 grid grid-cols-1 lg:grid-cols-10 min-h-screen">
        {PLANS.map((plan) => (
          <div key={plan.id} className={plan.wrapperClass}>
            {/* Specials for Premium Plan: glowy ball bg */}
            {plan.id === "premium" && (
              <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-indigo-600/10 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full -mr-32 sm:-mr-40 md:-mr-48 -mt-32 sm:-mt-40 md:-mt-48 pointer-events-none" />
            )}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <h3 className={plan.headerClass}>{plan.title}</h3>
                {plan.id === "support" && (
                  <div className="h-px flex-1 bg-white/5" />
                )}
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <div className={plan.id === "premium" ? "flex items-baseline gap-1 sm:gap-2" : undefined}>
                    <h2
                      className={cn(
                        "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tighter mb-2",
                        plan.id === "support" && "mb-3 sm:mb-4"
                      )}
                    >
                      {plan.header}
                    </h2>
                  </div>
                  {plan.priceSection}
                  <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-md">
                    {plan.description}
                  </p>
                </div>

                <div
                  className={
                    plan.id === "premium"
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                      : "space-y-3 sm:space-y-4"
                  }
                >
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className={plan.id === "premium"
                        ? "flex items-center gap-2 sm:gap-3 group"
                        : "flex items-center gap-2 sm:gap-3 text-white/70"}
                    >
                      {plan.featureIcon === CoffeeIcon ? (
                        <CoffeeIcon
                          weight="fill"
                          className={plan.featureIconProps.className}
                        />
                      ) : (
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border flex items-center justify-center transition-colors shrink-0 border-white/10 sm:border-indigo-500/50">
                          <CheckIcon weight="fill" className={plan.featureIconProps.className} />
                        </div>
                      )}
                      <span className={plan.featureTextClass}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={plan.id === "premium" ? "mt-8 sm:mt-10 md:mt-12 relative z-10" : "mt-8 sm:mt-10 md:mt-12"}>
              <button onClick={plan.button.onClick} className={plan.button.className}>
                <span className={plan.button.spanClass}>{plan.button.label}{" "}</span>
                <div className="relative flex items-center overflow-hidden h-5 w-5 sm:h-6 sm:w-6 px-1 shrink-0 group/btn">
                  {plan.button.iconLeft}
                  {plan.button.iconRight}
                </div>
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out lg:group-hover/btn:translate-x-full" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default UpgradePage;
