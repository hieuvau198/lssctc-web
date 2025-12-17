import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Home, ChevronRight, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Yellow accent bar */}
            <div className="h-1 bg-yellow-400" />

            <div className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="text-center max-w-lg">
                    {/* 404 Badge */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 mb-8">
                        <AlertTriangle className="w-12 h-12 text-black" />
                    </div>

                    {/* Error Code */}
                    <h1 className="text-8xl font-black text-neutral-900 mb-4 tracking-tighter">404</h1>

                    {/* Title */}
                    <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-900 mb-4">
                        {t('notFound.title', 'Không tìm thấy trang')}
                    </h2>

                    {/* Description */}
                    <p className="text-neutral-500 mb-8">
                        {t('notFound.description', 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.')}
                    </p>

                    {/* Action Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-all group"
                    >
                        <Home className="w-5 h-5" />
                        {t('notFound.backHome', 'Về trang chủ')}
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="h-2 bg-neutral-900" />
        </div>
    );
}
