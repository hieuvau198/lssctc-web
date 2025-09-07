import React from 'react';
import Chart from 'react-apexcharts';

export default function EnrollmentTrend() {
  const series = [{ name: 'Enrollments', data: [21, 32, 45, 51, 62, 70, 78, 88, 97, 109, 120, 134] }];
  const options = {
    chart: { id: 'enrollment-trend', toolbar: { show: false }, sparkline: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    colors: ['#2563eb'],
    dataLabels: { enabled: false },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] } },
    grid: { borderColor: '#eee' },
    tooltip: { theme: 'light' }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-2 text-gray-700">Enrollment Trend (12m)</h2>
      <Chart options={options} series={series} type="area" height={260} />
    </div>
  );
}
