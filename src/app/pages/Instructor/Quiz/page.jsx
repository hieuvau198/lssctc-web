import React, { useEffect, useMemo, useState } from "react";

import { getAllQuizzes } from '../../../apis/Instructor/InstructorSectionApi';

// ---- UTIL ----
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function useDebouncedValue(value, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function formatMinutes(min) {
  if (min == null) return "—";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m ? ` ${m}m` : ""}`;
}

// ---- MAIN PAGE ----
export default function QuizzesPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  // Load data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllQuizzes({ page, pageSize, search: debouncedSearch });
        if (!cancelled) {
          setItems(data.items ?? []);
          setTotal(data.total ?? 0);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, debouncedSearch]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((total || 0) / pageSize)), [total, pageSize]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Instructor · Manage Quizzes</h1>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search quizzes..."
            className="input input-bordered w-64 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:opacity-90"
            onClick={() => alert("TODO: Navigate to Create Quiz page")}
          >
            + New Quiz
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 shadow-sm bg-white overflow-visible">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 rounded-t-2xl">
          <div className="col-span-4">Name</div>
          <div className="col-span-2">Pass</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading quizzes…</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm">No quizzes found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((q) => (
              <li key={q.id} className="px-4 py-3 hover:bg-gray-50">
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-4 min-w-0">
                    <button
                      onClick={() => setExpandedId((v) => (v === q.id ? null : q.id))}
                      className="text-left w-full group"
                      title="Click to expand"
                    >
                      <div className="truncate"><span className="font-medium group-hover:underline align-middle">{q.name}</span></div>
                    </button>
                  </div>
                  <div className="col-span-2 text-sm">{q.passScoreCriteria ?? "—"}</div>
                  <div className="col-span-2 text-sm">{formatMinutes(q.timelimitMinute)}</div>
                  <div className="col-span-2 text-sm">{q.totalScore ?? "—"}</div>
                  <div className="col-span-2 text-right">
                    <div className="flex justify-end gap-2 flex-nowrap whitespace-nowrap">
                      <button
                        className="px-3 py-1 text-xs rounded-lg border bg-white hover:bg-gray-50 shadow-sm"
                        onClick={() => alert(`Preview quiz #${q.id}`)}
                      >
                        Preview
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-lg border bg-white hover:bg-gray-50 shadow-sm"
                        onClick={() => alert(`Manage Questions of quiz #${q.id}`)}
                      >
                        Questions
                      </button>
                      <button
                        className="px-3 py-1 text-xs rounded-lg border bg-white hover:bg-gray-50 shadow-sm"
                        onClick={() => alert(`Edit quiz #${q.id}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>

                {expandedId === q.id && (
                  <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div><span className="text-gray-500">ID:</span> {q.id}</div>
                      <div><span className="text-gray-500">Pass Criteria:</span> {q.passScoreCriteria ?? "—"}</div>
                      <div><span className="text-gray-500">Time Limit:</span> {formatMinutes(q.timelimitMinute)}</div>
                      <div><span className="text-gray-500">Total Score:</span> {q.totalScore ?? "—"}</div>
                      <div className="sm:col-span-3"><span className="text-gray-500">Description:</span> {q.description || "—"}</div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pagination */}
      <footer className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Page size</label>
          <select
            className="px-2 py-1 border rounded-lg"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(parseInt(e.target.value, 10));
            }}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <nav className="inline-flex items-center gap-1">
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span className="px-2 text-sm">Page {page} / {totalPages}</span>
            <button
              className="px-3 py-1 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
