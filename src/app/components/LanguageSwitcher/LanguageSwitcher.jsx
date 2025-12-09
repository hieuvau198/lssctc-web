import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'antd';
import { Languages } from 'lucide-react';
import vietnamFlag from '../../assets/vietnam-flag-icon-sign-png.webp';
import ukFlag from '../../assets/uk-united-kingdom-flag-icon.png';

const FLAG_ICONS = {
  vi: <img src={vietnamFlag} alt="Vietnamese" className="w-6 h-6 rounded-full object-cover" />,
  en: <img src={ukFlag} alt="English" className="w-6 h-6 rounded-full object-cover" />,
};

const LANGUAGE_OPTIONS = [
  {
    key: 'vi',
    label: (
      <div className="flex items-center gap-2 px-2 py-1">
        {FLAG_ICONS.vi}
        <span>Tiếng Việt</span>
      </div>
    ),
  },
  {
    key: 'en',
    label: (
      <div className="flex items-center gap-2 px-2 py-1">
        {FLAG_ICONS.en}
        <span>English</span>
      </div>
    ),
  },
];

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();

  const handleMenuClick = ({ key }) => {
    i18n.changeLanguage(key);
  };

  const currentLangKey = i18n.language && i18n.language.startsWith('vi') ? 'vi' : 'en';
  const currentLanguageText = currentLangKey === 'vi' ? 'Vie' : 'En';

  return (
    <Dropdown
      menu={{
        items: LANGUAGE_OPTIONS,
        onClick: handleMenuClick,
        selectedKeys: [currentLangKey],
      }}
      trigger={['click']}
      placement="bottom"
    >
      <button
        type="button"
        className={`flex items-center justify-center p-2 h-10 rounded-md hover:bg-gray-100 transition-colors font-medium text-gray-700 ${className}`}
        aria-label="Change language"
      >
        <Languages className="w-4 h-4 text-gray-600" />
        {currentLanguageText}
      </button>
    </Dropdown>
  );
}
