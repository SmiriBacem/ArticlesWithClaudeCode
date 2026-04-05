import Button from '../components/ui/Button'
import ArticleCard from '../components/ui/ArticleCard'
import BlogCard from '../components/ui/BlogCard'
import { Link } from 'react-router-dom'

const news = [
  {
    title: 'AI Revolution: What 2026 Holds for Tech',
    summary: 'Artificial intelligence continues to reshape industries worldwide as new breakthroughs emerge.',
    image: 'https://picsum.photos/seed/ai-tech/600/400',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/40?u=sarah',
  },
  {
    title: 'Climate Summit Reaches Historic Agreement',
    summary: 'World leaders commit to ambitious new targets for carbon reduction at the global climate conference.',
    image: 'https://picsum.photos/seed/climate/600/400',
    author: 'James Miller',
    avatar: 'https://i.pravatar.cc/40?u=james',
  },
  {
    title: 'Space Exploration Enters a New Era',
    summary: 'Private companies and agencies announce bold missions planned for the next decade.',
    image: 'https://picsum.photos/seed/space/600/400',
    author: 'Aisha Patel',
    avatar: 'https://i.pravatar.cc/40?u=aisha',
  },
  {
    title: 'The Future of Remote Work',
    summary: 'New studies reveal how hybrid work models are transforming productivity and employee well-being.',
    image: 'https://picsum.photos/seed/remote-work/600/400',
    author: 'David Kim',
    avatar: 'https://i.pravatar.cc/40?u=david',
  },
]

const blogPosts = [
  {
    slug: 'building-scalable-apis-nodejs',
    title: 'Building Scalable APIs with Node.js and Express',
    excerpt: 'A practical guide to designing RESTful APIs that handle millions of requests while keeping your codebase clean and maintainable.',
    image: 'https://picsum.photos/seed/nodejs/600/400',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/40?u=sarah',
    date: 'Mar 28, 2026',
    tag: 'Backend',
    readTime: '8 min read',
  },
  {
    slug: 'css-grid-vs-flexbox',
    title: 'CSS Grid vs Flexbox: When to Use What',
    excerpt: 'Stop guessing which layout method to reach for. This breakdown covers real-world scenarios to help you pick the right tool every time.',
    image: 'https://picsum.photos/seed/css-layout/600/400',
    author: 'James Miller',
    avatar: 'https://i.pravatar.cc/40?u=james',
    date: 'Mar 25, 2026',
    tag: 'CSS',
    readTime: '5 min read',
  },
  {
    slug: 'typescript-generics-guide',
    title: 'Introduction to TypeScript Generics',
    excerpt: 'Generics unlock powerful type-safe patterns in TypeScript. Learn how to write flexible, reusable code without sacrificing type safety.',
    image: 'https://picsum.photos/seed/typescript/600/400',
    author: 'Aisha Patel',
    avatar: 'https://i.pravatar.cc/40?u=aisha',
    date: 'Mar 22, 2026',
    tag: 'TypeScript',
    readTime: '6 min read',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col items-center py-20 gap-12">
      <div className="text-center flex flex-col gap-6">
        <h1 className="text-5xl font-bold text-gray-900">Welcome to MyApp</h1>
        <p className="text-lg text-gray-500 max-w-xl">
          A simple React app with Tailwind CSS and React Router. Browse our
          articles or explore the content we have to offer.
        </p>
        <Button to="/articles">Browse Articles</Button>
      </div>

      <div className="w-full flex flex-col lg:flex-row">
        <section className="lg:w-2/3 lg:pr-8 lg:border-r border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {news.map((item) => (
              <ArticleCard
                key={item.title}
                title={item.title}
                excerpt={item.summary}
                image={item.image}
                author={item.author}
                avatar={item.avatar}
              />
            ))}
          </div>
        </section>

        <aside className="lg:w-1/3 lg:pl-8 mt-8 lg:mt-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">From the Blog</h2>
          <div className="flex flex-col gap-5">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="hover:opacity-80 transition">
                <BlogCard
                  title={post.title}
                  excerpt={post.excerpt}
                  image={post.image}
                  author={post.author}
                  avatar={post.avatar}
                  date={post.date}
                  tag={post.tag}
                  readTime={post.readTime}
                />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
