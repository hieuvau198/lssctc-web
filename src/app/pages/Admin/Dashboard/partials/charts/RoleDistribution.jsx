import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getClassStatusDistribution } from '../../../../../apis/Admin/AdminDashboard';

export default function RoleDistribution() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const distribution = await getClassStatusDistribution();
        setData(distribution);
      } catch (error) {
        console.error('Failed to fetch class status distribution:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const series = data.map(d => d.count);
  const options = {
    chart: { type: 'donut', fontFamily: 'inherit' },
    labels: data.map(d => d.statusName),
    legend: { position: 'bottom', fontSize: '11px' },
    dataLabels: { dropShadow: { enabled: false }, style: { fontSize: '11px', fontWeight: 700 } },
    stroke: { width: 2, colors: ['#171717'] },
    colors: ['#a3a3a3', '#fbbf24', '#f59e0b', '#171717', '#ef4444'],
    plotOptions: { pie: { donut: { size: '62%' } } },
  };

  return (
    <div className="bg-white border-2 border-neutral-900 p-5 flex flex-col">
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
      <h2 className="text-sm font-black uppercase tracking-wider mb-4 text-neutral-900">{t('admin.dashboard.charts.classStatusDistribution')}</h2>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="donut" height={290} />
      )}
    </div>
  );
}
