import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function QuizEmptyState() {
    return (
        <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
            <FileQuestion className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No quizzes found</p>
        </div>
    );
}
