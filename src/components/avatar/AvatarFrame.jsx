// src/components/avatar/AvatarFrame.jsx
import React from "react";

// eslint-disable-next-line no-unused-vars
export default function AvatarFrame({ label }) {
  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#1d4457]/10 border border-[#1d4457]/20 overflow-hidden shadow-xl">

  <iframe
     src="https://embed.liveavatar.com/v1/eace4748-4fb1-49cd-b84f-cd0169395e99"
    allow="microphone"
    title="LiveAvatar Embed"
    className="absolute inset-0 w-full h-full"
  ></iframe>

</div>

  );
}
