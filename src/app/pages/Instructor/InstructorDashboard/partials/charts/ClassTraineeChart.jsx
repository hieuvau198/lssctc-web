import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getTopClassesByTrainees } from '../../../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../../../store/authStore';

export default function ClassTraineeChart() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { nameid: instructorId } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) return;

      try {
        setLoading(true);
        const classes = await getTopClassesByTrainees(instructorId, 10);
        setData(classes);
      } catch (error) {
        console.error('Failed to fetch top classes by trainees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId]);

  const series = [{
    name: t('instructor.dashboard.trainees'),
    data: data.map(c => c.traineeCount || c.totalTrainees || 0)
  }];

  const options = {
    chart: {
      id: 'class-trainees',
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: false,
        columnWidth: '55%',
        distributed: true
      }
    },
    xaxis: {
      categories: data.map(c => c.className || c.name),
      labels: {
        rotate: -45,
        rotateAlways: data.length > 5,
        style: { fontSize: '11px' },
        trim: true,
        maxHeight: 80
      }
    },
    yaxis: {
      title: { text: t('instructor.dashboard.numberOfTrainees'), style: { fontSize: '12px', fontWeight: 700 } }
    },
    colors: ['#fbbf24', '#171717', '#fbbf24', '#171717', '#fbbf24', '#171717', '#fbbf24', '#171717', '#fbbf24', '#171717'],
    dataLabels: {
      enabled: true,
      style: { fontSize: '11px', fontWeight: 700 }
    },
    legend: { show: false },
    grid: { borderColor: '#e5e5e5', strokeDashArray: 4 },
    tooltip: {
      theme: 'light',
      y: { formatter: (val) => t('instructor.dashboard.traineesCount', { count: val }) }
    }
  };

  return (
    <div className="bg-white border-2 border-neutral-900 p-5 flex flex-col h-full">
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
      <h2 className="text-sm font-black uppercase tracking-wider mb-4 text-neutral-900">{t('instructor.dashboard.traineesByClass')}</h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-neutral-400 uppercase tracking-wider font-semibold">
          {t('instructor.dashboard.noClassData')}
        </div>
      ) : (
        <Chart options={options} series={series} type="bar" height={320} />
      )}
    </div>
  );
}
