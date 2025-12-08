import { Tabs } from "antd";
import React, { useMemo } from "react";
import { Link, Outlet, useLocation, useParams, Navigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import BackButton from "../../../components/BackButton/BackButton";

export default function InstructorClassDetail() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const location = useLocation();

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
      label: <Link to={`/instructor/classes/${classId}/overview`}>{t('instructor.classes.overviewTitle')}</Link>,
    },
    {
      key: "sections",
      label: <Link to={`/instructor/classes/${classId}/sections`}>{t('instructor.classes.sectionsTitle')}</Link>,
    },
    {
      key: "members",
      label: <Link to={`/instructor/classes/${classId}/members`}>{t('instructor.classes.membersTitle')}</Link>,
    },
    {
      key: "schedule",
      label: <Link to={`/instructor/classes/${classId}/schedule`}>{t('attendance.classSchedule')}</Link>,
    },
    {
      key: "final-exam",
      label: <Link to={`/instructor/classes/${classId}/final-exam`}>{t('instructor.finalExam.tabTitle')}</Link>,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <BackButton />
      <Tabs
        activeKey={activeTab}
        items={tabItems}
        type="line"
      />
      <Outlet />
    </div>
  );
}