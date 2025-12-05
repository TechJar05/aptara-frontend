// src/screens/AvatarRoomPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LiveKitRoomComponent from '../components/avatar/LiveKitRoomComponent';

export default function AvatarRoomPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // We expect navigate('/avatar-room', { state: { livekitUrl, livekitToken } })
  const { livekitUrl, livekitToken } = location.state || {};

  const handleDisconnect = () => {
    // When the user leaves the room, send them back (e.g. to Show Demo)
    navigate('/show-demo');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-2xl font-semibold mb-4 text-[#1d4457]">
        Live Avatar Room
      </h1>

      {!livekitUrl || !livekitToken ? (
        <p className="text-sm text-red-600">
          LiveKit session not found. Please start a session again from the demo
          page.
        </p>
      ) : (
        <LiveKitRoomComponent
          livekitUrl={livekitUrl}
          livekitToken={livekitToken}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
}
