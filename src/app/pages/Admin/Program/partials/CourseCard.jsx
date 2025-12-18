import { useTranslation } from 'react-i18next';
import { Clock, BarChart2, Folder } from 'lucide-react';

const CourseCard = ({ course }) => {
    const { t } = useTranslation();

    return (
        <div className="border-2 border-neutral-900 bg-white hover:border-yellow-400 transition-all group mb-2">
            <div className="h-1 bg-yellow-400" />
            <div className="flex gap-4 p-4">
                {/* Course Image */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-24 overflow-hidden bg-neutral-100 border border-neutral-200">
                        <img
                            src={course.imageUrl || '/placeholder-course.jpg'}
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                    {/* Course Name */}
                    <span className="block font-bold text-base uppercase tracking-wide text-neutral-900 group-hover:text-yellow-600 transition-colors mb-2">
                        {course.name}
                    </span>

                    {/* Status + Metadata Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
                        <span className={`px-2 py-1 text-xs font-bold uppercase ${course.isActive
                                ? 'bg-yellow-400 text-black'
                                : 'bg-neutral-200 text-neutral-600'
                            }`}>
                            {course.isActive ? t('common.active') : t('common.inactive')}
                        </span>

                        {course.durationHours && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                <span className="font-semibold">{course.durationHours}h</span>
                            </span>
                        )}
                        {course.level && (
                            <span className="flex items-center gap-1.5">
                                <BarChart2 className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                <span className="font-semibold">{course.level}</span>
                            </span>
                        )}
                        {course.category && (
                            <span className="flex items-center gap-1.5">
                                <Folder className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                <span className="font-semibold">{course.category}</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
