import { Route, Routes } from 'react-router'
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout'
import Dashboard from '../../../pages/Admin/Dashboard/Dashboard'
import ManageUser from '../../../pages/Admin/ManageUser/ManageUser'
import Courses from '../../../pages/Admin/Course/Courses'
import PMClasses from '../../../pages/Admin/Class/PMClasses'
import ManagerProgramList from '../../../pages/Admin/Program/ManagerProgramList'
import NotFound from '../../../layouts/NotFound'
import PrivateRoute from '../../PrivateRoutes/PrivateRoute'
import TraineeTable from '../../../pages/Admin/ManageUser/partials/TraineeTable'
import InstructorTable from '../../../pages/Admin/ManageUser/partials/InstructorTable'
import SimulationManagerTable from '../../../pages/Admin/ManageUser/partials/SimulationManagerTable'

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
        <Route path="courses" element={<Courses />} />
        <Route path="programs" element={<ManagerProgramList />} />
        <Route path="class" element={<PMClasses />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
