// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainShell from './components/layout/MainShell';
import IntroScreen from './screens/IntroScreen';
import ChoosePathScreen from './screens/ChoosePathScreen';
import ShowreelScreen from './screens/ShowreelScreen';
import DemoSelectorScreen from './screens/DemoSelectorScreen';
import DemoViewScreen from './screens/DemoViewScreen';

import AvatarSession from './screens/AvatarSession';
import AvatarRoomPage from './screens/AvatarRoomPage';

export default function App() {
  return (
    <MainShell>
      <Routes>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/showreel" element={<ShowreelScreen />} />
        <Route path="/show-demo" element={<ChoosePathScreen />} />
        <Route path="/choose-demo" element={<DemoSelectorScreen />} />
        <Route path="/demo-view" element={<DemoViewScreen />} />

        {/* New HeyGen routes */}
        <Route path="/avatar-session" element={<AvatarSession />} />
        <Route path="/avatar-room" element={<AvatarRoomPage />} />
      </Routes>
    </MainShell>
  );
}
