// src/app/pages/SimManager/Scenarios/Scenarios.jsx
import React, { useEffect, useState } from 'react';
import { getPractices } from '../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { Link } from 'react-router-dom';

export default function Scenarios() {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, totalCount: 0, totalPages: 1 });

  useEffect(() => {
    setLoading(true);
    getPractices(meta.page, meta.pageSize)
      .then((data) => {
        setPractices(data.items);
        setMeta({
          page: data.page,
          pageSize: data.pageSize,
          totalCount: data.totalCount,
          totalPages: data.totalPages || 1,
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Could not fetch practices');
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [meta.page, meta.pageSize]);

  if (loading) return <div>Loading practices...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Scenarios</h1>
      <div className="p-4 rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1 text-left">Name</th>
              <th className="px-2 py-1 text-left">Difficulty</th>
              <th className="px-2 py-1 text-left">Status</th>
              <th className="px-2 py-1 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {practices.map((p) => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="px-2 py-1">{p.practiceName}</td>
                <td className="px-2 py-1">{p.difficultyLevel}</td>
                <td className="px-2 py-1">{p.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-2 py-1">
                  <Link
                    to={`../scenarios/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-xs text-slate-400">
          {meta.totalCount} practices • Page {meta.page} of {meta.totalPages}
        </div>
      </div>
    </div>
  );
}
