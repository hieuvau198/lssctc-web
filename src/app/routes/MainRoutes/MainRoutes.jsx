import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "../../layouts/NotFound";
import ExamResult from "../../pages/Trainee/FinalExam/ExamResult";
import ExamTaking from "../../pages/Trainee/FinalExam/ExamTaking";
import FinalExam from "../../pages/Trainee/FinalExam/FinalExam";
import PrivateRoute from "../PrivateRoutes/PrivateRoute";
import StartupRedirect from "../StartupRedirect/StartupRedirect";
import AdminRoutes from "./partials/AdminRoutes";
import AuthRoutes from "./partials/AuthRoutes";
import InstructorRoutes from "./partials/InstructorRoutes";
import SectionRoutes from "./partials/SectionRoutes";
import SimulationManagerRoutes from "./partials/SimulationManagerRoutes";
import TraineeRoutes from "./partials/TraineeRoutes";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <StartupRedirect />
      <Routes>
        <Route path="/*" element={<TraineeRoutes />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="simulationManager/*" element={<SimulationManagerRoutes />} />
        <Route path="instructor/*" element={<InstructorRoutes />} />
        <Route path="learnings/*" element={<SectionRoutes />} />
        <Route
          path="final-exam/:id"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <FinalExam />
            </PrivateRoute>
          }
        />
        <Route
          path="final-exam/:id/take"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <ExamTaking />
            </PrivateRoute>
          }
        />
        <Route
          path="final-exam/:id/result"
          element={
            <PrivateRoute allowedroles={["Trainee"]} redirectUrl="/auth/login">
              <ExamResult />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default MainRoutes;