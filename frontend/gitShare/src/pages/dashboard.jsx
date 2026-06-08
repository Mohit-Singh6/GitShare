import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'
import SnippetCard from '../components/SnippetCard'
import Icon from '../globalComponents/Icon'
import { navTags } from '../data/snippets'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/GitShareDashboard.css'

function GitShareDashboard() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');

  const token = localStorage.getItem('token');
  if (!token) {
    // If no token is found, redirect to the login page
    const navigate = useNavigate();
    navigate('/auth');
  }

  useEffect(() => {
    getAllSnippets();
  }, []) // By wrapping it in useEffect with an empty dependency array [] at the bottom, you are telling React:

    // "Run this function exactly one time when this component first pops up on the screen, and then never run it again until the user refreshes the page."

  const getAllSnippets = async () => {
      try {
        const token = localStorage.getItem('token');

        
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const result = await axios.get(`${backendUrl}/snippets`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSnippets(result.data.snippets);
        console.log("Fetched snippets:", result.data.snippets);
        setLoading(false);
      }
      catch (err) {
        console.error("Error fetching all snippets:", err);
        setLoading(false);
      }
  }

  const getSnippetById = async (id) => {
    try {
      // If the search input is empty, reset back to show all snippets instead of crashing
      if (!id.trim()) return getAllSnippets();

      const token = localStorage.getItem('token');
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      const result = await axios.get(`${backendUrl}/snippets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Wrap the single returned snippet inside an array so the .map() loop doesn't break!
      setSnippets([result.data.snippet]);
      console.log("Fetched snippet by ID:", result.data.snippet);
      setSearchId('');
      setLoading(false);
    }
    catch (err) {
      console.error("Error fetching snippet by ID:", err);
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <Sidebar tags={navTags} username="dev_santos" />

      <div className="dashboard__main">
        <header className="dashboard__header">
          <div className="dashboard__title-group">
            <h1 className="dashboard__title">All Snippets</h1>
            <span className="dashboard__count" aria-label="snippets">
              {loading ? 'Loading...' : `${snippets.length} snippet${snippets.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div className="dashboard__controls">
            <div
              className="dashboard__search"
              role="search"
              aria-label="Search snippets"
            >
              <input 
                onChange={(e) => setSearchId(e.target.value)} 
                value={searchId}
                type="search"
                className="dashboard__search-input"
                placeholder="Search by exact ID..."
                aria-label="Search snippets"
              />
              <button 
                onClick={() => getSnippetById(searchId)}
                type="button"
                className="dashboard__search-btn"
                aria-label="Submit search"
              >
                Search
                <Icon name="arrow-right" size={14} />
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard__grid">
          {snippets.map((snippet) => (
            <SnippetCard
              id={snippet.id}
              title={snippet.title}
              code={snippet.code_content}
              date={snippet.created_at}
            />
          ))}
        </main>
      </div>
    </div>
  )
}

export default GitShareDashboard;