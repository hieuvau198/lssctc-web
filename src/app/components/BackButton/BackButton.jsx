import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function BackButton({ size = 'default' }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const sizeClasses = {
    small: 'px-3 py-1.5 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`inline-flex items-center gap-2 font-bold uppercase tracking-wider border-2 border-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 transition-all group ${sizeClasses[size] || sizeClasses.default}`}
    >
      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      {t('common.back')}
    </button>
  );
}
