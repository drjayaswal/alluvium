"use client";

import { navLinks } from "@/lib/const";
import Link from "next/link";
import { useEffect, useState } from "react";

function Footer() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);

    const checkToken = () => {
      setHasToken(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage_change", checkToken);
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage_change", checkToken);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  if (!hasToken) return null;
  return (
    <footer className="w-full z-10 fixed bottom-0 left-0 right-0 bg-black border-t border-white/15 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-7xl mx-auto px-2 py-1.5 sm:px-4 sm:py-1 md:px-6 md:py-2 lg:px-8">
        <div className="flex flex-col gap-y-1 sm:gap-y-3 md:flex-row md:justify-between md:items-center">
          <div className="overflow-x-auto overflow-y-hidden md:overflow-visible -mx-2 px-2 sm:-mx-4 sm:px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.3)_rgba(255,255,255,0.1)]">
            <nav className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-end gap-x-1 gap-y-1 sm:gap-x-3 sm:gap-y-1.5 md:gap-x-4 lg:gap-x-5 min-w-max md:min-w-0 w-max md:w-auto">
              {navLinks.map((link, index) => (
                <div
                  key={index}
                  className={`relative group/tooltip flex items-center shrink-0 ${link.isGrouped ? "-mr-px" : ""}`}
                >
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`
                      text-[10px] min-[380px]:text-[10px] md:text-[10px] py-2 px-1.5 sm:px-2 min-h-[36px] sm:min-h-0 sm:py-2 flex items-center justify-center
                      ${link.color} text-white transition-colors uppercase tracking-tighter whitespace-nowrap
                      active:scale-[0.98] touch-manipulation
                      ${link.isGrouped ? "" : ""}
                      ${link.position === "start" ? "-mr-2 md:-mr-4.75" : ""}
                      ${link.position === "end" ? "-ml-2 md:-ml-4.75" : ""}
                      `}
                  >
                    {link.name}
                  </Link>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 hidden md:block">
                    <div className="bg-white text-black text-[10px] font-bold uppercase tracking-wider py-1 px-3 whitespace-nowrap shadow-xl border border-white/20 relative">
                      {link.tooltip}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 block md:hidden">
                    <div className="bg-white/95 text-black text-[9px] font-medium uppercase tracking-wide py-0.5 px-2 rounded shadow border border-white/20 whitespace-nowrap">
                      {link.tooltip}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
