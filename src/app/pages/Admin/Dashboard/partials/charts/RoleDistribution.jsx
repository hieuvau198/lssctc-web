import React from 'react';
import Chart from 'react-apexcharts';

export default function RoleDistribution() {
  const series = [44, 27, 19, 7, 3];
  const options = {
    chart: { type: 'donut' },
    labels: ['Learner', 'Instructor', 'Admin', 'Simulator Mgr', 'Other'],
    legend: { position: 'bottom' },
    dataLabels: { dropShadow: { enabled: false } },
    stroke: { width: 1 },
    colors: ['#3b82f6','#10b981','#f59e0b','#6366f1','#9ca3af'],
    plotOptions: { pie: { donut: { size: '62%' } } },
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-2 text-gray-700">User Role Distribution</h2>
      <Chart options={options} series={series} type="donut" height={260} />
    </div>
  );
}
