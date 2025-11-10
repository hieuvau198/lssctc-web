import { Navigate, Route, Routes } from 'react-router'
import ForgotPassword from '../../../pages/Auth/ForgotPassword/ForgotPassword'
import Login from '../../../pages/Auth/Login/Login'
import NotFound from '../../../layouts/NotFound'

export default function AuthRoutes() {
    return (
        <Routes>
            <Route index element={<Navigate to={"/login"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
