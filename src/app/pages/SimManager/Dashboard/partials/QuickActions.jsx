// src/app/pages/SimManager/Dashboard/partials/QuickActions.jsx
import React from 'react';
import { Card, Button, Space } from 'antd';
import { Settings, PlusCircle, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuickActions({ onCreate, onManageComponents, onSettings }) {
  const { t } = useTranslation();
  return (
    <Card className="border-slate-200 hover:shadow-md transition" title={t('simManager.dashboard.quickActions')}>
      <Space wrap>
        <Button type="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={onCreate}>
          {t('simManager.dashboard.newSimulation')}
        </Button>
        <Button icon={<Wrench className="w-4 h-4" />} onClick={onManageComponents}>
          {t('simManager.dashboard.manageComponents')}
        </Button>
        <Button icon={<Settings className="w-4 h-4" />} onClick={onSettings}>
          {t('common.settings')}
        </Button>
      </Space>
    </Card>
  );
}
