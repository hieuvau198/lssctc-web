// src\app\pages\Instructor\InstructorClasses\InstructorClasses.jsx
import {
  Alert,
  Skeleton,
  Empty,
  App
} from "antd";
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton.Button style={{ width: 200, height: 32 }} active />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{t('instructor.classes.title')}</span>
      </div>

      {/* Content */}
      {(!classes || classes.length === 0) ? (
        <Empty description={t('instructor.classes.noClasses')} className="mt-16" />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-hidden">
            <ClassTable
              classes={classes}
              pageNumber={pageNumber}
              pageSize={pageSize}
              total={total}
              onPageChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
              onView={handleViewClass}
            />
          </div>
        </div>
      )}
    </div>
  );
}
