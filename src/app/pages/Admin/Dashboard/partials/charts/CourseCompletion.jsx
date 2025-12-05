import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton, Select } from 'antd';
import { getDailyCompletionTrends } from '../../../../../apis/Admin/AdminDashboard';

export default function CourseCompletion() {
  const { t } = useTranslation();
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const trends = await getDailyCompletionTrends(month, year);
        setData(trends);
      } catch (error) {
        console.error('Failed to fetch daily completion trends:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, year]);

  const series = [{ name: t('admin.dashboard.charts.completions'), data: data.map(d => d.completedCount) }];
  const options = {
    chart: { id: 'completion-trends', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: data.map(d => `${t('admin.dashboard.charts.day')} ${d.day}`) },
    colors: ['#10b981'],
    dataLabels: { enabled: false },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] } },
    grid: { borderColor: '#eee' },
    tooltip: { theme: 'light', y: { formatter: (val) => val + ' ' + t('admin.dashboard.charts.completed') } }
  };

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-700">{t('admin.dashboard.charts.dailyCourseCompletions')}</h2>
        <div className="flex gap-2">
          <Select
            size="small"
            value={month}
            onChange={setMonth}
            options={months}
            style={{ width: 100 }}
          />
          <Select
            size="small"
            value={year}
            onChange={setYear}
            options={years.map(y => ({ value: y, label: y }))}
            style={{ width: 80 }}
          />
        </div>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="area" height={290} />
      )}
    </div>
  );
}
