import React from 'react';
import PageNav from '../../../components/PageNav/PageNav';

export default function SimulationPlatform() {
  return (
    <div className="min-h-[50vh] bg-white">
      <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
        <PageNav nameMap={{ simulator: 'Simulator' }} />
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Simulation Platform</h1>
        <p className="text-slate-600">Interactive simulator workspace coming soon.</p>
      </div>
    </div>
  );
}
