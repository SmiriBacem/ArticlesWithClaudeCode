import ArticleCard from '../components/ui/ArticleCard'

const articles = [
  {
    id: 1,
    title: 'Getting Started with React',
    date: 'March 20, 2026',
    category: 'React',
    excerpt: 'Learn the fundamentals of React and start building modern user interfaces with components, props, and state.',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/40?u=sarah',
  },
  {
    id: 2,
    title: 'Mastering Tailwind CSS',
    date: 'March 22, 2026',
    category: 'CSS',
    excerpt: 'Discover how utility-first CSS with Tailwind can speed up your workflow and help you build beautiful UIs faster.',
    author: 'James Miller',
    avatar: 'https://i.pravatar.cc/40?u=james',
  },
  {
    id: 3,
    title: 'React Router in Depth',
    date: 'March 25, 2026',
    category: 'React',
    excerpt: 'Understand client-side routing with React Router — nested routes, loaders, and navigation patterns explained.',
    author: 'Aisha Patel',
    avatar: 'https://i.pravatar.cc/40?u=aisha',
  },
  {
    id: 4,
    title: 'State Management Patterns',
    date: 'March 27, 2026',
    category: 'React',
    excerpt: 'Explore different approaches to managing state in React apps, from useState and useReducer to external libraries.',
    author: 'David Kim',
    avatar: 'https://i.pravatar.cc/40?u=david',
  },
]

export default function Articles() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Articles</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            author={article.author}
            avatar={article.avatar}
            category={article.category}
            date={article.date}
            actionLabel="Read more →"
          />
        ))}
      </div>
    </div>
  )
}
