import React from 'react';
import { useTranslation } from 'react-i18next';
import { Anchor, Shield, Truck, Wrench } from 'lucide-react';

export default function CraneSection() {
    const { t } = useTranslation();

    const features = [
        {
            icon: Anchor,
            title: t('home.craneSection.feature1Title', 'Thiết bị hiện đại'),
            description: t('home.craneSection.feature1Desc', 'Trang bị đầy đủ các loại cẩu từ 5 tấn đến 500 tấn'),
        },
        {
            icon: Shield,
            title: t('home.craneSection.feature2Title', 'An toàn hàng đầu'),
            description: t('home.craneSection.feature2Desc', 'Tuân thủ nghiêm ngặt các tiêu chuẩn an toàn quốc tế'),
        },
        {
            icon: Wrench,
            title: t('home.craneSection.feature3Title', 'Đào tạo chuyên sâu'),
            description: t('home.craneSection.feature3Desc', 'Chương trình đào tạo vận hành cẩu chuyên nghiệp'),
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Description */}
                    <div className="space-y-8">
                        <div>
                            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
                                {t('home.craneSection.subtitle', 'LSSCTC ACADEMY')}
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-900 mb-4">
                                {t('home.craneSection.title', 'Trung tâm đào tạo vận hành cẩu chuyên nghiệp')}
                            </h2>
                            <div className="h-1 w-24 bg-yellow-400" />
                        </div>

                        <p className="text-neutral-600 leading-relaxed text-lg">
                            {t('home.craneSection.description', 'LSSCTC là trung tâm đào tạo vận hành cẩu hàng đầu Việt Nam, cung cấp các khóa học từ cơ bản đến nâng cao. Với đội ngũ giảng viên giàu kinh nghiệm và thiết bị hiện đại, chúng tôi cam kết đào tạo những kỹ sư vận hành cẩu chuyên nghiệp nhất.')}
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="flex items-start gap-4 p-4 border-2 border-neutral-200 hover:border-yellow-400 transition-colors">
                                        <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center flex-shrink-0">
                                            <IconComponent className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900 uppercase tracking-wide mb-1">
                                                {feature.title}
                                            </h3>
                                            <p className="text-neutral-600 text-sm">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right - Crane Embed */}
                    <div className="relative">
                        <div className="border-4 border-yellow-400 bg-white overflow-hidden">
                            {/* Crane 3D Embed - Sketchfab */}
                            <div className="aspect-square w-full relative">
                                <iframe
                                    title="Tower Crane 3D Model"
                                    src="https://sketchfab.com/models/e0f0b59f569e4e93a5eab75d1673cdd3/embed?autospin=1&autostart=1&preload=1&ui_theme=dark"
                                    className="w-full h-full"
                                    style={{ border: 'none' }}
                                    allow="autoplay; fullscreen; xr-spatial-tracking"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 -z-10" />
                        <div className="absolute -top-4 -left-4 w-16 h-16 border-4 border-neutral-900 -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
