"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "../ui/spinner";
import { getBaseUrl } from "@/lib/utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const publicPaths = ["/connect", "/developers"];
    const isPublicPath = publicPaths.includes(pathname);
    const token = localStorage.getItem("token");

    if (!token) {
      if (!isPublicPath) {
        router.push("/connect");
      }
      setLoading(false);
      return;
    }

    fetch(`${getBaseUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          if (isPublicPath && pathname !== "/developers") {
            router.push("/");
          }
        } else {
          localStorage.removeItem("token");
          if (!isPublicPath) {
            router.push("/connect");
          }
        }
      })
      .catch(() => {
        if (!isPublicPath) router.push("/connect");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, router]);

  if (loading) {
    return <Spinner/>
  }

  return <>{children}</>;
}