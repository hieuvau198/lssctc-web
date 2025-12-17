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
            fontFamily: 'inherit',
        },
        labels,
        colors: ['#fbbf24', '#171717', '#a3a3a3', '#737373', '#404040', '#262626'],
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}%`,
            style: { fontSize: '12px', fontWeight: 700 },
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '11px',
            fontWeight: 700,
            markers: { width: 10, height: 10, radius: 0 },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        name: { show: true, fontSize: '14px', fontWeight: 700, color: '#171717' },
                        value: { show: true, fontSize: '24px', fontWeight: 900, color: '#171717' },
                        total: {
                            show: true,
                            label: t('simManager.dashboard.total') || 'Tổng',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#525252',
                        },
                    },
                },
            },
        },
        stroke: { show: true, width: 2, colors: ['#171717'] },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val) => `${val} buổi thực hành`,
            },
        },
    };

    return (
        <div className="bg-white border-2 border-neutral-900 h-full">
            <div className="h-1 bg-yellow-400" />
            <div className="p-5">
                <h3 className="font-black text-neutral-900 uppercase tracking-wider text-sm mb-4">
                    {t('simManager.dashboard.durationDistribution') || 'Phân bố thời lượng thực hành'}
                </h3>
                <Spin spinning={loading}>
                    <div>
                        {data.length > 0 ? (
                            <Chart options={options} series={values} type="donut" height={300} />
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
