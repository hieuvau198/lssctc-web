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
            fontFamily: 'inherit',
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 0,
            },
        },
        colors: ['#fbbf24', '#171717'],
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: months,
            labels: { style: { colors: '#525252', fontSize: '12px' } },
        },
        yaxis: {
            labels: { style: { colors: '#525252' } },
        },
        fill: { opacity: 1 },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            fontSize: '11px',
            fontWeight: 700,
            markers: { width: 10, height: 10, radius: 0 },
        },
        grid: { borderColor: '#e5e5e5', strokeDashArray: 4 },
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
        <div className="bg-white border-2 border-neutral-900 h-full">
            <div className="h-1 bg-yellow-400" />
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-neutral-900 uppercase tracking-wider text-sm">
                        {t('simManager.dashboard.completionDistribution') || 'Phân bố hoàn thành thực hành'}
                    </h3>
                    <Select
                        value={year || currentYear}
                        onChange={onYearChange}
                        size="small"
                        style={{ width: 100 }}
                        options={years.map(y => ({ value: y, label: y }))}
                    />
                </div>
                <Spin spinning={loading}>
                    <div>
                        {data.length > 0 ? (
                            <Chart options={options} series={series} type="bar" height={300} />
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-neutral-400 uppercase tracking-wider font-semibold">
                                {t('common.noData') || 'Không có dữ liệu'}
                            </div>
                        )}
                    </div>
                </Spin>
            </div>
        </div>
    );
}
