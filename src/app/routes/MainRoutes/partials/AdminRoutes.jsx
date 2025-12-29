// hieuvau198/lssctc-web/lssctc-web-dev/src/app/routes/MainRoutes/partials/AdminRoutes.jsx

import { Route, Routes } from 'react-router'
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout'
import NotFound from '../../../layouts/NotFound'
import ClassEditPage from '../../../pages/Admin/Class/ClassEditPage'
import ClassViewPage from '../../../pages/Admin/Class/ClassViewPage'
import PMClasses from '../../../pages/Admin/Class/PMClasses'
import Courses from '../../../pages/Admin/Course/Courses'
import CourseViewPage from '../../../pages/Admin/Course/CourseViewPage'
import Dashboard from '../../../pages/Admin/Dashboard/Dashboard'
import ManageUser from '../../../pages/Admin/ManageUser/ManageUser'
import InstructorTable from '../../../pages/Admin/ManageUser/partials/InstructorTable'
import SimulationManagerTable from '../../../pages/Admin/ManageUser/partials/SimulationManagerTable'
import TraineeTable from '../../../pages/Admin/ManageUser/partials/TraineeTable'
import ManagerProgramList from '../../../pages/Admin/Program/ManagerProgramList'
import ProgramDetailPage from '../../../pages/Admin/Program/ProgramDetailPage'
import MaterialManagement from '../../../pages/Admin/Material/MaterialManagement'
import QuizManagement from '../../../pages/Admin/Quiz/QuizManagement'
import CertificateManagement from '../../../pages/Admin/Certificate/CertificateManagement'
import PrivateRoute from '../../PrivateRoutes/PrivateRoute'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={
        <PrivateRoute
          children={<AdminLayout />}
          allowedroles={["Admin"]}
          redirectUrl="/auth/login"
        />}
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUser />}>
          <Route path="trainees" element={<TraineeTable />} />
          <Route path="instructors" element={<InstructorTable />} />
          <Route path="simulation-managers" element={<SimulationManagerTable />} />
        </Route>
        
        <Route path="courses">
          <Route index element={<Courses />} />
          <Route path=":id" element={<CourseViewPage />} />
        </Route>

        <Route path="programs">
            <Route index element={<ManagerProgramList />} />
            <Route path=":id" element={<ProgramDetailPage />} />
        </Route>

        <Route path="class">
          <Route index element={<PMClasses />} />
          <Route path=":id" element={<ClassViewPage />} />
          <Route path=":id/edit" element={<ClassEditPage />} />
        </Route>

        <Route path="materials" element={<MaterialManagement />} />
        
        <Route path="quizzes" element={<QuizManagement />} />

        <Route path="certificates" element={<CertificateManagement />} />

      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}