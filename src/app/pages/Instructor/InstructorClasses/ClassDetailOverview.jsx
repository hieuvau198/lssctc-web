import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { getInstructorClassById } from '../../../apis/Instructor/InstructorApi';
import ClassOverview from './partials/ClassOverview';

export default function ClassDetailOverview() {
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
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="p-4">
        <Alert
          message={t('common.error')}
          description={t('instructor.classes.classDetail')}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return <ClassOverview classData={classDetail} />;
}
