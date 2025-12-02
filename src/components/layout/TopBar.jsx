// src/components/layout/TopBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50">
      {/* Top brand bar */}
      <div className="bg-[#1d4457]">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 md:px-6">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img
              src="/aptaraLogo.png"
              alt="Aptara Logo"
              className="h-8 w-auto select-none"
            />
          </div>

          {/* Right: Badge */}
          <span
            className="
              text-[11px] md:text-xs 
              px-3 py-1 
              rounded-full 
              bg-white/10 
              border border-white/20 
              text-white/80
            "
          >
            Powered by AI Avatar
          </span>
        </div>
      </div>

      {/* Nav bar under the brand bar */}
      <div className="bg-white border-b border-slate-200 justify-center">
        <div className="max-w-7xl mx-auto px-4 md:px-6 justify-center align-middle flex">
          <nav className="flex gap-6 md:gap-8 text-sm md:text-base font-medium text-[#1d4457]">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-flex items-center py-3 border-b-2 transition ${
                  isActive
                    ? "border-[#1d4457] text-[#1d4457]"
                    : "border-transparent text-[#1d4457]/70 hover:text-[#1d4457]"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/showreel"
              className={({ isActive }) =>
                `inline-flex items-center py-3 border-b-2 transition ${
                  isActive
                    ? "border-[#1d4457] text-[#1d4457]"
                    : "border-transparent text-[#1d4457]/70 hover:text-[#1d4457]"
                }`
              }
            >
              Showreel
            </NavLink>

            <NavLink
              to="/choose-demo"
              className={({ isActive }) =>
                `inline-flex items-center py-3 border-b-2 transition ${
                  isActive
                    ? "border-[#1d4457] text-[#1d4457]"
                    : "border-transparent text-[#1d4457]/70 hover:text-[#1d4457]"
                }`
              }
            >
              Show Demo
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
