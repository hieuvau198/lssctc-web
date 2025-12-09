import { Input, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const ClassFilters = ({
  searchValue,
  setSearchValue,
  status,
  setStatus,
  onSearch,
}) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-4">
      <Input.Search
        placeholder={t('instructor.classes.filters.searchPlaceholder')}
        allowClear
        size="middle"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={onSearch}
        style={{ width: 300 }}
      />
      <Select
        placeholder={t('instructor.classes.filters.status')}
        allowClear
        style={{ width: 140 }}
        value={status}
        onChange={(val) => setStatus(val)}
      >
        <Option value="1">{t('instructor.classes.filters.active')}</Option>
        <Option value="0">{t('instructor.classes.filters.inactive')}</Option>
      </Select>
    </div>
  );
};

export default ClassFilters;