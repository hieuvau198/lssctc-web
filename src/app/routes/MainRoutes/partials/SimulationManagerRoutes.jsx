import { Route, Routes } from 'react-router'
import NotFound from '../../../layouts/NotFound'
import SimManagerLayout from '../../../layouts/SimManagerLayout/SimManagerLayout'
import BrandModel from '../../../pages/SimManager/BrandModel/BrandModel'
import SimDashboard from '../../../pages/SimManager/Dashboard/Dashboard'
import CreatePractice from '../../../pages/SimManager/Practices/CreatePractice/CreatePractice'
import PracticeDetail from '../../../pages/SimManager/Practices/partials/PracticeDetail'
import PracticeStepDetail from '../../../pages/SimManager/Practices/PracticeDetail/PracticeStep/PracticeStepDetail/PracticeStepDetail'
import Practices from '../../../pages/SimManager/Practices/Practices'
import SimSettings from '../../../pages/SimManager/Settings/Settings'
import SimulatorSettings from '../../../pages/SimManager/SimulatorSettings/SimulatorSettings'
import TaskPractice from '../../../pages/SimManager/TaskPractice/TaskPractice'
import PrivateRoute from '../../PrivateRoutes/PrivateRoute'

export default function SimulationManagerRoutes() {
  return (
    <Routes>
      <Route element={
        <PrivateRoute
          children={<SimManagerLayout />}
          allowedroles={["SimulationManager"]}
          redirectUrl="/auth/login"
        />}
      >
        <Route index element={<SimDashboard />} />
        <Route path="/dashboard" element={<SimDashboard />} />
        <Route path="/practices" element={<Practices />} />
        <Route path="/practices/create" element={<CreatePractice />} />
        <Route path="/practices/:id" element={<PracticeDetail />} />
        <Route path="/practices/:practiceId/steps/:stepId" element={<PracticeStepDetail />} />
        <Route path="/tasks" element={<TaskPractice />} />
        <Route path="/brand-models" element={<BrandModel />} />
        <Route path="/settings" element={<SimSettings />} />
        <Route path="/simulator-settings" element={<SimulatorSettings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
