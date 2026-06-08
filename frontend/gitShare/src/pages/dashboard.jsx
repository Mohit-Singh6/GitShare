import Sidebar from '../components/Sidebar'
import SnippetCard from '../components/SnippetCard'
import Icon from '../globalComponents/Icon'
import { navTags } from '../data/snippets'
import axios from 'axios';
import '../styles/GitShareDashboard.css'

function GitShareDashboard() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllSnippets = async () => {
      try {
        const token = localStorage.getItem('token');

        const backendUrl = import.meta.env.BACKEND_URL;
        const result = await axios.get(`${backendUrl}/snippets`, {
          headers: {
            // Pass your JWT token in the authorization header
            'Authorization': `Bearer ${token}`
          }
        });
        setSnippets(result.data);
        setLoading(false);
      }
      catch (err) {
        console.log(err);
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
              24
            </span>
          </div>

          <div className="dashboard__controls">
            <div
              className="dashboard__search"
              role="search"
              aria-label="Search snippets"
            >
              <Icon name="search" size={14} />
              <span className="dashboard__search-placeholder">
                Search snippets...
              </span>
            </div>

            
          </div>
        </header>

        <main className="dashboard__grid">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              title={snippet.title}
              code={snippet.code}
              tags={snippet.tags}
              date={snippet.date}
            />
          ))}
        </main>
      </div>
    </div>
  )
}

export default GitShareDashboard
