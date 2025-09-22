// src/app/pages/SimManager/Settings/Settings.jsx

import React, { useEffect, useState } from 'react';
import { getComponents } from '../../../apis/SimulationManager/SimulationManagerComponentApi';
import UpdateComponent from './partials/UpdateComponent';

export default function SimSettings() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState(null); // component being edited

  const handleUpdated = () => {
    setEditing(null);
    // reload data
    getComponents(page, 5)
      .then(res => {
        setComponents(res.items || []);
        setTotalPages(res.totalPages || 1);
      });
  };

  useEffect(() => {
    setLoading(true);
    getComponents(page, 5) // 5 per page, change as you want
      .then(res => {
        setComponents(res.items || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch(e => setErr(e.message || 'Error'))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 mb-4">Settings</h1>
      <div className="p-4 rounded-lg border bg-white">
        <div>Personal and workspace settings (mock)</div>
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-3">Simulation Components</h2>
          {loading && <div>Loading...</div>}
          {err && <div className="text-red-500">{err}</div>}
          <div className="grid grid-cols-1 gap-6">
            {components.map(comp => (
              <div key={comp.id} className="flex items-center gap-6 p-4 border rounded-xl bg-gray-50 shadow hover:shadow-lg transition-shadow">
                <div className="w-40 h-40 rounded-xl overflow-hidden group flex-shrink-0">
                  <img
                    src={comp.imageUrl}
                    alt={comp.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-125"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-lg">{comp.name}</div>
                  <div className="text-gray-500">{comp.description}</div>
                  <div className="text-xs text-gray-400 mt-1">ID: {comp.id}</div>
                  <div className="text-xs mt-1">{comp.isActive ? 'Active' : 'Inactive'}</div>
                </div>
                <button
                  onClick={() => setEditing(comp)}
                  className="ml-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* Show update form as overlay or modal */}
          {editing && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <UpdateComponent
                component={editing}
                onUpdated={handleUpdated}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}
          
          {/* Paging controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
