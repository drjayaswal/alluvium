"use client";

import { toast } from "sonner";
import Script from "next/script";
import Loading from "../ui/loading";
import { toPng } from "html-to-image";
import { AnalysisChart } from "../ui/radar";
import { useRouter } from "next/navigation";
import { cn, getBaseUrl } from "@/lib/utils";
import { FileData, UserData } from "@/lib/interface";
import { useGoogleLogin } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowsCounterClockwiseIcon,
  BackspaceIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  CloudArrowDownIcon,
  CloudIcon,
  CurrencyCircleDollarIcon,
  DownloadIcon,
  ExclamationMarkIcon,
  FilePdfIcon,
  FolderOpenIcon,
  FileDocIcon,
  FileTxtIcon,
  PaperclipIcon,
  TrashIcon,
  WarningOctagonIcon,
  ImageIcon,
  CameraIcon,
  PlugsIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

export function Services({ user }: { user: UserData }) {
  const id = user;
  const router = useRouter();
  const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPickerLoaded, setIsPickerLoaded] = useState(false);
  const [extractedData, setExtractedData] = useState<FileData[]>([]);
  const [selectedFileData, setSelectedFileData] = useState<FileData | null>(
    null,
  );
  const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(fetchHistory, 5 * 1000);
    }
    return () => clearInterval(interval);
  }, [isProcessing, user]);

  useEffect(() => {
    setIsLoading(true);
    fetchHistory().finally(() => setIsLoading(false));
  }, [user]);

  const fetchHistory = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");
    if (!token || !user) return;
    try {
      const res = await fetch(`${getBaseUrl()}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const history = await res.json();
        setExtractedData(history);
        const stillWorking = history.some(
          (f: any) => f.status === "pending" || f.status === "processing",
        );
        if (stillWorking) setIsProcessing(true);
        else setIsProcessing(false);
      }
    } catch (err) {
      console.error("History fetch error:", err);
    }
  };

  const handleSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (files?.length >= 2 && user.credits < 3) {
      toast.info("Only 1 file is allowed with free tier", {
        action: {
          label: "Upgrade",
          onClick: () => {
            const toastId = toast.loading("Redirecting...");
            setTimeout(() => {
              toast.dismiss(toastId);
              router.push("/upgrade");
            }, 1500);
          },
        },
      });
      return;
    }

    if (!description) {
      toast.error("Please provide description first.");
      return;
    }

    const token = localStorage.getItem("token");
    const validFiles = Array.from(files).filter(
      (f) =>
        ALLOWED_MIME_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE_BYTES,
    );

    if (validFiles.length === 0) {
      toast.error("No valid PDF or Docx files selected.");
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);

    const formData = new FormData();
    validFiles.forEach((file) => formData.append("files", file));
    formData.append("description", description);

    try {
      const uploadToastId = toast.loading(
        `Uploading ${validFiles.length} files...`,
      );
      const response = await fetch(`${getBaseUrl()}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const localPlaceholders: FileData[] = validFiles.map((f) => ({
          id: Math.random().toString(),
          filename: f.name,
          status: "processing",
          match_score: 0,
          details: null,
          created_at: new Date().toISOString(),
        }));

        setExtractedData((prev) => [...localPlaceholders, ...prev]);
        toast.dismiss(uploadToastId);
        const data = await response.json();
        toast.success(data.message);

        fetchHistory();
      } else {
        toast.error("Upload failed", { id: uploadToastId });
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("Network error");
      setIsProcessing(false);
    } finally {
      setIsLoading(false);
      router.push("/services");
    }
  };

  const exportToCSV = () => {
    const completedFiles = extractedData.filter(
      (file) => file.status === "completed",
    );

    if (completedFiles.length === 0) {
      toast.error("No completed files to export");
      return;
    }

    toast.success("Download Report", {
      description: `Save report for ${completedFiles.length} files`,
      action: {
        label: "Download",
        onClick: () => {
          const fileName = `Report.csv`;

          const headers = [
            "ID",
            "Filename",
            "Status",
            "Match Score (%)",
            "Emails",
            "Phones",
            "Links",
            "Created At",
          ];

          const rows = completedFiles.map((file) => {
            const emails = file.candidate_info?.contact?.emails || [];
            const phones = file.candidate_info?.contact?.phones || [];
            const links = file.candidate_info?.contact?.links || [];

            const displayScore =
              file.match_score !== null ? file.match_score : "N/A";

            return [
              `"${file.id}"`,
              `"${file.filename.split("/").pop()}"`,
              file.status.toUpperCase(),
              displayScore,
              `"${emails.join(", ")}"`,
              `"${phones.join(", ")}"`,
              `"${links.join(", ")}"`,
              `"${new Date(file.created_at).toLocaleString()}"`,
            ];
          });

          const csvContent = [headers, ...rows]
            .map((e) => e.join(","))
            .join("\n");

          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success("Report Downloaded");
        },
      },
    });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => openPicker(tokenResponse.access_token),
    scope: "https://www.googleapis.com/auth/drive.readonly",
  });

  const openPicker = (token: string) => {
    if (!isPickerLoaded) return toast.error("Picker API not loaded.");
    const google = (window as any).google;

    const view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
      .setIncludeFolders(true)
      .setSelectFolderEnabled(true);

    const developerKey = process.env.NEXT_PUBLIC_PICKER_KEY;
    if (!developerKey) {
      toast.error("Google Picker is not configured. Add NEXT_PUBLIC_PICKER_KEY to .env.");
      return;
    }
    const picker = new google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(token)
      .setDeveloperKey(developerKey)
      .setAppId(process.env.NEXT_PUBLIC_APP_ID || "")
      .setTitle("Select Google Drive Folder")
      .setCallback(async (data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const folderId = data.docs[0].id;
          setIsProcessing(true);
          const toastId = toast.loading("Processing Drive folder...");

          try {
            const response = await fetch(`${getBaseUrl()}/get-folder`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                folderId: folderId,
                googleToken: token,
                description: description || "Resume Analysis",
              }),
            });

            if (response.ok) {
              const responseData = await response.json();

              const placeholders = responseData.files.map((f: any) => ({
                id: f.id,
                filename: f.name,
                status: "processing",
                match_score: null,
                details: null,
                created_at: new Date().toISOString(),
              }));

              setExtractedData((prev) => [...placeholders, ...prev]);
              setIsProcessing(true);
              toast.dismiss(toastId);
              toast.success(responseData.message);
            } else {
              const errData = await response.json();
              toast.dismiss(toastId);
              console.error("422 Details:", errData);
              toast.error("Processing failed (422). Check console.", {
                id: toastId,
              });
            }
          } catch (err) {
            toast.error("Network error.", { id: toastId });
          } finally {
            setIsProcessing(false);
          }
        }
      })
      .build();

    picker.setVisible(true);
  };

  const resetHistory = async () => {
    const token = localStorage.getItem("token");
    if (extractedData.length < 1) {
      toast.error("Nothing to Erase...");
      return;
    }
    toast.info("Clear History", {
      description: "This action cannot be undone",
      action: {
        label: "Clear All",
        onClick: async () => {
          try {
            const toastId = toast.loading("Erasing history...");
            const res = await fetch(`${getBaseUrl()}/reset-history`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
              setExtractedData([]);
              toast.dismiss(toastId);
              toast.success("History cleared successfully");
            } else {
              toast.dismiss(toastId);
              toast.error("Failed to clear history");
            }
          } catch (error) {
            toast.error("Network error. Please try again.");
          }
        },
      },
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircleIcon className="w-4 h-4" weight="fill" />,
          bg: "text-emerald-500",
        };
      case "processing":
        return {
          icon: <CircleNotchIcon className="w-4 h-4 animate-spin" weight="bold" />,
          bg: "text-indigo-500",
        };
      case "failed":
        return {
          icon: <ExclamationMarkIcon className="w-4 h-4" weight="fill" />,
          bg: "text-red-500",
        };
      default:
        return {
          icon: <WarningOctagonIcon className="w-4 h-4" weight="fill" />,
          bg: "text-slate-500",
        };
    }
  };

  const getDescription = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user.credits == 0) {
      toast.info("Insufficient credits", {
        action: {
          label: "Upgrade",
          onClick: () => {
            const toastId = toast.loading("Redirecting...");
            setTimeout(() => {
              toast.dismiss(toastId);
              router.push("/upgrade");
            }, 1500);
          },
        },
      });
      return;
    }
    const toastId = toast.loading("Extracting description from file...");

    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      toast.error("Invalid file type for description");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${getBaseUrl()}/get-description`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      toast.dismiss(toastId);
      const data = await response.json();
      if (response.ok) {
        if (data.description) {
          setDescription(data.description);
          toast.success("Description updated from file");
        }
      } else {
        toast.error("Failed to extract description from file");
      }
    } catch (error) {
      console.error("Extraction error:", error);
      toast.error("Error connecting to server");
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const downloadReport = async () => {
    if (reportRef.current === null) return;

    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: "#000",
        style: { borderRadius: "0" },
      });

      const link = document.createElement("a");
      if (selectedFileData) {
        link.download = `Analysis-${selectedFileData.filename}.png`;
      } else {
        toast.info("Select to download");
      }
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      className="text-white"
    >
      <Script
        src="https://apis.google.com/js/api.js"
        onLoad={() =>
          (window as any).gapi.load("picker", () => setIsPickerLoaded(true))
        }
      />

      <div className="max-w-full grid grid-cols-1 lg:grid-cols-10 min-h-screen lg:h-screen">
        <div className="lg:col-span-6 p-4 sm:p-6 lg:pt-10 lg:pr-7 lg:pl-18 flex flex-col space-y-4 sm:space-y-6 lg:space-y-7.75 border-r border-white/5">
          <div className="space-y-3 sm:space-y-4">
            <header className="mb-6 sm:mb-8 lg:mb-10 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={60}
                height={60}
                className="-mr-2 w-12 h-12 sm:w-14 sm:h-14 lg:w-[60px] lg:h-[60px]"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter text-white">
                  <span className="uppercase">Services</span>
                </h1>
                <span className="text-white/50 text-xs sm:text-sm">View Features</span>
              </div>
            </header>
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] sm:text-[12px] font-black text-white/40 uppercase tracking-[0.2em]">
                Description
              </h3>
            </div>
            <div className="relative group">
              <div className="relative group">
                <textarea
                  placeholder="Paste the requirements here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-48 sm:h-56 lg:h-71 p-4 sm:p-5 lg:p-6 bg-black border-dashed border focus:border-white/40 border-white/20 text-xs sm:text-sm leading-relaxed text-white placeholder:text-white/40 outline-none transition-all resize-none"
                />

                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2">
                  {description && (
                    <div className="relative group/tooltip">
                      <div className="absolute top-1/2 -left-2 -translate-x-full -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 hidden sm:block">
                        <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap relative">
                          Clear Description
                          <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-white" />
                        </div>
                      </div>
                      <button
                        onClick={() => setDescription("")}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 cursor-pointer hover:text-white text-white/50 hover:bg-red-600 transition-colors"
                      >
                        <BackspaceIcon className="w-4 h-4 sm:w-5 sm:h-5" weight="bold" />
                      </button>
                    </div>
                  )}
                  <div className="relative group/tooltip">
                    <div className="absolute top-1/2 -left-2 -translate-x-full -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 hidden sm:block">
                      <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl relative">
                        Upload Description
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-4 border-y-transparent border-l-4 border-l-white" />
                      </div>
                    </div>
                    <label className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 cursor-pointer text-white/50 hover:bg-white hover:text-black transition-colors">
                      <PaperclipIcon className="w-4 h-4 sm:w-5 sm:h-5" weight="bold" />
                      <input
                        type="file"
                        className="hidden"
                        onChange={getDescription}
                        accept=".pdf,.docx,.txt"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-0">
            {[
              {
                title: "Drive",
                tooltip: "Import from Drive",
                icon: <CloudIcon className="w-5 h-5 sm:w-6 sm:h-6" weight="fill" />,
                handler: () => {

                  if (user.credits == 0) {
                    toast.info("Insufficient credits", {
                      action: {
                        label: "Upgrade",
                        onClick: () => {
                          const toastId = toast.loading("Redirecting...");
                          setTimeout(() => {
                            toast.dismiss(toastId);
                            router.push("/upgrade");
                          }, 1500);
                        },
                      },
                    });
                  } else {
                    login();
                  }
                },
              },
              {
                title: "Folder",
                tooltip: "Upload Whole Folder",
                icon: <FolderOpenIcon className="w-5 h-5 sm:w-6 sm:h-6" weight="fill" />,
                handler: () =>
                  description.trim()
                    ? folderInputRef.current?.click()
                    : toast.error("Description Required"),
              },
              {
                title: "File",
                tooltip: "Upload Single File",
                icon: <FilePdfIcon className="w-5 h-5 sm:w-6 sm:h-6" weight="fill" />,
                handler: () =>
                  description.trim()
                    ? fileInputRef.current?.click()
                    : toast.error("Description Required"),
              },
              {
                title: "Image",
                tooltip: "Extract from Image",
                icon: <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" weight="fill" />,
                handler: () => {
                  toast.info("Upgrade to use Image Extraction", {
                    action: {
                      label: "Upgrade",
                      onClick: () => {
                        const toastId = toast.loading("Redirecting...");
                        setTimeout(() => {
                          toast.dismiss(toastId);
                          router.push("/upgrade");
                        }, 1500);
                      },
                    },
                  });
                },
              },{
                title: "Camera",
                tooltip: "Capture from Camera",
                icon: <CameraIcon className="w-5 h-5 sm:w-6 sm:h-6" weight="fill" />,
                handler: () => {
                  toast.info("Upgrade to use Device Camera", {
                    action: {
                      label: "Upgrade",
                      onClick: () => {
                        const toastId = toast.loading("Redirecting...");
                        setTimeout(() => {
                          toast.dismiss(toastId);
                          router.push("/upgrade");
                        }, 1500);
                      },
                    },
                  });
                },
              },
              {
                title: "Watch",
                tooltip: "Connect & Watch Drive",
                icon: <PlugsIcon className="w-5 h-5 sm:w-6 sm:h-6" weight="fill" />,
                handler: () => {
                  toast.info("Upgrade to use C&W Service", {
                    action: {
                      label: "Upgrade",
                      onClick: () => {
                        const toastId = toast.loading("Redirecting...");
                        setTimeout(() => {
                          toast.dismiss(toastId);
                          router.push("/upgrade");
                        }, 1500);
                      },
                    },
                  });
                },
              }
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => {
                  if (user.credits == 0) {
                    toast.info("Insufficient credits", {
                      action: {
                        label: "Upgrade",
                        onClick: () => {
                          const toastId = toast.loading("Redirecting...");
                          setTimeout(() => {
                            toast.dismiss(toastId);
                            router.push("/upgrade");
                          }, 1500);
                        },
                      },
                    });
                  } else btn.handler();
                }}
                className="group flex-1 p-3 sm:p-4 lg:p-6 flex flex-col sm:flex-row items-center sm:items-center sm:text-left gap-2 sm:gap-3 lg:gap-4 cursor-pointer relative"
              >
                <div className="p-1.5 sm:p-2 bg-white/5 group-hover:rounded-4xl text-white/70 group-hover:text-black group-hover:bg-white transition-all duration-300">
                  {btn.icon}
                </div>

                <div className="z-10">
                  <h3 className="text-white font-bold uppercase text-[10px] sm:text-xs lg:text-sm tracking-widest group-hover:scale-110 transition-all duration-200 text-center sm:text-left">
                    {btn.title}
                  </h3>
                </div>
                <div className="absolute -top-3 left-1/2 sm:-left-7 sm:translate-x-0 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
                  <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                    {btn.tooltip}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col h-full lg:h-screen bg-black border-t lg:border-t-0 lg:border-l border-white/13 overflow-hidden">
          <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-[16.1px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 z-20 border-y border-white/13 shrink-0">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <h2 className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-white/40">
                Analysis
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-[12px] font-mono text-white/40">
                  ({extractedData.length.toString().padStart(2, "0")})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-0 flex-wrap sm:flex-nowrap">
              <div className="flex items-center border border-white/13 p-0.5">
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 transition-colors duration-300 ${
                    user.credits < 10 && "bg-red-700"
                  }`}
                >
                  <CurrencyCircleDollarIcon
                    weight="fill"
                    className={`w-3 h-4 sm:w-4 sm:h-5 text-white`}
                  />
                  <span className={`text-[10px] sm:text-[11px] font-medium text-white `}>
                    {user.credits}
                  </span>
                </div>

                <button
                  onClick={() => {
                    toast.info("Want to Upgrade", {
                      action: {
                        label: "Upgrade",
                        onClick: () => {
                          const toastId = toast.loading("Redirecting...");
                          setTimeout(() => {
                            toast.dismiss(toastId);
                            router.push("/upgrade");
                          }, 1500);
                        },
                      },
                    });
                  }}
                  className="group px-4 sm:px-6 lg:px-10 ml-0.5 relative group/action cursor-pointer flex items-center justify-center h-8 transition-colors duration-300 hover:bg-white hover:text-black font-bold"
                >
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 hidden sm:block">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                      Upgrade your Plan
                      <div className="absolute -top-1.25 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-white" />
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-[12px]">Upgrade</span>
                </button>
              </div>

              <div className="flex items-center border border-white/13 p-0.5">
                <div className="relative group/action">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 hidden sm:block">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                      Sync History
                      <div className="absolute -top-1.25 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-white" />
                    </div>
                  </div>
                  <button
                    onClick={fetchHistory}
                    className="group cursor-pointer flex items-center justify-center h-8 w-8 sm:w-9 transition-all hover:bg-white"
                  >
                    <ArrowsCounterClockwiseIcon
                      weight="fill"
                      className={cn(
                        "text-white group-hover:text-black transition-all w-4 h-4",
                        isProcessing && "animate-spin",
                      )}
                    />
                  </button>
                </div>
                <div className="w-px h-8 bg-white/20 mx-0.5" />
                <div className="relative group/action">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 hidden sm:block">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                      Export CSV
                      <div className="absolute -top-1.25 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-white" />
                    </div>
                  </div>
                  <button
                    onClick={exportToCSV}
                    className="group cursor-pointer flex items-center justify-center h-8 w-8 sm:w-9 transition-all hover:bg-green-600"
                  >
                    <CloudArrowDownIcon
                      weight="fill"
                      className="text-white transition-all w-4 h-4"
                    />
                  </button>
                </div>
                <div className="w-px h-8 bg-white/20 mx-0.5" />
                <div className="relative group/action">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 hidden sm:block">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                      Clear History
                      <div className="absolute -top-1.25 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-b-4 border-white" />
                    </div>
                  </div>
                  <button
                    onClick={resetHistory}
                    className="group cursor-pointer flex items-center justify-center h-8 w-8 sm:w-9 transition-all hover:bg-red-600"
                  >
                    <TrashIcon
                      weight="fill"
                      className="text-white transition-all w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {extractedData.length === 0 ? (
              <div className="h-full flex flex-col items-center bg-black/10 justify-center space-y-4 opacity-50">
                <div className="flex items-center gap-2">
                  <FilePdfIcon className="w-8 h-8" weight="fill" />
                  <FileDocIcon className="w-8 h-8" weight="fill" />
                  <FileTxtIcon className="w-8 h-8" weight="fill" />
                </div>
                <p className="text-[10px] uppercase tracking-widest">
                  Awaiting Uploads
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/13 mb-20">
                {extractedData.sort().map((file, idx) => {
                  const config = getStatusConfig(file.status);
                  const isInteractive =
                    file.details &&
                    !["processing", "failed", "pending"].includes(file.status);

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => isInteractive && setSelectedFileData(file)}
                      className={cn(
                        "p-2 sm:p-[10.7px] py-3 sm:py-[14.80px] group relative overflow-hidden transition-all border-b border-white/10",
                        isInteractive
                          ? "cursor-pointer hover:bg-white/5"
                          : "opacity-60",
                      )}
                    >
                      <div className="flex px-1 sm:px-2 items-center justify-between relative z-10 gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                          <FilePdfIcon className="w-6 h-5 sm:w-8 sm:h-6 text-white/50 group-hover:text-white transition-colors duration-500 shrink-0" weight="fill" />
                          <div className="min-w-0 flex items-center gap-2 flex-1">
                            <h4 className="text-xs sm:text-sm text-white/50 group-hover:text-white font-bold transition-colors duration-500 truncate">
                              {file.filename.split("/").pop()}
                            </h4>
                            <div className={cn(config.bg, "shrink-0")}> {config.icon} </div>
                          </div>
                        </div>

                          {file.match_score !== null && (
                            <div className="text-right shrink-0">
                              <div
                                className={cn(
                                  "text-lg sm:text-xl font-black transition-colors duration-500",
                                  file.match_score >= 0.8
                                    ? "text-emerald-500/50 group-hover:text-emerald-500"
                                    : file.match_score >= 0.5
                                      ? "text-amber-500/50 group-hover:text-amber-500"
                                      : isProcessing
                                        ? "text-indigo-500/50 group-hover:text-indigo-500"
                                        : "text-red-500/50 group-hover:text-red-500",
                                )}
                              >
                                {Math.floor(file.match_score)}%
                              </div>
                              <div className="text-[7px] sm:text-[8px] text-white/30 group-hover:text-white/70 transition-colors duration-500 uppercase tracking-tighter font-bold">
                                Match
                              </div>
                            </div>
                          )}
                      </div>
                      <div
                        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full"
                        style={{ pointerEvents: "none" }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFileData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFileData(null)}
              className="fixed inset-0 bg-black/10 backdrop-blur-md z-100"
            />

            <div className="fixed inset-0 grid place-items-center z-102 p-2 sm:p-4 pointer-events-none">
              <motion.div
                layoutId={`card-${selectedFileData.id}-${id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-6xl h-fit max-h-[95vh] sm:max-h-[90vh] bg-black border border-white/20 flex flex-col overflow-hidden pointer-events-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-10 overflow-y-auto no-scrollbar">
                  <div className="mb-3 sm:mb-4 pb-2 border-b border-white/20 flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center text-xs sm:text-sm lg:text-[15px] font-mono text-white/50">
                    <span className="text-white/20 text-xs sm:text-sm">Success on</span>
                    <span className="truncate max-w-full sm:max-w-none">{selectedFileData.filename}</span>
                    <span className="text-white/20 text-xs sm:text-sm">with</span>
                    <div className="text-lg sm:text-xl font-black text-white leading-none">
                      {selectedFileData.match_score !== null && (
                        <div className="text-right shrink-0">
                          <div className={cn("text-white/50")}>
                            {selectedFileData.match_score === 0 ? (
                              "0%"
                            ) : (
                              <>
                                {Math.floor(selectedFileData.match_score)}
                                <span className="text-xs sm:text-sm">
                                  .
                                  {
                                    (selectedFileData.match_score % 1)
                                      .toFixed(2)
                                      .split(".")[1]
                                  }
                                  %
                                </span>
                              </>
                            )}{" "}
                            <span className="text-white/20 text-xs sm:text-sm">match</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
                    <div className="lg:col-span-7 space-y-6 sm:space-y-8 lg:space-y-10">
                      {renderSkillSection(
                        "Critical Missing",
                        selectedFileData.details?.missing_skills ?? [],
                        selectedFileData.details?.total_missed_skills ?? 0,
                        "bg-red-500",
                      )}
                      {renderSkillSection(
                        "Candidate Strengths",
                        selectedFileData.details?.matched_skills ?? [],
                        selectedFileData.details?.total_matched_skills ?? 0,
                        "bg-emerald-500",
                      )}
                      {renderSkillSection(
                        "Candidate Strengths (Unrelated)",
                        selectedFileData.details?.unrelated_skills ?? [],
                        selectedFileData.details?.total_unrelated_skills ?? 0,
                        "bg-indigo-500",
                      )}
                      {/* {renderSkillSection(
                        "JD Noise",
                        selectedFileData.details?.jd_noise ?? [],
                        selectedFileData.details?.total_jd_noise ?? 0,
                        "bg-teal-500",
                      )}
                      {renderSkillSection(
                        "Resume Noise",
                        selectedFileData.details?.resume_noise ?? [],
                        selectedFileData.details?.total_resume_noise ?? 0,
                        "bg-sky-500",
                      )} */}
                    </div>
                    <div className="lg:col-span-5">
                      <div ref={reportRef} className="h-48 sm:h-56 lg:h-64">
                        <AnalysisChart
                          data={selectedFileData.details?.radar_data ?? []}
                          color="white"
                        />
                      </div>

                      <button
                        onClick={downloadReport}
                        className="group/btn mt-5 sm:mt-0 w-full cursor-pointer relative flex items-center justify-center sm:justify-between gap-3 sm:gap-0 overflow-hidden px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-4.5 font-bold text-white bg-black sm:bg-black hover:bg-indigo-700 active:bg-indigo-700 transition-all duration-500 text-xs sm:text-sm lg:text-base"
                      >
                        <span className="relative z-10 transition-all duration-500 group-hover/btn:tracking-wider sm:group-hover/btn:tracking-widest whitespace-nowrap">
                          Download Chart
                        </span>
                        <div className="relative flex items-center justify-center overflow-hidden h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 shrink-0">
                          <DownloadIcon
                            weight="fill"
                            className={cn(
                              "transform transition-all duration-500 -translate-y-full opacity-0 scale-110 absolute group-hover/btn:translate-y-0 group-hover/btn:opacity-100 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6",
                            )}
                          />
                          <CloudArrowDownIcon
                            weight="fill"
                            className={cn(
                              "transition-all duration-500 opacity-100 scale-110 group-hover/btn:translate-y-full group-hover/btn:opacity-0 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6",
                            )}
                          />
                        </div>
                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out group-hover/btn:translate-x-full" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleSelection}
      />
      <input
        type="file"
        ref={folderInputRef}
        className="hidden"
        /* @ts-ignore */
        webkitdirectory="webkitdirectory"
        directory=""
        onChange={handleSelection}
      />
    </motion.div>
  );
}

const renderSkillSection = (
  title: string,
  skills: string[],
  total: number,
  dotColor: string,
) => (
  <section>
    <div className="flex justify-between items-center mb-3 sm:mb-4">
      <h4 className="text-[9px] sm:text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 flex-wrap">
        <div className={`w-1.5 h-1.5 flex gap-4 items-center ${dotColor}`} />
        <span className="wrap-break-word">{title}</span>
        <div className="whitespace-nowrap">
          {skills.length}({total})
        </div>
      </h4>
    </div>
    <div className="flex flex-wrap gap-1 sm:gap-1.5">
      {skills.map((kw, i) => (
        <span
          key={i}
          className="px-2 sm:px-2.5 py-0.5 sm:py-1 border border-white/15 text-white/50 text-[10px] sm:text-[11px]"
        >
          {kw}
        </span>
      ))}
      {total > skills.length && (
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-white/30 text-[10px] sm:text-[11px] tracking-tighter">
          + {total - skills.length} more
        </span>
      )}
      {total === 0 && (
        <span className="text-[10px] sm:text-[11px] text-white/70">No skills</span>
      )}
    </div>
  </section>
);
