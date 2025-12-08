import {
  ExperimentOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { App, Button, Input, Menu, Select } from 'antd';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { getInstructors, getTrainees, getSimulationManagers } from '../../../apis/Admin/AdminUser'; // Ensure import
import DrawerAdd from './partials/DrawerAdd';
import ImportInstructorModal from './partials/ImportInstructorModal';
import ImportSimulationManagerModal from './partials/ImportSimulationManagerModal';
import ImportTraineeModal from './partials/ImportTraineeModal';

const { Option } = Select;

export default function ManageUser() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const MENU_ITEMS = [
    { key: 'trainees', icon: <TeamOutlined />, label: t('admin.users.trainee'), to: 'trainees' },
    { key: 'instructors', icon: <UserOutlined />, label: t('admin.users.instructor'), to: 'instructors' },
    { key: 'simulation-managers', icon: <ExperimentOutlined />, label: t('admin.users.simulatorManager'), to: 'simulation-managers' },
  ];

  // UI State
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importInstructorModalVisible, setImportInstructorModalVisible] = useState(false);
  const [importSimManagerModalVisible, setImportSimManagerModalVisible] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Data State
  const [traineeData, setTraineeData] = useState({ items: [], totalCount: 0 });
  const [loadingTrainees, setLoadingTrainees] = useState(false);
  const [instructorData, setInstructorData] = useState({ items: [], totalCount: 0 });
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [simManagerData, setSimManagerData] = useState({ items: [], totalCount: 0 });
  const [loadingSimManagers, setLoadingSimManagers] = useState(false);

  // State from URL
  const page = parseInt(searchParams.get('page')) || 1;
  const pageSize = parseInt(searchParams.get('pageSize')) || 10;
  const searchTermParam = searchParams.get('searchTerm') || '';
  const statusParam = searchParams.get('status');
  const statusFilter = statusParam === 'true' ? true : (statusParam === 'false' ? false : undefined);

  // Local state for search input to allow typing
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTermParam);

  // Sync local state if URL param changes externally (e.g. back/forward navigation)
  useEffect(() => {
    setLocalSearchTerm(searchTermParam);
  }, [searchTermParam]);

  // Derive active key
  const activeKey = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    if (!last || last === 'users') return 'instructors';
    if (last === 'simulation-managers') return 'simulation-managers';
    if (last === 'trainees') return 'trainees';
    if (last === 'instructors') return 'instructors';
    return last;
  }, [location.pathname]);

  const updateSearchParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') {
        updated.delete(k);
      } else {
        updated.set(k, v);
      }
    });
    setSearchParams(updated);
  };

  const setPage = (p) => updateSearchParams({ page: p });
  const setPageSize = (ps) => updateSearchParams({ pageSize: ps, page: 1 });

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

  // Fetch Logic
  useEffect(() => {
    if (activeKey === 'trainees') {
      const fetchTraineesData = async () => {
        setLoadingTrainees(true);
        try {
          const res = await getTrainees({
            pageNumber: page,
            pageSize,
            searchTerm: searchTermParam,
            isActive: statusFilter
          });
          setTraineeData(res);
        } catch (err) {
          console.error("Failed to fetch trainees", err);
          message.error("Failed to fetch trainees");
        } finally {
          setLoadingTrainees(false);
        }
      };

      const timer = setTimeout(() => {
        fetchTraineesData();
      }, 300);
      return () => clearTimeout(timer);
    } else if (activeKey === 'instructors') {
      const fetchInstructorsData = async () => {
        setLoadingInstructors(true);
        try {
          const res = await getInstructors({
            pageNumber: page,
            pageSize,
            searchTerm: searchTermParam,
            isActive: statusFilter
          });
          setInstructorData(res);
        } catch (err) {
          console.error("Failed to fetch instructors", err);
          message.error("Failed to fetch instructors");
        } finally {
          setLoadingInstructors(false);
        }
      };

      const timer = setTimeout(() => {
        fetchInstructorsData();
      }, 300);
      return () => clearTimeout(timer);
    } else if (activeKey === 'simulation-managers') {
      const fetchSimManagersData = async () => {
        setLoadingSimManagers(true);
        try {
          const res = await getSimulationManagers({
            pageNumber: page,
            pageSize,
            searchTerm: searchTermParam,
            isActive: statusFilter
          });
          setSimManagerData(res);
        } catch (err) {
          console.error("Failed to fetch simulation managers", err);
          message.error("Failed to fetch simulation managers");
        } finally {
          setLoadingSimManagers(false);
        }
      };

      const timer = setTimeout(() => {
        fetchSimManagersData();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeKey, page, pageSize, searchTermParam, statusFilter, refreshTrigger, message]);

  // Handle Search/Filter changes
  const handleSearch = (value) => {
    updateSearchParams({ searchTerm: value, page: 1 });
  };

  const handleStatusChange = (value) => {
    updateSearchParams({ status: value, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 py-2">
      {/* Header Title */}
      <div className="mb-2 flex justify-between items-center">
        <span className="text-2xl">{t('admin.users.title')}</span>
      </div>

      {/* Controls Row: Search/Filter + Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-4">
        {/* Left Side: Search & Filters (Only for Trainees for now) */}
        <div className="flex flex-col md:flex-row gap-2 w-full xl:w-auto items-center flex-1">
          {['trainees', 'instructors', 'simulation-managers'].includes(activeKey) && (
            <>
              <Input.Search
                placeholder={t('admin.users.searchPlaceholder') || "Search user..."}
                allowClear
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onSearch={handleSearch}
                style={{ width: '100%', maxWidth: 600 }}
                className="md:w-[600px]"
              />
              <Select
                placeholder={t('admin.users.filterStatus') || "Status"}
                allowClear
                value={statusFilter}
                onChange={handleStatusChange}
                style={{ width: 150 }}
              >
                <Option value={undefined}>{t('common.all') || "All"}</Option>
                <Option value={true}>{t('common.active') || "Active"}</Option>
                <Option value={false}>{t('common.inactive') || "Inactive"}</Option>
              </Select>
            </>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex gap-2 w-full md:w-auto justify-end shrink-0">
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
          <Outlet
            context={{
              setDrawerVisible,
              refreshTrigger,
              // Trainee specific context
              traineeData,
              loadingTrainees,
              page,
              pageSize,
              setPage,
              setPageSize,
              // Instructor specific context
              instructorData,
              loadingInstructors,
              // Sim Manager specific context
              simManagerData,
              loadingSimManagers
            }}
          />
        </div>
      </div>

      <DrawerAdd
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        role={getRole()}
        onCreated={() => setRefreshTrigger(prev => prev + 1)}
      />

      <ImportTraineeModal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onSuccess={() => {
          setImportModalVisible(false);
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
