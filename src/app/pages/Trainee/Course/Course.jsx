import React from 'react';
import CourseCard from '../../../components/CourseCard/CourseCard';
import CourseHeader from './partials/CourseHeader';

export default function Course() {
  // Temporary mock data; replace with hook/API once backend schema is ready.
  const courses = [
    {
      id: 1,
      title: 'Crane Operations Fundamentals',
      provider: 'LSSCTC Academy',
      level: 'Beginner',
      duration: '12h',
      thumbnail: '/crane-truck.png',
      tags: ['Safety', 'Operations', 'Basics'],
    },
    {
      id: 2,
      title: 'Container Yard Logistics & Scheduling',
      provider: 'LSSCTC Academy',
      level: 'Intermediate',
      duration: '8h',
      thumbnail: '/crane-truck.png',
      tags: ['Logistics', 'Planning'],
    },
    {
      id: 3,
      title: 'Simulator Scenario Mastery: Seaport',
      provider: 'LSSCTC Academy',
      level: 'Advanced',
      duration: '16h',
      thumbnail: '/crane-truck.png',
      tags: ['Simulator', 'Seaport', 'Scenarios'],
    },
    {
      id: 4,
      title: 'Rigging and Load Management',
      provider: 'LSSCTC Academy',
      level: 'Intermediate',
      duration: '10h',
      thumbnail: '/crane-truck.png',
      tags: ['Rigging', 'Safety'],
    },
    {
      id: 5,
      title: 'Equipment Maintenance Essentials',
      provider: 'LSSCTC Academy',
      level: 'Beginner',
      duration: '6h',
      thumbnail: '/crane-truck.png',
      tags: ['Maintenance', 'Basics'],
    },
  ];

  return (
    <div className="min-h-[60vh] bg-white">
      <div className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8 py-10">
        <CourseHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
