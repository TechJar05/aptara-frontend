// src/components/avatar/AvatarFrame.jsx
import React, { useEffect, useRef, useState } from "react";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";

const BACKEND_URL = "http://localhost:4000"; // or from env

export default function AvatarFrame({ label, onShowDemo }) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [hasTriggeredDemo, setHasTriggeredDemo] = useState(false);

  const VIDEO_ELEMENT_ID = "anam-avatar-video";

  useEffect(() => {
    let cancelled = false;

    async function initAvatar() {
      try {
        setStatus("requesting_token");
        setError("");

        const res = await fetch(`${BACKEND_URL}/api/session-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!res.ok) throw new Error(`Backend error: ${res.status}`);

        const { sessionToken } = await res.json();
        if (!sessionToken) throw new Error("No sessionToken returned");

        setStatus("connecting");

        const client = createClient(sessionToken);
        clientRef.current = client;

        // Session ready → mark as connected
        client.addListener(AnamEvent.SESSION_READY, () => {
          if (!cancelled) setStatus("connected");
        });

        // 👇 Listen for user saying "show demo"
        client.addListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          async (messages = []) => {
            if (!messages.length || hasTriggeredDemo) return;

            const last = messages[messages.length - 1];

            if (
              last?.role === "user" &&
              /show\s+(me\s+)?(the\s+)?demo/i.test(last.content || "")
            ) {
              console.log("🟢 Detected 'show demo' from user");
              setHasTriggeredDemo(true);

              try {
                // Use talk() to make avatar speak the response
                await client.talk("OK sure, let's see our demo!");
                
                // Wait a moment for the speech to complete, then navigate
                setTimeout(() => {
                  if (typeof onShowDemo === "function") {
                    onShowDemo();
                  }
                }, 3500); // Adjust timing as needed
              } catch (err) {
                console.error("Error using talk():", err);
                // Navigate anyway if talk fails
                if (typeof onShowDemo === "function") {
                  onShowDemo();
                }
              }
            }
          }
        );

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

    return () => {
      cancelled = true;
      if (clientRef.current) {
        clientRef.current.stopStreaming?.().catch((err) =>
          console.error("Error stopping Anam stream:", err)
        );
        clientRef.current = null;
      }
    };
  }, [hasTriggeredDemo, onShowDemo]);

  return (
    <div className="relative w-full aspect-video rounded-2xl bg-[#1d4457]/10 border border-[#1d4457]/20 overflow-hidden shadow-xl">
      <video
        id={VIDEO_ELEMENT_ID}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
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
