import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Target, TrendingUp, Calendar } from 'lucide-react';

export default function QuickStats({ features }) {
    const { t } = useTranslation();

    const defaultFeatures = [
        { icon: Award, title: t('trainee.myClassDetail.industryCertification', 'Industry Certification'), value: t('trainee.myClassDetail.lssctcStandard', 'LSSCTC Standard') },
        { icon: Target, title: t('trainee.myClassDetail.completionRate', 'Completion Rate'), value: t('trainee.myClassDetail.successRate', '95% Success') },
        { icon: TrendingUp, title: t('trainee.myClassDetail.careerGrowth', 'Career Growth'), value: t('trainee.myClassDetail.salaryIncrease', '+40% Salary') },
        { icon: Calendar, title: t('trainee.myClassDetail.courseLength', 'Course Length'), value: t('trainee.myClassDetail.weeks', '12 Weeks') },
    ];

    const displayFeatures = features || defaultFeatures;

    return (
        <section className="bg-neutral-50 border-y border-neutral-200">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {displayFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white border border-neutral-200 p-6 hover:border-yellow-400 transition-all group"
                        >
                            <feature.icon className="w-8 h-8 mb-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" />
                            <div className="text-sm text-neutral-500 uppercase tracking-wider mb-2">{feature.title}</div>
                            <div className="text-2xl font-bold text-black">{feature.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
