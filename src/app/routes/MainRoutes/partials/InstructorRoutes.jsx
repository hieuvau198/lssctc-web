import { Route, Routes } from 'react-router';
import InstructorLayout from '../../../layouts/InstructorLayout/InstructorLayout';
import InstructorDashboard from '../../../pages/Instructor/Dashboard';
import InstructorClasses from '../../../pages/Instructor/Classes';
import InstructorSections from '../../../pages/Instructor/Sections';
import InstructorSettings from '../../../pages/Instructor/Settings';
import PrivateRoutes from '../../PrivateRoutes/PrivateRoutes';

export default function InstructorRoutes() {
  return (
    <Routes>
        <Route element={<InstructorLayout />}>
          <Route index element={<InstructorDashboard />} />
          <Route path="/dashboard" element={<InstructorDashboard />} />
          <Route path="/classes" element={<InstructorClasses />} />
          <Route path="/sections" element={<InstructorSections />} />
          <Route path="/settings" element={<InstructorSettings />} />
     </Route>
    </Routes>
  );
}
