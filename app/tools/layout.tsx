"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/ToolsSidebar";
import { UserData } from "@/lib/interface";
import { getBaseUrl } from "@/lib/utils";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        router.push("/connect");
        return;
      }

      try {
        const res = await fetch(`${getBaseUrl()}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          toast.error("Session expired");
          router.push("/connect");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <Loading />;

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-black text-white font-mono overflow-hidden">
        <AppSidebar user={user!} />
        
        <main className="relative flex-1 flex flex-col min-w-0">
          <header className="flex h-14 items-center gap-4 border-b border-white/10 px-4 bg-black/80 backdrop-blur-md sticky top-0 z-50">
            <SidebarTrigger />
            <div className="h-7 w-px bg-white/10" />
            <span className="text-[10px] text-white/40 tracking-widest">
              {user?.email}
            </span>
          </header>
          
          <div className="flex-1 overflow-y-auto bg-black">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}