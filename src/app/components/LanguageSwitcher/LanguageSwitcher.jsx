import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import { Globe } from 'lucide-react';

const languages = [
  { key: 'en', label: 'English', flag: '🇺🇸' },
  { key: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
];

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();

  const currentLang = languages.find(lang => lang.key === i18n.language) || languages[0];

  const handleLanguageChange = ({ key }) => {
    i18n.changeLanguage(key);
  };

  const items = languages.map(lang => ({
    key: lang.key,
    label: (
      <div className="flex items-center gap-2 px-1 py-0.5">
        <span className="text-base">{lang.flag}</span>
        <span>{lang.label}</span>
        {lang.key === i18n.language && (
          <span className="ml-auto text-blue-500">✓</span>
        )}
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{ items, onClick: handleLanguageChange }}
      trigger={['click']}
      placement="bottomRight"
    >
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${className}`}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLang.flag}</span>
        <span className="text-sm text-gray-600 hidden sm:inline">{currentLang.label}</span>
      </button>
    </Dropdown>
  );
}
