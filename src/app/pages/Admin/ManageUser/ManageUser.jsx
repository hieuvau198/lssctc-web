import { App, Input, Select } from 'antd';
import { FileSpreadsheet, Plus, Users, User, Settings, AlertCircle, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { getInstructors, getTrainees, getSimulationManagers } from '../../../apis/Admin/AdminUser';
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
    { key: 'trainees', icon: Users, label: t('admin.users.trainee'), to: 'trainees' },
    { key: 'instructors', icon: User, label: t('admin.users.instructor'), to: 'instructors' },
    { key: 'simulation-managers', icon: Settings, label: t('admin.users.simulatorManager'), to: 'simulation-managers' },
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

  // Local state for search input
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTermParam);

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

  const getImportLabel = () => {
    if (activeKey === 'trainees') return t('admin.users.import.importTraineeBtn');
    if (activeKey === 'simulation-managers') return t('admin.users.import.importSimManagerBtn');
    return t('admin.users.import.importInstructorBtn');
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

  const handleSearch = (value) => {
    updateSearchParams({ searchTerm: value, page: 1 });
  };

  const handleStatusChange = (value) => {
    updateSearchParams({ status: value, page: 1 });
  };

  const handleImportClick = () => {
    if (activeKey === 'trainees') setImportModalVisible(true);
    else if (activeKey === 'instructors') setImportInstructorModalVisible(true);
    else if (activeKey === 'simulation-managers') setImportSimManagerModalVisible(true);
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-60px)] flex flex-col pb-2">
      {/* Header - Industrial Theme */}
      <div className="bg-neutral-800 border-2 border-black px-4 py-3 mb-0 flex-none z-10">
        <div className="h-1 bg-yellow-400 -mx-4 -mt-3 mb-3" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight leading-none block">
                {t('admin.users.title')}
              </span>
              <p className="text-yellow-400 text-xs mt-0.5 font-bold">
                {activeKey === 'trainees' && `${traineeData.totalCount} ${t('admin.users.trainee').toLowerCase()}`}
                {activeKey === 'instructors' && `${instructorData.totalCount} ${t('admin.users.instructor').toLowerCase()}`}
                {activeKey === 'simulation-managers' && `${simManagerData.totalCount} ${t('admin.users.simulatorManager').toLowerCase()}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImportClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-neutral-100 hover:scale-[1.02] transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              {getImportLabel()}
            </button>
            <button
              onClick={() => setDrawerVisible(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-xs border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              {getButtonLabel()}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border-x-2 border-b-2 border-black overflow-hidden flex-1 flex flex-col min-h-0">

        {/* Industrial Tabs */}
        <div className="border-b-2 border-neutral-200 flex-none bg-neutral-50/50">
          <div className="flex gap-0 overflow-x-auto">
            {MENU_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`px-5 py-2.5 font-bold uppercase tracking-wider text-xs border-b-4 transition-all whitespace-nowrap flex items-center gap-2 ${activeKey === item.key
                    ? 'border-yellow-400 text-black bg-white'
                    : 'border-transparent text-neutral-500 hover:text-black hover:border-neutral-300 hover:bg-neutral-100'
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Integrated Search Bar */}
        <div className="px-4 py-2 bg-white border-b-2 border-neutral-200 flex-none shadow-sm z-10">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Custom Search Input */}
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder={t('admin.users.searchPlaceholder') || "Search..."}
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(localSearchTerm)}
                className="w-full h-9 pl-10 pr-4 bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white focus:ring-1 focus:ring-black font-medium text-sm text-black placeholder-neutral-400 transition-all outline-none"
              />
              {localSearchTerm && (
                <button
                  onClick={() => { setLocalSearchTerm(''); handleSearch(''); }}
                  className="absolute inset-y-0 right-10 flex items-center pr-2 text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => handleSearch(localSearchTerm)}
                className="absolute inset-y-0 right-0 flex items-center px-4 bg-yellow-400 text-black font-bold uppercase text-xs border-l border-black hover:bg-yellow-500 transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Status Filter */}
            <Select
              placeholder={t('admin.users.filterStatus') || "Status"}
              allowClear
              value={statusFilter}
              onChange={handleStatusChange}
              size="middle"
              style={{ width: 150 }}
              className="industrial-select-compact"
            >
              <Option value={undefined}>{t('common.all') || "All"}</Option>
              <Option value={true}>{t('common.active') || "Active"}</Option>
              <Option value={false}>{t('common.inactive') || "Inactive"}</Option>
            </Select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <Outlet
            context={{
              setDrawerVisible,
              refreshTrigger,
              traineeData,
              loadingTrainees,
              page,
              pageSize,
              setPage,
              setPageSize,
              instructorData,
              loadingInstructors,
              simManagerData,
              loadingSimManagers,
              tableScroll: { y: 'calc(100vh - 350px)' }
            }}
          />
        </div>
      </div>

      {/* Industrial Select Styles */}
      <style>{`
        .industrial-select-compact .ant-select-selector {
          border: 1px solid #d4d4d4 !important;
          height: 36px !important;
          background-color: #fafafa !important;
        }
        .industrial-select-compact.ant-select-focused .ant-select-selector {
          border-color: #000 !important;
          box-shadow: 0 0 0 1px #000 !important;
        }
        .industrial-select-compact .ant-select-selection-item,
        .industrial-select-compact .ant-select-selection-placeholder {
          line-height: 34px !important;
          font-weight: 500 !important;
          font-size: 13px !important;
        }
        .industrial-modal .ant-modal-content {
          border: 2px solid #000 !important;
          border-radius: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        .industrial-modal .ant-modal-header {
          border-radius: 0 !important;
          border-bottom: 2px solid #000 !important;
          margin-bottom: 0 !important;
          background: #fff !important;
          padding: 16px 24px !important;
        }
        .industrial-modal .ant-modal-title {
          font-weight: 900 !important;
          text-transform: uppercase !important;
        }
        .industrial-modal .ant-modal-close {
          top: 16px !important;
          right: 20px !important;
        }
        .industrial-modal .ant-modal-body {
          padding: 24px !important;
        }
        .industrial-modal .ant-modal-footer {
          padding: 20px 24px !important;
          border-top: 2px solid #000 !important;
          text-align: right !important;
          background: #fff !important;
        }
      `}</style>

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
