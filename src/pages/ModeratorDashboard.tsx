import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useComments } from '../hooks/useComments';
import { commentService } from '../services/commentService';
import { CommentThread } from '../components/comments/CommentThread';
import { Comment, CommentReport } from '../types/Comment';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

export const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'reports'>('pending');
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [reports, setReports] = useState<CommentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin' && user.role !== 'moderator') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load pending comments and reports
  useEffect(() => {
    setIsLoading(true);
    try {
      const pending = commentService.getPendingComments();
      const allReports = commentService.getCommentReports();
      setPendingComments(pending);
      setReports(allReports.filter((r) => r.status === 'open'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleApprove = (commentId: string) => {
    if (!user) return;
    commentService.updateCommentStatus(commentId, 'approved', undefined, user.id);
    setPendingComments(pendingComments.filter((c) => c.id !== commentId));
  };

  const handleReject = (commentId: string) => {
    if (!user) return;
    const reason = prompt('Enter rejection reason (optional):');
    commentService.updateCommentStatus(commentId, 'rejected', reason || undefined, user.id);
    setPendingComments(pendingComments.filter((c) => c.id !== commentId));
  };

  const handleResolveReport = (reportId: string) => {
    commentService.resolveReport(reportId);
    setReports(reports.filter((r) => r.id !== reportId));
  };

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moderation Dashboard</h1>
        <p className="text-gray-600">Review and manage comments</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-4 font-medium border-b-2 transition ${
            activeTab === 'pending'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Review ({pendingComments.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-4 px-4 font-medium border-b-2 transition ${
            activeTab === 'reports'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Reports ({reports.length})
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : activeTab === 'pending' ? (
        <div className="space-y-6">
          {pendingComments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">All caught up! No pending comments to review.</p>
            </div>
          ) : (
            pendingComments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" name={comment.authorName} src={comment.authorAvatar} />
                    <div>
                      <p className="font-medium text-gray-900">{comment.authorName}</p>
                      <p className="text-xs text-gray-500">Submitted a comment</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>

                <p className="text-gray-700 mb-4 p-3 bg-gray-50 rounded border border-gray-200">
                  {comment.content}
                </p>

                <div className="flex gap-3 justify-end">
                  <Button
                    variant="light"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleReject(comment.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(comment.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No open reports at this time.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex gap-2 mb-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm font-medium">
                        {report.reason}
                      </span>
                      <span className="text-xs text-gray-500">Reported by {report.reporterName}</span>
                    </div>
                    <p className="text-gray-700 font-medium">Report Details:</p>
                    <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                  </div>
                  <Button
                    variant="light"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => handleResolveReport(report.id)}
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
