import "./App.css";
import Apply from "./features/apply/Apply";
import { Frame } from "./features/frame/Frame";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Main from "./features/main/Main";
import ApplyStatus from "./features/apply/ApplyStatus";
import Auth from "./features/auth/Auth";
import Audit from "./features/audit/Audit";
import Board from "./features/board/Board";

const App: React.FC = () => {
  return (
    <Frame>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/board" element={<Board />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/:bvid" element={<ApplyStatus />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/audit" element={<Audit />} />
      </Routes>
    </Frame>
  );
};

export default App;

