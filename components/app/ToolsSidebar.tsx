"use client";

import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CaretUpDownIcon,
  UserCircleIcon,
  FileTextIcon,
  SignOutIcon,
  GearSixIcon,
  CreditCardIcon,
  PaletteIcon,
  FingerprintSimpleIcon,
  TextStrikethroughIcon,
  BugBeetleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function AppSidebar({ user }: { user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    toast.info("Disconnect?", {
      description: "You will be disconnected!",
      action: {
        label: "Disconnect",
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

  const navItems = [
    { label: "Text Extractor", path: "/tools/text-extractor", icon: FileTextIcon },
    { label: "Color Extractor", path: "/tools/color-extractor", icon: PaletteIcon },
    { label: "Security Suite", path: "/tools/security-suite", icon: FingerprintSimpleIcon },
    { label: "Convertor", path: "/tools/convertor", icon: TextStrikethroughIcon },
    { label: "Reglab", path: "/tools/reglab", icon: BugBeetleIcon },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 text-white z-50"
    >
      <SidebarHeader
        className={`${isCollapsed ? "hidden" : "p-[7.5px]"} bg-black`}
      >
        <div className="flex items-center gap-3 transition-all duration-300">
          <div className="shrink-0 flex items-center justify-center">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black uppercase tracking-tighter text-xl text-white whitespace-nowrap"
            >
              Alluvium
            </motion.span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 bg-black border-t border-white/10">
        <SidebarMenu className="gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className={`group h-12 rounded-none transition-all px-3 ${
                    isActive
                      ? "bg-white hover:bg-white text-black hover:text-black"
                      : "hover:bg-white text-white sm:hover:text-black"
                  }`}
                >
                  <Link href={item.path} className="flex items-center w-full">
                    <item.icon
                      size={22}
                      weight="fill"
                      className="shrink-0"
                    />
                    {!isCollapsed && (
                      <span className="ml-3 uppercase text-[11px] hover:text-black font-bold tracking-widest truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-white/10 bg-black">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-none hover:bg-white/5 cursor-pointer text-white transition-colors px-2"
                >
                  <div className="flex aspect-square size-8 items-center justify-center shrink-0">
                    <UserCircleIcon size={20} weight="fill" />
                  </div>
                  {!isCollapsed && (
                    <div className="flex-1 text-left text-sm leading-tight overflow-hidden">
                      <span className="truncate font-bold uppercase text-[10px] tracking-tight block">
                        {user?.email?.split("@")[0] || "Alpha"}
                      </span>
                      <span className="truncate text-[9px] text-white/40 uppercase block">
                        {user?.role || "User"}
                      </span>
                    </div>
                  )}
                  {!isCollapsed && (
                    <CaretUpDownIcon
                      size={14}
                      className="ml-auto opacity-50 shrink-0"
                    />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side={isCollapsed ? "right" : "top"}
                align="start"
                sideOffset={12}
                className="w-50 mb-2 ml-4.5 rounded-none bg-black border border-white/10 text-white font-mono p-0"
              >
                <DropdownMenuLabel className="flex items-center gap-2 p-2 text-white/30 border-b border-white/10">
                  <div className="flex aspect-square size-8 items-center justify-center shrink-0">
                    <UserCircleIcon size={20} weight="fill" />
                  </div>
                  <p className="text-xs font-black truncate">{user?.email}</p>
                </DropdownMenuLabel>

                <div className="p-1">
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="rounded-none focus:bg-white focus:text-black cursor-pointer py-2 gap-3 transition-colors"
                  >
                    <GearSixIcon size={16} weight="bold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      Profile
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push("/upgrade")}
                    className="rounded-none focus:bg-white focus:text-black cursor-pointer py-2 gap-3 transition-colors"
                  >
                    <CreditCardIcon size={16} weight="bold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      Upgrade & Support
                    </span>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-white/10 mx-0" />

                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-none focus:bg-red-600 focus:text-white cursor-pointer py-2 gap-3 transition-colors"
                  >
                    <SignOutIcon size={16} weight="bold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                      Disconnect
                    </span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
