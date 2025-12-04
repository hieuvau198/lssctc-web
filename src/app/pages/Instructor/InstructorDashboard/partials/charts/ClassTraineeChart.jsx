import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Skeleton } from 'antd';
import { getTopClassesByTrainees } from '../../../../../apis/Instructor/InstructorDashboard';
import useAuthStore from '../../../../../store/authStore';

export default function ClassTraineeChart() {
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
    name: 'Trainees', 
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
        borderRadius: 6, 
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
      title: { text: 'Number of Trainees', style: { fontSize: '12px', fontWeight: 500 } }
    },
    colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#eab308'],
    dataLabels: { 
      enabled: true,
      style: { fontSize: '11px', fontWeight: 600 }
    },
    legend: { show: false },
    grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
    tooltip: { 
      theme: 'light', 
      y: { formatter: (val) => val + ' trainees' } 
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full">
      <h2 className="text-sm font-semibold mb-4 text-gray-700">Trainees by Class</h2>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No class data available
        </div>
      ) : (
        <Chart options={options} series={series} type="bar" height={320} />
      )}
    </div>
  );
}
