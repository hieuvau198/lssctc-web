import IndustrialSearchBar from "../../../../components/Industrial/IndustrialSearchBar";
import { useTranslation } from 'react-i18next';

const QuizFilters = ({
  searchValue,
  setSearchValue,
  onSearch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <IndustrialSearchBar
        placeholder={t('instructor.quizzes.filters.searchPlaceholder')}
        value={searchValue}
        onChange={setSearchValue}
        onSearch={onSearch}
        className="!bg-transparent !border-none !p-0"
      />
    </div>
  );
};

export default QuizFilters;
