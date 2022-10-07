import './App.css';
import Apply from './features/apply/Apply';
import { Frame } from './features/frame/Frame';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from './features/main/Main';
import Progress from './features/apply/Progress';

const App: React.FC = () => {
  return (
    <Frame>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/:bvid" element={<Progress />} />
      </Routes>
    </Frame>
  );
}

export default App;