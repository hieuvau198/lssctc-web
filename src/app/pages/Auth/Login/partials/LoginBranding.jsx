import React from 'react';

export default function LoginBranding() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
                    alt=""
                    className="w-full h-full object-cover opacity-40"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />

            <div className="relative z-10 flex flex-col justify-center p-12 max-w-xl">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tight mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                        Chào mừng đến với LSSCTC
                    </h2>
                    <p className="text-lg text-neutral-300 leading-relaxed">
                        Đào tạo vận hành cần cẩu chuyên nghiệp với công nghệ mô phỏng 3D tiên tiến
                    </p>
                </div>

                <div className="space-y-4">
                    {['Chương trình đào tạo chuyên nghiệp', 'Mô phỏng 3D thực tế', 'Chứng nhận quốc tế'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-400" />
                            <span className="text-neutral-300 uppercase tracking-wider text-sm font-semibold">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
