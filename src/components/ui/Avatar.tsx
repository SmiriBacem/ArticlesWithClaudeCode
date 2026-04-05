interface AvatarProps {
  src: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  )
}
