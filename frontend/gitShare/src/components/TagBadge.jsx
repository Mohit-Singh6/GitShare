import './TagBadge.css'

const tagVariants = {
  blue: 'tag-badge--blue',
  green: 'tag-badge--green',
  purple: 'tag-badge--purple',
  orange: 'tag-badge--orange',
}

function TagBadge({ label, variant = 'blue' }) {
  return (
    <span className={`tag-badge ${tagVariants[variant] ?? tagVariants.blue}`}>
      {label}
    </span>
  )
}

export default TagBadge
