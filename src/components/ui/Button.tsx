import { Link } from 'react-router-dom'

type ButtonProps = {
  variant?: 'primary' | 'link' | 'light' | 'dark' | 'warning' | 'danger' | 'success'
  to?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const shared = 'px-6 py-3 rounded-xl font-medium uppercase tracking-wider text-white transition-all active:translate-y-1 active:shadow-none cursor-pointer'

const base = {
  primary: `${shared} bg-indigo-500 shadow-[0_6px_0_0_theme(colors.indigo.700)] hover:shadow-[0_4px_0_0_theme(colors.indigo.700)]`,
  link: 'text-sm text-indigo-600 font-medium hover:underline',
  light: `${shared} bg-gray-100 !text-black shadow-[0_6px_0_0_theme(colors.gray.400)] hover:shadow-[0_4px_0_0_theme(colors.gray.400)]`,
  dark: `${shared} bg-gray-800 shadow-[0_6px_0_0_theme(colors.gray.950)] hover:shadow-[0_4px_0_0_theme(colors.gray.950)]`,
  warning: `${shared} bg-amber-500 shadow-[0_6px_0_0_theme(colors.amber.700)] hover:shadow-[0_4px_0_0_theme(colors.amber.700)]`,
  danger: `${shared} bg-red-500 shadow-[0_6px_0_0_theme(colors.red.700)] hover:shadow-[0_4px_0_0_theme(colors.red.700)]`,
  success: `${shared} bg-green-500 shadow-[0_6px_0_0_theme(colors.green.700)] hover:shadow-[0_4px_0_0_theme(colors.green.700)]`,
}

export default function Button({ variant = 'primary', to, onClick, children, className = '' }: ButtonProps) {
  const classes = `${base[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
