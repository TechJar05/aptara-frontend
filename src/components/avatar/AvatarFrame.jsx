// src/components/avatar/AvatarFrame.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";

const BACKEND_URL = "http://localhost:4000"; // keep as-is or use env

const AvatarFrame = forwardRef(function AvatarFrame({ label, onShowDemo, initialBotMessage, idleFollowUpMessage, idleSeconds, onGoToProductDemo, onBotConfirmedGoToDemo }, ref) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [hasTriggeredDemo, setHasTriggeredDemo] = useState(false);

  const VIDEO_ELEMENT_ID = "anam-avatar-video";

  // Expose stopStreaming to parent via ref
  useImperativeHandle(ref, () => ({
    async stopStreaming() {
      if (clientRef.current?.stopStreaming) {
        try {
          // await stop to ensure backend session closes
          await clientRef.current.stopStreaming();
          clientRef.current = null;
          setStatus("idle");
        } catch (err) {
          console.warn("Error in exposed stopStreaming():", err);
        }
      }
    },
    // optional: expose raw client if parent wants it
    getClient() {
      return clientRef.current;
    }
  }), []);

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

        client.addListener(AnamEvent.SESSION_READY, () => {
          if (!cancelled) setStatus("connected");
        });

        client.addListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          async (messages = []) => {
            if (!messages.length || hasTriggeredDemo) return;

            const last = messages[messages.length - 1];

            if (
              last?.role === "user" &&
              /show\s+(me\s+)?(the\s+)?demo/i.test(last.content || "")
            ) {
              setHasTriggeredDemo(true);

              try {
                await client.talk("OK sure, let's see our demo!");
                setTimeout(() => {
                  if (typeof onShowDemo === "function") onShowDemo();
                }, 3500);
              } catch (err) {
                console.error("Error using talk():", err);
                if (typeof onShowDemo === "function") onShowDemo();
              }
            }
          }
        );

        await client.streamToVideoElement(VIDEO_ELEMENT_ID);

        if (cancelled && clientRef.current) {
          await clientRef.current.stopStreaming();
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
          console.error("Error stopping Anam stream (cleanup):", err)
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
});

export default AvatarFrame;
