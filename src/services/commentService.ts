import { Comment, CommentStatus, CommentReport, ModerationEntry } from '../types/Comment';
import { spamService } from './spamService';
import { authService } from './authService';

const COMMENTS_STORAGE_KEY = 'comment_system_comments';
const REPORTS_STORAGE_KEY = 'comment_system_reports';
const MODERATION_STORAGE_KEY = 'comment_system_moderation';

interface StoredComment extends Comment {
  spamScore: number;
}

const generateId = (): string => `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const getStoredComments = (): StoredComment[] => {
  const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveComments = (comments: StoredComment[]): void => {
  localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
};

const getStoredReports = (): CommentReport[] => {
  const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveReports = (reports: CommentReport[]): void => {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
};

const getStoredModeration = (): ModerationEntry[] => {
  const stored = localStorage.getItem(MODERATION_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveModeration = (entries: ModerationEntry[]): void => {
  localStorage.setItem(MODERATION_STORAGE_KEY, JSON.stringify(entries));
};

const buildCommentTree = (comments: StoredComment[], parentId?: string): Comment[] => {
  return comments
    .filter((c) => (parentId ? c.parentCommentId === parentId : !c.parentCommentId))
    .map((c) => ({
      ...c,
      replies: buildCommentTree(comments, c.id),
    }));
};

export const commentService = {
  submitComment: (postId: string, content: string, authorId: string, authorName: string, authorAvatar: string | undefined, parentCommentId?: string): Comment => {
    const comments = getStoredComments();

    // Determine depth
    let depth: 0 | 1 | 2 = 0;
    if (parentCommentId) {
      const parentComment = comments.find((c) => c.id === parentCommentId);
      if (parentComment) {
        depth = Math.min(parentComment.depth + 1, 2) as 0 | 1 | 2;
      }
    }

    // Get user email for spam checking
    const user = authService.getUserById(authorId);
    const email = user?.email || 'unknown@example.com';

    // Check spam
    const spamScore = spamService.checkSpam(content, email);
    const status: CommentStatus = spamScore > 0.7 ? 'pending' : 'approved';

    const newComment: StoredComment = {
      id: generateId(),
      postId,
      authorId,
      authorName,
      authorAvatar,
      content,
      parentCommentId,
      depth,
      status,
      spamScore,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    comments.push(newComment);
    saveComments(comments);

    // Create moderation entry
    const moderationEntries = getStoredModeration();
    const modEntry: ModerationEntry = {
      id: generateId(),
      commentId: newComment.id,
      createdAt: new Date(),
    };
    moderationEntries.push(modEntry);
    saveModeration(moderationEntries);

    const { spamScore: _, ...commentWithoutScore } = newComment;
    return commentWithoutScore;
  },

  getComments: (postId: string): Comment[] => {
    const comments = getStoredComments().filter((c) => c.postId === postId && c.status === 'approved');
    return buildCommentTree(comments);
  },

  getCommentById: (commentId: string): Comment | null => {
    const comments = getStoredComments();
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      const { spamScore: _, ...commentWithoutScore } = comment;
      return commentWithoutScore;
    }
    return null;
  },

  updateCommentStatus: (commentId: string, status: CommentStatus, reason?: string, moderatorId?: string): Comment | null => {
    const comments = getStoredComments();
    const comment = comments.find((c) => c.id === commentId);

    if (!comment) return null;

    comment.status = status;
    comment.updatedAt = new Date();
    saveComments(comments);

    // Update moderation entry
    const moderationEntries = getStoredModeration();
    const modEntry = moderationEntries.find((e) => e.commentId === commentId);
    if (modEntry) {
      modEntry.reviewedBy = moderatorId;
      if (moderatorId) {
        const user = authService.getUserById(moderatorId);
        if (user) modEntry.reviewerName = user.displayName;
      }
      modEntry.decision = status === 'approved' ? 'approved' : 'rejected';
      modEntry.reason = reason;
      modEntry.reviewedAt = new Date();
    }
    saveModeration(moderationEntries);

    const { spamScore: _, ...commentWithoutScore } = comment;
    return commentWithoutScore;
  },

  getPendingComments: (): Comment[] => {
    const comments = getStoredComments().filter((c) => c.status === 'pending');
    return comments.map(({ spamScore: _, ...c }) => c);
  },

  reportComment: (commentId: string, reportedBy: string, reason: 'spam' | 'inappropriate' | 'offensive' | 'other', description: string): CommentReport => {
    const reports = getStoredReports();
    const user = authService.getUserById(reportedBy);

    const newReport: CommentReport = {
      id: generateId(),
      commentId,
      reportedBy,
      reporterName: user?.displayName || 'Anonymous',
      reason,
      description,
      createdAt: new Date(),
      status: 'open',
    };

    reports.push(newReport);
    saveReports(reports);

    return newReport;
  },

  getCommentReports: (): CommentReport[] => {
    return getStoredReports();
  },

  resolveReport: (reportId: string): CommentReport | null => {
    const reports = getStoredReports();
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      report.status = 'resolved';
      saveReports(reports);
      return report;
    }
    return null;
  },
};
