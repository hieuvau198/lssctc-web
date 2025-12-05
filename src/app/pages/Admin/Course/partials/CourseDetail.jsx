// src\app\pages\ProgramManager\Course\partials\CourseDetail.jsx

import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { fetchCourseDetail } from "../../../../apis/ProgramManager/CourseApi";
import { Card, Skeleton, Alert, Button, Tag } from "antd";
import SectionList from './Sections/SectionList';

const CourseDetail = ({ id, onBack, course: providedCourse, embedded = false }) => {
  const { t } = useTranslation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (providedCourse) {
      setCourse(providedCourse);
      setLoading(false);
      return;
    }
    if (!id) return;
    setLoading(true);
    fetchCourseDetail(id)
      .then((data) => { setCourse(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id, providedCourse]);

  if (loading)
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <Skeleton.Button active className="mb-4 !w-20" />
        <Card cover={<Skeleton.Image active className="!w-full !h-56" />}>
          <Skeleton active title paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  if (error)
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
        <Button className="mt-4" onClick={onBack}>
          {t('common.back')}
        </Button>
      </div>
    );

  if (embedded) {
    return (
      // 1. WRAPPER: Use a flex-col container to stack the "Details Grid" and "Section List" vertically
      <div className="flex flex-col gap-8"> 
        
        {/* TOP PART: Image and Details (The Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Column 1: Image */}
          <div className="md:col-span-1">
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 border h-64 md:h-auto">
              <img
                src={course.imageUrl}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Column 2: Details Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{course.name}</h3>
              <Tag color={course.isActive ? 'green' : 'red'}>
                {course.isActive ? t('common.active') : t('common.inactive')}
              </Tag>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>
                <span className="font-medium">{t('common.category')}:</span> {course.category}
              </span>
              <span>
                <span className="font-medium">{t('common.level')}:</span> {course.level}
              </span>
              <span>
                <span className="font-medium">{t('common.duration')}:</span> {course.durationHours}h
              </span>
              <span>
                <span className="font-medium">{t('common.price')}:</span> ${course.price}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-800 mb-1">{t('common.description')}</div>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-20 md:max-h-40 overflow-auto pr-2">
                {course.description}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM PART: Sections List (Full Width) */}
        {/* 2. PLACEMENT: Placed OUTSIDE the grid div above, so it takes 100% width */}
        <div className="w-full">
           {course && <SectionList courseId={course.id} />}
        </div>

      </div>
    );
  }

  // Fallback for standalone view (if you uncomment it later)
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button className="mb-4" onClick={onBack}>Back</Button>
      <Card title={course.name}>
        {/* Basic info can go here */}
        <p>{course.description}</p>
        
        {/* Add SectionList here too for standalone view */}
        <div className="mt-8">
            <SectionList courseId={course.id} />
        </div>
      </Card>
    </div>
  );
};

export default CourseDetail;
