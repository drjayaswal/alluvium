"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import Loading from "@/components/ui/loading";
import { UserData } from "@/lib/interface";
import {
  UsersIcon,
  FileVideoIcon,
  FilePdfIcon,
  ChatCircleDotsIcon,
  LightbulbIcon,
  ArrowLeftIcon,
  CaretDownIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type AdminData = {
  users: Array<{
    id: string;
    email: string;
    credits: number;
    role: string;
    updated_at: string | null;
    linked_folder_ids: string[];
    processed_filenames: string[];
  }>;
  sources: Array<{
    id: string;
    source_name: string;
    source_type: string;
    status: string;
    unique_key: string;
    user_id: string;
    created_at: string | null;
    updated_at: string | null;
  }>;
  resume_analyses: Array<{
    id: string;
    user_id: string;
    filename: string;
    s3_key: string | null;
    status: string;
    match_score: number;
    details: unknown;
    candidate_info: unknown;
    created_at: string | null;
    updated_at: string | null;
  }>;
  conversations: Array<{
    id: string;
    user_id: string;
    title: string | null;
    created_at: string | null;
    message_count: number;
    messages: Array<{
      id: string;
      role: string;
      content: string;
      created_at: string | null;
    }>;
  }>;
  feedbacks: Array<{
    id: string;
    email: string;
    category: string;
    content: string;
    created_at: string | null;
  }>;
};

function DataSection({
  title,
  icon: Icon,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-white/10 bg-transparent overflow-hidden">
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-white/10 transition-colors cursor-pointer touch-manipulation"
        style={{ borderRadius: 0 }}
        whileTap={{ scale: 0.98 }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 shrink-0" size={20}/>
          <span className="font-semibold text-white text-sm sm:text-base truncate">{title}</span>
          <span className="text-xs sm:text-sm text-white/50 shrink-0">({count})</span>
        </div>
        {open ? (
          <CaretDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" weight="fill" />
        ) : (
          <CaretRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white/60 shrink-0" weight="fill" />
        )}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="section-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="border-t border-white/10 bg-transparent overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto max-h-[300px] sm:max-h-[400px] overflow-y-auto -webkit-overflow-scrolling-touch">
      {children}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

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
          const userData = await res.json();
          setUser(userData);
        } else {
          toast.error("Session expired");
          localStorage.removeItem("token");
        }
      } catch {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRole = user.role || "user";
    if (userRole !== "admin") {
      router.push("/");
      return;
    }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${getBaseUrl()}/admin/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          toast.error("Failed to load admin data");
        }
      } catch {
        toast.error("Failed to load admin data");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [user, router]);

  if (loading) return <Loading />;
  if (!user) {
    router.push("/connect");
    return null;
  }
  const userRole = user.role || "user";
  if (userRole !== "admin") return null;
  if (dataLoading || !data) return <Loading />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-mono p-3 sm:p-4 md:p-8 mb-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <motion.button
              type="button"
              onClick={() => router.push("/")}
              className="p-2 text-white hover:bg-white hover:text-black transition-colors cursor-pointer touch-manipulation shrink-0"
              aria-label="Back"
              style={{ borderRadius: 0 }}
              whileTap={{ scale: 0.96 }}
              whileHover={{
                backgroundColor: "#fff",
                color: "#0a0a0f",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" weight="fill" />
            </motion.button>
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-6 w-6 sm:h-8 sm:w-8 object-contain shrink-0"
              priority={true}
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white truncate">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.button
              type="button"
              onClick={() => router.push("/admin/feedbacks")}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 border border-white/10 bg-transparent text-white hover:bg-white hover:text-black transition-colors text-xs sm:text-sm font-medium cursor-pointer touch-manipulation whitespace-nowrap"
              style={{ borderRadius: 0 }}
              whileTap={{ scale: 0.98 }}
              whileHover={{
                backgroundColor: "#fff",
                color: "#0a0a0f"
              }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            >
              <LightbulbIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" weight="fill" />
              <span className="hidden sm:inline">Resolve Feedbacks</span>
              <span className="sm:hidden">Feedbacks</span>
            </motion.button>
            <span className="text-xs sm:text-sm text-white/50 hidden sm:inline truncate max-w-[120px] md:max-w-none" title={user.email}>{user.email}</span>
          </div>
        </div>

        <DataSection
          title="Users"
          icon={UsersIcon}
          count={data.users.length}
          defaultOpen={true}
        >
          <TableWrapper>
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
              <thead className="sticky top-0 bg-[#0a0a0f] border-b border-white/10 z-10">
                <tr className="text-left text-white/60 uppercase tracking-wider">
                  <th className="p-2 sm:p-3">Email</th>
                  <th className="p-2 sm:p-3">Role</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">ID</th>
                  <th className="p-2 sm:p-3">Credits</th>
                  <th className="p-2 sm:p-3 hidden sm:table-cell">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/10 hover:bg-white/10 transition-colors duration-150"
                  >
                    <td className="p-2 sm:p-3 font-medium text-white truncate max-w-[150px] sm:max-w-none" title={u.email}>{u.email}</td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-1.5 py-0.5 text-xs font-medium ${u.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-white/70"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-white/60 text-xs truncate max-w-[120px] hidden md:table-cell" title={u.id}>{u.id}</td>
                    <td className="p-2 sm:p-3 text-white whitespace-nowrap">{u.credits}</td>
                    <td className="p-2 sm:p-3 text-white/50 text-xs hidden sm:table-cell whitespace-nowrap">
                      {u.updated_at ? formatDateTime(u.updated_at, "date") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </DataSection>

        <DataSection
          title="Sources"
          icon={FileVideoIcon}
          count={data.sources.length}
        >
          <TableWrapper>
            <table className="w-full text-xs sm:text-sm min-w-[700px]">
              <thead className="sticky top-0 bg-[#0a0a0f] border-b border-white/10 z-10">
                <tr className="text-left text-white/60 uppercase tracking-wider">
                  <th className="p-2 sm:p-3">Name</th>
                  <th className="p-2 sm:p-3">Type</th>
                  <th className="p-2 sm:p-3">Status</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">User ID</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.sources.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/10 hover:bg-white/10 transition-colors duration-150"
                  >
                    <td className="p-2 sm:p-3 font-medium truncate max-w-[150px] sm:max-w-[200px] text-white" title={s.source_name}>{s.source_name}</td>
                    <td className="p-2 sm:p-3 text-white whitespace-nowrap">{s.source_type}</td>
                    <td className="p-2 sm:p-3">
                      <span
                        className={
                          s.status === "completed"
                            ? "text-white"
                            : s.status === "failed"
                            ? "text-red-400"
                            : "text-amber-400"
                        }
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-white/50 text-xs truncate max-w-[100px] hidden lg:table-cell" title={s.user_id}>{s.user_id}</td>
                    <td className="p-2 sm:p-3 text-white/50 text-xs hidden md:table-cell whitespace-nowrap">
                      {s.created_at ? formatDateTime(s.created_at, "date") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </DataSection>

        <DataSection
          title="Resume analyses"
          icon={FilePdfIcon}
          count={data.resume_analyses.length}
        >
          <TableWrapper>
            <table className="w-full text-xs sm:text-sm min-w-[650px]">
              <thead className="sticky top-0 bg-[#0a0a0f] border-b border-white/10 z-10">
                <tr className="text-left text-white/60 uppercase tracking-wider">
                  <th className="p-2 sm:p-3">Filename</th>
                  <th className="p-2 sm:p-3">Status</th>
                  <th className="p-2 sm:p-3">Score</th>
                  <th className="p-2 sm:p-3 hidden lg:table-cell">User ID</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.resume_analyses.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-white/10 hover:bg-white/10 transition-colors duration-150"
                  >
                    <td className="p-2 sm:p-3 font-medium truncate max-w-[150px] sm:max-w-[180px] text-white" title={a.filename}>{a.filename}</td>
                    <td className="p-2 sm:p-3">
                      <span
                        className={
                          a.status === "completed"
                            ? "text-white"
                            : a.status === "failed"
                            ? "text-red-400"
                            : "text-amber-400"
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-white whitespace-nowrap">{a.match_score}</td>
                    <td className="p-2 sm:p-3 text-white/50 text-xs truncate max-w-[100px] hidden lg:table-cell" title={a.user_id}>{a.user_id}</td>
                    <td className="p-2 sm:p-3 text-white/50 text-xs hidden md:table-cell whitespace-nowrap">
                      {a.created_at ? formatDateTime(a.created_at, "date") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </DataSection>

        <DataSection
          title="Conversations"
          icon={ChatCircleDotsIcon}
          count={data.conversations.length}
        >
          <TableWrapper>
            <div className="divide-y divide-white/10">
              {data.conversations.map((c) => (
                <details
                  key={c.id}
                  className="group p-2 sm:p-3 hover:bg-white/10 transition-colors duration-150"
                  style={{ borderRadius: 0, background: "transparent", color: "white" }}
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-2 text-xs sm:text-sm touch-manipulation">
                    <span className="font-medium truncate flex-1 text-white min-w-0" title={c.title || c.id}>
                      {c.title || "Untitled"}
                    </span>
                    <span className="text-white/50 shrink-0 text-xs whitespace-nowrap ml-2">
                      <span className="hidden sm:inline">{c.message_count} msg</span>
                      <span className="sm:hidden">{c.message_count}</span>
                      <span className="hidden md:inline"> · {c.created_at ? formatDateTime(c.created_at, "date") : "—"}</span>
                    </span>
                  </summary>
                  <div className="mt-2 pl-2 border-l-2 border-white/10 space-y-2 text-xs sm:text-sm text-white/80 wrap-break-word">
                    {c.messages.slice(0, 10).map((m) => (
                      <div key={m.id} className="wrap-break-word">
                        <span className="font-semibold text-white/60">{m.role}:</span>{" "}
                        <span className="wrap-break-word">{m.content.slice(0, 200)}{m.content.length > 200 ? "…" : ""}</span>
                      </div>
                    ))}
                    {c.messages.length > 10 && (
                      <div className="text-white/40">+{c.messages.length - 10} more</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </TableWrapper>
        </DataSection>

        <DataSection
          title="Feedbacks"
          icon={LightbulbIcon}
          count={data.feedbacks.length}
        >
          <TableWrapper>
            <table className="w-full text-xs sm:text-sm min-w-[600px]">
              <thead className="sticky top-0 bg-[#0a0a0f] border-b border-white/10 z-10">
                <tr className="text-left text-white/60 uppercase tracking-wider">
                  <th className="p-2 sm:p-3">Email</th>
                  <th className="p-2 sm:p-3 hidden sm:table-cell">Category</th>
                  <th className="p-2 sm:p-3">Content</th>
                  <th className="p-2 sm:p-3 hidden md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.feedbacks.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-white/10 hover:bg-white/10 transition-colors duration-150"
                  >
                    <td className="p-2 sm:p-3 font-medium text-white truncate max-w-[120px] sm:max-w-none" title={f.email}>{f.email}</td>
                    <td className="p-2 sm:p-3 text-white hidden sm:table-cell whitespace-nowrap">{f.category}</td>
                    <td className="p-2 sm:p-3 text-white/80 max-w-[200px] sm:max-w-[300px] truncate" title={f.content}>{f.content}</td>
                    <td className="p-2 sm:p-3 text-white/50 text-xs hidden md:table-cell whitespace-nowrap">
                      {f.created_at ? formatDateTime(f.created_at, "date") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </DataSection>
      </div>
    </div>
  );
}
