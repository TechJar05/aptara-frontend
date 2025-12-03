// src/components/layout/MainShell.jsx
import React from "react";
import TopBar from "./TopBar";

export default function MainShell({ children }) {
  return (
    <div className="bg-white text-[#1d4457] min-h-screen ">
      <TopBar />

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
