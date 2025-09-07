import React from 'react';
import Chart from 'react-apexcharts';

export default function CourseCompletion() {
  const series = [68];
  const options = {
    chart: { type: 'radialBar' },
    plotOptions: { radialBar: { hollow: { size: '60%' }, dataLabels: { value: { formatter: (v) => v + '%'} } } },
    labels: ['Avg Completion'],
    colors: ['#10b981'],
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-2 text-gray-700">Course Completion Rate</h2>
      <Chart options={options} series={series} type="radialBar" height={260} />
    </div>
  );
}
