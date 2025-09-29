import React from 'react';
import { Skeleton, Alert } from 'antd';
import { BookOpen } from 'lucide-react';
import PageNav from '../../components/PageNav/PageNav';

/**
 * Temporary placeholder for session lesson/activity content.
 * Replace with real content viewer (video player, reading pane, quiz, etc.).
 */
export default function LessonSessionPlaceholder() {
  // Simulated loading state (replace with hook logic later)
  const [loading] = React.useState(false);
  const [error] = React.useState(null);

  return (
    <div className="space-y-6">
      <PageNav />
      {error && <Alert type="error" showIcon message={error} />}
      {loading ? (
        <div className="space-y-4">
          <Skeleton active title paragraph={{ rows: 4 }} />
        </div>
      ) : (
        <div className="prose max-w-none">
          <h1 className="flex items-center gap-2 text-slate-800">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Session Activity Placeholder
          </h1>
          <p className="text-sm text-slate-600">This page will display the specific content for the selected session activity (e.g., video, reading, quiz). The left sidebar lists all items in the current session.</p>
          <ul className="text-sm list-disc pl-5">
            <li>Progress state indicator (completed, in-progress)</li>
            <li>Navigation persists between activities</li>
            <li>Skeletons shown while loading activity data</li>
            <li>Breadcrumb (PageNav) at top for context</li>
          </ul>
        </div>
      )}
    </div>
  );
}
