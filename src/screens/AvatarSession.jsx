import React, { useState, useEffect, useRef } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';

import { avatarAPI } from '../services/api';

const AvatarSession = () => {
  const [avatarId] = useState('7b888024-f8c9-4205-95e1-78ce01497bda');

  const [sessionData, setSessionData] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [livekitUrl, setLivekitUrl] = useState(null);
  const [livekitToken, setLivekitToken] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // optional, but kept
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarInfo, setAvatarInfo] = useState(null);

  const keepAliveInterval = useRef(null);

  // ✅ Fetch avatar info on mount
  useEffect(() => {
    fetchAvatarInfo();
  }, []);

  // ✅ Keep session alive every 5 minutes
  useEffect(() => {
    if (sessionId) {
      keepAliveInterval.current = setInterval(() => {
        handleKeepAlive();
      }, 300000); // 5 min

      return () => {
        if (keepAliveInterval.current) {
          clearInterval(keepAliveInterval.current);
        }
      };
    }
  }, [sessionId]);

  // ✅ Fetch Avatar Info
  const fetchAvatarInfo = async () => {
    try {
      const response = await avatarAPI.getAvatar(avatarId);
      if (response.code === 1000) {
        setAvatarInfo(response.data);
      }
    } catch (err) {
      console.error('Error fetching avatar info:', err);
    }
  };

  // ✅ START SESSION (embed on same page)
  const handleStartSession = async () => {
    setLoading(true);
    setError(null);
    setIsConnected(true);

    try {
      console.log('Starting session for avatar:', avatarId);

      const response = await avatarAPI.startSession(
        avatarId,
        'd14c6c9f-e817-43eb-b3f8-c407390933db' // context id
      );

      if (response.code === 1000) {
        const data = response.data;

        setSessionData(data);
        setSessionId(data.session_id);
        setLivekitUrl(data.livekit_url);
        setLivekitToken(data.livekit_client_token);
      } else {
        setError(response.message || 'Failed to start session');
      }
    } catch (err) {
      console.error('Start session error:', err);
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  // ✅ KEEP SESSION ALIVE
  const handleKeepAlive = async () => {
    if (!sessionId) return;

    try {
      await avatarAPI.keepSessionAlive(sessionId);
      console.log('✅ Session kept alive');
    } catch (err) {
      console.error('❌ Error keeping session alive:', err);
    }
  };

  // ✅ STOP SESSION
  const handleStopSession = async () => {
    if (!sessionId) {
      setError('No active session to stop');
      return;
    }

    setLoading(true);
    setError(null);
    setIsConnected(false);

    try {
      await avatarAPI.stopSession(sessionId, 'USER_ENDED');

      setSessionData(null);
      setSessionId(null);
      setLivekitUrl(null);
      setLivekitToken(null);

      if (keepAliveInterval.current) {
        clearInterval(keepAliveInterval.current);
      }
    } catch (err) {
      setError(err.message || 'Failed to stop session');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Binds remote avatar video to our <video> once (no flicker)
  const AvatarVideoBinder = () => {
    const tracks = useTracks(
      [{ source: Track.Source.Camera, withPlaceholder: false }],
      { onlySubscribed: true }
    );

    const attachedRef = useRef(false);
    const trackRef = useRef(null);

    // Attach track once when it appears
    useEffect(() => {
      if (!tracks.length || attachedRef.current) return;

      const videoEl = document.getElementById('avatar-video');
      if (!videoEl) return;

      const track = tracks[0]?.publication?.track;
      if (track && track.kind === 'video') {
        track.attach(videoEl);
        trackRef.current = track;
        attachedRef.current = true;
      }
    }, [tracks]);

    // Detach only on unmount
    useEffect(() => {
      return () => {
        const videoEl = document.getElementById('avatar-video');
        if (trackRef.current && videoEl) {
          trackRef.current.detach(videoEl);
        }
      };
    }, []);

    return null;
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ color: 'white' }}>HeyGen Avatar AI Session</h1>

      {/* ✅ AVATAR INFO */}
      {avatarInfo && (
        <div style={avatarInfoBox}>
          <h3>Avatar Info</h3>
          <p>
            <strong>Name:</strong> {avatarInfo.name}
          </p>
          <p>
            <strong>Status:</strong> {avatarInfo.status}
          </p>
          <img
            src={avatarInfo.preview_url}
            alt="Avatar"
            style={{ width: '200px', borderRadius: '8px' }}
          />
        </div>
      )}

      {/* ✅ ERROR */}
      {error && <div style={errorBox}>{error}</div>}

      {/* ✅ CONTROLS */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleStartSession}
          disabled={loading || sessionId}
          style={{
            ...btnStyle,
            backgroundColor: sessionId ? '#555' : '#2563eb',
          }}
        >
          {loading ? 'Starting...' : 'Start Session'}
        </button>

        <button
          onClick={handleStopSession}
          disabled={loading || !sessionId}
          style={{
            ...btnStyle,
            backgroundColor: !sessionId ? '#555' : '#e11d48',
            marginLeft: '10px',
          }}
        >
          {loading ? 'Stopping...' : 'Stop Session'}
        </button>
      </div>

      {/* ✅ SAME PAGE LIVE AVATAR EMBED */}
      {livekitUrl && livekitToken && (
        <div style={avatarBox}>
          <h3 style={{ color: 'white' }}>AI Avatar Live</h3>

          <LiveKitRoom
            key={sessionId} // forces full teardown when session changes
            serverUrl={livekitUrl}
            token={livekitToken}
            connect
            video={false} // no local camera
            audio={true}  // only remote audio
            style={{ height: '400px' }}
          >
            {/* Remote audio output */}
            <RoomAudioRenderer />

            {/* Our custom video element for the avatar */}
            <video
              id="avatar-video"
              autoPlay
              playsInline
              muted={false}
              style={avatarVideo}
            />

            {/* This binds the remote camera track to #avatar-video */}
            <AvatarVideoBinder />
          </LiveKitRoom>
        </div>
      )}
    </div>
  );
};

export default AvatarSession;

/* ✅ STYLES */

const pageStyle = {
  minHeight: '100vh',
  background: '#020617',
  padding: '40px',
  textAlign: 'center',
};

const avatarInfoBox = {
  marginBottom: '20px',
  padding: '15px',
  border: '1px solid #334155',
  borderRadius: '8px',
  background: '#0f172a',
  color: 'white',
  display: 'inline-block',
};

const errorBox = {
  padding: '10px',
  backgroundColor: '#ffebee',
  color: '#c62828',
  borderRadius: '4px',
  marginBottom: '20px',
};

const btnStyle = {
  padding: '12px 20px',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
};

const avatarBox = {
  marginTop: '30px',
  background: '#020617',
  borderRadius: '16px',
  padding: '16px',
};

const avatarVideo = {
  width: '100%',
  height: '100%',
  borderRadius: '12px',
  background: 'black',
};
