import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, BookOpen } from 'lucide-react';
import PageNav from '../../../../components/PageNav/PageNav';

export default function ClassDetailHero({
    classData,
    completedActivities,
    totalActivities
}) {
    const { t } = useTranslation();

    if (!classData) return null;

    // [UPDATED] Determine image source
    const defaultImage = "https://i.ibb.co/fGDt4tzT/hinh-anh-xe-cau-3-1024x683.jpg";
    const bgImage = classData.backgroundImageUrl || defaultImage;

    return (
        <section className="relative bg-black text-white py-24 overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src={bgImage} // [UPDATED] Use dynamic image
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/industrial-crane-construction-site.jpg"; // Final fallback
                    }}
                    alt={classData.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-black/30" />

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <PageNav
                        items={[{ title: t('trainee.myClasses', 'My Classes'), href: '/my-classes' }, { title: classData.name }]}
                        className="text-lg [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
                    />
                </div>

                {/* Provider + Status */}
                <div className="mb-6 flex items-center gap-4 flex-wrap">
                    <span
                        className="text-sm tracking-widest text-white uppercase font-bold drop-shadow-lg"
                        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                    >
                        {classData.provider}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-yellow-400" />
                    <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
                        {classData.status}
                    </span>
                </div>

                {/* Title */}
                <h1
                    className="text-6xl md:text-7xl font-black tracking-tight uppercase mb-8 leading-none text-white drop-shadow-xl"
                    style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}
                >
                    {classData.name}
                </h1>

                {/* Description */}
                <p
                    className="text-xl text-white max-w-3xl mb-12 leading-relaxed font-medium drop-shadow-lg"
                    style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
                >
                    {classData.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-8 flex-wrap">
                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
                            <Users className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white drop-shadow-md">{classData.capacity}</div>
                            <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">
                                {t('trainee.myClassDetail.students', 'Students')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3 rounded-lg">
                        <div className="w-12 h-12 bg-white flex items-center justify-center">
                            <Clock className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white drop-shadow-md">{classData.courseDurationHours}</div>
                            <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">
                                {t('trainee.myClassDetail.hours', 'Hours')}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}