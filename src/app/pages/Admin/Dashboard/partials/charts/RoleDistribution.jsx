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
    chart: { type: 'donut' },
    labels: data.map(d => d.statusName),
    legend: { position: 'bottom' },
    dataLabels: { dropShadow: { enabled: false } },
    stroke: { width: 1 },
    colors: ['#9ca3af','#3b82f6','#f59e0b','#10b981','#ef4444'],
    plotOptions: { pie: { donut: { size: '62%' } } },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-2 text-gray-700">{t('admin.dashboard.charts.classStatusDistribution')}</h2>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="donut" height={290} />
      )}
    </div>
  );
}
