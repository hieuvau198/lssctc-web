import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

// Guards protected routes by checking the auth token in cookies
// Usage:
// <Route element={<PrivateRoutes />}> ...protected routes... </Route>
export default function PrivateRoutes({ children, redirectTo = '/auth/login' }) {
  const location = useLocation()
  const token = Cookies.get('token')

  if (!token) {
    // Redirect to login and preserve where the user tried to go
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: { pathname: location.pathname, search: location.search } }}
      />
    )
  }

  // If authenticated, render nested routes or provided children
  return children ? <>{children}</> : <Outlet />
}
