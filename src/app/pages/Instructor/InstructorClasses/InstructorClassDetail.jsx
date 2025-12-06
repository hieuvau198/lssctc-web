import { Alert, Breadcrumb, Skeleton, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getInstructorClassById } from "../../../apis/Instructor/InstructorApi";
import BackButton from "../../../components/BackButton/BackButton";
import ClassMembers from "./partials/ClassMembers";
import ClassOverview from "./partials/ClassOverview";
import ClassSections from "./partials/ClassSections";
import ClassTimeslotSchedule from "./partials/ClassTimeslotSchedule";
import AttendanceModal from "./partials/AttendanceModal";
import { mockAttendanceList } from "../../../mocks/teachingSlots";

export default function InstructorClassDetail() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [classDetail, setClassDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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
      label: t('instructor.classes.overviewTitle'),
      children: <ClassOverview classData={classDetail} />,
    },
    {
      key: "sections",
      label: t('instructor.classes.sectionsTitle'),
      // classDetail is now guaranteed to be non-null
      // We still use optional chaining just in case programCourseId is null
      children: <ClassSections courseId={classDetail?.courseId} classId={classId}/>,
    },
    {
      key: "members",
      label: t('instructor.classes.membersTitle'),
      children: <ClassMembers classId={classId} />,
    },
    {
      key: "schedule",
      label: t('attendance.classSchedule'),
      children: (
        <ClassTimeslotSchedule
          classId={classId}
          className={classDetail?.courseName || classDetail?.name}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div>
        <BackButton />
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="line"
        />
      </div>

      <AttendanceModal
        open={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        slotData={selectedSlot}
        attendanceList={mockAttendanceList}
      />
    </div>
  );
}