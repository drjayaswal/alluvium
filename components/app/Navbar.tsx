"use client";

import { navLinks } from "@/lib/const";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";

function Navbar() {
  const [hasToken, setHasToken] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
    const checkToken = () => setHasToken(!!localStorage.getItem("token"));
    window.addEventListener("storage_change", checkToken);
    window.addEventListener("storage", checkToken);
    return () => {
      window.removeEventListener("storage_change", checkToken);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!hasToken) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4.5 right-6 z-110 flex items-center justify-center w-12 h-12 cursor-pointer transition-all ${
          isOpen ? "text-rose-500" : "text-black bg-white"
        } active:scale-95`}
      >
        {isOpen ? <XIcon size={24} weight="bold" /> : <ListIcon size={24} weight="bold" />}
      </button>

      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-100 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-[70%] sm:w-70 bg-black border-l border-white/20 z-105
          shadow-2xl transition-transform duration-500 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 pt-9.5">
          <nav className="flex flex-col gap-6">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/30 mb-2">
              Navigation
            </p>
            
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between text-xs sm:text-sm uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                <span className="shrink-0">{link.name}</span>
                <span className="ml-4 h-px w-0 bg-white transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;