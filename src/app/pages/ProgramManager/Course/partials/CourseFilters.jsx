import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "antd";
import {
  fetchCourseCategories,
  fetchCourseLevels,
} from "../../../../apis/ProgramManager/CourseApi";

const { Option } = Select;

const CourseFilters = ({
  searchValue,
  setSearchValue,
  categoryId,
  setCategoryId,
  levelId,
  setLevelId,
  isActive,
  setIsActive,
  onAddCourse,
}) => {
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    fetchCourseCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
    fetchCourseLevels()
      .then((data) => setLevels(data))
      .catch(() => setLevels([]));
  }, []);

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Input
        placeholder="Search courses"
        allowClear
        size="large"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ width: 220 }}
      />
      <Select
        placeholder="Category"
        allowClear
        style={{ width: 180 }}
        value={categoryId}
        onChange={(val) =>
          setCategoryId(val !== undefined ? Number(val) : undefined)
        }
      >
        {categories.map((cat) => (
          <Option key={cat.id} value={cat.id}>
            {cat.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Level"
        allowClear
        style={{ width: 140 }}
        value={levelId}
        onChange={(val) =>
          setLevelId(val !== undefined ? Number(val) : undefined)
        }
      >
        {levels.map((lvl) => (
          <Option key={lvl.id} value={lvl.id}>
            {lvl.name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Status"
        allowClear
        style={{ width: 140 }}
        value={isActive}
        onChange={(val) => {
          if (val === undefined) setIsActive(undefined);
          else if (val === true || val === false) setIsActive(val);
          else setIsActive(val === "true");
        }}
      >
        <Option value={true}>Active</Option>
        <Option value={false}>Inactive</Option>
      </Select>
      <Button type="primary" onClick={onAddCourse}>
        + Add New Course
      </Button>
    </div>
  );
};

export default CourseFilters;
