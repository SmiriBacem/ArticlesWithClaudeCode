import { useState } from 'react';
import { Comment, CommentStatus } from '../../types/Comment';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { ReportModal } from './ReportModal';

const formatTimeAgo = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

interface CommentCardProps {
  comment: Comment;
  onReply?: (parentId: string) => void;
  onReport?: (commentId: string, reason: string, description: string) => void;
  onApprove?: (commentId: string) => void;
  onReject?: (commentId: string) => void;
  isInModerationView?: boolean;
}

const getStatusBadgeColor = (status: CommentStatus): string => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'hidden':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const CommentCard = ({
  comment,
  onReply,
  onReport,
  onApprove,
  onReject,
  isInModerationView,
}: CommentCardProps) => {
  const { user } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const isOwner = user?.id === comment.authorId;
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const handleReportSubmit = (reason: string, description: string) => {
    if (onReport) {
      onReport(comment.id, reason, description);
      setShowReportModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm" name={comment.authorName} src={comment.authorAvatar} />
          <div>
            <p className="font-medium text-gray-900">{comment.authorName}</p>
            <p className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</p>
          </div>
        </div>
        {comment.status !== 'approved' && (
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(comment.status)}`}>
            {comment.status}
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4 text-sm leading-relaxed">{comment.content}</p>

      <div className="flex items-center gap-2">
        {/* Reply button (only up to depth 1) */}
        {comment.depth < 2 && onReply && !isInModerationView && (
          <Button
            variant="light"
            className="text-xs py-1 px-2"
            onClick={() => onReply(comment.id)}
          >
            Reply
          </Button>
        )}

        {/* Report button */}
        {!isOwner && !isAdmin && !isInModerationView && (
          <Button
            variant="light"
            className="text-xs py-1 px-2 text-red-600 hover:text-red-700"
            onClick={() => setShowReportModal(true)}
          >
            Report
          </Button>
        )}

        {/* Admin actions */}
        {isAdmin && isInModerationView && comment.status === 'pending' && (
          <>
            <Button
              variant="light"
              className="text-xs py-1 px-2 text-green-600 hover:text-green-700"
              onClick={() => onApprove?.(comment.id)}
            >
              Approve
            </Button>
            <Button
              variant="light"
              className="text-xs py-1 px-2 text-red-600 hover:text-red-700"
              onClick={() => onReject?.(comment.id)}
            >
              Reject
            </Button>
          </>
        )}
      </div>

      {showReportModal && (
        <ReportModal
          commentId={comment.id}
          onSubmit={handleReportSubmit}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
