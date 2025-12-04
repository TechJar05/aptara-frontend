// src/components/avatar/AvatarFrame.jsx
import React, { useEffect, useRef, useState } from "react";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";

const BACKEND_URL = "http://localhost:4000"; // change if your backend URL is different

export default function AvatarFrame({ label }) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Use a fixed ID for the video element
  const VIDEO_ELEMENT_ID = "anam-avatar-video";

  useEffect(() => {
    let cancelled = false;

    async function initAvatar() {
      try {
        setStatus("requesting_token");
        setError("");

        // 1) Get session token from your Node/Express backend
        const res = await fetch(`${BACKEND_URL}/api/session-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // send personaConfig here if needed
        });

        if (!res.ok) {
          throw new Error(`Backend error: ${res.status}`);
        }

        const data = await res.json();
        const sessionToken = data.sessionToken;
        if (!sessionToken) {
          throw new Error("No sessionToken returned from backend");
        }

        setStatus("connecting");

        // 2) Create Anam client
        const client = createClient(sessionToken);
        clientRef.current = client;

        // Listen for session ready
        client.addListener(AnamEvent.SESSION_READY, () => {
          if (!cancelled) {
            setStatus("connected");
          }
        });

        // 3) Stream persona into the video element by ID (this is the key fix)
        await client.streamToVideoElement(VIDEO_ELEMENT_ID);

        if (cancelled) {
          await client.stopStreaming();
        }
      } catch (err) {
        console.error("Error initializing Anam avatar:", err);
        if (!cancelled) {
          setStatus("error");
          setError(err.message || "Unknown error");
        }
      }
    }

    initAvatar();

    // Cleanup on unmount
    return () => {
      cancelled = true;
      if (clientRef.current) {
        clientRef.current.stopStreaming?.().catch((err) =>
          console.error("Error stopping Anam stream:", err)
        );
        clientRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#1d4457]/10 border border-[#1d4457]/20 overflow-hidden shadow-xl">
      {/* Important: give the video a matching id */}
      <video
        id={VIDEO_ELEMENT_ID}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full"
      />

      {/* Optional status pill */}
      <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur">
        {status === "idle" && "Idle"}
        {status === "requesting_token" && "Connecting..."}
        {status === "connecting" && "Starting avatar..."}
        {status === "connected" && (label || "Live")}
        {status === "error" && `Error: ${error}`}
      </div>
    </div>
  );
}
