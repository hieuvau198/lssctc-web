import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TabNavigation({ activeTab, onTabChange }) {
    const { t } = useTranslation();

    const tabs = [
        { key: "learning", label: t('trainee.myClassDetail.learning') },
        { key: "schedule", label: t('attendance.classSchedule') },
        { key: "attendance", label: t('attendance.attendance') },
        { key: "exam", label: t('trainee.finalExam.tabLabel') }
    ];

    return (
        <section className="bg-white border-b border-neutral-200 sticky top-17 z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex gap-0 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`px-8 py-4 font-bold uppercase tracking-wider text-sm border-b-4 transition-all whitespace-nowrap ${activeTab === tab.key
                                    ? "border-yellow-400 text-black"
                                    : "border-transparent text-neutral-400 hover:text-black hover:border-neutral-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
