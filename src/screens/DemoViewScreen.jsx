// src/screens/DemoViewScreen.jsx
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AvatarFrame from "../components/avatar/AvatarFrame";

export default function DemoViewScreen({
  industry,
  level,
  onBackToSelector,
}) {
  const industryLabel =
    industry === "finance"
      ? "Finance"
      : industry === "healthcare"
      ? "Healthcare"
      : "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      <div className="max-w-[2900px] mx-auto bg-[#073246] text-white px-8 md:px-14 py-12 md:py-20 shadow-lg">
        {/* GRID → avatar RIGHT */}
        <div className="grid gap-14 md:grid-cols-[1fr_1.5fr] items-start">

          {/* LEFT → TITLE + INFO + STEPS */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            {/* Pills */}
            <div className="flex flex-wrap items-center gap-3">
              {industry && (
                <span className="px-3 py-1 rounded-full bg-white text-[#073246] text-[11px] uppercase tracking-wide">
                  {industryLabel}
                </span>
              )}
              {level && (
                <span className="px-3 py-1 rounded-full border border-white/30 text-[11px] uppercase tracking-wide text-white">
                  {level} complexity
                </span>
              )}
            </div>

            {/* Title + description */}
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {industryLabel || "Selected"} demo — {level || ""} walkthrough
              </h2>
              <p className="text-sm md:text-base text-white/80">
                The avatar is now guiding the user through a{" "}
                {industryLabel ? industryLabel.toLowerCase() : "chosen"} journey
                tailored to this complexity level. Each step can be mapped to
                real product screens and workflows.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-sm text-white/85">
              <div className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <p>Step 1 – User lands from the email onto this guided microsite.</p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <p>Step 2 – Avatar introduces the solution, value props and context.</p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <p>
                  Step 3 – Walkthrough of key flows for this{" "}
                  {industryLabel ? industryLabel.toLowerCase() : "selected"} use case.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <p>
                  Step 4 – Handoff to deeper actions like AI-assisted forms or
                  scheduling a meeting.
                </p>
              </div>
            </div>

            {/* Back to previous */}
            <button
              onClick={onBackToSelector}
              className="mt-4 px-5 py-2.5 rounded-full border border-white/30 text-sm text-white hover:bg-white/10 transition"
            >
              Back to industry & level selection
            </button>
          </motion.div>

          {/* RIGHT → AVATAR */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl bg-linear-to-br from-white/40 to-white/10 p-0.5 shadow-[0_22px_55px_rgba(0,0,0,0.55)]">
              <div className="rounded-3xl bg-black/85 p-2 md:p-3">
                <div className="w-full aspect-video">
                  <AvatarFrame
                    label={
                      industryLabel && level
                        ? `${industryLabel} demo video – ${level} complexity`
                        : "Demo video"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Info pill under video */}
            <div className="hidden md:flex items-center gap-3 mt-4 text-xs text-white/80">
              <div className="px-3 py-2 rounded-full bg-white/10 border border-white/25 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Avatar walkthrough of {industryLabel || "selected"} flow at level{" "}
                  {level || "chosen"} complexity.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
