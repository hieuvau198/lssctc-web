import { BrowserRouter, Route, Routes } from "react-router";
import AdminRoutes from "./partials/AdminRoutes";
import AuthRoutes from "./partials/AuthRoutes";
import ProgramManagerRoutes from "./partials/ProgramManagerRoutes";
import SessionRoutes from "./partials/SessionRoutes";
import SimulationManagerRoutes from "./partials/SimulationManagerRoutes";
import TraineeRoutes from "./partials/TraineeRoutes";
import NotFound from "../../layouts/NotFound";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<TraineeRoutes />} />
        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="admin/*" element={<AdminRoutes />} />
        <Route path="simulationManager/*" element={<SimulationManagerRoutes />} />
        <Route path="programManager/*" element={<ProgramManagerRoutes />} />
        <Route path="learn/*" element={<SessionRoutes />} />
        <Route path="*" element={<NotFound />} />  
      </Routes>
    </BrowserRouter>
  );
};
export default MainRoutes;
