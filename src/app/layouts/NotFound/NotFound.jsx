import React from "react";
import { useTranslation } from "react-i18next";
import BackButton from "../../components/BackButton/BackButton";
import img from "../../assets/404.svg";

export default function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      {/* Illustration */}
      <img
        src={img}
        alt="404 illustration"
        className="mx-auto w-auto max-w-md select-none"
        draggable={false}
      />

      {/* Title */}
      <h2 className="text-4xl font-sans text-blue-500 mb-5">{t('notFound.title')}</h2>

      {/* Description */}
      <h1 className="text-5xl font-sans text-gray-800 mb-5">
        {t('notFound.message')}
      </h1>

      {/* Back button */}
      <BackButton type="primary" variant="solid" />
    </div>
  );
}
