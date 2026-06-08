import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'
import SnippetCard from '../components/SnippetCard'
import Icon from '../globalComponents/Icon'
import { navTags } from '../data/snippets'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/GitShareDashboard.css'
import '../styles/UserAuth.css'

function GitShareDashboard() {
  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // this should be placed at the top of the component, before any conditional logic that might use it to avoid issues with hooks being called conditionally otherwise the navigate function might not be available when you try to use it for redirection after login or if the user is not authenticated. By placing it at the top, you ensure that it's always initialized and ready to be used whenever needed in the component.


  const handleRegister = async () => {
    try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const result = await axios.post(`${backendUrl}/users/register`, {
            username,
            password
        });
        
        // redirect to login page by toggling state to show login form instead of registration form
        setRegistering(false);
        setLoading(false);
    }
    catch (err) {
        console.error("Registration error:", err);
        setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const result = await axios.post(`${backendUrl}/users/login`, {
            username,
            password
        });
        console.log("Login response:", result.data);
        localStorage.setItem('token', result.data.accessToken);

        console.log("Login successful, token stored:", result.data.accessToken);

        setLoading(false);
        // Redirect to dashboard after successful login
        navigate('/');
    }
    catch (err) {
        console.error("Login error:", err);
        setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <Sidebar tags={navTags} username="dev_santos" />

      <div className="dashboard__main">
        <div className="dashboard__auth-container">
          <h2 className="dashboard__auth-title">{registering ? 'Register' : 'Login'}</h2>
          <input
            type="text"
            placeholder="Username"
            className="dashboard__auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="dashboard__auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="dashboard__auth-toggle">
            {registering ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="dashboard__auth-toggle-btn"
              onClick={() => setRegistering(!registering)}
            >
              {registering ? 'Login here' : 'Register here'}
            </button>
          </p>
          <button
            onClick={registering ? handleRegister : handleLogin}
            disabled={loading}
            className="dashboard__auth-submit-btn"
          >
            {loading ? 'Processing...' : registering ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GitShareDashboard;