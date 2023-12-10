import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Exam from './components/Exam/Exam';
import ShowResult from './components/ShowResult/ShowResult';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: 'white' }}>
        <Routes>
          <Route path="/" element={<Exam />} />
          <Route path="/show-resut" element={<ShowResult />} />
          {/* Add more Route components for other routes */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
