import { Route, Routes } from "react-router";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import NotFound from "../../layouts/NotFound/NotFound";
import TraineeLayout from "../../layouts/TraineeLayout/TraineeLayout";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import ManageUser from "../../pages/Admin/ManageUser/ManageUser";
import ManageCourse from "../../pages/Admin/ManageCourse/ManageCourse";
import SimManagerLayout from "../../layouts/SimManagerLayout/SimManagerLayout";
import SimDashboard from "../../pages/SimManager/Dashboard/Dashboard";
import Scenarios from "../../pages/SimManager/Scenarios/Scenarios";
import SimulatorConfigs from "../../pages/SimManager/SimulatorConfigs/SimulatorConfigs";
import Sessions from "../../pages/SimManager/Sessions/Sessions";
import SimSettings from "../../pages/SimManager/Settings/Settings";
import ForgotPassword from "../../pages/Auth/ForgotPassword/ForgotPassword";
import Login from "../../pages/Auth/Login/Login";
import Register from "../../pages/Auth/Register/Register";
import Home from "../../pages/Home/Home";
import Course from "../../pages/Trainee/Course/Course";
import Quiz from "../../pages/Trainee/Quiz/Quiz";
import Program from "../../pages/Trainee/Program/Program";

const MainRoutes = () => {
  return (
    <Routes>
      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />

      {/* Public/Trainee Routes */}
      <Route element={<TraineeLayout />}>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/course" element={<Course />} />
        <Route path="/program" element={<Program />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUser />} />
        <Route path="courses" element={<ManageCourse />} />
      </Route>

      {/* Simulator Manager Routes */}
      <Route path="/simulator" element={<SimManagerLayout />}>
        <Route path="dashboard" element={<SimDashboard />} />
        <Route path="scenarios" element={<Scenarios />} />
        <Route path="configs" element={<SimulatorConfigs />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="settings" element={<SimSettings />} />
      </Route>
      
    </Routes>
  );
};
export default MainRoutes;