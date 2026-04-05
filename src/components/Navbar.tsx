import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors underline ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
    }`

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600">MyApp</span>
        <div className="flex gap-2 items-center">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/articles" className={linkClass}>Articles</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>

          {user ? (
            <>
              {(user.role === 'admin' || user.role === 'moderator') && (
                <NavLink to="/admin/moderation" className={linkClass}>
                  Moderation
                </NavLink>
              )}
              <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full"
                  title={`${user.displayName} (${user.role})`}
                />
                <span className="text-sm text-gray-600">{user.displayName}</span>
                <button
                  onClick={logout}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="ml-4 pl-4 border-l border-gray-200 flex gap-2">
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/register" className={linkClass}>Register</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
