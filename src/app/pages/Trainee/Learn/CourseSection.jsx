// src/app/pages/Trainee/Learn/CourseSection.jsx

import { useEffect, useState, useMemo, useCallback } from 'react'; // <-- Đã thêm useCallback
import { useParams } from 'react-router-dom';
import SectionLayout from '../../../layouts/SectionLayout/SectionLayout';
import {
  getLearningSectionsByClassIdAndTraineeId,
  // Cập nhật: Chúng ta sẽ dùng API mới của bạn
  getActivityRecordsByClassAndSection,
  getActivityById,
} from '../../../apis/Trainee/TraineeLearningApi';
import { getLearningClassByIdAndTraineeId } from '../../../apis/Trainee/TraineeClassApi'; // <-- Thêm để lấy tên khóa học

// --- IMPORT MỚI ĐỂ XỬ LÝ AUTH ---
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';
// --- KẾT THÚC IMPORT MỚI ---

export default function CourseSection() {
  const { courseId } = useParams(); // courseId == classId
  const classId = courseId;
  
  // --- LOGIC TRAINEE ID MỚI ---
  // const traineeId = 1; // Hardcoded trainee ID - ĐÃ XÓA
  const traineeIdFromStore = useAuthStore((s) => s.nameid);
  const [traineeId, setTraineeId] = useState(null);
  // --- KẾT THÚC LOGIC TRAINEE ID MỚI ---

  const [courseTitle, setCourseTitle] = useState('Course');
  const [sections, setSections] = useState([]);
  const [activities, setActivities] = useState([]); // State mới để lưu trữ activity records
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
    // Thêm Guard Clause: Chỉ chạy khi đã có classId và traineeId
    if (!classId || !traineeId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Lấy thông tin lớp học (để lấy tên)
      try {
         const classData = await getLearningClassByIdAndTraineeId(traineeId, classId);
         if(classData) setCourseTitle(classData.name || "Course");
      } catch (e) {
         console.warn("Could not fetch class name", e);
      }
      
      // 2. Lấy Section Records (Giống như 'MyClassDetail.jsx' làm)
      const fetchedSections = await getLearningSectionsByClassIdAndTraineeId(
        classId,
        traineeId
      );
      setSections(fetchedSections || []);

      // 3. Lấy TẤT CẢ Activity Records cho TOÀN BỘ lớp học một lần
      // Thay vì gọi API lặp lại cho mỗi section, chúng ta lấy tất cả activities cho classId
      // Ghi chú: API của bạn `getActivityRecordsByClassAndSection` yêu cầu sectionId.
      // Nếu không có API để lấy TẤT CẢ activities cho một class, chúng ta phải lặp lại.
      // Giả sử chúng ta phải lặp:

      let allActivities = [];
      for (const section of fetchedSections) {
        try {
          const activityRecords = await getActivityRecordsByClassAndSection(
            classId,
            section.sectionId
          );
          
          // Lấy metadata (tên, v.v.) cho mỗi activity
          const activitiesWithMeta = await Promise.all(
            activityRecords.map(async (record) => {
              try {
                const meta = await getActivityById(record.activityId);
                return { 
                  ...record, // Chứa isCompleted, score, v.v.
                  ...meta,   // Chứa activityTitle, estimatedDurationMinutes, v.v.
                };
              } catch (e) {
                console.warn(`Failed to get meta for activity ${record.activityId}`, e);
                return { 
                  ...record, 
                  activityTitle: `Item ${record.activityId}` // Fallback
                };
              }
            })
          );
          allActivities = [...allActivities, ...activitiesWithMeta];
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
  }, [classId, traineeId]); // <-- Cập nhật dependencies

  // Chạy fetchSidebarData khi dependencies thay đổi
  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]); // fetchSidebarData đã chứa classId và traineeId

  // Gộp Section records và Activity records để tạo sidebar
  const allItems = useMemo(() => {
    const items = [];

    // Sắp xếp sections theo 'sectionOrder'
    const sortedSections = [...sections].sort((a, b) => a.sectionOrder - b.sectionOrder);

    sortedSections.forEach((section) => {
      // Thêm section header
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
        // Bạn có thể cần một trường 'order' từ activity meta, ở đây dùng tạm activityId
        .sort((a, b) => a.activityId - b.activityId); // <-- Cần một trường 'order' tốt hơn

      // Thêm partitions (activities)
      sectionActivities.forEach((act) => {
        items.push({
          id: act.activityId, // Dùng activityId làm ID cho partition
          type: act.activityType || 'content', // Sử dụng activityType
          title: act.activityTitle || `Activity ${act.activityId}`,
          duration: `${act.estimatedDurationMinutes || 0} min`,
          isCompleted: act.isCompleted,
          sectionId: section.sectionId,
          // Link trỏ đến LearnContent
          href: `/learnings/${classId}/${section.sectionId}/${act.activityId}`,
        });
      });
    });
    return items;
  }, [sections, activities, classId]); // <-- Cập nhật dependencies

  const handleSelectItem = (item) => {
    console.log('Selected item:', item);
  };

  return (
    <SectionLayout
      items={allItems}
      onSelectItem={handleSelectItem}
      itemsLoading={loading}
      error={error}
      courseTitle={courseTitle} // Truyền tên khóa học động
    />
  );
}