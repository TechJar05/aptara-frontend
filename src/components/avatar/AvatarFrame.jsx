/* eslint-disable no-unused-vars */
// src/components/avatar/AvatarFrame.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";

const ANAM_SESSION_URL = "https://api.anam.ai/v1/auth/session-token";

const AvatarFrame = forwardRef(function AvatarFrame({
  label,
  onShowDemo,
  initialBotMessage,
  idleFollowUpMessage,
  idleSeconds,
  onGoToProductDemo,
  onBotConfirmedGoToDemo,
}, ref) {
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
          await clientRef.current.stopStreaming();
          clientRef.current = null;
          setStatus("idle");
        } catch (err) {
          console.warn("Error in exposed stopStreaming():", err);
        }
      }
    },
    getClient() {
      return clientRef.current;
    },
  }), []);

  useEffect(() => {
    let cancelled = false;

    async function initAvatar() {
      try {
        setStatus("requesting_token");
        setError("");

        // Read API key from Vite env
        const ANAM_API_KEY = import.meta.env.VITE_ANAM_API_KEY;
        if (!ANAM_API_KEY) {
          throw new Error(
            "Missing VITE_ANAM_API_KEY in environment. Add VITE_ANAM_API_KEY to .env.local (dev only)."
          );
        }

        const personaConfig = {
          name: 'Cara',
          avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18',
          voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b',
          llmId: '9d8900ee-257d-4401-8817-ba9c835e9d36',
          systemPrompt:
            "Ava is a friendly, professional website assistant for Aptara. She welcomes visitors, introduces Aptara’s digital,content, and AI-enabled solutions, and guides users based on their interests. Keep responses warm, clear, and concise—never salesy. Focus only on Aptara services, suggest solutions or contacting the team wheneeded, and avoid pricing or competitor discussions. Opening: “Hi there! Welcome to Aptara. I’m Ava, your digital guide. Are you here to explore our solutions, learn about Aptara, or see how we can support your business?",
        };

        // Request session token directly from Anam
        const res = await fetch(ANAM_SESSION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ANAM_API_KEY}`,
          },
          body: JSON.stringify({ personaConfig }),
        });

        const raw = await res.text();
        // Helpful logging for debugging (remove in production)
        console.debug("Anam session-token raw response:", raw);

        if (!res.ok) {
          // try to return parsed error message if possible
          let parsed;
          try { parsed = JSON.parse(raw); } catch (e) { /* ignore */ }
          const msg = (parsed && (parsed.message || parsed.error)) || `Anam API returned ${res.status}`;
          throw new Error(msg);
        }

        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          throw new Error("Failed to parse Anam response JSON");
        }

        const { sessionToken } = data;
        if (!sessionToken) throw new Error("No sessionToken returned from Anam");

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

        // Start streaming into the video element
        await client.streamToVideoElement(VIDEO_ELEMENT_ID);

        if (cancelled && clientRef.current) {
          await clientRef.current.stopStreaming();
        }
      } catch (err) {
        console.error("Error initializing Anam avatar:", err);
        if (!cancelled) {
          setStatus("error");
          setError(err.message || String(err));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
