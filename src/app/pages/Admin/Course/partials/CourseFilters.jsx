import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Input, Select } from "antd";
import { Search, Plus } from 'lucide-react';
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
  const { t } = useTranslation();
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
    <>
      <style>{`
        .industrial-filters .ant-input,
        .industrial-filters .ant-select-selector {
          border-radius: 0 !important;
          border: 2px solid #e5e5e5 !important;
          font-weight: 500 !important;
        }
        .industrial-filters .ant-input:hover,
        .industrial-filters .ant-input:focus,
        .industrial-filters .ant-select-selector:hover,
        .industrial-filters .ant-select-focused .ant-select-selector {
          border-color: #facc15 !important;
        }
        .industrial-filters .ant-input-affix-wrapper {
          border-radius: 0 !important;
          border: 2px solid #e5e5e5 !important;
        }
        .industrial-filters .ant-input-affix-wrapper:hover,
        .industrial-filters .ant-input-affix-wrapper-focused {
          border-color: #facc15 !important;
        }
      `}</style>

      <div className="flex flex-wrap items-center gap-3 mb-4 industrial-filters">
        <div className="relative">
          <Input
            placeholder={t('admin.courses.searchPlaceholder', 'Search courses...')}
            allowClear
            prefix={<Search className="w-4 h-4 text-neutral-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 240 }}
            className="h-10"
          />
        </div>

        <Select
          placeholder={t('common.category')}
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
          placeholder={t('common.level')}
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
          placeholder={t('common.status')}
          allowClear
          style={{ width: 140 }}
          value={isActive}
          onChange={(val) => {
            if (val === undefined) setIsActive(undefined);
            else if (val === true || val === false) setIsActive(val);
            else setIsActive(val === "true");
          }}
        >
          <Option value={true}>{t('common.active')}</Option>
          <Option value={false}>{t('common.inactive')}</Option>
        </Select>

        <button
          onClick={onAddCourse}
          className="h-10 px-4 bg-yellow-400 border-2 border-black text-black font-bold uppercase tracking-wider text-xs hover:bg-yellow-500 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('admin.courses.addNewCourse')}
        </button>
      </div>
    </>
  );
};

export default CourseFilters;
