// src/screens/DemoSelectorScreen.jsx
import React from "react";
import { motion } from "framer-motion";
import AvatarFrame from "../components/avatar/AvatarFrame";

const levelLabels = {
  L1: "High level – quick overview",
  L2: "Detailed – more screens and steps",
  L3: "Deep dive – end-to-end with scenarios",
};

export default function DemoSelectorScreen({
  selectedIndustry,
  setSelectedIndustry,
  selectedLevel,
  setSelectedLevel,
  onStartDemo,
}) {
  const canStart = selectedIndustry && selectedLevel;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      {/* Full-width hero band – avatar + controls */}
      <div className="max-w-[2900px] mx-auto bg-[#073246] text-white px-8 md:px-14 py-12 md:py-20 shadow-lg">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr] items-start">
          {/* LEFT: Avatar / explainer */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-white/40 to-white/10 p-[2px] shadow-[0_22px_55px_rgba(0,0,0,0.55)]">
              <div className="rounded-3xl bg-black/85 p-2 md:p-3">
                <div className="w-full aspect-[16/9] md:aspect-[16/9]">
                  <AvatarFrame label="Avatar explains how to choose industry + complexity" />
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3 mt-4 text-xs text-white/80">
              <div className="px-3 py-2 rounded-full bg-white/10 border border-white/25 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Avatar guides your demo configuration.</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Controls */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                  Configure demo
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold text-white">
                Choose your industry and level of detail.
              </h2>
              <p className="text-sm text-white/80">
                Select the industry first, then pick how deep you want the
                journey to go.
              </p>
            </div>

            {/* Industry Selection */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                Industry
              </p>

              <div className="flex flex-wrap gap-3">
                {["finance", "healthcare"].map((ind) => {
                  const active = selectedIndustry === ind;
                  const label = ind === "finance" ? "Finance" : "Healthcare";

                  return (
                    <button
                      key={ind}
                      onClick={() => setSelectedIndustry(ind)}
                      className={`
                        px-5 py-2.5 rounded-full text-sm transition font-medium
                        border 
                        ${
                          active
                            ? "bg-white text-[#073246] border-transparent shadow-sm"
                            : "bg-transparent text-white border-white/35 hover:bg-white/10"
                        }
                      `}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complexity Selection */}
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                Complexity Level
              </p>

              <div className="grid gap-3">
                {["L1", "L2", "L3"].map((lvl) => {
                  const active = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`
                        text-left rounded-2xl border px-5 py-4 text-sm transition
                        ${
                          active
                            ? "bg-white text-[#073246] border-transparent shadow-md"
                            : "bg-white/5 text-white border-white/20 hover:border-white/40 hover:bg-white/10"
                        }
                      `}
                    >
                      <div className="font-semibold">{lvl}</div>
                      <div
                        className={`mt-1 ${
                          active ? "text-[#073246]/80" : "text-white/80"
                        }`}
                      >
                        {levelLabels[lvl]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onStartDemo}
              disabled={!canStart}
              className={`
                px-6 py-3 rounded-full text-sm font-semibold transition 
                w-full md:w-auto
                ${
                  canStart
                    ? "bg-white text-[#073246] hover:bg-[#f5f5f5]"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }
              `}
            >
              Start Demo
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
