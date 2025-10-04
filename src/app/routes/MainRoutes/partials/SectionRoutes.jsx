import { Route, Routes } from 'react-router'
import CourseSection from '../../../pages/Trainee/Session/CourseSection'
import LessonContent from '../../../pages/Trainee/Session/LessonContent'
import CourseOverview from '../../../pages/Trainee/Session/CourseOverview'

export default function SectionRoutes() {
  return (
    <Routes>
      <Route path=":courseId" element={<CourseSection />}>
        <Route index element={<CourseOverview />} />
        <Route path=":sectionId/:partitionId" element={<LessonContent />} />
      </Route>
    </Routes>
  )
}
