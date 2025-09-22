// src/app/pages/SimManager/Dashboard/partials/LiveUsersChart.jsx
import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Card } from 'antd';

export default function LiveUsersChart({ data = [], categories = [], title = 'Live Users' }) {
  const series = useMemo(() => [
    { name: 'Users', data },
  ], [data]);

  const options = useMemo(() => ({
    chart: { id: 'live-users', toolbar: { show: false }, animations: { easing: 'easeinout', speed: 400 } },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { style: { colors: '#64748b' } } },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100] } },
    grid: { borderColor: '#e2e8f0' },
    tooltip: { theme: 'light' },
  }), [categories]);

  return (
    <Card className="border-slate-200 hover:shadow-md transition" title={title}>
      <div className="-mt-2">
        <Chart options={options} series={series} type="area" height={260} />
      </div>
    </Card>
  );
}
