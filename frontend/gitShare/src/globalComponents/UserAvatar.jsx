import './UserAvatar.css'

function UserAvatar({ name, size = 28 }) {
  const initials = name
    .split('_')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div
      className="user-avatar"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export default UserAvatar
