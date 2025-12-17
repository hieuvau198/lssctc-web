import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ProgressCard({
    progress = 0,
    completedSections = 0,
    totalSections = 0,
    completedActivities = 0,
    totalActivities = 0
}) {
    const { t } = useTranslation();

    return (
        <div className="bg-white border-2 border-neutral-900">
            <div className="h-2 bg-neutral-900" />
            <div className="p-6">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4">
                    {t('trainee.myClassDetail.overallProgress', 'Overall Progress')}
                </h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-neutral-600 uppercase tracking-wider">
                                {t('trainee.myClassDetail.courseCompletion', 'Course Completion')}
                            </span>
                            <span className="font-black text-2xl">{progress}%</span>
                        </div>
                        <div className="h-3 bg-neutral-100 border border-neutral-900">
                            <div className="h-full bg-yellow-400" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-200">
                        <div>
                            <div className="text-3xl font-black text-black">
                                {completedSections}/{totalSections}
                            </div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider">
                                {t('trainee.myClassDetail.lessonsDone', 'Lessons Done')}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-black">
                                {completedActivities}/{totalActivities}
                            </div>
                            <div className="text-xs text-neutral-500 uppercase tracking-wider">
                                {t('trainee.myClassDetail.activitiesDone', 'Activities Done')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
