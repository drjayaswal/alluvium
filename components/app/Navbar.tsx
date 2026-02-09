"use client";

import { Cog, User, Shield, LogOut, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="fixed w-full z-20 px-8 py-[12.5px] flex justify-between bg-black border-b border-white/10 items-center shadow-xs">
      <Image
        className="cursor-pointer hover:invert-100 rounded-full transition-all duration-500"
        src="/logo.png"
        alt="logo"
        onClick={() => router.push("/")}
        width={40}
        height={40}
      />

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="p-2 hover:rotate-90 transition-all bg-transparent shadow-none text-white cursor-pointer outline-none">
            <Cog size={30} />
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-white/5 backdrop-blur-sm z-30 animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-100 bg-black border border-white/20 p-6 shadow-2xl z-40 focus:outline-none">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={40}
                  height={40}
                />
              <Dialog.Title className="text-white font-mono text-xl">
                Settings
              </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className="text-white cursor-pointer hover:text-rose-600 transition-colors">
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
            <MenuButton
              icon={<User size={18} />}
              label="Account Profile"
              onClick={() => {
                router.push("/profile");
              }}
            />
            <MenuButton
              icon={<Shield size={18} />}
              label="Security & API"
              onClick={() => toast.info("feature will be coming soon")}
            />
            <div className="h-px bg-white/5 my-3" />
            <MenuButton
              icon={<LogOut size={18} />}
              label="Log Out"
              onClick={() => console.log("Logout")}
              variant="danger"
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
};

const MenuButton = ({ icon, label, onClick, variant = "default" }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex cursor-pointer items-center gap-4 px-4 py-3 transition-all font-mono text-sm
      ${
        variant === "danger"
          ? "text-red-500 hover:bg-red-500/10"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
  >
    {icon}
    {label}
  </button>
);

export default Navbar;
