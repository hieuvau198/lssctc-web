import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getClassGradeDistribution } from '../../../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../../../store/authStore';

// Grade ranges configuration - Industrial colors
const getGradeRanges = (t) => [
  { key: 'excellent', label: t('instructor.dashboard.grades.excellent'), color: '#fbbf24', min: 90, max: 100 },
  { key: 'good', label: t('instructor.dashboard.grades.good'), color: '#171717', min: 70, max: 89 },
  { key: 'average', label: t('instructor.dashboard.grades.average'), color: '#a3a3a3', min: 50, max: 69 },
  { key: 'belowAverage', label: t('instructor.dashboard.grades.belowAverage'), color: '#737373', min: 30, max: 49 },
  { key: 'poor', label: t('instructor.dashboard.grades.poor'), color: '#ef4444', min: 0, max: 29 },
];

export default function GradeDistributionChart() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { nameid: instructorId } = useAuthStore();
  const gradeRanges = getGradeRanges(t);

  useEffect(() => {
    const fetchData = async () => {
      if (!instructorId) return;

      try {
        setLoading(true);
        const distribution = await getClassGradeDistribution(instructorId);
        setData(distribution);
      } catch (error) {
        console.error('Failed to fetch grade distribution:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [instructorId]);

  const processedData = gradeRanges.map(range => {
    const found = data.find(d =>
      d.gradeRange === range.label ||
      d.rangeName === range.label ||
      (d.minScore >= range.min && d.maxScore <= range.max)
    );
    return {
      ...range,
      count: found?.classCount || found?.count || 0
    };
  });

  const series = processedData.map(d => d.count);
  const labels = processedData.map(d => d.label);
  const colors = processedData.map(d => d.color);

  const options = {
    chart: {
      type: 'pie',
      fontFamily: 'inherit'
    },
    labels: labels,
    legend: {
      position: 'bottom',
      fontSize: '11px',
      markers: { width: 10, height: 10, radius: 0 },
      itemMargin: { horizontal: 8, vertical: 4 }
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const count = opts.w.config.series[opts.seriesIndex];
        return count > 0 ? t('instructor.dashboard.classesCount', { count }) : '';
      },
      dropShadow: { enabled: false },
      style: { fontSize: '11px', fontWeight: 700 }
    },
    stroke: { width: 2, colors: ['#171717'] },
    colors: colors,
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: { size: '0%' }
      }
    },
    tooltip: {
      y: {
        formatter: (val) => t('instructor.dashboard.classesCount', { count: val })
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

  const totalClasses = series.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border-2 border-neutral-900 p-5 flex flex-col h-full">
      <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">{t('instructor.dashboard.classGradeDistribution')}</h2>
        <span className="text-xs text-neutral-900 bg-yellow-400 px-2 py-1 font-bold uppercase">
          {t('instructor.dashboard.classesCount', { count: totalClasses })}
        </span>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : totalClasses === 0 ? (
        <div className="flex-1 flex items-center justify-center text-neutral-400 uppercase tracking-wider font-semibold">
          {t('instructor.dashboard.noGradeData')}
        </div>
      ) : (
        <Chart options={options} series={series} type="pie" height={320} />
      )}
    </div>
  );
}
