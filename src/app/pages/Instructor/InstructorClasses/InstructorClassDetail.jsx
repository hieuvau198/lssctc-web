import { Alert, Breadcrumb, Skeleton, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getInstructorClassById } from "../../../apis/Instructor/InstructorApi";
import BackButton from "../../../components/BackButton/BackButton";
import ClassMembers from "./partials/ClassMembers";
import ClassOverview from "./partials/ClassOverview";
import ClassSections from "./partials/ClassSections";

export default function InstructorClassDetail() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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
        setError(err?.message || "Failed to load class details");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [classId]);

  // MOVED LOADING AND ERROR CHECKS UP
  // This ensures classDetail is available before tabItems is defined.
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Skeleton active paragraph={{ rows: 1 }} className="mb-4" />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Alert
          message={t('common.error')}
          description={t('instructor.classes.classDetail')}
          type="warning"
          showIcon
        />
      </div>
    );
  }

  // Define tabItems ONLY when data is guaranteed to be available.
  const tabItems = [
    {
      key: "overview",
      label: t('instructor.classes.overview'),
      children: <ClassOverview classData={classDetail} />,
    },
    {
      key: "sections",
      label: t('instructor.classes.sections'),
      // classDetail is now guaranteed to be non-null
      // We still use optional chaining just in case programCourseId is null
      children: <ClassSections courseId={classDetail?.courseId} classId={classId}/>,
    },
    {
      key: "members",
      label: t('instructor.classes.members'),
      children: <ClassMembers classId={classId} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-start items-center mb-4">
        <BackButton />
        {/* <Breadcrumb
          className="text-lg"
          items={[
            {
              title: <Link to="/instructor/classes">My Classes</Link>,
            },
            {
              title: classDetail.courseName || "Class Detail",
            },
          ]}
        /> */}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="line"
        />
      </div>
    </div>
  );
}