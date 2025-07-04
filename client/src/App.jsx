import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentList from './pages/StudentList';
import StudentProfile from './pages/StudentProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/student/:id" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
}

export default App;