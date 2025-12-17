import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { getInstructorClassById } from '../../../apis/Instructor/InstructorApi';
import ClassTimeslotSchedule from './partials/ClassTimeslotSchedule';

export default function ClassDetailSchedule() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await getInstructorClassById(classId);
        if (cancelled) return;
        setClassDetail(res);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Failed to load class details');
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [classId]);

  if (loading) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-6" />
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <span className="font-bold uppercase">{error}</span>
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
        <div className="flex items-center gap-3 text-yellow-600">
          <AlertCircle className="w-6 h-6" />
          <span className="font-bold uppercase">{t('instructor.classes.classDetail')}</span>
        </div>
      </div>
    );
  }

  return (
    <ClassTimeslotSchedule
      classId={classId}
      className={classDetail?.courseName || classDetail?.name}
    />
  );
}
