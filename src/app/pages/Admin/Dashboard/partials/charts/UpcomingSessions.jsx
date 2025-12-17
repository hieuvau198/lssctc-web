import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getActiveTrainees } from '../../../../../apis/Admin/AdminDashboard';

export default function UpcomingSessions() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const trainees = await getActiveTrainees(10);
        setData(trainees);
      } catch (error) {
        console.error('Failed to fetch active trainees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const series = [{ name: t('admin.dashboard.charts.enrolledCourses'), data: data.map(item => item.enrolledCourseCount) }];
  const options = {
    chart: { id: 'active-trainees', toolbar: { show: false }, fontFamily: 'inherit' },
    plotOptions: { bar: { borderRadius: 0, horizontal: false, columnWidth: '60%' } },
    xaxis: {
      categories: data.map(item => item.traineeName),
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: { fontSize: '10px' },
        trim: true,
        maxHeight: 80
      }
    },
    colors: ['#171717'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#e5e5e5', strokeDashArray: 4 },
    tooltip: { theme: 'light', y: { formatter: (val) => val + ' ' + t('admin.dashboard.charts.courses') } }
  };

  return (
    <div className="bg-white border-2 border-neutral-900 p-5 flex flex-col">
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
      <h2 className="text-sm font-black uppercase tracking-wider mb-4 text-neutral-900">{t('admin.dashboard.charts.mostActiveTrainees')}</h2>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="bar" height={280} />
      )}
    </div>
  );
}
