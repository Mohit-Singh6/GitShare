import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import GitShareDashboard from './pages/dashboard'

function App() {
  return ( 
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<GitShareDashboard />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          

        </Routes>
    </BrowserRouter>
  );
}

export default App
