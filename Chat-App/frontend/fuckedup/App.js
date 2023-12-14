import { Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chatpage" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
