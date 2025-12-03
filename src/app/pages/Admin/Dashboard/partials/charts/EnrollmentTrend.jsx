import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getPopularCourses } from '../../../../../apis/Admin/AdminDashboard';

export default function EnrollmentTrend() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courses = await getPopularCourses(10);
        setData(courses);
      } catch (error) {
        console.error('Failed to fetch popular courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const series = [{ name: 'Total Enrollments', data: data.map(c => c.totalEnrollments) }];
  const options = {
    chart: { id: 'popular-courses', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '60%' } },
    xaxis: { 
      categories: data.map(c => c.courseName),
      labels: { 
        rotate: -45,
        rotateAlways: true,
        style: { fontSize: '10px' },
        trim: true,
        maxHeight: 80
      }
    },
    colors: ['#2563eb'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#eee' },
    tooltip: { theme: 'light', y: { formatter: (val) => val + ' enrollments' } }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-2 text-gray-700">Most Popular Courses</h2>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="bar" height={290} />
      )}
    </div>
  );
}
