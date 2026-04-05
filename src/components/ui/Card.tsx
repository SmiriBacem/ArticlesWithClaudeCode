export type CardVariant = 'primary' | 'light' | 'dark' | 'warning' | 'danger' | 'success'
export type CardSize = 'sm' | 'md' | 'lg'

export interface CardProps {
  variant?: CardVariant
  size?: CardSize
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<CardVariant, string> = {
  primary: 'bg-white border border-indigo-200 shadow-[0_4px_0_0_theme(colors.indigo.200)]',
  light: 'bg-gray-50 border border-gray-200 shadow-[0_4px_0_0_theme(colors.gray.300)]',
  dark: 'bg-gray-800 border border-gray-700 shadow-[0_4px_0_0_theme(colors.gray.950)] text-white',
  warning: 'bg-amber-50 border border-amber-200 shadow-[0_4px_0_0_theme(colors.amber.300)]',
  danger: 'bg-red-50 border border-red-200 shadow-[0_4px_0_0_theme(colors.red.300)]',
  success: 'bg-green-50 border border-green-200 shadow-[0_4px_0_0_theme(colors.green.300)]',
}

const sizeClasses: Record<CardSize, string> = {
  sm: 'p-3 rounded-lg text-sm',
  md: 'p-5 rounded-xl text-base',
  lg: 'p-7 rounded-2xl text-lg',
}

export function Card({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className = '',
}: CardProps) {
  const base = 'transition-all'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onClick={!disabled ? onClick : undefined}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim()}
      aria-disabled={disabled || undefined}
    >
      {children}
    </div>
  )
}
