// src/screens/ShowreelScreen.jsx
import React, {useEffect} from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AvatarFrame from "../components/avatar/AvatarFrame";

export default function ShowreelScreen({ onBack, onGoToDemo }) {

  useEffect(() => {
  const video = document.getElementById("showreelVideo");
  const unmute = () => {
    video.muted = false;
    window.removeEventListener("click", unmute);
  };
  window.addEventListener("click", unmute);
}, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
    >
      {/* Full-width hero band – avatar + copy */}
      <div className="max-w-[2900px] mx-auto bg-[#073246] text-white px-8 md:px-14 py-12 md:py-20 shadow-lg">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr] items-start">
          {/* LEFT: Showreel video container (bigger, hero style) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl bg-linear-to-br from-white/30 to-white/5 p-0.5 shadow-[0_22px_55px_rgba(0,0,0,0.55)]">
              <div className="relative rounded-3xl bg-linear-to-br from-white/30 to-white/5 p-0.5 shadow-[0_22px_55px_rgba(0,0,0,0.55)]">
                <div className="rounded-3xl bg-black/80 p-2 md:p-3">
                  <div className="w-full aspect-video md:aspect-video relative overflow-hidden rounded-2xl">
                    <video
                      src="https://myai-aws-bucket.s3.ap-south-1.amazonaws.com/Nex+AI+Product+Pitch.mp4"
                      autoPlay
                      playsInline
                      controls
                      muted
                      id="showreelVideo"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    ></video>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Copy + actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            {/* Eyebrow tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/80">
                Overview demo
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-semibold text-white">
                A quick look at the Aptara AI experience.
              </h2>
              <p className="text-sm md:text-base text-white/80">
                This showreel walks through the end-user journey — from clicking
                an email to interacting with the avatar and branching into
                different flows.
              </p>
            </div>

            {/* Bullets */}
            <ul className="mt-2 space-y-2 text-xs md:text-sm text-white/85">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <span>
                  Personalized avatar greeting triggered directly from the email
                  click.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <span>
                  Branching into different industries and buyer journeys.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white" />
                <span>
                  Clear hand-off points to deeper demos, form fills, or
                  meetings.
                </span>
              </li>
            </ul>

            {/* Tiny meta row */}
            <div className="flex flex-wrap gap-3 text-[11px] text-white/80 pt-1">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                ~2–3 min overview
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                Best for cold prospects
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onBack}
                className="px-4 py-2.5 rounded-full border border-white/40 text-xs md:text-sm text-white hover:bg-white/10 transition"
              >
                Back to options
              </button>
              <button
                onClick={onGoToDemo}
                className="px-4 py-2.5 rounded-full bg-white text-[#073246] text-xs md:text-sm font-semibold hover:bg-[#f5f5f5] transition"
              >
                See Finance / Healthcare demo
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}