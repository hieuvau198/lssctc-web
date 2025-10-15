import { Route, Routes } from 'react-router'
import ProgramManagerLayout from '../../../layouts/ProgramManagerLayout/ProgramManagerLayout'
import PMClasses from '../../../pages/ProgramManager/Class/PMClasses'
import PMClassDetail from '../../../pages/ProgramManager/Class/partials/PMClassDetail'
import Courses from '../../../pages/ProgramManager/Course/Courses'
import ManagerProgramList from '../../../pages/ProgramManager/Program/ManagerProgramList'
import ManagerProgramDetail from '../../../pages/ProgramManager/Program/partials/ManagerProgramDetail'
import ProgramCreate from '../../../pages/ProgramManager/Program/partials/ProgramCreate'
import ProgramEdit from '../../../pages/ProgramManager/Program/partials/ProgramEdit'
import NotFound from '../../../layouts/NotFound'

export default function ProgramManagerRoutes() {
  return (
    <Routes>  
      <Route element={<ProgramManagerLayout />}>
        <Route index element={<Courses />} />
        <Route path="courses" element={<Courses />} />
        <Route path="programs" element={<ManagerProgramList />} />
        <Route path="programs/create" element={<ProgramCreate />} />
        <Route path="programs/:id" element={<ManagerProgramDetail />} />
        <Route path="programs/:id/edit" element={<ProgramEdit />} />
        <Route path="classes" element={<PMClasses />} />
        <Route path="classes/:id" element={<PMClassDetail />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
