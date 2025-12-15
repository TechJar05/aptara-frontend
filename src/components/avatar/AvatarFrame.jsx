// src/components/avatar/AvatarFrame.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { createClient, AnamEvent } from "@anam-ai/js-sdk";

const ANAM_SESSION_URL = "https://api.anam.ai/v1/auth/session-token";

const AvatarFrame = forwardRef(function AvatarFrame({
  label,
  onShowDemo,
  initialBotMessage,
  idleFollowUpMessage,
  idleSeconds = 10,
  onGoToProductDemo,
  onBotConfirmedGoToDemo,
  postDemoMode = false, // NEW: flag to indicate post-demo Q&A mode
}, ref) {
  const clientRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [hasTriggeredDemo, setHasTriggeredDemo] = useState(false);
  const idleTimerRef = useRef(null);

  const VIDEO_ELEMENT_ID = "anam-avatar-video";

  useImperativeHandle(ref, () => ({
    async stopStreaming() {
      // Clear idle timer
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

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

        const ANAM_API_KEY = import.meta.env.VITE_ANAM_API_KEY;
        if (!ANAM_API_KEY) {
          throw new Error(
            "Missing VITE_ANAM_API_KEY in environment. Add VITE_ANAM_API_KEY to .env.local (dev only)."
          );
        }

        // Different persona config based on mode
        const personaConfig = postDemoMode
          ? {
              // POST-DEMO Q&A MODE
              name: 'Ava',
              avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18',
              voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b',
              llmId: '9d8900ee-257d-4401-8817-ba9c835e9d36',
              systemPrompt: `You are Ava, Aptara's helpful Q&A assistant. The user has just watched the Aptara demo video. Your role is to:
1. Thank them for watching
2. Answer any questions they have about what they saw
3. Offer to show them a product-specific demo if they're interested
4. Keep responses concise, friendly, and focused on Aptara's solutions
5. If they want to see more, guide them to the product demo

Opening: "Thanks for watching! Do you have any questions about the demo?"`,
            }
          : {
              // INITIAL GREETING MODE
              name: 'Cara',
              avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18',
              voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b',
              llmId: '9d8900ee-257d-4401-8817-ba9c835e9d36',
              systemPrompt: `Ava is a friendly, professional website assistant for Aptara. She welcomes visitors, introduces Aptara's digital, content, and AI-enabled solutions, and guides users based on their interests. Keep responses warm, clear, and concise—never salesy. Focus only on Aptara services, suggest solutions or contacting the team when needed, and avoid pricing or competitor discussions. 

Opening: "Hi there! Welcome to Aptara. I'm Ava, your digital guide. Are you here to explore our solutions, learn about Aptara, or see how we can support your business?"`,
            };

        const res = await fetch(ANAM_SESSION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ANAM_API_KEY}`,
          },
          body: JSON.stringify({ personaConfig }),
        });

        const raw = await res.text();
        console.debug("Anam session-token raw response:", raw);

        if (!res.ok) {
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

        client.addListener(AnamEvent.SESSION_READY, async () => {
          if (!cancelled) {
            setStatus("connected");
            
            // If there's an initial message, have the avatar speak it
            if (initialBotMessage && client.talk) {
              try {
                await client.talk(initialBotMessage);
                
                // Start idle timer for follow-up
                if (idleFollowUpMessage && idleSeconds > 0) {
                  idleTimerRef.current = setTimeout(async () => {
                    if (client.talk && !hasTriggeredDemo) {
                      try {
                        await client.talk(idleFollowUpMessage);
                      } catch (err) {
                        console.error("Error in idle follow-up:", err);
                      }
                    }
                  }, idleSeconds * 1000);
                }
              } catch (err) {
                console.error("Error speaking initial message:", err);
              }
            }
          }
        });

        client.addListener(
          AnamEvent.MESSAGE_HISTORY_UPDATED,
          async (messages = []) => {
            if (!messages.length || hasTriggeredDemo) return;

            const last = messages[messages.length - 1];
            if (last?.role !== "user") return;

            const userText = (last.content || "").trim().toLowerCase();

            // Demo trigger logic
            const demoVerbRegex = /\b(show|display|view|open|play|watch|see|start|launch)\b/;
            const demoNounRegex = /\bdemo\b/;

            const wantsDemo =
              demoNounRegex.test(userText) &&
              (demoVerbRegex.test(userText) || userText.endsWith("demo"));

            if (wantsDemo) {
              setHasTriggeredDemo(true);

              // Clear idle timer
              if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
                idleTimerRef.current = null;
              }

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
          setError(err.message || String(err));
        }
      }
    }

    initAvatar();

    return () => {
      cancelled = true;
      
      // Clear idle timer
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      if (clientRef.current) {
        clientRef.current.stopStreaming?.().catch((err) =>
          console.error("Error stopping Anam stream (cleanup):", err)
        );
        clientRef.current = null;
      }
    };
  }, [hasTriggeredDemo, onShowDemo, initialBotMessage, idleFollowUpMessage, idleSeconds, postDemoMode]);

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
        {status === "error" && "Error"}
      </div>
      {error && (
        <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg text-xs bg-red-500/90 text-white">
          {error}
        </div>
      )}
    </div>
  );
});

export default AvatarFrame;