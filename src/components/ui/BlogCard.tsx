import Avatar from './Avatar'

interface BlogCardProps {
  title: string
  excerpt: string
  image: string
  author: string
  avatar: string
  date: string
  tag: string
  readTime: string
}

export default function BlogCard({
  title,
  excerpt,
  image,
  author,
  avatar,
  date,
  tag,
  readTime,
}: BlogCardProps) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-52 object-cover" />
        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {tag}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
        <p className="text-gray-500 text-sm flex-1 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <Avatar src={avatar} name={author} size="sm" />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{date}</span>
            <span>·</span>
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
