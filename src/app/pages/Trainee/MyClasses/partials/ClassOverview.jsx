
import React from 'react';
import { Card } from 'antd';
import { useTranslation } from 'react-i18next';

export default function ClassOverview({ classData }) {
  const { t } = useTranslation();
  return (
    <div className="my-4">
      <Card
        title={t('trainee.classOverview.title')}
        className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          <strong>{t('trainee.classOverview.course')}:</strong> {classData.courseName} ({classData.courseCode})
          <br />
          <br />
          {classData.description ||
            t('trainee.classOverview.noDescription')}
        </p>
      </Card>
    </div>
  );
}