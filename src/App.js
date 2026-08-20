import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Host from "./Host";
import Project from "./Project";

import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>🎯 Clue Battle</h1>
      <p>Select your mode</p>

      <div className="home-buttons">
        <button onClick={() => navigate("/host")}>
          🎤 Host
        </button>

        <button onClick={() => navigate("/project")}>
          🎮 Project
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/Clue_Battle">
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/host" element={<Host />} />

        <Route path="/project" element={<Project />} />

        <Route path="*" element={<Home />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;