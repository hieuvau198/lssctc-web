import { Route, Routes } from "react-router";
import InstructorLayout from "../../../layouts/InstructorLayout/InstructorLayout";
import InstructorClasses from "../../../pages/Instructor/InstructorClasses/InstructorClasses";
import InstructorClassDetail from "../../../pages/Instructor/InstructorClasses/InstructorClassDetail";
import InstructorSections from "../../../pages/Instructor/InstructorSections/InstructorSections";
import InstructorMaterials from "../../../pages/Instructor/InstructorMaterials/InstructorMaterials";
import InstructorQuizzes from "../../../pages/Instructor/InstructorQuizzes/InstructorQuizzes";
import InstructorPractices from "../../../pages/Instructor/InstructorPractices/InstructorPractices";
import InstructorProfile from "../../../pages/Instructor/InstructorProfile/InstructorProfile";
import NotFound from "../../../layouts/NotFound";
// Reuse Program Manager pages under Instructor (Program features only, exclude Program classes)
import PMCourses from "../../../pages/ProgramManager/Course/Courses";
import ManagerProgramList from "../../../pages/ProgramManager/Program/ManagerProgramList";
import ManagerProgramDetail from "../../../pages/ProgramManager/Program/partials/ManagerProgramDetail";
import ProgramCreate from "../../../pages/ProgramManager/Program/partials/ProgramCreate";
import ProgramEdit from "../../../pages/ProgramManager/Program/partials/ProgramEdit";

export default function InstructorRoutes() {
  return (
    <Routes>
      <Route element={<InstructorLayout />}>
        <Route index element={<InstructorClasses />} />
        <Route path="/classes" element={<InstructorClasses />} />
        <Route path="/classes/:slug" element={<InstructorClassDetail />} />
        <Route path="/sections" element={<InstructorSections />} />
        <Route path="/materials" element={<InstructorMaterials />} />
        <Route path="/quizzes" element={<InstructorQuizzes />} />
        <Route path="/practices" element={<InstructorPractices />} />
        <Route path="/profile" element={<InstructorProfile />} />
        {/* Program features moved here */}
        <Route path="/programs" element={<ManagerProgramList />} />
        <Route path="/programs/create" element={<ProgramCreate />} />
        <Route path="/programs/:id" element={<ManagerProgramDetail />} />
        <Route path="/programs/:id/edit" element={<ProgramEdit />} />
        <Route path="/courses" element={<PMCourses />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
