// src/app/pages/SimManager/Dashboard/partials/DurationDistributionChart.jsx
import { Spin } from 'antd';
import Chart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

export default function DurationDistributionChart({ data = [], loading = false }) {
    const { t } = useTranslation();

    // Transform data for pie/donut chart
    const labels = data.map(item => item.range || item.durationRange || item.label || 'Unknown');
    const values = data.map(item => item.count || item.practiceCount || item.value || 0);

    const options = {
        chart: {
            type: 'donut',
            animations: { easing: 'easeinout', speed: 400 },
        },
        labels,
        colors: ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#10b981', '#f59e0b'],
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`,
            style: { fontSize: '12px', fontWeight: 600 },
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '13px',
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '14px', color: '#64748b' },
                        value: { show: true, fontSize: '24px', fontWeight: 700, color: '#8b5cf6' },
                        total: {
                            show: true,
                            label: t('simManager.dashboard.total') || 'Tổng',
                            fontSize: '14px',
                            color: '#64748b',
                        },
                    },
                },
            },
        },
        stroke: { show: true, width: 2, colors: ['#fff'] },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val) => `${val} buổi thực hành`,
            },
        },
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 h-full">
            <div className="p-5">
                <h3 className="font-bold text-slate-800 mb-4">
                    {t('simManager.dashboard.durationDistribution') || 'Phân bố thời lượng thực hành'}
                </h3>
                <Spin spinning={loading}>
                    <div>
                        {data.length > 0 ? (
                            <Chart options={options} series={values} type="donut" height={300} />
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
