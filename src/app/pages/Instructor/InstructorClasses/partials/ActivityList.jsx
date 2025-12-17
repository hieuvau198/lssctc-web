import { Alert, List, Skeleton, Drawer } from 'antd';
import { BookOpen, FileText, Monitor, HelpCircle, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getActivitiesBySectionId } from '../../../../apis/Instructor/InstructorSectionApi';
import ManageMaterialModal from './Sections/ManageMaterialModal';
import ManageQuizModal from './Sections/ManageQuizModal';
import ManagePracticeModal from './Sections/ManagePracticeModal';
import ActivityDetailView from './Sections/ActivityDetail/ActivityDetailView';

const getActivityTypeDetails = (type, t) => {
  switch (type?.toLowerCase()) {
    case 'material':
      return {
        icon: <BookOpen className="w-5 h-5" />,
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-400',
        iconColor: 'text-yellow-700',
        label: t('instructor.classes.addActivityModal.typeMaterial'),
      };
    case 'quiz':
      return {
        icon: <HelpCircle className="w-5 h-5" />,
        bgColor: 'bg-yellow-400',
        borderColor: 'border-black',
        iconColor: 'text-black',
        label: t('instructor.classes.addActivityModal.typeQuiz'),
      };
    case 'practice':
      return {
        icon: <Monitor className="w-5 h-5" />,
        bgColor: 'bg-black',
        borderColor: 'border-black',
        iconColor: 'text-yellow-400',
        label: t('instructor.classes.addActivityModal.typePractice'),
      };
    default:
      return {
        icon: <FileText className="w-5 h-5" />,
        bgColor: 'bg-neutral-100',
        borderColor: 'border-neutral-300',
        iconColor: 'text-neutral-600',
        label: type || t('instructor.classes.activities'),
      };
  }
};

const ActivityList = ({ sectionId, classId, refreshKey }) => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isManageMaterialVisible, setIsManageMaterialVisible] = useState(false);
  const [isManageQuizVisible, setIsManageQuizVisible] = useState(false);
  const [isManagePracticeVisible, setIsManagePracticeVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);

  const fetchActivities = async () => {
    if (!sectionId) {
      setLoading(false);
      setError(t('instructor.classes.activityList.noSectionId'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getActivitiesBySectionId(sectionId);
      setActivities(data || []);
    } catch (err) {
      setError(err.message || t('instructor.classes.activityList.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [sectionId, refreshKey]);

  const openDetailDrawer = (activity) => {
    setSelectedActivity(activity);
    setIsDetailDrawerVisible(true);
  };

  const closeDetailDrawer = () => {
    setIsDetailDrawerVisible(false);
    setSelectedActivity(null);
  };

  const openManageMaterial = (activity) => {
    setSelectedActivity(activity);
    setIsManageMaterialVisible(true);
  };
  const onMaterialModalUpdate = () => {
    setIsManageMaterialVisible(false);
    setSelectedActivity(null);
    fetchActivities();
  };
  const onMaterialModalClose = () => {
    setIsManageMaterialVisible(false);
    setSelectedActivity(null);
  };

  const openManageQuiz = (activity) => {
    setSelectedActivity(activity);
    setIsManageQuizVisible(true);
  };
  const onQuizModalUpdate = () => {
    setIsManageQuizVisible(false);
    setSelectedActivity(null);
    fetchActivities();
  };
  const onQuizModalClose = () => {
    setIsManageQuizVisible(false);
    setSelectedActivity(null);
  };

  const openManagePractice = (activity) => {
    setSelectedActivity(activity);
    setIsManagePracticeVisible(true);
  };
  const onPracticeModalUpdate = () => {
    setIsManagePracticeVisible(false);
    setSelectedActivity(null);
    fetchActivities();
  };
  const onPracticeModalClose = () => {
    setIsManagePracticeVisible(false);
    setSelectedActivity(null);
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    );
  }

  if (error) {
    return <Alert message={t('instructor.classes.activityList.error')} description={error} type="error" showIcon className="m-4" />;
  }

  if (activities.length === 0) {
    return <div className="p-4 text-neutral-500 font-medium">{t('instructor.classes.activityList.noActivities')}</div>;
  }

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => {
          const typeDetails = getActivityTypeDetails(item.type, t);

          const getManageButton = () => {
            const buttonClass = "px-3 py-1 text-xs font-bold uppercase border-2 border-black bg-white hover:bg-yellow-400 transition-all flex items-center gap-1";

            if (item.type?.toLowerCase() === 'material') {
              return (
                <button
                  className={buttonClass}
                  onClick={(e) => { e.stopPropagation(); openManageMaterial(item); }}
                >
                  <Settings className="w-3 h-3" />
                  {t('instructor.classes.activityList.manageMaterial')}
                </button>
              );
            } else if (item.type?.toLowerCase() === 'quiz') {
              return (
                <button
                  className={buttonClass}
                  onClick={(e) => { e.stopPropagation(); openManageQuiz(item); }}
                >
                  <Settings className="w-3 h-3" />
                  {t('instructor.classes.activityList.manageQuiz')}
                </button>
              );
            } else if (item.type?.toLowerCase() === 'practice') {
              return (
                <button
                  className={buttonClass}
                  onClick={(e) => { e.stopPropagation(); openManagePractice(item); }}
                >
                  <Settings className="w-3 h-3" />
                  {t('instructor.classes.activityList.managePractice')}
                </button>
              );
            }
            return null;
          };

          return (
            <List.Item
              actions={[getManageButton()]}
              onClick={() => openDetailDrawer(item)}
              className="hover:bg-yellow-50 cursor-pointer border-b border-neutral-100 transition-all"
            >
              <List.Item.Meta
                avatar={
                  <div className={`w-10 h-10 ${typeDetails.bgColor} ${typeDetails.iconColor} border-2 ${typeDetails.borderColor} flex items-center justify-center`}>
                    {typeDetails.icon}
                  </div>
                }
                title={
                  <span className="font-bold text-black">
                    {item.title}
                  </span>
                }
                description={
                  <div className="flex flex-col">
                    <span className="text-neutral-600">{item.description}</span>
                    <span className="text-xs text-neutral-500 mt-1 font-medium">
                      <span className="uppercase">{typeDetails.label}</span> • {item.duration} {t('instructor.classes.activityList.minutes')}
                    </span>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />

      <Drawer
        title={<span className="font-black uppercase">{t('instructor.classes.activityList.activityDetails')}</span>}
        placement="right"
        width={720}
        onClose={closeDetailDrawer}
        open={isDetailDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <ActivityDetailView
          activity={selectedActivity}
          classId={classId}
          sectionId={sectionId}
        />
      </Drawer>

      {selectedActivity && (
        <>
          <ManageMaterialModal
            activity={selectedActivity}
            isVisible={isManageMaterialVisible}
            onClose={onMaterialModalClose}
            onUpdate={onMaterialModalUpdate}
          />

          <ManageQuizModal
            activity={selectedActivity}
            isVisible={isManageQuizVisible}
            onClose={onQuizModalClose}
            onUpdate={onQuizModalUpdate}
          />

          <ManagePracticeModal
            activity={selectedActivity}
            isVisible={isManagePracticeVisible}
            onClose={onPracticeModalClose}
            onUpdate={onPracticeModalUpdate}
          />
        </>
      )}
    </>
  );
};

export default ActivityList;