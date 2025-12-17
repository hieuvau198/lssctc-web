import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getClassStatusDistribution } from '../../../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../../../store/authStore';

const statusColors = {
  'Draft': '#a3a3a3',
  'Open': '#fbbf24',
  'In-Progress': '#171717',
  'InProgress': '#171717',
  'Completed': '#fbbf24',
  'Cancelled': '#ef4444'
};

export default function ClassStatusChart() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { nameid: instructorId } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) return;

      try {
        setLoading(true);
        const distribution = await getClassStatusDistribution(instructorId);
        setData(distribution);
      } catch (error) {
        console.error('Failed to fetch class status distribution:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId]);

  const series = data.map(d => d.count || d.classCount || 0);
  const rawLabels = data.map(d => d.statusName || d.status);
  const labels = rawLabels.map(label => t(`instructor.dashboard.status.${label.toLowerCase().replace('-', '')}`, label));
  const colors = rawLabels.map(label => statusColors[label] || '#6b7280');

  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit'
    },
    labels: labels,
    legend: {
      position: 'bottom',
      fontSize: '12px',
      markers: { width: 10, height: 10, radius: 0 }
    },
    dataLabels: {
      enabled: true,
      dropShadow: { enabled: false },
      style: { fontSize: '12px', fontWeight: 700 }
    },
    stroke: { width: 2, colors: ['#171717'] },
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', fontWeight: 700 },
            value: { show: true, fontSize: '20px', fontWeight: 900 },
            total: {
              show: true,
              label: t('instructor.dashboard.totalClasses'),
              fontSize: '12px',
              fontWeight: 700,
              formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: { height: 280 },
        legend: { position: 'bottom' }
      }
    }]
  };

  return (
    <div className="bg-white border-2 border-neutral-900 p-5 flex flex-col h-full">
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
      <h2 className="text-sm font-black uppercase tracking-wider mb-4 text-neutral-900">{t('instructor.dashboard.classStatusDistribution')}</h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-neutral-400 uppercase tracking-wider font-semibold">
          {t('instructor.dashboard.noStatusData')}
        </div>
      ) : (
        <Chart options={options} series={series} type="donut" height={320} />
      )}
    </div>
  );
}
