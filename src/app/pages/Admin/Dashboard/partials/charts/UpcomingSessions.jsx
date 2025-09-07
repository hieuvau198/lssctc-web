import React from 'react';

export default function UpcomingSessions() {
  const sessions = [
    { id: 1, course: 'Crane Ops 101', start: '2025-09-08 09:00', type: 'Simulator' },
    { id: 2, course: 'Safety Protocols', start: '2025-09-08 13:30', type: 'Classroom' },
    { id: 3, course: 'Advanced Load', start: '2025-09-09 10:15', type: 'Simulator' },
    { id: 4, course: 'Yard Navigation', start: '2025-09-10 08:00', type: 'Field' },
  ];
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-col">
      <h2 className="text-sm font-medium mb-3 text-gray-700">Upcoming Sessions (Next 7d)</h2>
      <ul className="space-y-2 text-sm">
        {sessions.map(s => (
          <li key={s.id} className="flex items-center justify-between p-2 rounded border border-gray-100 hover:bg-gray-50 transition">
            <div>
              <p className="font-medium text-gray-800">{s.course}</p>
              <p className="text-gray-500 text-xs">{s.start}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">{s.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
