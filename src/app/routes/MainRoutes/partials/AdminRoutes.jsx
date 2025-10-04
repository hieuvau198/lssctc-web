import { Route, Routes } from 'react-router'
import AdminLayout from '../../../layouts/AdminLayout/AdminLayout'
import Dashboard from '../../../pages/Admin/Dashboard/Dashboard'
import ManageUser from '../../../pages/Admin/ManageUser/ManageUser'
import Courses from '../../../pages/ProgramManager/Course/Courses'
import PMClasses from '../../../pages/ProgramManager/Class/PMClasses'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<ManageUser />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/class" element={<PMClasses />} />
      </Route>
    </Routes>
  )
}
