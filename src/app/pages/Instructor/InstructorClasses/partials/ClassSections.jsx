// src/app/pages/Instructor/InstructorClasses/partials/ClassSections.jsx
import { Alert, Collapse, Skeleton, Tooltip } from 'antd';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSectionsByCourseId } from '../../../../apis/Instructor/InstructorSectionApi';
import ActivityList from './ActivityList';

const { Panel } = Collapse;

const SectionHeader = ({ title, duration, minutesText }) => (
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
        <BookOpen className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-black uppercase tracking-tight">
        {title}
      </span>
    </div>
    <div className="flex items-center gap-2 text-sm text-neutral-600 pr-2">
      <Clock className="w-4 h-4 text-yellow-600" />
      <span className="font-bold">{duration} {minutesText}</span>
    </div>
  </div>
);

const ClassSections = ({ courseId, classId }) => {
  const { t } = useTranslation();
  const minutesText = t('instructor.classes.sections.minutes');
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      setError(t('instructor.classes.sections.courseIdNotAvailable'));
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSectionsByCourseId(courseId);
        if (!cancelled) {
          setSections(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load sections');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (loading) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-2 border-neutral-200 p-4">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-6" />
        <Alert
          message={t('instructor.classes.sections.errorLoading')}
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
        <div className="bg-neutral-50 border-2 border-neutral-200 p-8 text-center">
          <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-800 font-bold uppercase mb-1">{t('instructor.classes.sections.noSections')}</p>
          <p className="text-sm text-neutral-500">{t('instructor.classes.sections.noSectionsDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      <div className="h-1 bg-yellow-400" />
      <div className="p-6 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
        <Collapse
          accordion
          bordered={false}
          className="bg-transparent"
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <ChevronRight className={`w-5 h-5 text-neutral-500 transition-transform ${isActive ? 'rotate-90' : ''}`} />
          )}
        >
          {sections.map((section, index) => (
            <Panel
              key={section.id}
              header={
                <SectionHeader
                  title={section.title}
                  duration={section.duration}
                  minutesText={minutesText}
                />
              }
              // Removed extra prop (add button)
              className="mb-3 overflow-hidden border-2 border-neutral-200 hover:border-yellow-400 transition-all bg-white [&>.ant-collapse-header]:bg-neutral-50 [&>.ant-collapse-header]:border-b-2 [&>.ant-collapse-header]:border-neutral-200"
            >
              <div className="bg-neutral-50 -mx-4 -mt-4 px-4 py-3 mb-4 border-b-2 border-neutral-100">
                <p className="text-neutral-700 leading-relaxed">{section.description}</p>
              </div>
              <ActivityList
                sectionId={section.id}
                classId={classId}
                refreshKey={0} // Fixed key since we don't add activities anymore
              />
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default ClassSections;