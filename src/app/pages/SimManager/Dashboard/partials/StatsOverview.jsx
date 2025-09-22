// src/app/pages/SimManager/Dashboard/partials/StatsOverview.jsx
import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { Users, Activity, PlayCircle, Timer } from 'lucide-react';

export default function StatsOverview({
  activeUsers = 0,
  activeSimulations = 0,
  totalSimulations = 0,
  avgSessionMins = 0,
}) {
  const items = [
    { title: 'Active Users', value: activeUsers, icon: <Users className="w-5 h-5 text-blue-600" /> },
    { title: 'Active Simulations', value: activeSimulations, icon: <Activity className="w-5 h-5 text-blue-600" /> },
    { title: 'Total Simulations', value: totalSimulations, icon: <PlayCircle className="w-5 h-5 text-blue-600" /> },
    { title: 'Avg Session (min)', value: avgSessionMins, icon: <Timer className="w-5 h-5 text-blue-600" /> },
  ];

  return (
    <Row gutter={[16, 16]}>
      {items.map((it) => (
        <Col key={it.title} xs={12} sm={12} md={6}>
          <Card className="border-slate-200 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-500 text-sm">{it.title}</div>
                <Statistic value={it.value} valueStyle={{ color: '#0ea5e9' }} />
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">{it.icon}</div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
