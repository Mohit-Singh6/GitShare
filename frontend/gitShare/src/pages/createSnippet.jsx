import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'
import SnippetCard from '../components/SnippetCard'
import Icon from '../globalComponents/Icon'
import { navTags } from '../data/snippets'
import axios from 'axios';
import '../styles/GitShareDashboard.css'
import '../styles/createSnippet.css'

function CreateSnippet() {
  const [title, setTitle] = useState('');
  const [code_content, setCodeContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // this should be placed at the top of the component, before any conditional logic that might use it to avoid issues with hooks being called conditionally otherwise the navigate function might not be available when you try to use it for redirection after login or if the user is not authenticated. By placing it at the top, you ensure that it's always initialized and ready to be used whenever needed in the component.

  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [token, navigate]);

  const handleSubmit = async () => {
    try {
        if (!title.trim() || !code_content.trim()) {
            alert("Title and Code Content fields cannot be empty!");
            return;
        }

        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const tagsArray = tags.split(',').map(tag => tag.trim());
        console.log("Submitting snippet with data:", { title, code_content, tags: tagsArray });
        const result = await axios.post(`${backendUrl}/snippets`, {
            title,
            code_content,
            tags: tagsArray
        },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        
        // redirect to dashboard page after successful snippet creation
        navigate('/');
        setLoading(false);
    }
    catch (err) {
        console.error("Registration error:", err);
        setLoading(false);
    }
  };


  return (
    <div className="dashboard">
      <Sidebar tags={navTags} username="dev_santos" />

      <div className="dashboard__main">
        <div className="dashboard__auth-container">
          <h2 className="dashboard__auth-title">Create Snippet</h2>
          <input
            type="text"
            placeholder="Title"
            className="dashboard__auth-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Code Content"
            className="dashboard__auth-input"
            value={code_content}
            rows={15}
            onChange={(e) => setCodeContent(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            className="dashboard__auth-input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="dashboard__auth-submit-btn"
          >
            {loading ? 'Processing...' : 'Create Snippet'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateSnippet;