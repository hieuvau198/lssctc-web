import { Route, Routes } from "react-router";
import AboutUs from "../../layouts/AboutUs/AboutUs";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import NotFound from "../../layouts/NotFound/NotFound";
import ProgramManagerLayout from "../../layouts/ProgramManagerLayout/ProgramManagerLayout";
import SimManagerLayout from "../../layouts/SimManagerLayout/SimManagerLayout";
import TraineeLayout from "../../layouts/TraineeLayout/TraineeLayout";
import SessionLayout from "../../layouts/SessionLayout/SessionLayout";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import ManageCourse from "../../pages/Admin/ManageCourse/ManageCourse";
import ManageUser from "../../pages/Admin/ManageUser/ManageUser";
import ForgotPassword from "../../pages/Auth/ForgotPassword/ForgotPassword";
import Login from "../../pages/Auth/Login/Login";
import Home from "../../pages/Home/Home";
import Courses from "../../pages/ProgramManager/Course/Courses";
import ProgramList from "../../pages/ProgramManager/Program/ProgramList";
import SimDashboard from "../../pages/SimManager/Dashboard/Dashboard";
import Scenarios from "../../pages/SimManager/Scenarios/Scenarios";
import PracticeDetail from "../../pages/SimManager/Scenarios/partials/PracticeDetail";
import Sessions from "../../pages/SimManager/Sessions/Sessions";
import SimSettings from "../../pages/SimManager/Settings/Settings";
import SimulatorConfigs from "../../pages/SimManager/SimulatorConfigs/SimulatorConfigs";
import CertificateForm from "../../pages/Trainee/Certificate/Certificate";
import Course from "../../pages/Trainee/Course/Course";
import CourseDetail from "../../pages/Trainee/Course/partials/CourseDetail";
import Profile from "../../pages/Trainee/Profile/Profile";
import Program from "../../pages/Trainee/Program/Program";
import ProgramDetail from "../../pages/Trainee/Program/partials/ProgramDetail";

import Quiz from "../../pages/Trainee/Quiz/Quiz";
import SimulationPlatform from "../../pages/Trainee/SimulationPlatform/SimulationPlatform";
import LessonSessionPlaceholder from "../../modules/Session/LessonSessionPlaceholder";

import SimulationPlatform from "../../pages/Trainee/SimulationPlatform/SimulationPlatform";
import ProgramEdit from "../../pages/ProgramManager/Program/partials/ProgramEdit";
import ManagerProgramList from "../../pages/ProgramManager/Program/ManagerProgramList";
import ManagerProgramDetail from "../../pages/ProgramManager/Program/partials/ManagerProgramDetail";


const MainRoutes = () => {
  return (
    <Routes>
      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Public/Trainee Routes */}
      <Route element={<TraineeLayout />}>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/program" element={<Program />} />
        <Route path="/program/:id" element={<ProgramDetail />} />
        <Route path="/simulator" element={<SimulationPlatform />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/certificate" element={<CertificateForm />} />
        {/* Auth Routes */}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUser />} />
        <Route path="courses" element={<ManageCourse />} />
      </Route>

      {/* Simulator Manager Routes */}
      <Route path="/simulationManager" element={<SimManagerLayout />}>
        <Route path="dashboard" element={<SimDashboard />} />
        <Route path="scenarios" element={<Scenarios />} />
        <Route path="scenarios/:id" element={<PracticeDetail />} />
        <Route path="configs" element={<SimulatorConfigs />} />
        <Route path="settings" element={<SimSettings />} />
      </Route>

      {/* Program Manager Routes */}
      <Route path="/programManager" element={<ProgramManagerLayout />}>
        <Route path="courses" element={<Courses />} />
        <Route path="programs" element={<ManagerProgramList />} />
        <Route path="programs/:id" element={<ManagerProgramDetail />} />
        <Route path="programs/:id/edit" element={<ProgramEdit />} />
      </Route>

      {/* Learning Session (in-course) Routes */}
      <Route
        path="/learn"
        element={<SessionLayout itemsLoading={false} items={[]} />}
      >
        <Route index element={<LessonSessionPlaceholder />} />
        <Route path=":activityId" element={<LessonSessionPlaceholder />} />
      </Route>
    </Routes>
  );
};
export default MainRoutes;
