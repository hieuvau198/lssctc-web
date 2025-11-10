import { Input } from "antd";

const QuizFilters = ({
  searchValue,
  setSearchValue,
  onSearch,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Input.Search
        placeholder="Search quizzes..."
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
