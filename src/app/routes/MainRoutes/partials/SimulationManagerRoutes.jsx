import { Route, Routes } from 'react-router'
import SimManagerLayout from '../../../layouts/SimManagerLayout/SimManagerLayout'
import SimDashboard from '../../../pages/SimManager/Dashboard/Dashboard'
import PracticeDetail from '../../../pages/SimManager/Practices/PracticeDetail/PracticeDetail'
import PracticeStepDetail from '../../../pages/SimManager/Practices/PracticeDetail/PracticeStep/PracticeStepDetail/PracticeStepDetail'
import Practices from '../../../pages/SimManager/Practices/Practices'
import SimSettings from '../../../pages/SimManager/Settings/Settings'
import SimulatorConfigs from '../../../pages/SimManager/SimulatorConfigs/SimulatorConfigs'
import NotFound from '../../../layouts/NotFound'

export default function SimulationManagerRoutes() {
  return (
    <Routes>
      <Route element={<SimManagerLayout />}>
        <Route index element={<SimDashboard />} />
        <Route path="/dashboard" element={<SimDashboard />} />
        <Route path="/practices" element={<Practices />} />
        <Route path="/practices/:id" element={<PracticeDetail />} />
        <Route path="/practices/:practiceId/steps/:stepId" element={<PracticeStepDetail />} />
        <Route path="/configs" element={<SimulatorConfigs />} />
        <Route path="/settings" element={<SimSettings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
