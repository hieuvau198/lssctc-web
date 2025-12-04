import React from 'react';
import { Card, Divider, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const ProgramCard = ({ program, onClick }) => {
  const { t } = useTranslation();
  const { name, imageUrl, totalCourses, isActive, description } = program || {};

  return (
    <Card
      hoverable
      cover={
        <div className="h-40 overflow-hidden cursor-pointer relative" onClick={onClick}>
          {imageUrl ? (
            <img alt={name} src={imageUrl} className="object-cover h-full w-full" loading="lazy" />
          ) : (
            <div className="h-40 w-full bg-gradient-to-br from-blue-50 to-blue-100" />
          )}
          <div className="absolute top-2 right-2 z-10">
            <Tag color={isActive ? 'green' : 'red'} className="m-0">{isActive ? t('common.active') : t('common.inactive')}</Tag>
          </div>
        </div>
      }
      className="rounded-lg shadow flex flex-col h-full"
      bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-start gap-1">
          <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1 cursor-pointer min-h-[2.5rem]" onClick={onClick}>
            {name}
          </h3>
        </div>

        <Divider className="my-1" style={{ margin: '2px 0' }} />

        {description ? (
          <p className="text-xs text-slate-600 line-clamp-2 mb-2">{description}</p>
        ) : null}

        <div className="mt-auto pt-2 text-xs text-slate-700 space-y-1">
          {totalCourses != null && (
            <div>
              <span className="font-medium">{t('sidebar.courses')}:</span> {totalCourses}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProgramCard;
