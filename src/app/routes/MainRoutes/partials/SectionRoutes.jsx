import { Route, Routes } from 'react-router'
import NotFound from '../../../layouts/NotFound'
import CourseSection from '../../../pages/Trainee/Learn/CourseSection'
import LearnContent from '../../../pages/Trainee/Learn/LearnContent'

export default function SectionRoutes() {
  return (
    <Routes>
      <Route path=":courseId" element={
        <PrivateRoute
          children={<CourseSection />}
          allowedroles={["Trainee"]}
          redirectUrl="/auth/login"
        />
      }>
        <Route path=":sectionId/:partitionId" element={<LearnContent />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
