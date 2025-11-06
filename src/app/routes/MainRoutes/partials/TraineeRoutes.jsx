import { Route, Routes } from 'react-router'
import AboutUs from '../../../layouts/AboutUs/AboutUs'
import NotFound from '../../../layouts/NotFound'
import TraineeLayout from '../../../layouts/TraineeLayout/TraineeLayout'
import Home from '../../../pages/Home/Home'
import CertificateView from '../../../pages/Trainee/Certificate/Certificate'
import Course from '../../../pages/Trainee/Course/Course'
import CourseDetail from '../../../pages/Trainee/Course/partials/CourseDetail'
import MyClassDetail from '../../../pages/Trainee/MyClasses/MyClassDetail'
import MyClasses from '../../../pages/Trainee/MyClasses/MyClasses'
import Profile from '../../../pages/Trainee/Profile/Profile'
import Program from '../../../pages/Trainee/Program/Program'
import ProgramDetail from '../../../pages/Trainee/Program/partials/ProgramDetail'
import SimulationPlatform from '../../../pages/Trainee/SimulationPlatform/SimulationPlatform'
import PrivateRoute from '../../PrivateRoutes/PrivateRoute'

export default function TraineeRoutes() {
  return (
    <Routes>
      <Route element={<TraineeLayout />}>
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="course" element={<Course />} />
        <Route path="course/:id" element={<CourseDetail />} />
        <Route path="program" element={<Program />} />
        <Route path="program/:id" element={<ProgramDetail />} />
        <Route path="simulator" element={<SimulationPlatform />} />
        <Route path="about" element={<AboutUs />} />

        {/* Protected trainee routes */}
        <Route
          path="profile"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="certificate"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <CertificateView />
            </PrivateRoute>
          }
        />
        <Route
          path="my-classes"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <MyClasses />
            </PrivateRoute>
          }
        />
        <Route
          path="my-classes/:id"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <MyClassDetail />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
