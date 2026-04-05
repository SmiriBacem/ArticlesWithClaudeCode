import { useState } from 'react';
import { Comment } from '../../types/Comment';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';

interface CommentThreadProps {
  comments: Comment[];
  onSubmitReply: (parentId: string | undefined, content: string) => void;
  onReport: (commentId: string, reason: string, description: string) => void;
  onApprove?: (commentId: string) => void;
  onReject?: (commentId: string) => void;
  isSubmitting?: boolean;
  isInModerationView?: boolean;
}

export const CommentThread = ({
  comments,
  onSubmitReply,
  onReport,
  onApprove,
  onReject,
  isSubmitting,
  isInModerationView,
}: CommentThreadProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReplySubmit = (parentId: string, content: string) => {
    onSubmitReply(parentId, content);
    setReplyingTo(null);
  };

  const renderCommentWithReplies = (comment: Comment) => (
    <div key={comment.id} className="space-y-3">
      <CommentCard
        comment={comment}
        onReply={() => setReplyingTo(comment.id)}
        onReport={onReport}
        onApprove={onApprove}
        onReject={onReject}
        isInModerationView={isInModerationView}
      />

      {replyingTo === comment.id && !isInModerationView && (
        <div className="ml-4 border-l-2 border-indigo-300 pl-4">
          <CommentForm
            onSubmit={(content) => handleReplySubmit(comment.id, content)}
            isSubmitting={isSubmitting}
            placeholder={`Reply to @${comment.authorName}...`}
            parentCommentAuthor={comment.authorName}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
          {comment.replies.map((reply) => renderCommentWithReplies(reply))}
        </div>
      )}
    </div>
  );

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. {!isInModerationView && "Be the first to share your thoughts!"}</p>
      </div>
    );
  }

  return <div className="space-y-4">{comments.map((comment) => renderCommentWithReplies(comment))}</div>;
};
