import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from 'antd';

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch
        checked={i18n.language === 'vi'}
        onChange={(checked) => i18n.changeLanguage(checked ? 'vi' : 'en')}
        checkedChildren="Vi"
        unCheckedChildren="En"
      />
    </div>
  );
}
