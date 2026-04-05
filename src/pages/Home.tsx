import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import ArticleCard from '../components/ui/ArticleCard'
import BlogCard from '../components/ui/BlogCard'
import { Link } from 'react-router-dom'

// --- Weather ---
interface WeatherData {
  current: {
    temperature_2m: number
    wind_speed_10m: number
    weather_code: number
  }
}

const weatherIcon = (code: number): string => {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

const weatherDesc = (code: number): string => {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 55) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Rain showers'
  return 'Thunderstorm'
}

// --- Stocks (static demo data) ---
const STOCKS = [
  { symbol: 'AAPL', name: 'Apple', price: 189.45, change: +1.23 },
  { symbol: 'MSFT', name: 'Microsoft', price: 415.20, change: -0.87 },
  { symbol: 'GOOGL', name: 'Google', price: 175.30, change: +2.10 },
  { symbol: 'AMZN', name: 'Amazon', price: 198.75, change: +0.54 },
  { symbol: 'NVDA', name: 'Nvidia', price: 875.60, change: -3.20 },
  { symbol: 'TSLA', name: 'Tesla', price: 242.10, change: +5.40 },
]

const CURRENCY_PAIRS = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF']

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
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [currencies, setCurrencies] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    // Paris coords as default
    fetch('https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto')
      .then((r) => r.json())
      .then(setWeather)
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((r) => r.json())
      .then((data) => setCurrencies(data.rates))
      .catch(() => {})
  }, [])

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

      {/* Live Data Row */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-sm border border-blue-200">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-3">Weather · Paris</h3>
          {weather ? (
            <div className="flex items-center gap-4">
              <span className="text-5xl">{weatherIcon(weather.current.weather_code)}</span>
              <div>
                <p className="text-3xl font-bold text-gray-900">{Math.round(weather.current.temperature_2m)}°C</p>
                <p className="text-sm text-gray-500">{weatherDesc(weather.current.weather_code)}</p>
                <p className="text-xs text-gray-400 mt-1">Wind {Math.round(weather.current.wind_speed_10m)} km/h</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Loading…</p>
          )}
        </div>

        {/* Currencies */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 shadow-sm border border-green-200">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-3">Currencies · vs USD</h3>
          {currencies ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {CURRENCY_PAIRS.map((cur) => (
                <div key={cur} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{cur}</span>
                  <span className="text-gray-500">{currencies[cur]?.toFixed(3)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Loading…</p>
          )}
        </div>

        {/* Stocks */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 shadow-sm border border-purple-200">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-500 mb-3">Stocks <span className="normal-case font-normal text-gray-400">(demo)</span></h3>
          <div className="flex flex-col gap-1">
            {STOCKS.map((s) => (
              <div key={s.symbol} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-semibold text-gray-800">{s.symbol}</span>
                  <span className="text-gray-400 text-xs ml-1">{s.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-700">${s.price.toFixed(2)}</span>
                  <span className={`ml-2 text-xs font-semibold ${s.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
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
