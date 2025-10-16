import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "../../layouts/NotFound";
import AdminRoutes from "./partials/AdminRoutes";
import AuthRoutes from "./partials/AuthRoutes";
import ProgramManagerRoutes from "./partials/ProgramManagerRoutes";
import SectionRoutes from "./partials/SectionRoutes";
import SimulationManagerRoutes from "./partials/SimulationManagerRoutes";
import TraineeRoutes from "./partials/TraineeRoutes";
import InstructorRoutes from "./partials/InstructorRoutes";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<TraineeRoutes />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="simulationManager/*" element={<SimulationManagerRoutes />} />
        <Route path="programManager/*" element={<ProgramManagerRoutes />} />
        <Route path="instructor/*" element={<InstructorRoutes />} />
        <Route path="learnings/*" element={<SectionRoutes />} />
        <Route path="*" element={<NotFound />} />  
      </Routes>
    </BrowserRouter>
  );
};
export default MainRoutes;
