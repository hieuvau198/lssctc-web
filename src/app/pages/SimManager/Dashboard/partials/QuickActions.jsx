// src/app/pages/SimManager/Dashboard/partials/QuickActions.jsx
import React from 'react';
import { Card, Button, Space } from 'antd';
import { Settings, PlusCircle, Wrench } from 'lucide-react';

export default function QuickActions({ onCreate, onManageComponents, onSettings }) {
  return (
    <Card className="border-slate-200 hover:shadow-md transition" title="Quick Actions">
      <Space wrap>
        <Button type="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={onCreate}>
          New Simulation
        </Button>
        <Button icon={<Wrench className="w-4 h-4" />} onClick={onManageComponents}>
          Manage Components
        </Button>
        <Button icon={<Settings className="w-4 h-4" />} onClick={onSettings}>
          Settings
        </Button>
      </Space>
    </Card>
  );
}
