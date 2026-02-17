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
      label: "Conversation",
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
      label: "Developer",
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
      label: "Contribute",
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
    <div className="min-h-screen flex flex-col items-center justify-center p-2 min-[375px]:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 font-mono w-full overflow-x-hidden">
      <section className="relative z-10 w-full max-w-7xl mx-auto px-1 min-[375px]:px-2 sm:px-3 md:px-4">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          className="mb-4 min-[375px]:mb-5 sm:mb-6 md:mb-8 lg:mb-10 space-y-1 min-[375px]:space-y-2 sm:space-y-3 flex flex-col items-center justify-center"
        >
          <div className="w-full flex flex-col items-center justify-center gap-1.5 min-[375px]:gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-row items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 md:gap-4 justify-center w-full py-1 min-[375px]:py-1.5 sm:py-2">
              <div className="flex items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 md:gap-4 shrink-0 bg-white/10 px-2 min-[375px]:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 min-[375px]:py-2 sm:py-2.5 md:py-3 lg:py-4 shadow-md rounded-lg">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={80}
                  height={80}
                  className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 min-[400px]:w-14 min-[400px]:h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 xl:w-24 xl:h-24 shrink-0"
                  priority
                />
                <span
                  className="
                    text-2xl min-[375px]:text-3xl min-[400px]:text-3xl min-[440px]:text-4xl
                    sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl
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
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 min-[375px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1.5 min-[375px]:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5"
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
                className="w-full min-h-[75px] min-[375px]:min-h-[80px] sm:min-h-[90px] md:min-h-[100px] lg:min-h-[110px] xl:min-h-[120px] p-2 min-[375px]:p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col items-start text-left gap-1.5 min-[375px]:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 cursor-pointer relative overflow-hidden touch-manipulation active:scale-[0.98] transition-transform"
              >
                <div className="p-1 min-[375px]:p-1.5 sm:p-1.5 md:p-2 lg:p-2.5 bg-white/5 group-hover:rounded-4xl text-white/70 group-hover:text-black group-hover:bg-white transition-all duration-300 shrink-0">
                  <menu.icon className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 shrink-0" weight="fill" />
                </div>

                <div className="z-10 min-w-0 w-full">
                  <h3 className="text-white font-bold uppercase text-xs min-[375px]:text-sm min-[400px]:text-sm sm:text-base md:text-base lg:text-md tracking-widest group-hover:scale-105 sm:group-hover:scale-110 transition-transform truncate">
                    {menu.label}
                  </h3>
                  <p className="text-[9px] min-[375px]:text-[10px] min-[400px]:text-[11px] sm:text-xs md:text-sm group-hover:text-white/50 uppercase mt-0.5 min-[375px]:mt-0.5 sm:mt-1 tracking-tighter truncate">
                    {menu.desc}
                  </p>
                </div>
              </button>

              <div className="absolute -top-2 min-[375px]:-top-2.5 sm:-top-3 left-6 min-[375px]:left-7 sm:left-8 md:left-10 lg:left-12 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                <div className="bg-white text-black text-[9px] min-[375px]:text-[10px] sm:text-xs font-bold uppercase tracking-wider py-1 min-[375px]:py-1.5 px-2 min-[375px]:px-2.5 sm:px-3 whitespace-nowrap shadow-xl border border-white/20 relative rounded">
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
