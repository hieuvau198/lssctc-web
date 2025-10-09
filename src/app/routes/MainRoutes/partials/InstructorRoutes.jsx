import { Route, Routes } from 'react-router';
import InstructorLayout from '../../../layouts/InstructorLayout/InstructorLayout';
import InstructorClasses from '../../../pages/Instructor/InstructorClasses/InstructorClasses';
import InstructorClassDetail from '../../../pages/Instructor/InstructorClasses/InstructorClassDetail';
import InstructorSections from '../../../pages/Instructor/InstructorSections/InstructorSections';

export default function InstructorRoutes() {
  return (
    <Routes>
      <Route element={<InstructorLayout />}>
        <Route index element={<InstructorClasses />} />
        <Route path="/classes" element={<InstructorClasses />} />
        <Route path="/classes/:slug" element={<InstructorClassDetail />} />
        <Route path="/sections" element={<InstructorSections />} />
      </Route>
    </Routes>
  );
}
