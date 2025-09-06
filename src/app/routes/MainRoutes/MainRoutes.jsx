import { Route, Routes } from "react-router";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Auth/Login/Login";
import Register from "../../pages/Auth/Register/Register";
import NotFound from "../../layouts/NotFound/NotFound";
import LearnersLayout from "../../layouts/LearnersLayout/LearnersLayout";
import Dashboard from "../../pages/Admin/Dashboard/Dashboard";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import ForgotPassword from "../../pages/Auth/ForgotPassword/ForgotPassword";

const MainRoutes = () => {
  return (
    <Routes>


      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />


      <Route element={<LearnersLayout />}>
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
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};
export default MainRoutes;