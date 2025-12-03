import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getActiveTrainees } from '../../../../../apis/Admin/AdminDashboard';

export default function UpcomingSessions() {
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

  const series = [{ name: 'Enrolled Courses', data: data.map(t => t.enrolledCourseCount) }];
  const options = {
    chart: { id: 'active-trainees', toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '60%' } },
    xaxis: { 
      categories: data.map(t => t.traineeName),
      labels: { 
        rotate: -45,
        rotateAlways: true,
        style: { fontSize: '10px' },
        trim: true,
        maxHeight: 80
      }
    },
    colors: ['#10b981'],
    dataLabels: { enabled: false },
    grid: { borderColor: '#eee' },
    tooltip: { theme: 'light', y: { formatter: (val) => val + ' courses' } }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-2 text-gray-700">Most Active Trainees</h2>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Chart options={options} series={series} type="bar" height={280} />
      )}
    </div>
  );
}
