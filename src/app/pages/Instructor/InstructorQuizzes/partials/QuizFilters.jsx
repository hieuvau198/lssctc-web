import { Input } from "antd";
import { useTranslation } from 'react-i18next';

const QuizFilters = ({
  searchValue,
  setSearchValue,
  onSearch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4">
      <Input.Search
        placeholder={t('instructor.quizzes.filters.searchPlaceholder')}
        allowClear
        size="middle"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={onSearch}
        style={{ width: 300 }}
      />
    </div>
  );
};

export default QuizFilters;
