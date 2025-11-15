import { Card, Tag } from 'antd';

const CourseCard = ({ course }) => {
    return (
        <div className="mb-2">
            <Card
                key={course.id}
                className="shadow-md transition-shadow"
                role="button"
            >
                <div className="flex gap-4">
                    {/* Course Image */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-24 rounded-lg overflow-hidden bg-slate-100">
                            <img
                                src={course.imageUrl || '/placeholder-course.jpg'}
                                alt={course.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Course Info */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-base">{course.name}</h4>
                            <Tag color={course.isActive ? 'green' : 'default'}>
                                {course.isActive ? 'Active' : 'Inactive'}
                            </Tag>
                        </div>

                        <div className="flex items-center gap-x-6 text-sm text-slate-600">
                            {course.durationHours && (
                                <span>
                                    <span className="font-medium">Duration:</span> {course.durationHours}h
                                </span>
                            )}
                            {course.level && (
                                <span>
                                    <span className="font-medium">Level:</span> {course.level}
                                </span>
                            )}
                        </div>

                        {course.category && (
                            <div className="text-sm text-slate-600 mt-1">
                                <span className="font-medium">Category:</span> {course.category}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CourseCard;