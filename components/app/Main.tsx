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
  CoinIcon,
  ToolboxIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { UserData, UserRole } from "@/lib/interface";

export default function Main({ user }: { user: UserData }) {
  const roleStr = String(user.role || UserRole.USER);
  const userRole: "user" | "admin" = roleStr === "admin" ? "admin" : "user";
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
      label: "Tools",
      path: "/tools",
      icon: ToolboxIcon,
      desc: "Utilities",
      tooltip: "Explore Tools",
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
        {
      label: "Upgrade",
      path: "/upgrade",
      icon: CoinIcon,
      external: false,
      desc: "Upgrade Account",
      tooltip: "Upgrade to Pro",

    },
    ...(userRole === "admin"
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
          className=" space-y-1 min-[375px]:space-y-2 sm:space-y-3 flex flex-col items-center justify-center"
        >
          <div className="w-full flex flex-col items-center justify-center gap-1.5 min-[375px]:gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-row items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 md:gap-4 justify-center w-full py-1 min-[375px]:py-1.5 sm:py-2 bg-white">
              <div className="flex items-center gap-2 min-[375px]:gap-2.5 sm:gap-3 md:gap-4 shrink-0 px-2 min-[375px]:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 min-[375px]:py-2 sm:py-2.5 md:py-3 lg:py-4">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={80}
                  height={80}
                  className="w-10 h-10 min-[375px]:w-12 min-[375px]:h-12 min-[400px]:w-14 min-[400px]:h-14 sm:w-16 sm:h-16 md:w-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 shrink-0"
                  priority
                />
                <span
                  className="
                    text-2xl min-[375px]:text-3xl min-[400px]:text-3xl min-[440px]:text-4xl
                    sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl
                    font-black uppercase tracking-tighter text-black whitespace-nowrap leading-none
                  "
                  style={{
                    lineHeight: 1.1,
                  }}
                >
                  Alluvium
                  <span className="sm:text-black/10 text-black hover:text-black">
                    ™
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid border border-white grid-cols-2 min-[375px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1.5 min-[375px]:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4 xl:gap-5"
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
                className="w-full min-h-20 p-6 flex flex-col items-center justify-center text-center gap-4 
               relative overflow-hidden cursor-pointer active:scale-[0.95] 
               transition-all duration-500 ease-in-out
               rounded-[7rem] border-b-2 border-transparent
               hover:rounded-none hover:border-white hover:bg-black group"
              >
                <div className="p-1 min-[375px]:p-1.5 sm:p-1.5 md:p-2 lg:p-2.5 border-2 border-transparent group-hover:border-white bg-white/5 group-hover:rounded-4xl text-white/70 group-hover:text-black group-hover:bg-white transition-all duration-300 shrink-0">
                  <menu.icon
                    className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 shrink-0"
                    weight="fill"
                  />
                </div>
                <div className="z-10 w-full flex flex-col items-center">
                  <h3 className="text-white font-bold uppercase text-xs sm:text-base tracking-[0.2em] transition-transform duration-500 group-hover:scale-110">
                    {menu.label}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/40 group-hover:text-white/60 uppercase mt-1 tracking-widest transition-colors duration-500">
                    {menu.desc}
                  </p>
                </div>
              </button>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hidden md:block">
                <div className="bg-white border-2 border-black text-black text-[10px] font-bold uppercase tracking-tighter py-1.5 px-3 whitespace-nowrap relative">
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
