import React from 'react';
import { Tag, Divider } from 'antd';
import {
  BookOpen,
  FileText,
  Monitor,
  HelpCircle,
  Clock,
  Info,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TraineeActivityRecords from './TraineeActivityRecords';
import ActivitySessionManager from './ActivitySessionManager';

// Helper to get icon and styling
const getActivityTypeDetails = (type) => {
  switch (type?.toLowerCase()) {
    case 'material':
      return {
        icon: <BookOpen className="w-5 h-5" />,
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-400',
        iconColor: 'text-yellow-700',
        tagBg: 'bg-yellow-400',
        tagText: 'text-black',
      };
    case 'quiz':
      return {
        icon: <HelpCircle className="w-5 h-5" />,
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-400',
        iconColor: 'text-blue-700',
        tagBg: 'bg-blue-500',
        tagText: 'text-white',
      };
    case 'practice':
      return {
        icon: <Monitor className="w-5 h-5" />,
        bgColor: 'bg-black',
        borderColor: 'border-black',
        iconColor: 'text-yellow-400',
        tagBg: 'bg-black',
        tagText: 'text-yellow-400',
      };
    default:
      return {
        icon: <FileText className="w-5 h-5" />,
        bgColor: 'bg-neutral-100',
        borderColor: 'border-neutral-300',
        iconColor: 'text-neutral-600',
        tagBg: 'bg-neutral-200',
        tagText: 'text-neutral-700',
      };
  }
};

const ActivityDetailView = ({ activity, classId, sectionId }) => {
  const { t } = useTranslation();

  if (!activity) {
    return null;
  }

  const typeDetails = getActivityTypeDetails(activity.type);
  const isSessionManagable = ['quiz', 'practice'].includes(activity.type?.toLowerCase());

  return (
    <div className="divide-y-2 divide-neutral-200">
      {/* Activity Header */}
      <div className="p-6 bg-white">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${typeDetails.bgColor} ${typeDetails.iconColor} border-2 ${typeDetails.borderColor} flex items-center justify-center flex-shrink-0`}>
            {typeDetails.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-xl text-black uppercase tracking-tight mb-2">
              {activity.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 border-2 border-black font-bold text-xs uppercase ${typeDetails.tagBg} ${typeDetails.tagText}`}>
                {activity.type}
              </span>
              <span className="px-3 py-1 bg-neutral-100 border-2 border-neutral-300 font-bold text-xs text-neutral-700 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {activity.duration} {t('instructor.classes.activityDetail.minutes')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {activity.description && (
        <div className="p-6 bg-neutral-50">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold uppercase text-neutral-500 mb-2">
                {t('common.description', 'Mô tả')}
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                {activity.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Session Manager for Quiz/Practice */}
      {isSessionManagable && (
        <div className="p-6 bg-white">
          <ActivitySessionManager
            classId={classId}
            activityId={activity.id}
          />
        </div>
      )}

      {/* Trainee Records */}
      <div className="p-6 bg-white">
        <TraineeActivityRecords
          classId={classId}
          sectionId={sectionId}
          activityId={activity.id}
          activityType={activity.type}
        />
      </div>
    </div>
  );
};

export default ActivityDetailView;