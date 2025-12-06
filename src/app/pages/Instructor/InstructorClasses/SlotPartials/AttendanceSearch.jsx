import { Input } from 'antd';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AttendanceSearch({ searchText, setSearchText }) {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <Input
        placeholder={t('attendance.searchStudent', 'Tìm học viên...')}
        prefix={<Search className="w-4 h-4 text-gray-400" />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="large"
        allowClear
      />
    </div>
  );
}
