// src/screens/IntroScreen.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AvatarFrame from "../components/avatar/AvatarFrame";

export default function IntroScreen({ onStart, onSkip }) {
  const navigate = useNavigate();
  const avatarRef = useRef(null);

  // Called when AvatarFrame detects "show demo"
  const handleShowDemo = async () => {
    // Ensure we stop existing avatar session to avoid concurrency limit
    try {
      if (avatarRef.current?.stopStreaming) {
        // await the stopStreaming call to ensure session closes
        const stopPromise = avatarRef.current.stopStreaming();
        // safety: timeout after 1500ms if stop takes too long
        const timeout = new Promise((res) => setTimeout(res, 1500));
        await Promise.race([stopPromise, timeout]);
      }
    } catch (err) {
      console.warn("Error stopping avatar before navigate:", err);
    } finally {
      // now safe to navigate
      navigate("/showreel");
    }
  };

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
      <div className="max-w-[2900px] mx-auto bg-[#073246] text-white px-8 md:px-14 py-12 md:py-20 shadow-lg">
        <div className="grid gap-14 md:grid-cols-[1fr_1.5fr] items-center">
          <motion.div className="space-y-7" initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
            <div className="space-y-4">
              <h1 className="text-xl md:text-xl text-white/80 max-w-xl">
                Welcome to your Aptara demo microsite. See how an avatar can greet prospects...
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs md:text-sm text-white/85 max-w-md">
              <div className="rounded-2xl bg-white/5 px-3 py-3 border border-white/15">
                <p className="font-semibold">2 entry paths</p>
                <p className="mt-1 text-[11px] md:text-xs text-white/80">Quick showreel or guided industry-specific demo.</p>
              </div>
              <div className="rounded-2xl bg-white/5 px-3 py-3 border border-white/15">
                <p className="font-semibold">3 complexity levels</p>
                <p className="mt-1 text-[11px] md:text-xs text-white/80">L1, L2, L3 flows for different buyer personas.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <button onClick={onStart} className="px-5 py-2.5 rounded-full bg-white text-[#073246] text-sm font-semibold shadow-sm hover:bg-[#f5f5f5] transition">
                Start guided demo
              </button>
              <button onClick={onSkip} className="px-5 py-2.5 rounded-full border border-white/40 text-sm text-white hover:bg-white/10 transition">
                Skip to path selection
              </button>
            </div>
          </motion.div>

          <motion.div className="relative" initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
            <div className="relative rounded-3xl bg-linear-to-br from-white/30 to-white/5 p-0.5 shadow-[0_22px_55px_rgba(0,0,0,0.55)]">
              <div className="rounded-3xl bg-black/80 p-2 md:p-3">
                <div className="w-full aspect-video md:aspect-video">
                  <AvatarFrame
                    ref={avatarRef}
                    label="Aptara-Welcome Script"
                    onShowDemo={handleShowDemo}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
