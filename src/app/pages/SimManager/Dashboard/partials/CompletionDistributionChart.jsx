// src/app/pages/SimManager/Dashboard/partials/CompletionDistributionChart.jsx
import { Select, Spin } from 'antd';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

export default function CompletionDistributionChart({
    data = [],
    loading = false,
    year,
    onYearChange,
    availableYears = []
}) {
    const { t } = useTranslation();

    // Transform data for stacked bar chart
    const months = data.map(item => item.month || item.monthName || `Tháng ${item.monthNumber}`);

    const series = [
        {
            name: t('simManager.dashboard.completed') || 'Completed',
            data: data.map(item => item.completed || item.completedCount || 0),
        },
        {
            name: t('simManager.dashboard.notCompleted') || 'Not Completed',
            data: data.map(item => item.notCompleted || item.notCompletedCount || 0),
        },
    ];

    const options = {
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: { show: false },
            animations: { easing: 'easeinout', speed: 400 },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        colors: ['#8b5cf6', '#f97316'], // violet and orange
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: months,
            labels: { style: { colors: '#64748b', fontSize: '12px' } },
        },
        yaxis: {
            labels: { style: { colors: '#64748b' } },
        },
        fill: { opacity: 1 },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        grid: { borderColor: '#e2e8f0' },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val) => `${val} buổi thực hành`,
            },
        },
    };

    const currentYear = new Date().getFullYear();
    const years = availableYears.length > 0
        ? availableYears
        : [currentYear - 2, currentYear - 1, currentYear];

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 h-full">
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">
                        {t('simManager.dashboard.completionDistribution') || 'Phân bố hoàn thành thực hành'}
                    </h3>
                    <Select
                        value={year || currentYear}
                        onChange={onYearChange}
                        size="small"
                        className="!rounded-lg"
                        style={{ width: 100 }}
                        options={years.map(y => ({ value: y, label: y }))}
                    />
                </div>
                <Spin spinning={loading}>
                    <div>
                        {data.length > 0 ? (
                            <Chart options={options} series={series} type="bar" height={300} />
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-slate-400">
                                {t('common.noData') || 'Không có dữ liệu'}
                            </div>
                        )}
                    </div>
                </Spin>
            </div>
        </div>
    );
}
