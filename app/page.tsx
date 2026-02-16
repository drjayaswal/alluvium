"use client";

import { toast } from "sonner";
import { getBaseUrl } from "@/lib/utils";
import { UserData } from "@/lib/interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import Main from "@/components/app/Main";

export default function FeedbacksPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
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
          localStorage.removeItem("token");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  useEffect(() => {
    if (!loading && !user) {
      router.push("/connect");
    }
  }, [loading, user, router]);

  if (loading) return <Loading />;

  if (!user) return null;

  return (
    <div>
      <Main user={user} />
    </div>
  );
}