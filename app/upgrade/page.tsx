"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  XIcon,
  QrCodeIcon,
  CheckIcon,
  CoinIcon,
  CoffeeIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAYTM_UPI_ID = "6377257649@pthdfc";
const NAME = "Dhruv Ratan Jayaswal";

const generateUPILink = (amount: string) => {
  return `upi://pay?pa=${PAYTM_UPI_ID}&pn=${encodeURIComponent(NAME)}&am=${amount}&cu=INR`;
};

const UpgradePage = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const openPayment = (plan: any) => {
    setSelectedPlan(plan);
    setShowPayment(true);
    toast.success(`Opening secure gateway...`);
  };

  const PLANS = [
    {
      id: "Patron",
      title: "Support Program",
      amount: "150",
      header: (
        <>
          <span className="text-amber-500">el-Alluvium</span>er
        </>
      ),
      description:
        "Become a cornerstone of our development. Your contribution sustains the core infrastructure and fuels the continuous evolution of the el-Alluvium ecosystem.",
      features: [
        "Core Project Stewardship",
        "Exclusive Beta Invitations",
        "Ecosystem Badge Recognition",
        "Direct Influence on Roadmap",
      ],
      featureIcon: CoffeeIcon,
      featureIconProps: {
        className:
          "w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-amber-500 lg:group-hover/btn:text-amber-500",
      },
      featureTextClass:
        "text-[10px] sm:text-xs md:text-sm font-mono uppercase tracking-wider break-words",
      button: {
        label: "Support el-Alluvium",
        onClick: () =>
          openPayment({ name: "el-Alluvium-er Status", amount: "150" }),
        className: cn(
          "group/btn cursor-pointer relative flex items-center justify-between overflow-hidden w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white transition-all duration-500 bg-amber-700 sm:bg-black hover:bg-amber-800 sm:hover:bg-amber-700 sm:text-amber-400 sm:hover:text-white border border-white/5",
        ),
        spanClass:
          "relative z-10 transition-all duration-500 lg:group-hover/btn:tracking-widest mr-4",
        iconLeft: (
          <CoffeeIcon
            weight="fill"
            className="transform transition-all duration-500 -translate-x-full scale-150 opacity-0 absolute lg:group-hover/btn:translate-x-0 lg:group-hover/btn:opacity-100"
          />
        ),
        iconRight: (
          <CoffeeIcon
            weight="fill"
            className="transition-all duration-500 opacity-100 scale-150 lg:group-hover/btn:translate-x-full lg:group-hover/btn:opacity-0"
          />
        ),
      },
      wrapperClass:
        "lg:col-span-5 p-6 sm:p-12 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 min-h-[60vh] lg:min-h-screen",
      headerClass:
        "text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-[0.3em]",
      name: "Alluvium-er",
    },
    {
      id: "Premium",
      title: "The Experience",
      amount: "999",
      header: (
        <>
          <span className="text-indigo-500">el-Alluvium</span>ite
        </>
      ),
      priceSection: (
        <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl lg:text-3xl font-mono text-white/40">
            ₹
          </span>
          <span className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black">
            999
          </span>
          <span className="text-sm sm:text-base lg:text-lg text-white/40 font-mono">
            /month
          </span>
        </div>
      ),
      description:
        "The definitive el-Alluvium experience. Designed for those who demand high-fidelity analysis, unhindered processing, and total platform immersion.",
      features: [
        "Total Processing Priority",
        "Unrestricted Credit Access",
        "Premium Intelligence Modules",
        "Full Data Portability",
        "Extended Analysis History",
        "Direct Line Technical Support",
      ],
      featureIcon: CheckIcon,
      featureIconProps: { className: "w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" },
      featureTextClass:
        "text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50",
      button: {
        label: "Embrace the Experience",
        onClick: () =>
          openPayment({ name: "el-Alluvium-ite Membership", amount: "999" }),
        className: cn(
          "group/btn cursor-pointer relative flex items-center justify-between overflow-hidden w-full sm:w-auto px-5 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white transition-all duration-500 bg-indigo-700 sm:bg-black hover:bg-indigo-800 sm:hover:bg-indigo-700 sm:text-indigo-400 sm:hover:text-white border border-white/5",
        ),
        spanClass:
          "relative z-10 transition-all duration-500 lg:group-hover/btn:tracking-widest mr-4",
        iconLeft: (
          <CoinIcon
            weight="fill"
            className="transform transition-all duration-500 -translate-x-full scale-150 opacity-0 absolute lg:group-hover/btn:translate-x-0 lg:group-hover/btn:opacity-100"
          />
        ),
        iconRight: (
          <CoinIcon
            weight="fill"
            className="transition-all duration-500 opacity-100 scale-150 lg:group-hover/btn:translate-x-full lg:group-hover/btn:opacity-0"
          />
        ),
      },
      wrapperClass:
        "lg:col-span-5 p-6 sm:p-12 md:p-16 lg:p-20 xl:p-24 flex flex-col justify-between relative overflow-hidden min-h-[60vh] lg:min-h-screen",
      headerClass:
        "text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-indigo-400",
      name: "Alluvium-ite",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-white min-h-screen bg-black selection:bg-indigo-500/30"
    >
      <div className="max-w-full grid grid-cols-1 lg:grid-cols-10 min-h-screen">
        {PLANS.map((plan) => (
          <div key={plan.id} className={plan.wrapperClass}>
            {plan.id === "Premium" && (
              <div className="absolute top-0 right-0 w-120 h-120 bg-indigo-600/10 blur-[150px] rounded-full -mr-60 -mt-60 pointer-events-none" />
            )}
            <div className="space-y-8 sm:space-y-12 relative z-10">
              <div className="flex items-center gap-4">
                <h3 className={plan.headerClass}>{plan.title}</h3>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <div className="space-y-8 sm:space-y-10">
                <div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter mb-4 sm:mb-6 leading-[0.9]">
                    {plan.header}
                  </h2>
                  {plan.priceSection}
                  <p className="text-sm sm:text-base lg:text-sm text-white/50 max-w-xl leading-relaxed">
                    {plan.description}
                  </p>
                </div>
                <div
                  className={cn(
                    "grid gap-4 sm:gap-6",
                    plan.id === "Premium"
                      ? "grid-cols-1 sm:grid-cols-2"
                      : "grid-cols-1",
                  )}
                >
                  {plan.features.map((f, i) => (
                    <div key={f} className="flex items-start gap-3 sm:gap-4">
                      <div className="mt-1">
                        <plan.featureIcon
                          {...(plan.id === "Premium"
                            ? { weight: "bold" }
                            : { weight: "fill" })}
                          {...plan.featureIconProps}
                        />
                      </div>
                      <span className={plan.featureTextClass}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16">
              <button
                onClick={plan.button.onClick}
                className={plan.button.className}
              >
                <span className={plan.button.spanClass}>
                  {plan.button.label}
                </span>
                <div className="relative flex items-center overflow-hidden h-6 w-6 px-1 shrink-0 group/btn">
                  {plan.button.iconLeft}
                  {plan.button.iconRight}
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayment(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950/50 p-8 sm:p-10 text-center shadow-2xl overflow-hidden backdrop-blur-md"
            >
              <button
                onClick={() => setShowPayment(false)}
                className="absolute top-6 right-6 p-2 text-rose-500 sm:text-white/20 hover:text-rose-500 hover:bg-white/5 rounded-full transition-all cursor-pointer"
              >
                <XIcon size={20} />
              </button>

              <div className="relative z-10">
                <div className="mb-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
                    Secure Checkout
                  </h2>
                  <p className="text-zinc-500 text-xs sm:text-sm font-medium">
                    <span className="text-white/50">{selectedPlan?.name}</span>
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 mb-6">
                  <span className="text-[14px] font-bold uppercase tracking-widest text-zinc-400">
                    {NAME}
                  </span>
                </div>
                <div className="relative group mb-6">
                  <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className={`relative bg-white p-5 rounded-[2rem] inline-block border-4 ${selectedPlan?.amount === "999" ? "border-indigo-600" : "border-amber-600"} shadow-xl`}>
                    <QRCodeSVG
                      value={generateUPILink(selectedPlan?.amount || "0")}
                      size={220}
                      level="H"
                      className="w-44 h-44 sm:w-56 sm:h-56"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(PAYTM_UPI_ID);
                    toast.success("UPI ID copied");
                  }}
                  className="my-5 flex items-center justify-center gap-2.5 w-full py-2 group cursor-pointer"
                >
                  <span className={`text-[11px] text-zinc-500 font-mono tracking-[0.2em] ${selectedPlan?.amount === "999" ? "group-hover:text-indigo-400" : "group-hover:text-amber-400"} transition-colors`}>
                    {PAYTM_UPI_ID}
                  </span>
                  <CopyIcon
                    size={14}
                    className={`text-zinc-600 ${selectedPlan?.amount === "999" ? "group-hover:text-indigo-400" : "group-hover:text-amber-400"} transition-colors`}
                  />
                </button>
                <div className="space-y-6">
                  <a
                    href={generateUPILink(selectedPlan?.amount || "0")}
                    className={`flex items-center justify-center gap-3 w-full py-4 sm:py-5 ${selectedPlan?.amount === "999" ? "bg-indigo-600 hover:bg-indigo-500" : "bg-amber-600 hover:bg-amber-500"} text-white rounded-2xl font-bold active:scale-95 transition-all text-sm sm:text-base`}
                  >
                    <QrCodeIcon size={22} weight="bold" />
                    Pay{" "}
                    {selectedPlan?.amount
                      ? `₹${selectedPlan.amount} with UPI`
                      : "with UPI"}
                  </a>
                  <div className="pt-2">
                    <div className="flex items-center justify-between px-6 opacity-30 grayscale transition-all">
                      <span className="text-[10px] font-black tracking-tighter text-white italic">
                        GPAY
                      </span>
                      <span className="text-[10px] font-black tracking-tighter text-white italic">
                        PHONEPE
                      </span>
                      <span className="text-[10px] font-black tracking-tighter text-white italic">
                        PAYTM
                      </span>
                      <span className="text-[10px] font-bold text-white px-1 py-0.5 rounded-sm leading-none">
                        UPI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UpgradePage;
