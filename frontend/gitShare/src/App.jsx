import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import GitShareDashboard from './pages/dashboard'
import Auth from './pages/userAuth'
import CreateSnippet from './pages/createSnippet'

function App() {
  return ( 
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<GitShareDashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create" element={<CreateSnippet />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App
