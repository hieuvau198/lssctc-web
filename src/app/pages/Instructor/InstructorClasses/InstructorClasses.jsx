// src\app\pages\Instructor\InstructorClasses\InstructorClasses.jsx
import {
  Alert,
  Skeleton,
  Empty,
  App
} from "antd";
import { BookOpen, AlertCircle } from 'lucide-react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from 'react-i18next';
import { getInstructorClasses } from "../../../apis/Instructor/InstructorApi";
import ClassTable from "./partials/ClassTable";
import useAuthStore from "../../../store/authStore";
import { getAuthToken } from "../../../libs/cookies";
import { decodeToken } from "../../../libs/jwtDecode";

export default function InstructorClasses() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const authState = useAuthStore();
  const instructorIdFromStore = authState.nameid;
  const [instructorId, setInstructorId] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    const decoded = token ? decodeToken(token) : null;
    const resolvedInstructorId =
      instructorIdFromStore ||
      decoded?.nameid ||
      decoded?.nameId ||
      decoded?.sub ||
      null;

    if (!resolvedInstructorId) {
      setError(t('instructor.classes.instructorIdNotAvailable'));
      setLoading(false);
    } else {
      setInstructorId(resolvedInstructorId);
    }
  }, [instructorIdFromStore]);

  useEffect(() => {
    if (instructorId) {
      load();
    }
  }, [instructorId]);

  const load = async (p = pageNumber, ps = pageSize) => {
    if (!instructorId) return;

    setLoading(true);
    try {
      const res = await getInstructorClasses(instructorId, {
        page: p,
        pageSize: ps,
      });

      if (res && Array.isArray(res.items)) {
        setClasses(res.items);
        setTotal(Number(res.totalCount) || res.items.length || 0);
      } else if (Array.isArray(res)) {
        setClasses(res);
        setTotal(res.length || 0);
      } else {
        setClasses([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load classes', err);
      message.error(t('instructor.classes.loadFailed'));
      setClasses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = (classItem) => {
    const id = classItem?.id ?? classItem?.classId;
    if (id) navigate(`/instructor/classes/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-black border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-neutral-800" />
        </div>
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold uppercase">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-neutral-100 overflow-hidden">
      {/* Light Wire Header */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t('instructor.classes.title')}</h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {t('instructor.classes.table.pagination', { start: (pageNumber - 1) * pageSize + 1, end: Math.min(pageNumber * pageSize, total), total })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {(!classes || classes.length === 0) ? (
          <div className="bg-white border-2 border-black p-12 flex-1 flex flex-col items-center justify-center">
            <div className="h-1 bg-yellow-400 w-full mb-8 absolute top-0 left-0" />
            <Empty
              description={
                <div>
                  <p className="text-neutral-800 text-lg font-bold uppercase mb-2">{t('instructor.classes.noClasses')}</p>
                  <p className="text-neutral-500 text-sm">{t('instructor.classes.noClassesDesc')}</p>
                </div>
              }
              image={<div className="text-8xl mb-4">📚</div>}
            />
          </div>
        ) : (
          <ClassTable
            classes={classes}
            pageNumber={pageNumber}
            pageSize={pageSize}
            total={total}
            onPageChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
            onView={handleViewClass}
          />
        )}
      </div>
    </div>
  );
}
