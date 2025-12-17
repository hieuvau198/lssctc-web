import React from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { getFirstPartitionPath } from '../../../../mocks/lessonPartitions';

export default function CourseCurriculum({
    sections = [],
    loading = false,
    classId
}) {
    const { t } = useTranslation();

    if (loading) {
        return <Skeleton active paragraph={{ rows: 4 }} />;
    }

    if (sections.length === 0) {
        return <div className="text-neutral-500 py-8">{t('trainee.myClassDetail.noSections', 'No sections available.')}</div>;
    }

    return (
        <div className="space-y-6">
            {sections.map((section, index) => {
                const isCompleted = section.sectionProgress === 100;
                const isInProgress = section.sectionProgress > 0 && section.sectionProgress < 100;

                const deepLink = section.firstActivity
                    ? `/learnings/${classId}/${section.sectionId}/${section.firstActivity.activityId}`
                    : getFirstPartitionPath(classId) || `/learnings/${classId}`;

                return (
                    <div key={section.sectionId} className="group relative">
                        {/* Timeline connector */}
                        {index < sections.length - 1 && (
                            <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-neutral-200 -translate-x-1/2" />
                        )}

                        <Link to={deepLink} className="block relative bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all">
                            {/* Status indicator bar */}
                            <div
                                className={`h-2 ${isCompleted ? "bg-yellow-400" : isInProgress ? "bg-neutral-300" : "bg-neutral-100"
                                    }`}
                            />

                            <div className="p-8">
                                <div className="flex items-start gap-6">
                                    {/* Number Badge */}
                                    <div
                                        className={`flex-shrink-0 w-12 h-12 border-2 flex items-center justify-center font-black text-xl ${isCompleted
                                                ? "bg-yellow-400 border-yellow-400 text-black"
                                                : isInProgress
                                                    ? "bg-black border-black text-white"
                                                    : "bg-white border-neutral-300 text-neutral-400"
                                            }`}
                                    >
                                        {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                                    </div>

                                    <div className="flex-1">
                                        {/* Meta info */}
                                        <div className="flex items-center gap-4 mb-3 flex-wrap">
                                            <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
                                                {t('trainee.myClassDetail.lesson', 'Lesson')} {index + 1}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                            <span className="flex items-center gap-2 text-xs text-neutral-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {section.durationMinutes} {t('trainee.myClassDetail.mins', 'mins')}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                            <span className="text-xs text-neutral-500">
                                                {section.activities} {t('trainee.myClassDetail.activities', 'Activities')}
                                            </span>
                                            {isCompleted && (
                                                <>
                                                    <span className="h-1 w-1 rounded-full bg-neutral-300" />
                                                    <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase">
                                                        {t('trainee.myClassDetail.completed', 'Completed')}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-black uppercase mb-3 group-hover:text-yellow-400 transition-colors">
                                            {section.sectionName}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-2">{section.sectionDescription}</p>

                                        {/* Progress bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-bold text-neutral-500 uppercase tracking-wider">
                                                    {t('trainee.myClassDetail.progress', 'Progress')}
                                                </span>
                                                <span className="font-black text-xl">{section.sectionProgress}%</span>
                                            </div>
                                            <div className="h-2 bg-neutral-100 border border-neutral-900">
                                                <div
                                                    className="h-full bg-yellow-400 transition-all duration-500"
                                                    style={{ width: `${section.sectionProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex-shrink-0 w-12 h-12 border-2 border-neutral-900 group-hover:bg-yellow-400 group-hover:border-yellow-400 flex items-center justify-center transition-all group-hover:translate-x-1">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
