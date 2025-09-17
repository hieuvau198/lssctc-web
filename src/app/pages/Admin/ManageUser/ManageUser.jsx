import React, { useMemo, useState } from 'react';
import { Menu } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import InstructorTable from './partials/InstructorTable';
import TraineeTable from './partials/TraineeTable';
import SimulatorManagerTable from './partials/SimulatorManagerTable';

export default function ManageUser() {
  const [activeKey, setActiveKey] = useState('instructor');

  const items = useMemo(() => ([
    {
      key: 'instructor',
      icon: <UserOutlined />,
      label: 'Instructor',
    },
    {
      key: 'trainee',
      icon: <TeamOutlined />,
      label: 'Trainee',
    },
    {
      key: 'sim-manager',
      icon: <ExperimentOutlined />,
      label: 'Simulator Manager',
    },
  ]), []);

  return (
    <div className="max-w-[1380px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Users</h1>
        <p className="text-slate-600">View and manage users by role.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-slate-200">
          <Menu
            mode="horizontal"
            selectedKeys={[activeKey]}
            onClick={(e) => setActiveKey(e.key)}
            items={items}
          />
        </div>

        <div className="p-4">
          {activeKey === 'instructor' && <InstructorTable />}
          {activeKey === 'trainee' && <TraineeTable />}
          {activeKey === 'sim-manager' && <SimulatorManagerTable />}
        </div>
      </div>
    </div>
  );
}
