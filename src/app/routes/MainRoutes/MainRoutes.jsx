import { Route, Routes } from "react-router";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import NotFound from "../../layouts/NotFound/NotFound";
import TraineeLayout from "../../layouts/TraineeLayout/TraineeLayout";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import ForgotPassword from "../../pages/Auth/ForgotPassword/ForgotPassword";
import Login from "../../pages/Auth/Login/Login";
import Register from "../../pages/Auth/Register/Register";
import Home from "../../pages/Home/Home";

const MainRoutes = () => {
  return (
    <Routes>
      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />

      {/* Public/Trainee Routes */}
      <Route element={<TraineeLayout />}>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> */}

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
export default MainRoutes;