"use client";

import { ExternalLink, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { devData } from "@/lib/const";


const Developers = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] p-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-sm font-bold text-main uppercase tracking-[0.2em] mb-3">
          The Team
        </h2>
        <h1 className="text-4xl font-black text-dark tracking-tight">
          Built by Developers for Recruiters
        </h1>
        <div className="h-1 w-20 bg-main mx-auto mt-4 rounded-full"></div>
      </div>
      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] items-center justify-between z-0">
        <div className="absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-main/40 -translate-y-1/2"></div>
        <div className="relative bg-transparent p-2 rounded-full border border-slate-100 shadow-sm text-main/60 -rotate-12 hover:rotate-0 transition-transform">
          <LinkIcon size={20} />
        </div>
        <div className="relative text-main">
          <LinkIcon size={28} className="rotate-45" />
        </div>
        <div className="relative bg-transparent p-2 rounded-full border border-slate-100 shadow-sm text-main/60 rotate-12 hover:rotate-0 transition-transform">
          <LinkIcon size={20} />
        </div>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        {devData.map((dev, index) => (
          <div
            key={index}
            className="group relative duration-300 bg-white rounded-[4rem] p-8 px-15 border border-slate-100 shadow-brand transition-all hover:-translate-y-2"
          >
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-main rounded-4xl group-hover:rotate-12 transition-transform opacity-20"></div>
                <Image
                  src={dev.image}
                  alt={dev.name}
                  quality={100}
                    width={128}
                    height={128}
                  className="relative w-32 h-32 rounded-4xl object-cover border-0 shadow-md grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              <h3 className="text-2xl font-bold text-dark">{dev.name}</h3>
              <p className="text-main font-semibold mb-4">{dev.role}</p>
              <p className="text-slate-500 text-center text-sm leading-relaxed mb-8">
                {dev.bio}
              </p>
              <div className="flex gap-4 w-full">
                <Button
                  className="rounded-xl flex-1 gap-2 text-xs"
                  onClick={() => window.open(dev.github, "_blank")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={"text-white"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>{" "}
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl flex-1 gap-2 text-xs border-slate-100"
                  onClick={() => window.open(dev.linkedin, "_blank")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={"text-[#0077b5]"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>{" "}
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-20 text-center">
        <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
          Want to see how it works? <ExternalLink size={14} />
          <span className="text-dark font-bold cursor-pointer hover:text-main decoration-main/30">
            Github Repository
          </span>
        </p>
      </div>
    </div>
  );
};

export default Developers;
