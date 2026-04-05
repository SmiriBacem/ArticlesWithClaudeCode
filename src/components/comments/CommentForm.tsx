import { useState } from 'react';
import Button from '../ui/Button';
import { validateComment } from '../../utils/validators';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  parentCommentAuthor?: string;
}

export const CommentForm = ({
  onSubmit,
  isSubmitting,
  placeholder = 'Write a comment...',
  parentCommentAuthor,
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateComment(content);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-4">
      {parentCommentAuthor && (
        <p className="text-sm text-gray-600 mb-3">
          Replying to <span className="font-medium">@{parentCommentAuthor}</span>
        </p>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mb-3"
      />

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="flex justify-end gap-2">
        {content.trim() && (
          <Button
            type="button"
            variant="light"
            onClick={() => {
              setContent('');
              setError('');
            }}
          >
            Clear
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
};
