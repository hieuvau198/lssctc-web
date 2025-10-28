import { Route, Routes } from "react-router";
import InstructorLayout from "../../../layouts/InstructorLayout/InstructorLayout";
import InstructorClasses from "../../../pages/Instructor/InstructorClasses/InstructorClasses";
import InstructorClassDetail from "../../../pages/Instructor/InstructorClasses/InstructorClassDetail";
import InstructorSections from "../../../pages/Instructor/InstructorSections/InstructorSections";
import InstructorMaterials from "../../../pages/Instructor/InstructorMaterials/InstructorMaterials";
import InstructorQuizzes from "../../../pages/Instructor/InstructorQuizzes/InstructorQuizzes";
import QuizDetails from "../../../pages/Instructor/InstructorQuizzes/partials/QuizDetails";
import QuizEdit from "../../../pages/Instructor/InstructorQuizzes/partials/QuizEdit";
import InstructorPractices from "../../../pages/Instructor/InstructorPractices/InstructorPractices";
import InstructorProfile from "../../../pages/Instructor/InstructorProfile/InstructorProfile";
import NotFound from "../../../layouts/NotFound";

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
        <Route path="/quizzes/:id" element={<QuizDetails />} />
        <Route path="/quizzes/:id/edit" element={<QuizEdit />} />
        <Route path="/practices" element={<InstructorPractices />} />
        <Route path="/profile" element={<InstructorProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
