import Icon from '../globalComponents/Icon'
import CodeBlock from './CodeBlock'
import TagBadge from './TagBadge'
import './SnippetCard.css'

function SnippetCard({ title, code, tags, date }) {
  return (
    <article className="snippet-card">
      <div className="snippet-card__header">
        <h3 className="snippet-card__title">{title}</h3>
        <div className="snippet-card__actions">
          <button
            type="button"
            className="snippet-card__action"
            aria-label={`Edit ${title}`}
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            className="snippet-card__action"
            aria-label={`Copy ${title}`}
          >
            <Icon name="copy" size={14} />
          </button>
        </div>
      </div>

      <CodeBlock code={code} />

      <div className="snippet-card__footer">
        <div className="snippet-card__tags">
          {tags.map((tag) => (
            <TagBadge key={tag.label} label={tag.label} variant={tag.variant} />
          ))}
        </div>
        <time className="snippet-card__date" dateTime={date}>
          {date}
        </time>
      </div>
    </article>
  )
}

export default SnippetCard
