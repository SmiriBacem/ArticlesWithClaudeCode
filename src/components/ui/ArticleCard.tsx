import Avatar from './Avatar'
import Button from './Button'

interface ArticleCardProps {
  title: string
  excerpt: string
  author: string
  avatar: string
  image?: string
  category?: string
  date?: string
  actionLabel?: string
}

export default function ArticleCard({
  title,
  excerpt,
  author,
  avatar,
  image,
  category,
  date,
  actionLabel,
}: ArticleCardProps) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      {image && (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {category && (
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
            {category}
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 text-sm flex-1">{excerpt}</p>
        <div className="flex items-center justify-between mt-2">
          <Avatar src={avatar} name={author} size="sm" />
          {actionLabel && <Button variant="link">{actionLabel}</Button>}
        </div>
        {date && <span className="text-xs text-gray-400">{date}</span>}
      </div>
    </article>
  )
}
