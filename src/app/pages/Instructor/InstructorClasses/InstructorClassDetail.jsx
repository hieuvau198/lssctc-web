import { Tabs } from "antd";
import React, { useMemo } from "react";
import { Link, Outlet, useLocation, useParams, Navigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InstructorClassDetail() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab from URL pathname
  const activeTab = useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (['overview', 'sections', 'members', 'schedule', 'final-exam'].includes(lastSegment)) {
      return lastSegment;
    }
    return 'overview';
  }, [location.pathname]);

  // Redirect from /classes/:classId to /classes/:classId/overview
  if (location.pathname === `/instructor/classes/${classId}`) {
    return <Navigate to={`/instructor/classes/${classId}/overview`} replace />;
  }

  const tabItems = [
    {
      key: "overview",
      label: <Link to={`/instructor/classes/${classId}/overview`} className="font-bold uppercase text-sm text-black">{t('instructor.classes.overviewTitle')}</Link>,
    },
    {
      key: "sections",
      label: <Link to={`/instructor/classes/${classId}/sections`} className="font-bold uppercase text-sm text-black">{t('instructor.classes.sectionsTitle')}</Link>,
    },
    {
      key: "members",
      label: <Link to={`/instructor/classes/${classId}/members`} className="font-bold uppercase text-sm text-black">{t('instructor.classes.membersTitle')}</Link>,
    },
    {
      key: "schedule",
      label: <Link to={`/instructor/classes/${classId}/schedule`} className="font-bold uppercase text-sm text-black">{t('attendance.classSchedule')}</Link>,
    },
    {
      key: "final-exam",
      label: <Link to={`/instructor/classes/${classId}/final-exam`} className="font-bold uppercase text-sm text-black">{t('instructor.finalExam.tabTitle')}</Link>,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tabs with Back Button */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <div className="flex items-center bg-neutral-50 border-b-2 border-neutral-200">
          {/* Tabs */}
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            type="line"
            className="flex-1 [&_.ant-tabs-nav]:px-4 [&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav::before]:!border-0 [&_.ant-tabs-tab-active]:border-b-2 [&_.ant-tabs-tab-active]:border-yellow-400 [&_.ant-tabs-ink-bar]:bg-yellow-400"
          />
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="h-10 px-4 flex items-center gap-2 text-black font-bold uppercase text-sm hover:bg-yellow-400 transition-all border-l-2 border-neutral-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}