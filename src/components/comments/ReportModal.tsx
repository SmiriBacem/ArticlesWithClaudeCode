import { useState } from 'react';
import Button from '../ui/Button';

interface ReportModalProps {
  commentId: string;
  onSubmit: (reason: string, description: string) => void;
  onClose: () => void;
}

export const ReportModal = ({ commentId, onSubmit, onClose }: ReportModalProps) => {
  const [reason, setReason] = useState<'spam' | 'inappropriate' | 'offensive' | 'other'>('spam');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(reason, description);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Comment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as typeof reason)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="spam">Spam</option>
              <option value="inappropriate">Inappropriate</option>
              <option value="offensive">Offensive</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why you're reporting this comment..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!description.trim()}>
              Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
