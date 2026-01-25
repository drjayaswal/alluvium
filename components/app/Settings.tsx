"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Power, Home, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  email: string;
  id: string;
  authenticated?: boolean;
}

interface SettingsProps {
  user: UserData | null;
}

export function Settings({ user }: SettingsProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    toast.success("Logged out successfully");
    router.push("/connect");
  };

  if (!user) return null;

  const username = user.email.split("@")[0];
  const capitalizedUser = username.charAt(0).toUpperCase() + username.slice(1);

  return (
    <div className="min-h-screen w-full text-main pt-24 px-4 sm:px-6 pb-12">
      <div className="sm:min-w-3xl max-w-sm mx-auto w-full">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-black text-main tracking-tighter">
            Settings
          </h1>
          
          <div className="flex gap-3 items-center w-full sm:w-auto">
            <Button
              onClick={() => router.push("/")}
              title="home"
              className="flex-1 sm:flex-none shadow-inner cursor-pointer bg-main/10 hover:bg-main text-main hover:text-white rounded-2xl sm:rounded-4xl transition-all duration-200 active:scale-95 py-6 sm:py-2"
            >
              <Home size={20} />
            </Button>

            <Button
              onClick={() => router.push("/services")}
              title="services"
              className="flex-1 sm:flex-none shadow-inner cursor-pointer bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-2xl sm:rounded-4xl transition-all duration-200 active:scale-95 py-6 sm:py-2"
            >
              <Hammer size={20} />
            </Button>

            <Button
              onClick={handleLogout}
              title="Logout"
              className="flex-1 sm:flex-none shadow-inner cursor-pointer bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl sm:rounded-4xl transition-all duration-200 active:scale-95 py-6 sm:py-2"
            >
              <Power size={20} />
            </Button>
          </div>
        </div>

        <div className="space-y-6 border-t border-main pt-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-main/20 flex items-center justify-center text-main shrink-0">
                <User size={24} />
              </div>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 overflow-hidden">
                <p className="text-sm sm:text-lg font-medium text-main/50 italic truncate max-w-50 sm:max-w-none">
                  {user.email}
                </p>
                <span className="text-xs sm:text-base opacity-50">as</span>
                <h2 className="text-md sm:text-xl font-bold truncate">
                  {capitalizedUser}
                </h2>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}