import {
  ExperimentOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { App, Menu, Button } from 'antd';
import { Outlet, Link, useLocation } from 'react-router';
import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import DrawerAdd from './partials/DrawerAdd';

const MENU_ITEMS = [
  { key: 'trainees', icon: <TeamOutlined />, label: 'Trainee', to: 'trainees' },
  { key: 'instructors', icon: <UserOutlined />, label: 'Instructor', to: 'instructors' },
  { key: 'simulation-managers', icon: <ExperimentOutlined />, label: 'Simulator Manager', to: 'simulation-managers' },
];

export default function ManageUser() {
  const { message } = App.useApp();
  const location = useLocation();

  // derive active key from current pathname (last segment)
  const [drawerVisible, setDrawerVisible] = useState(false);

  const activeKey = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    // map possible empty or base `/users` to 'instructors' by default
    if (!last || last === 'users') return 'instructors';
    // normalize
    if (last === 'simulation-managers' || last === 'simulation-managers') return 'simulation-managers';
    if (last === 'trainees') return 'trainees';
    if (last === 'instructors') return 'instructors';
    return last;
  }, [location.pathname]);

  const getButtonLabel = () => {
    if (activeKey === 'trainees') return 'Add Trainee';
    if (activeKey === 'simulation-managers') return 'Add Simulation Manager';
    return 'Add Instructor';
  };

  const getRole = () => {
    if (activeKey === 'trainees') return 'trainee';
    if (activeKey === 'simulation-managers') return 'simulation-manager';
    return 'instructor';
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-2">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-2xl">Manage Users</span>
        <Button type="primary" icon={<Plus size={18}/>} onClick={() => setDrawerVisible(true)}>
          {getButtonLabel()}
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-slate-200">
          <Menu
            mode="horizontal"
            selectedKeys={[activeKey]}
            items={MENU_ITEMS.map((it) => ({
              key: it.key,
              icon: it.icon,
              label: <Link to={it.to}>{it.label}</Link>,
            }))}
          />
        </div>

        <div className="p-4">
          {/* Render the nested route (trainees, instructors, simulation-managers) */}
          <Outlet context={{ setDrawerVisible }} />
        </div>
      </div>

      <DrawerAdd
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        role={getRole()}
      />
    </div>
  );
}
