"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChatCircleDotsIcon,
  GithubLogoIcon,
  KeyIcon,
  LightbulbIcon,
  PackageIcon,
  SyringeIcon,
  UserGearIcon,
  UserIcon,
  CodesandboxLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { UserData } from "@/lib/interface";

export default function Main({ user }: { user: UserData }) {
  const router = useRouter();
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 5 },
    show: { opacity: 1, y: 0 },
  };
  const menuItems = [
    {
      label: "Ingest",
      path: "/ingest",
      icon: SyringeIcon,
      desc: "Add Context",
      tooltip: "Add Context",
    },
    {
      label: "Conversations",
      path: "/conversations",
      icon: ChatCircleDotsIcon,
      desc: "Talk to AI",
      tooltip: "Talk to Alluvium",
    },
    {
      label: "Services",
      path: "/services",
      icon: PackageIcon,
      desc: "View Core",
      tooltip: "View features",
    },
    {
      label: "Profile",
      path: "/profile",
      icon: UserIcon,
      desc: "Settings",
      tooltip: "User Profile",
    },
    {
      label: "Developers",
      path: "https://github.com/drjayaswal",
      icon: UserGearIcon,
      desc: "Creators",
      tooltip: "Meet Developer",
      external: true,
    },
    {
      label: "Feedback",
      path: "/feedback",
      icon: LightbulbIcon,
      desc: "Support",
      tooltip: "Send Ideas",
    },
    {
      label: "Codebase",
      path: "https://github.com/drjayaswal/alluvium-docker.git/fork",
      icon: CodesandboxLogoIcon,
      desc: "Code",
      tooltip: "Fork Project",
      external: true,
    },
    {
      label: "Contribution",
      path: "https://github.com/drjayaswal/alluvium-docker.git",
      icon: GithubLogoIcon,
      external: true,
      desc: "Open Source",
      tooltip: "Contribute",
    },
    ...(user.email == "dhruv@gmail.com"
      ? [
          {
            label: "Admin",
            path: "/admin",
            icon: KeyIcon,
            desc: "Admin Only",
            tooltip: "Admin Panel",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-5 md:p-6 lg:p-8 font-mono w-full overflow-x-hidden">
      <section className="relative z-10 w-full max-w-5xl mx-auto px-0 sm:px-1">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          className="mb-6 sm:mb-8 space-y-2 flex flex-col items-center justify-center"
        >
          <div className="w-full flex flex-col items-center justify-center gap-2 sm:gap-4">
            <div className="flex flex-row items-center gap-3 sm:gap-4 justify-center w-full py-2">
              <div className="flex items-center gap-3 shrink-0 bg-white/10 px-4 py-2 sm:px-5 sm:py-3 shadow-md">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={80}
                  height={80}
                  className="w-14 h-14 min-[400px]:w-16 min-[400px]:h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0"
                  priority
                />
                <span
                  className="
                    text-3xl min-[380px]:text-4xl min-[440px]:text-5xl
                    sm:text-5xl md:text-6xl
                    font-black uppercase tracking-tighter text-white whitespace-nowrap leading-none drop-shadow
                  "
                  style={{
                    lineHeight: 1.1,
                  }}
                >
                  Alluvium<span className="text-white/40">™</span>
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col items-center mt-1">
              <span className="
                text-lg min-[380px]:text-xl min-[440px]:text-2xl
                sm:text-2xl md:text-3xl lg:text-4xl
                font-bold text-white/80 text-center leading-tight truncate max-w-[95vw]
              ">
                Hello <span className="text-white">{user.email.split("@")[0]}</span> !
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
        >
          {menuItems.map((menu) => (
            <motion.div
              key={menu.label}
              variants={item}
              whileHover="hovered"
              className="group relative bg-transparent min-w-0"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  menu.external
                    ? window.open(menu.path, "_blank")
                    : router.push(menu.path);
                }}
                className="w-full min-h-[88px] sm:min-h-[100px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-start text-left gap-2 sm:gap-3 md:gap-4 cursor-pointer relative overflow-hidden touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div className="p-1.5 sm:p-2 bg-white/5 group-hover:rounded-2xl text-white/70 group-hover:text-black group-hover:bg-white transition-all duration-300 shrink-0">
                  <menu.icon className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" size={28} weight="fill" />
                </div>

                <div className="z-10 min-w-0 w-full">
                  <h3 className="text-white font-bold uppercase text-sm min-[400px]:text-base sm:text-base tracking-widest group-hover:scale-105 sm:group-hover:scale-110 transition-transform truncate">
                    {menu.label}
                  </h3>
                  <p className="text-[10px] min-[380px]:text-[11px] sm:text-[12px] group-hover:text-white/50 uppercase mt-0.5 sm:mt-1 tracking-tighter truncate">
                    {menu.desc}
                  </p>
                </div>
              </button>

              <div className="absolute -top-3 left-8 sm:left-11 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                  {menu.tooltip}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
