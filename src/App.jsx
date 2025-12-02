// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import MainShell from "./components/layout/MainShell";
import IntroScreen from "./screens/IntroScreen";
import ChoosePathScreen from "./screens/ChoosePathScreen";
import ShowreelScreen from "./screens/ShowreelScreen";
import DemoSelectorScreen from "./screens/DemoSelectorScreen";
import DemoViewScreen from "./screens/DemoViewScreen";

function AppInner() {
  const navigate = useNavigate();

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const resetSelections = () => {
    setSelectedIndustry(null);
    setSelectedLevel(null);
  };

  // Navigation helpers
  const goToIntro = () => {
    resetSelections();
    navigate("/");
  };

  const goToChoosePath = () => {
    resetSelections();
    navigate("/choose-path");
  };

  const goToShowreel = () => {
    resetSelections();
    navigate("/showreel");
  };

  const goToChooseDemo = () => {
    // keep previous selections if you want, or reset:
    // resetSelections();
    navigate("/choose-demo");
  };

  const goToDemoView = () => {
    if (!selectedIndustry || !selectedLevel) return;
    navigate("/demo");
  };

  return (
    <MainShell>
      <Routes>
        {/* INTRO SCREEN – / */}
        <Route
          path="/"
          element={
            <IntroScreen
              onStart={goToChoosePath}
              onSkip={goToChoosePath}
            />
          }
        />

        {/* CHOOSE PATH – /choose-path */}
        <Route
          path="/choose-path"
          element={
            <ChoosePathScreen
              onShowreel={goToShowreel}
              onChooseDemo={goToChooseDemo}
            />
          }
        />

        {/* SHOWREEL – /showreel */}
        <Route
          path="/showreel"
          element={
            <ShowreelScreen
              onBack={goToChoosePath}
              onGoToDemo={goToChooseDemo}
            />
          }
        />

        {/* INDUSTRY + LEVEL SELECTOR – /choose-demo */}
        <Route
          path="/choose-demo"
          element={
            <DemoSelectorScreen
              selectedIndustry={selectedIndustry}
              setSelectedIndustry={setSelectedIndustry}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              onStartDemo={goToDemoView}
            />
          }
        />

        {/* FINAL DEMO VIEW – /demo */}
        <Route
          path="/demo"
          element={
            <DemoViewScreen
              industry={selectedIndustry}
              level={selectedLevel}
              onBackToSelector={goToChooseDemo}
            />
          }
        />

        {/* Fallback: redirect anything unknown to intro */}
        <Route
          path="*"
          element={<IntroScreen onStart={goToChoosePath} onSkip={goToChoosePath} />}
        />
      </Routes>
    </MainShell>
  );
}

export default function App() {
  return <AppInner />;
}
