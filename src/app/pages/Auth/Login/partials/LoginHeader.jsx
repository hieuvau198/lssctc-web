import React from 'react';
import { Link } from 'react-router';

export default function LoginHeader() {
    return (
        <header className="bg-black text-white">
            <div className="h-1 bg-yellow-400" />
            <div className="mx-auto px-12 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-xl font-black uppercase tracking-wider text-white group-hover:text-yellow-400 transition-colors">
                            LSSCTC
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
