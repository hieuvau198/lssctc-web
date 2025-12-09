// src\app\pages\Instructor\InstructorClasses\InstructorClasses.jsx
import {
  Alert,
  Skeleton,
  Empty,
  App,
  Button
} from "antd";
import { Calendar } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
          <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-white/20" />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Alert message="Error" description={error} type="error" showIcon />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{t('instructor.classes.title')}</span>
              <p className="text-blue-100 text-sm mt-1">
                {t('instructor.classes.table.pagination', { start: (pageNumber - 1) * pageSize + 1, end: Math.min(pageNumber * pageSize, total), total })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {(!classes || classes.length === 0) ? (
        <div className="bg-white rounded-xl shadow-lg p-12">
          <Empty 
            description={
              <div>
                <p className="text-gray-600 text-lg font-medium mb-2">{t('instructor.classes.noClasses')}</p>
                <p className="text-gray-400 text-sm">{t('instructor.classes.noClassesDesc')}</p>
              </div>
            }
            image={<div className="text-8xl mb-4">📚</div>}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <ClassTable
            classes={classes}
            pageNumber={pageNumber}
            pageSize={pageSize}
            total={total}
            onPageChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
            onView={handleViewClass}
          />
        </div>
      )}
    </div>
  );
}
