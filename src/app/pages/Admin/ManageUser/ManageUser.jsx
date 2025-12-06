import {
  ExperimentOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { App, Button, Menu } from 'antd';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router';
import DrawerAdd from './partials/DrawerAdd';
import ImportInstructorModal from './partials/ImportInstructorModal';
import ImportSimulationManagerModal from './partials/ImportSimulationManagerModal';
import ImportTraineeModal from './partials/ImportTraineeModal';

export default function ManageUser() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const location = useLocation();

  const MENU_ITEMS = [
    { key: 'trainees', icon: <TeamOutlined />, label: t('admin.users.trainee'), to: 'trainees' },
    { key: 'instructors', icon: <UserOutlined />, label: t('admin.users.instructor'), to: 'instructors' },
    { key: 'simulation-managers', icon: <ExperimentOutlined />, label: t('admin.users.simulatorManager'), to: 'simulation-managers' },
  ];

  // derive active key from current pathname (last segment)
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importInstructorModalVisible, setImportInstructorModalVisible] = useState(false);
  const [importSimManagerModalVisible, setImportSimManagerModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    if (activeKey === 'trainees') return t('admin.users.addTrainee');
    if (activeKey === 'simulation-managers') return t('admin.users.addSimulationManager');
    return t('admin.users.addInstructor');
  };

  const getRole = () => {
    if (activeKey === 'trainees') return 'trainee';
    if (activeKey === 'simulation-managers') return 'simulation-manager';
    return 'instructor';
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-2">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-2xl">{t('admin.users.title')}</span>
        <div className="flex gap-2">
          {activeKey === 'trainees' && (
            <Button
              icon={<FileSpreadsheet size={18} />}
              onClick={() => setImportModalVisible(true)}
            >
              {t('admin.users.import.importTraineeBtn')}
            </Button>
          )}
          {activeKey === 'instructors' && (
            <Button
              icon={<FileSpreadsheet size={18} />}
              onClick={() => setImportInstructorModalVisible(true)}
            >
              {t('admin.users.import.importInstructorBtn')}
            </Button>
          )}
          {activeKey === 'simulation-managers' && (
            <Button
              icon={<FileSpreadsheet size={18} />}
              onClick={() => setImportSimManagerModalVisible(true)}
            >
              {t('admin.users.import.importSimManagerBtn')}
            </Button>
          )}
          <Button type="primary" icon={<Plus size={18} />} onClick={() => setDrawerVisible(true)}>
            {getButtonLabel()}
          </Button>
        </div>
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
          <Outlet context={{ setDrawerVisible, refreshTrigger }} />
        </div>
      </div>

      <DrawerAdd
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        role={getRole()}
      />

      <ImportTraineeModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onSuccess={() => {
          setImportModalVisible(false);
          // message.success('Trainees imported successfully'); // Moved to Modal for better control
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      <ImportInstructorModal
        visible={importInstructorModalVisible}
        onCancel={() => setImportInstructorModalVisible(false)}
        onSuccess={() => {
          setImportInstructorModalVisible(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      <ImportSimulationManagerModal
        visible={importSimManagerModalVisible}
        onCancel={() => setImportSimManagerModalVisible(false)}
        onSuccess={() => {
          setImportSimManagerModalVisible(false);
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
}
