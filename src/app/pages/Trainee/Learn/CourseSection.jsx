// src/app/pages/Trainee/Learn/CourseSection.jsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import SectionLayout from '../../../layouts/SectionLayout/SectionLayout';
import {
  getLearningSectionsByClassIdAndTraineeId,
  getActivityRecordsByClassAndSection,
  // getActivityById, // <-- ĐÃ XÓA, không cần nữa
} from '../../../apis/Trainee/TraineeLearningApi';
import { getLearningClassByIdAndTraineeId } from '../../../apis/Trainee/TraineeClassApi';

// --- IMPORT MỚI ĐỂ XỬ LÝ AUTH ---
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';

// Import context for sidebar refresh
import { useLearningSidebar } from '../../../contexts/LearningSidebarContext';
// --- KẾT THÚC IMPORT MỚI ---

export default function CourseSection() {
  const { courseId } = useParams(); // courseId == classId
  const classId = courseId;

  // --- LEARNING SIDEBAR CONTEXT ---
  const { refreshKey } = useLearningSidebar();
  // --- KẾT THÚC LEARNING SIDEBAR CONTEXT ---

  // --- LOGIC TRAINEE ID MỚI ---
  const authState = useAuthStore();
  const traineeIdFromStore = authState.nameid;
  const [traineeId, setTraineeId] = useState(null);
  // --- KẾT THÚC LOGIC TRAINEE ID MỚI ---

  const [courseTitle, setCourseTitle] = useState('Course');
  const [sections, setSections] = useState([]);
  const [activities, setActivities] = useState([]); // State để lưu trữ activity records
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- EFFECT MỚI ĐỂ LẤY TRAINEE ID ---
  useEffect(() => {
    const token = getAuthToken();
    const decoded = token ? decodeToken(token) : null;
    const resolvedTraineeId =
      traineeIdFromStore ||
      decoded?.nameid ||
      decoded?.nameId ||
      decoded?.sub ||
      null;

    if (!resolvedTraineeId) {
      console.error("Trainee ID could not be resolved.");
      setError("Trainee ID not available. Please log in again.");
      setLoading(false);
    } else {
      setTraineeId(resolvedTraineeId);
    }
  }, [traineeIdFromStore]);
  // --- KẾT THÚC EFFECT MỚI ---

  // Fetch sections và activity records
  const fetchSidebarData = useCallback(async () => {
    if (!classId || !traineeId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Lấy thông tin lớp học (để lấy tên)
      try {
        const classData = await getLearningClassByIdAndTraineeId(traineeId, classId);
        if (classData) setCourseTitle(classData.name || "Course");
      } catch (e) {
        console.warn("Could not fetch class name", e);
      }

      // 2. Lấy Section Records
      const fetchedSections = await getLearningSectionsByClassIdAndTraineeId(
        classId,
        traineeId
      );
      setSections(fetchedSections || []);

      // 3. Lấy TẤT CẢ Activity Records
      let allActivities = [];
      for (const section of fetchedSections) {
        try {
          // GỌI API LẤY ACTIVITY RECORDS (DTO mới của bạn)
          const activityRecords = await getActivityRecordsByClassAndSection(
            classId,
            section.sectionId
          );

          // Không cần gọi getActivityById nữa
          allActivities = [...allActivities, ...activityRecords];

        } catch (e) {
          console.warn(`Failed to fetch activities for section ${section.sectionId}`, e);
        }
      }

      setActivities(allActivities);

    } catch (err) {
      console.error('Error fetching sections/partitions:', err);
      setError('Failed to load learning sections.');
    } finally {
      setLoading(false);
    }
  }, [classId, traineeId]);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData, refreshKey]); // Add refreshKey to trigger refresh

  // Gộp Section records và Activity records để tạo sidebar
  const allItems = useMemo(() => {
    const items = [];

    const sortedSections = [...sections].sort((a, b) => a.sectionOrder - b.sectionOrder);

    sortedSections.forEach((section) => {
      items.push({
        id: section.sectionId,
        type: 'section',
        title: section.sectionName,
        duration: `${section.durationMinutes ?? 0} min`,
        isCompleted: section.isCompleted,
        isHeader: true,
      });

      // Lọc các activities thuộc về section này
      const sectionActivities = activities
        .filter((act) => act.sectionId === section.sectionId)
         // TODO: Cần một trường 'order' thực sự trên ActivityRecord
        .sort((a, b) => a.activityId - b.activityId); 

      // Thêm partitions (activities)
      sectionActivities.forEach((act) => {
        items.push({
          id: act.activityId, // Dùng activityId làm ID
          type: act.activityType, // Dùng activityType (chuỗi: "Material", "Quiz", "Practice")
          title: act.activityName, // Dùng activityName
          duration: '', // Tạm thời rỗng, DTO không có
          isCompleted: act.isCompleted,
          sectionId: section.sectionId,
          href: `/learnings/${classId}/${section.sectionId}/${act.activityId}`,
        });
      });
    });
    return items;
  }, [sections, activities, classId]);

  const handleSelectItem = (item) => {
    console.log('Selected item:', item);
  };

  return (
    <SectionLayout
      items={allItems}
      onSelectItem={handleSelectItem}
      itemsLoading={loading}
      error={error}
      courseTitle={courseTitle}
    />
  );
}