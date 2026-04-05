import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { CommentForm } from '../components/comments/CommentForm';
import { CommentThread } from '../components/comments/CommentThread';
import Button from '../components/ui/Button';

// Blog posts data with IDs and slugs
const BLOG_POSTS = [
  {
    id: 'post-1',
    slug: 'building-scalable-apis-nodejs',
    title: 'Building Scalable APIs with Node.js and Express',
    excerpt: 'A practical guide to designing RESTful APIs that handle millions of requests while keeping your codebase clean and maintainable.',
    content: `Building scalable APIs requires careful planning and attention to performance. In this comprehensive guide, we'll explore:

1. **API Design Principles**: RESTful architecture, versioning, and backward compatibility
2. **Database Optimization**: Connection pooling, caching strategies, and query optimization
3. **Rate Limiting & Authentication**: Protecting your API from abuse
4. **Monitoring & Logging**: Understanding what's happening in production
5. **Testing Strategies**: Unit tests, integration tests, and load testing

Node.js and Express provide an excellent foundation for building these systems. They're lightweight, fast, and have a rich ecosystem of middleware and tools.

The key to scalability is thinking about growth early. Consider load balancing, horizontal scaling, and microservices architecture from the start. Start simple, but build with scalability in mind.`,
    image: 'https://picsum.photos/seed/nodejs/600/400',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/40?u=sarah',
    date: 'Mar 28, 2026',
    tag: 'Backend',
    readTime: '8 min read',
  },
  {
    id: 'post-2',
    slug: 'css-grid-vs-flexbox',
    title: 'CSS Grid vs Flexbox: When to Use What',
    excerpt: 'Stop guessing which layout method to reach for. This breakdown covers real-world scenarios to help you pick the right tool every time.',
    content: `CSS has given us powerful layout tools that sometimes feel overlapping. Let's clarify when to use Grid and when to use Flexbox:

**Flexbox** is best for:
- One-dimensional layouts (rows or columns)
- Navigation bars and button groups
- Aligning items along a single axis
- When you want content to flow naturally

**CSS Grid** is best for:
- Two-dimensional layouts
- Complex page layouts
- Defining both rows and columns
- When you need precise control over placement

The good news? You can use both! A card might use Grid for the overall layout and Flexbox inside for aligning content.

Remember: Flexbox is about distribution of space along one axis, Grid is about positioning in two dimensions.`,
    image: 'https://picsum.photos/seed/css-layout/600/400',
    author: 'James Miller',
    avatar: 'https://i.pravatar.cc/40?u=james',
    date: 'Mar 25, 2026',
    tag: 'CSS',
    readTime: '5 min read',
  },
  {
    id: 'post-3',
    slug: 'typescript-generics-guide',
    title: 'Introduction to TypeScript Generics',
    excerpt: 'Generics unlock powerful type-safe patterns in TypeScript. Learn how to write flexible, reusable code without sacrificing type safety.',
    content: `TypeScript generics are one of the most powerful features for writing reusable, type-safe code. Let's explore what they are and how to use them:

**Why Generics?**
Without generics, you'd either lose type information (using any) or write duplicate code for each type.

**Basic Syntax:**
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

The \`<T>\` is a type variable that represents any type. When called, TypeScript infers the type.

**Generic Constraints:**
You can constrain generics to specific types:
\`\`\`typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}
\`\`\`

**Generic Classes and Interfaces:**
Generics work with classes and interfaces too, allowing you to write truly reusable components.

Start simple, and generics will become your best friend for writing clean, type-safe TypeScript.`,
    image: 'https://picsum.photos/seed/typescript/600/400',
    author: 'Aisha Patel',
    avatar: 'https://i.pravatar.cc/40?u=aisha',
    date: 'Mar 22, 2026',
    tag: 'TypeScript',
    readTime: '6 min read',
  },
];

type BlogPost = typeof BLOG_POSTS[0];

export const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  // Use post ID for comments
  const { comments, isLoading, isSubmitting, submitComment, reportComment, approveComment, rejectComment } = useComments(post?.id || '');

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Post not found</h1>
        <Button onClick={() => navigate('/')} variant="primary">
          Back to Home
        </Button>
      </div>
    );
  }

  const handleSubmitComment = async (content: string, parentCommentId?: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    await submitComment(content, user.id, user.displayName, user.avatar, parentCommentId);
  };

  const handleReport = (commentId: string, reason: string, description: string) => {
    if (!user) return;
    reportComment(commentId, user.id, reason, description);
    alert('Comment reported. Thank you for helping keep our community safe!');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Blog Post Header */}
      <article className="mb-12">
        <div className="mb-6">
          <Button onClick={() => navigate('/')} variant="light" className="text-indigo-600 mb-4">
            ← Back
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-medium">{post.author}</p>
              <p className="text-sm">{post.date} • {post.readTime}</p>
            </div>
            {post.tag && (
              <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {post.tag}
              </span>
            )}
          </div>
        </div>

        <img src={post.image} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-8" />

        <div className="prose prose-sm max-w-none mb-8">
          {post.content.split('\n').map((paragraph, idx) => {
            if (!paragraph.trim()) return null;
            if (paragraph.startsWith('#')) {
              const level = paragraph.match(/^#+/)?.[0].length || 2;
              const text = paragraph.replace(/^#+\s/, '');
              return <h2 key={idx} className={`text-${4 - Math.min(level - 2, 1)}xl font-bold my-4`}>{text}</h2>;
            }
            if (paragraph.startsWith('-')) {
              return <li key={idx} className="ml-4 text-gray-700">{paragraph.replace(/^-\s/, '')}</li>;
            }
            if (paragraph.startsWith('`')) {
              return <pre key={idx} className="bg-gray-100 p-4 rounded overflow-x-auto text-sm my-4"><code>{paragraph}</code></pre>;
            }
            return <p key={idx} className="text-gray-700 leading-relaxed mb-4">{paragraph}</p>;
          })}
        </div>
      </article>

      <hr className="my-12" />

      {/* Comments Section */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Comments ({comments.length})</h2>

        {/* Comment Form */}
        {user ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">Logged in as <strong>{user.displayName}</strong></p>
            <CommentForm
              onSubmit={(content) => handleSubmitComment(content)}
              isSubmitting={isSubmitting}
              placeholder="What are your thoughts on this post?"
            />
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-gray-700 mb-3">
              <Button to="/login" variant="primary" className="inline">
                Log in
              </Button>
              {' '}to leave a comment
            </p>
          </div>
        )}

        {/* Comments Thread */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading comments...</div>
        ) : (
          <CommentThread
            comments={comments}
            onSubmitReply={handleSubmitComment}
            onReport={handleReport}
            isSubmitting={isSubmitting}
          />
        )}
      </section>
    </div>
  );
};
