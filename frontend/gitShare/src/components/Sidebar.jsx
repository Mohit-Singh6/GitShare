import Icon from '../globalComponents/Icon'
import UserAvatar from '../globalComponents/UserAvatar'
import { useNavigate } from 'react-router-dom';
import './Sidebar.css'

function Sidebar({ tags, username }) {
  // const [tags, setTags] = useState(tags);

  const navigate = useNavigate();

  const handleNewSnippet = () => {
    navigate('/create');
  }

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="sidebar__brand">
        <Icon name="code-2" size={18} className="sidebar__brand-icon" />
        <span className="sidebar__brand-name">GitShare</span>
      </div>

      <div className="sidebar__cta">
        <button type="button" className="sidebar__new-btn" onClick={handleNewSnippet}>
          <Icon name="plus" size={15} />
          New Snippet
        </button>
      </div>

      <nav className="sidebar__nav" aria-label="Filter by tag">
        <p className="sidebar__nav-label">Tags</p>
        {tags.map((tag) => (
          <button
            key={tag.label}
            type="button"
            className={`sidebar__nav-item${tag.active ? ' sidebar__nav-item--active' : ''}`}
            aria-current={tag.active ? 'page' : undefined}
          >
            {tag.label}
          </button>
        ))}
      </nav>

      <div className="sidebar__user">
        <UserAvatar name={username} size={28} />
        <span className="sidebar__username">{username}</span>
        <button
          type="button"
          className="sidebar__logout"
          aria-label="Log out"
        >
          <Icon name="log-out" size={15} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
