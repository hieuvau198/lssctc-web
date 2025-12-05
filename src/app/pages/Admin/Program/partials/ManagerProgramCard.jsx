import React from "react";
import { useTranslation } from 'react-i18next';
import { Card, Button, Popconfirm } from "antd";

const ManagerProgramCard = ({ program, onEdit, onDelete, onDetail }) => {
  const { t } = useTranslation();

  return (
  <Card
    hoverable
    className="rounded-lg shadow flex flex-col h-full"
    cover={
      <img
        alt={program.name}
        src={program.imageUrl}
        className="object-cover h-40 w-full"
      />
    }
    bodyStyle={{ display: "flex", flexDirection: "column", height: "100%" }}
    onClick={onDetail}
  >
    <div style={{ flex: 1 }}>
      <Card.Meta
        title={<span className="font-semibold">{program.name}</span>}
        description={
          <div>
            <p className="mb-2">{program.description}</p>
          </div>
        }
      />
    </div>
    <div className="flex flex-wrap gap-4 text-sm mt-4 mb-2 border-t pt-3">
      <span>
        <span className="font-medium">{t('common.duration')}:</span> {program.durationHours}{" "}
        {t('common.hours')}
      </span>
      <span>
        <span className="font-medium">{t('admin.programs.totalCourses')}:</span>{" "}
        {program.totalCourses}
      </span>
    </div>
    <div className="flex justify-end gap-2 mt-auto">
      <Button
        type="default"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        {t('common.edit')}
      </Button>
      <Popconfirm
        title={t('admin.programs.deleteConfirm', { name: program.name })}
        okText={t('common.delete')}
        okType="danger"
        cancelText={t('common.cancel')}
        onConfirm={(e) => {
          e.stopPropagation();
          onDelete && onDelete();
        }}
        onCancel={(e) => e.stopPropagation()}
      >
        <Button type="default" danger onClick={(e) => e.stopPropagation()}>
          {t('common.delete')}
        </Button>
      </Popconfirm>
    </div>
  </Card>
);
};

export default ManagerProgramCard;
