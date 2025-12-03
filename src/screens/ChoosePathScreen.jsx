// src/screens/ChoosePathScreen.jsx
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AvatarFrame from "../components/avatar/AvatarFrame";

export default function ChoosePathScreen({ onShowreel, onChooseDemo }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      <div className="max-w-[2900px] mx-auto bg-[#073246] text-white px-8 md:px-14 py-12 md:py-20 shadow-lg">
        <div className="grid gap-14 md:grid-cols-[1fr_1.5fr] items-start">

          {/* LEFT → TEXT & BUTTONS */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Step label + heading */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/80">
                  Step 1 · Choose your entry path
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-semibold">
                What would you like to explore first?
              </h2>
              <p className="text-sm md:text-base text-white/80 max-w-xl">
                Start with a fast overview showreel, or jump straight into an
                industry-specific journey with different complexity levels.
              </p>
            </div>

            {/* Option cards */}
            <div className="grid gap-5">

              {/* Showreel */}
              <button
                onClick={onShowreel}
                className="
                  group text-left rounded-2xl bg-white 
                  border border-white/20 p-5 
                  hover:border-white/40 
                  hover:shadow-[0_14px_35px_rgba(0,0,0,0.12)] 
                  hover:-translate-y-0.5 transition transform
                "
              >
                <p className="text-[11px] uppercase tracking-wide text-[#073246]/70">
                  Overview
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-sm md:text-base font-semibold text-[#073246]">
                    Watch a generic showreel
                  </h3>
                  <span className="text-[11px] text-[#073246]/60 group-hover:text-[#073246]">
                    ~2 min
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#073246]/80 mt-1.5">
                  A fast tour of the overall AI experience from an end-user
                  perspective — ideal as a first touch.
                </p>
              </button>

              {/* Guided Demo */}
              <button
                onClick={onChooseDemo}
                className="
                  group text-left rounded-2xl bg-white 
                  border border-white/20 p-5 
                  hover:border-white/40 
                  hover:shadow-[0_14px_35px_rgba(0,0,0,0.12)] 
                  hover:-translate-y-0.5 transition transform
                "
              >
                <p className="text-[11px] uppercase tracking-wide text-[#073246]/70">
                  Guided demo
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <h3 className="text-sm md:text-base font-semibold text-[#073246]">
                    See an industry-specific journey
                  </h3>
                  <span className="text-[11px] text-[#073246]/60 group-hover:text-[#073246]">
                    Finance · Healthcare
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#073246]/80 mt-1.5">
                  Choose Finance or Healthcare and pick how deep you want to go:
                  L1, L2 or L3 flows tailored to different buyer personas.
                </p>
              </button>

            </div>
          </motion.div>

          {/* RIGHT → AVATAR */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="relative rounded-3xl bg-linear-to-br from-white/40 to-white/10 p-0.5 shadow-[0_22px_55px_rgba(0,0,0,0.5)]">
              <div className="rounded-3xl bg-black/85 p-2 md:p-3">
                <div className="w-full aspect-video">
                  <AvatarFrame label="Avatar continues talking while you choose" />
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 mt-4 text-xs text-white/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Avatar keeps context while the user chooses a path.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
