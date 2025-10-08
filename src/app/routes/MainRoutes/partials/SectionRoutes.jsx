import { Route, Routes } from 'react-router'
import CourseSection from '../../../pages/Trainee/Learn/CourseSection'
import LearnContent from '../../../pages/Trainee/Learn/LearnContent'
import CourseOverview from '../../../pages/Trainee/Learn/tempt/CourseOverview'

export default function SectionRoutes() {
  return (
    <Routes>
      <Route path=":courseId" element={<CourseSection />}>
        <Route path=":sectionId/:partitionId" element={<LearnContent />} />
      </Route>
    </Routes>
  )
}
