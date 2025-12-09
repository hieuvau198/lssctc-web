import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton, Select } from 'antd';
import { getYearlyCompletionTrends } from '../../../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../../../store/authStore';

export default function YearlyCompletionChart() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { nameid: instructorId } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) return;

      try {
        setLoading(true);
        const trends = await getYearlyCompletionTrends(instructorId, year);
        setData(trends);
      } catch (error) {
        console.error('Failed to fetch yearly completion trends:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId, year]);

  const months = [
    t('instructor.dashboard.months.jan'),
    t('instructor.dashboard.months.feb'),
    t('instructor.dashboard.months.mar'),
    t('instructor.dashboard.months.apr'),
    t('instructor.dashboard.months.may'),
    t('instructor.dashboard.months.jun'),
    t('instructor.dashboard.months.jul'),
    t('instructor.dashboard.months.aug'),
    t('instructor.dashboard.months.sep'),
    t('instructor.dashboard.months.oct'),
    t('instructor.dashboard.months.nov'),
    t('instructor.dashboard.months.dec')
  ];
  
  // Map data to months (assuming API returns monthly data)
  const chartData = months.map((month, index) => {
    const monthData = data.find(d => d.month === index + 1);
    return monthData?.completedCount || monthData?.count || 0;
  });

  const series = [{ 
    name: t('instructor.dashboard.completions'), 
    data: chartData 
  }];

  const options = {
    chart: { 
      id: 'yearly-completions', 
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    stroke: { 
      curve: 'smooth', 
      width: 3 
    },
    xaxis: { 
      categories: months,
      labels: { style: { fontSize: '11px' } }
    },
    yaxis: {
      title: { text: t('instructor.dashboard.completions'), style: { fontSize: '12px', fontWeight: 500 } },
      min: 0
    },
    colors: ['#10b981'],
    dataLabels: { enabled: false },
    fill: { 
      type: 'gradient', 
      gradient: { 
        shadeIntensity: 1, 
        opacityFrom: 0.4, 
        opacityTo: 0.05, 
        stops: [0, 90, 100] 
      } 
    },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { 
      theme: 'light', 
      y: { formatter: (val) => t('instructor.dashboard.completedCount', { count: val }) } 
    },
    markers: {
      size: 4,
      colors: ['#10b981'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 6 }
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">{t('instructor.dashboard.yearlyCourseCompletions')}</h2>
        <Select
          size="small"
          value={year}
          onChange={setYear}
          options={years.map(y => ({ value: y, label: y }))}
          style={{ width: 90 }}
        />
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : (
        <Chart options={options} series={series} type="area" height={320} />
      )}
    </div>
  );
}
