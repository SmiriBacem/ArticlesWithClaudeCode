import { useState, useEffect, useCallback } from 'react';
import { Comment } from '../types/Comment';
import { commentService } from '../services/commentService';
import { realtimeService } from '../services/realtimeService';

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial comments
  useEffect(() => {
    setIsLoading(true);
    try {
      const loadedComments = commentService.getComments(postId);
      setComments(loadedComments);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe('comment:new', postId, () => {
      try {
        const updatedComments = commentService.getComments(postId);
        setComments(updatedComments);
      } catch (err) {
        console.error('Failed to refresh comments:', err);
      }
    });

    return unsubscribe;
  }, [postId]);

  const submitComment = useCallback(
    async (content: string, authorId: string, authorName: string, authorAvatar: string | undefined, parentCommentId?: string) => {
      setIsSubmitting(true);
      try {
        const newComment = commentService.submitComment(postId, content, authorId, authorName, authorAvatar, parentCommentId);

        // Emit real-time event
        realtimeService.emit('comment:new', postId, newComment);

        // Reload comments (in real app, would just add the new comment)
        const updatedComments = commentService.getComments(postId);
        setComments(updatedComments);

        return { success: true };
      } catch (err) {
        const errorMsg = 'Failed to submit comment';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsSubmitting(false);
      }
    },
    [postId]
  );

  const getPendingComments = useCallback(() => {
    return commentService.getPendingComments();
  }, []);

  const approveComment = useCallback((commentId: string, moderatorId: string) => {
    const updated = commentService.updateCommentStatus(commentId, 'approved', undefined, moderatorId);
    realtimeService.emit('comment:status:changed', postId, { commentId, status: 'approved' });
    return updated;
  }, [postId]);

  const rejectComment = useCallback((commentId: string, reason: string, moderatorId: string) => {
    const updated = commentService.updateCommentStatus(commentId, 'rejected', reason, moderatorId);
    realtimeService.emit('comment:status:changed', postId, { commentId, status: 'rejected' });
    return updated;
  }, [postId]);

  const reportComment = useCallback((commentId: string, reportedBy: string, reason: string, description: string) => {
    const report = commentService.reportComment(commentId, reportedBy, reason as any, description);
    realtimeService.emit('comment:reported', postId, { commentId, report });
    return report;
  }, [postId]);

  return {
    comments,
    isLoading,
    isSubmitting,
    error,
    submitComment,
    getPendingComments,
    approveComment,
    rejectComment,
    reportComment,
  };
};
