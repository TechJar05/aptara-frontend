// src/components/avatar/AvatarFrame.jsx
import React from "react";

export default function AvatarFrame({ label }) {
  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#1d4457]/10 border border-[#1d4457]/20 overflow-hidden shadow-xl">

  <iframe
    src="https://embed.liveavatar.com/v1/1edf4a1f-4184-462c-aa11-14c69893ba81"
    allow="microphone"
    title="LiveAvatar Embed"
    className="absolute inset-0 w-full h-full"
  ></iframe>

</div>

  );
}
