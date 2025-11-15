import { Alert, Breadcrumb, Skeleton, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// 1. Import the new API function
import { getInstructorClassById } from "../../../apis/Instructor/InstructorApi";
import BackButton from "../../../components/BackButton/BackButton";
import ClassMembers from "./partials/ClassMembers";
import ClassOverview from "./partials/ClassOverview";
import ClassSections from "./partials/ClassSections";

export default function InstructorClassDetail() {
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
        // 2. Use the new function
        const res = await getInstructorClassById(classId);
        if (cancelled) return;
        setClassDetail(res); // 3. Set the response directly
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

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      // The component should be safe to render as long as classDetail is passed
      children: <ClassOverview classDetail={classDetail} />,
    },
    {
      key: "sections",
      label: "Sections",
      // As you noted, this might be broken, but we'll leave it for now
      children: <ClassSections classId={classId} />,
    },
    {
      key: "members",
      label: "Members",
      // As you noted, this might be broken, but we'll leave it for now
      children: <ClassMembers classId={classId} />,
    },
  ];

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
          message="Not Found"
          description="This class could not be found."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex justify-start items-center mb-4">
        <BackButton />
        <Breadcrumb
          className="text-lg"
          items={[
            {
              title: <Link to="/instructor/classes">My Classes</Link>,
            },
            {
              // 4. This should now work, assuming the new API returns courseName
              title: classDetail.courseName || "Class Detail",
            },
          ]}
        />
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