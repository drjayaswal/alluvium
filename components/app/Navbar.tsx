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

  if (!hasToken) return null;

  return (
    <nav className="fixed top-6 right-0 z-100 px-6 flex items-center justify-end pointer-events-none">
      <div 
        className={`flex items-center transition-all duration-700 ease-in-out overflow-hidden pointer-events-auto
          ${isOpen ? "max-w-full opacity-100" : "max-w-0 opacity-0"}
        `}
      >
        <nav className="flex items-center gap-2 bg-black p-1 border border-r-0 overflow-x-auto no-scrollbar max-w-[calc(100vw-100px)]">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-[10px] uppercase tracking-widest text-white/50 hover:text-black hover:bg-white px-4 py-3 transition-all duration-300 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group shrink-0 pointer-events-auto flex cursor-pointer items-center justify-center w-12.25 h-12.25 transition-all duration-200
          ${isOpen ? "hover:bg-white border border-white border-l-0 bg-black" : "bg-black"}
        `}
      >
        {isOpen ? (
          <XIcon size={20} weight="bold" className="text-white group-hover:text-red-600 transition-colors" />
        ) : (
          <ListIcon size={20} weight="bold" className="text-white group-hover:text-white transition-colors" />
        )}
      </button>
    </nav>
  );
}

export default Navbar;