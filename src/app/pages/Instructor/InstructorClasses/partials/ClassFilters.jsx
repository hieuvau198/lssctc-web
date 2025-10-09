import React from "react";
import { Input, Select } from "antd";

const { Option } = Select;

const ClassFilters = ({
  searchValue,
  setSearchValue,
  status,
  setStatus,
  onSearch,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Input.Search
        placeholder="Search classes..."
        allowClear
        size="middle"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={onSearch}
        style={{ width: 300 }}
      />
      <Select
        placeholder="Status"
        allowClear
        style={{ width: 140 }}
        value={status}
        onChange={(val) => setStatus(val)}
      >
        <Option value="1">Active</Option>
        <Option value="0">Inactive</Option>
      </Select>
    </div>
  );
};

export default ClassFilters;