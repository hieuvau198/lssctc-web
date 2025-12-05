import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, Tag, Button, Tooltip, Popconfirm } from "antd";
import { getClassStatus } from "../../../../utils/classStatus";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

/**
 * @param {Object} props
 * @param {Object} props.classItem
 * @param {Function} props.onDetail
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {string|number} props.deletingId
 * @param {boolean} props.compact - Compact mode for dropdown display
 */
const PMClassCard = ({ classItem, onDetail, onEdit, onDelete, deletingId, compact = false }) => {
  const { t } = useTranslation();
  // Compact mode for dropdown display
  if (compact) {
    return (
      <div className="border rounded p-3 bg-white hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start mb-2">
          <h4 
            className="font-medium text-sm cursor-pointer hover:text-blue-600"
            onClick={() => onDetail && onDetail(classItem)}
            title={t('admin.classes.viewClassDetail')}
          >
            {classItem.name}
          </h4>
            {(() => {
              const s = getClassStatus(classItem.status);
              return (
                <Tag size="small" color={s.color}>
                  {t(`common.classStatus.${s.key}`)}
                </Tag>
              );
            })()}
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>
            <span className="font-medium">{t('admin.classes.period')}:</span> {classItem.startDate?.slice(0, 10)} → {classItem.endDate?.slice(0, 10)}
          </div>
          <div className="flex gap-4">
            <span><span className="font-medium">{t('admin.classes.columns.capacity')}:</span> {classItem.capacity}</span>
            <span><span className="font-medium">{t('admin.classes.code')}:</span> {classItem.classCode?.name || classItem.classCode || "-"}</span>
          </div>
        </div>
        {classItem.description && (
          <div className="text-xs text-gray-500 mt-2 line-clamp-1">
            {classItem.description}
          </div>
        )}
      </div>
    );
  }

  // Full card mode
  return (
  <Card
    hoverable
    className="rounded-lg shadow flex flex-col h-full"
    actions={[
      <Tooltip title={t('admin.classes.viewDetails')} key="view">
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => onDetail && onDetail(classItem)}
        />
      </Tooltip>,
      <Tooltip title={getClassStatus(classItem.status).key !== 'Draft' ? t('admin.classes.cannotEditNonDraft') : t('admin.classes.editClass')} key="edit">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEdit && onEdit(classItem)}
          disabled={getClassStatus(classItem.status).key !== 'Draft'}
        />
      </Tooltip>,
      <Tooltip title={t('admin.classes.deleteClass')} key="delete">
        <Popconfirm
          title={t('admin.classes.deleteClassTitle')}
          description={t('admin.classes.deleteConfirm')}
          onConfirm={() => onDelete && onDelete(classItem.id)}
          okButtonProps={{ loading: deletingId === classItem.id }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deletingId === classItem.id}
          />
        </Popconfirm>
      </Tooltip>,
    ]}
  >
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 
          className="font-bold text-lg cursor-pointer hover:text-blue-600"
          onClick={() => onDetail && onDetail(classItem)}
          title={t('admin.classes.viewClassDetail')}
        >
          {classItem.name}
        </h3>
        {(() => {
          const s = getClassStatus(classItem.status);
          return (
            <Tag color={s.color} className="m-0">
              {t(`common.classStatus.${s.key}`)}
            </Tag>
          );
        })()}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <div className="flex flex-wrap gap-2">
          <span>{t('admin.classes.start')}: {classItem.startDate?.slice(0, 10)}</span>
          <span>•</span>
          <span>{t('admin.classes.end')}: {classItem.endDate?.slice(0, 10)}</span>
        </div>
      </div>
      <div className="text-sm mb-2">
        <div className="flex flex-wrap gap-4">
          <span><span className="font-medium">{t('admin.classes.columns.capacity')}:</span> {classItem.capacity}</span>
          <span><span className="font-medium">{t('admin.classes.code')}:</span> {classItem.classCode?.name || classItem.classCode || "-"}</span>
        </div>
      </div>
      {classItem.description && (
        <div className="text-sm text-gray-500 line-clamp-2 mt-auto">
          {classItem.description}
        </div>
      )}
    </div>
  </Card>
  );
};

export default PMClassCard;
