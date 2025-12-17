import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getPopularCourses } from '../../../../../apis/Admin/AdminDashboard';

export default function EnrollmentTrend() {
  const { t } = useTranslation();
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

  const series = [{ name: t('admin.dashboard.charts.totalEnrollments'), data: data.map(c => c.totalEnrollments) }];
  const options = {
    chart: { id: 'popular-courses', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: { bar: { borderRadius: 0, horizontal: false, columnWidth: '60%' } },
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
    colors: ['#fbbf24'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#e5e5e5', strokeDashArray: 4 },
    tooltip: { theme: 'light', y: { formatter: (val) => val + ' ' + t('admin.dashboard.charts.enrollments') } }
  };

  return (
    <div className="bg-white border-2 border-neutral-900 p-5 flex flex-col">
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
      <h2 className="text-sm font-black uppercase tracking-wider mb-4 text-neutral-900">{t('admin.dashboard.charts.popularCourses')}</h2>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="bar" height={290} />
      )}
    </div>
  );
}
