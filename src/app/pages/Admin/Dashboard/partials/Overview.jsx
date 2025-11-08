import React from 'react';
import EnrollmentTrend from './charts/EnrollmentTrend';
import RoleDistribution from './charts/RoleDistribution';
import CourseCompletion from './charts/CourseCompletion';
import UpcomingSessions from './charts/UpcomingSessions';
import SystemStats from './charts/SystemStats';

export default function Overview() {
  return (
    <div className="space-y-6">
      <span className="text-2xl">Academy Dashboard</span>
      <SystemStats />
      <div className="grid gap-6 md:grid-cols-2">
        <EnrollmentTrend />
        <RoleDistribution />
        <CourseCompletion />
        <UpcomingSessions />
      </div>
    </div>
  );
}
