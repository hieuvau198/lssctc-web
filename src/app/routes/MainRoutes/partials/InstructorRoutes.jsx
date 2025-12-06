import { Route, Routes } from "react-router";
import InstructorLayout from "../../../layouts/InstructorLayout/InstructorLayout";
import InstructorClasses from "../../../pages/Instructor/InstructorClasses/InstructorClasses";
import InstructorClassDetail from "../../../pages/Instructor/InstructorClasses/InstructorClassDetail";
import ClassDetailOverview from "../../../pages/Instructor/InstructorClasses/ClassDetailOverview";
import ClassDetailSections from "../../../pages/Instructor/InstructorClasses/ClassDetailSections";
import ClassDetailMembers from "../../../pages/Instructor/InstructorClasses/ClassDetailMembers";
import ClassDetailSchedule from "../../../pages/Instructor/InstructorClasses/ClassDetailSchedule";
import SlotAttendance from "../../../pages/Instructor/InstructorClasses/SlotAttendance";
import InstructorSchedule from "../../../pages/Instructor/InstructorSchedule/InstructorSchedule";
import InstructorSections from "../../../pages/Instructor/InstructorSections/InstructorSections";
import InstructorMaterials from "../../../pages/Instructor/InstructorMaterials/InstructorMaterials";
import InstructorQuizzes from "../../../pages/Instructor/InstructorQuizzes/InstructorQuizzes";
import QuizDetailView from "../../../pages/Instructor/InstructorQuizzes/partials/QuizDetailView";
import QuizCreateEdit from "../../../pages/Instructor/InstructorQuizzes/partials/QuizCreateEdit";
import QuizEdit from "../../../pages/Instructor/InstructorQuizzes/partials/QuizEdit";
import InstructorPractices from "../../../pages/Instructor/InstructorPractices/InstructorPractices";
import InstructorProfile from "../../../pages/Instructor/InstructorProfile/InstructorProfile";
import EditInstructorProfile from "../../../pages/Instructor/InstructorProfile/EditInstructorProfile";
import NotFound from "../../../layouts/NotFound";
import PrivateRoute from "../../PrivateRoutes/PrivateRoute";
import InstructorDashboard from "../../../pages/Instructor/InstructorDashboard/InstructorDashboard";
import PracticeDetail from "../../../pages/Instructor/InstructorPractices/partials/PracticeDetail";

export default function InstructorRoutes() {
  return (
    <Routes>
      <Route element={
        <PrivateRoute
          children={<InstructorLayout />}
          allowedroles={["Instructor"]}
          redirectUrl="/auth/login"
        />}
      >
        <Route index element={<InstructorClasses />} />
        <Route path="/dashboard" element={<InstructorDashboard />} />
        <Route path="/schedule" element={<InstructorSchedule />} />
        <Route path="/classes" element={<InstructorClasses />} />
        <Route path="/classes/:classId" element={<InstructorClassDetail />}>
          <Route path="overview" element={<ClassDetailOverview />} />
          <Route path="sections" element={<ClassDetailSections />} />
          <Route path="members" element={<ClassDetailMembers />} />
          <Route path="schedule" element={<ClassDetailSchedule />} />
        </Route>
        <Route path="/classes/:classId/attendance/:timeslotId" element={<SlotAttendance />} />
        <Route path="/sections" element={<InstructorSections />} />
        <Route path="/materials" element={<InstructorMaterials />} />
        <Route path="/materials/edit/:id" element={<InstructorMaterials />} />
        <Route path="/quizzes" element={<InstructorQuizzes />} />
        <Route path="/quizzes/create" element={<QuizCreateEdit />} />
        <Route path="/quizzes/:id" element={<QuizDetailView />} />
        <Route path="/quizzes/:id/edit" element={<QuizCreateEdit />} />
        <Route path="/practices" element={<InstructorPractices />} />
        <Route path="/practices/:id" element={<PracticeDetail />} />
        <Route path="/profile" element={<InstructorProfile />} />
        <Route path="/profile/edit" element={<EditInstructorProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
