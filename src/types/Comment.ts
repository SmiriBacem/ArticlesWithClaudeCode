export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  parentCommentId?: string;
  depth: 0 | 1 | 2;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
  replies?: Comment[];
  replyCount?: number;
}

export interface CommentReport {
  id: string;
  commentId: string;
  reportedBy: string;
  reporterName: string;
  reason: 'spam' | 'inappropriate' | 'offensive' | 'other';
  description: string;
  createdAt: Date;
  status: 'open' | 'resolved';
}

export interface ModerationEntry {
  id: string;
  commentId: string;
  reviewedBy?: string;
  reviewerName?: string;
  decision?: 'approved' | 'rejected';
  reason?: string;
  reviewedAt?: Date;
  createdAt: Date;
}
