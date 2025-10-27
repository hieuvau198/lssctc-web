import React, { useEffect, useState } from 'react';
import { getInstructorSections } from '../../../mock/instructorSections';

export default function ManageCourse() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInstructorSections()
      .then((data) => setSections(data.items))
      .catch((err) => setError(err?.message || 'Failed to load sections'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1380px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Manage Courses</h1>
        <p className="text-slate-600">Create, update and manage course catalog.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-4">
        <CourseTable />
      </div>

      {loading && <p>Loading sections...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <div>
          <h2 className="text-xl font-semibold">Sections</h2>
          <ul>
            {sections.map((section) => (
              <li key={section.id}>{section.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
