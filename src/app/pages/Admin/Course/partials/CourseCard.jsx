import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, Tag, Button, Tooltip, Popconfirm } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";

const CourseCard = ({ course, onSelect, onEdit, onDelete, deletingId }) => {
  const { t } = useTranslation();

  return (
    <Card
      hoverable
      className="rounded-lg shadow flex flex-col h-full"
      cover={
        <div
          className="h-40 overflow-hidden cursor-pointer"
          onClick={() => onSelect(course)}
        >
          <img
            alt={course.name}
            src={course.imageUrl}
            className="object-cover h-full w-full"
          />
        </div>
      }
      actions={[
        <Tooltip title={t('admin.courses.viewDetails')} key="view">
          <Button
            type="text"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => onSelect(course)}
          />
        </Tooltip>,
        <Tooltip title={t('admin.courses.editCourse')} key="edit">
          <Button
            type="text"
            icon={<Pencil className="w-4 h-4" />}
            onClick={() => onEdit(course)}
          />
        </Tooltip>,
        <Tooltip title={t('admin.courses.deleteCourseTitle')} key="delete">
          <Popconfirm
            title={t('admin.courses.deleteCourseTitle')}
            description={t('admin.courses.deleteConfirm')}
            onConfirm={() => onDelete(course.id)}
            okButtonProps={{ loading: deletingId === course.id }}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 className="w-4 h-4" />}
              loading={deletingId === course.id}
            />
          </Popconfirm>
        </Tooltip>,
      ]}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="font-semibold text-slate-900 line-clamp-2 flex-1 cursor-pointer"
            onClick={() => onSelect(course)}
          >
            {course.name}
          </h3>
          <Tag color={course.isActive ? "green" : "red"} className="m-0">
            {course.isActive ? t('common.active') : t('common.inactive')}
          </Tag>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
          {course.description}
        </p>
        <div className="mt-auto pt-3 border-t text-xs text-slate-700 space-y-1">
          <div>
            <span className="font-medium">{t('common.category')}:</span> {course.category}
          </div>
          <div>
            <span className="font-medium">{t('common.level')}:</span> {course.level}
          </div>
          <div>
            <span className="font-medium">{t('common.duration')}:</span> {course.durationHours}h
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
