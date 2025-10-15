import { Route, Routes } from 'react-router'
import AboutUs from '../../../layouts/AboutUs/AboutUs'
import TraineeLayout from '../../../layouts/TraineeLayout/TraineeLayout'
import Home from '../../../pages/Home/Home'
import CertificateView from '../../../pages/Trainee/Certificate/Certificate'
import Course from '../../../pages/Trainee/Course/Course'
import CourseDetail from '../../../pages/Trainee/Course/partials/CourseDetail'
import Profile from '../../../pages/Trainee/Profile/Profile'
import Program from '../../../pages/Trainee/Program/Program'
import ProgramDetail from '../../../pages/Trainee/Program/partials/ProgramDetail'
import Quiz from '../../../pages/Trainee/Quiz/Quiz'
import SimulationPlatform from '../../../pages/Trainee/SimulationPlatform/SimulationPlatform'
import MyClasses from '../../../pages/Trainee/MyClasses/MyClasses'
import MyClassDetail from '../../../pages/Trainee/MyClasses/MyClassDetail'
import NotFound from '../../../layouts/NotFound'

export default function TraineeRoutes() {
  return (
    <Routes>
      <Route element={<TraineeLayout />}>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/program" element={<Program />} />
        <Route path="/program/:id" element={<ProgramDetail />} />
        <Route path="/simulator" element={<SimulationPlatform />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/certificate" element={<CertificateView />} />
        <Route path="/my-classes" element={<MyClasses />} />
        <Route path="/my-classes/:id" element={<MyClassDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
