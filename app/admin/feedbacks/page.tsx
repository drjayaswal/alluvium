"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import Loading from "@/components/ui/loading";
import { UserData } from "@/lib/interface";
import Feedbacks from "@/components/app/Feedbacks";

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

  useEffect(() => {
    if (user) {
      const userRole = user.role || "user";
      if (userRole !== "admin") {
        router.push("/");
      }
    }
  }, [user, router]);

  if (loading) return <Loading />;
  if (!user) return null;
  const userRole = user.role || "user";
  if (userRole !== "admin") return null;

  return (
    <div>
      <Feedbacks user={user} />
    </div>
  );
}