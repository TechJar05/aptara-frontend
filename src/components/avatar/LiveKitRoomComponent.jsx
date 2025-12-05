// src/components/avatar/LiveKitRoomComponent.jsx
import React from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';

const LiveKitRoomComponent = ({ livekitUrl, livekitToken, onDisconnect }) => {
  if (!livekitUrl || !livekitToken) {
    return <p>Missing LiveKit credentials.</p>;
  }

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <LiveKitRoom
        video
        audio
        token={livekitToken}
        serverUrl={livekitUrl}
        connect
        onDisconnected={onDisconnect}
        style={{ height: '100%' }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};

export default LiveKitRoomComponent;
