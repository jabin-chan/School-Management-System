import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/Auth/AuthContext.jsx'
import { AdminAuthProvider, useAdminAuth } from './components/Admin/AdminAuthContext.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'
import LandingPage from './components/Auth/LandingPage.jsx'
import LoginPage from './components/Auth/LoginPage.jsx'
import AdmissionPage from './components/Auth/AdmissionPage.jsx'
import AdminLoginPage from './components/Admin/AdminLoginPage.jsx'
import AdminLayout from './components/Admin/AdminLayout.jsx'
import AdminAdmissions from './components/Admin/AdminAdmissions.jsx'
import AdminStudents from './components/Admin/AdminStudents.jsx'
import AdminTeachers from './components/Admin/AdminTeachers.jsx'
import AdminNotices from './components/Admin/AdminNotices.jsx'
import AdminPosts from './components/Admin/AdminPosts.jsx'
import AdminCalendar from './components/Admin/AdminCalendar.jsx'
import AdminFees from './components/Admin/AdminFees.jsx'

import Teachers from './components/Teacher/Teachers.jsx'
import Notices from './components/Notice/Notices.jsx'
import CalendarPage from './components/Calendar/CalendarPage.jsx'
import Discuss from './components/Discuss/Discuss.jsx'
import Results from './components/Results/Results.jsx'
import Fees from './components/Fees/Fees.jsx'
import Profile from './components/Profile/Profile.jsx'

function RootPage() {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />
}

function AdminRootPage() {
  const { admin, loading } = useAdminAuth()
  if (loading) return null
  return admin ? <Navigate to="/admin/admissions" replace /> : <AdminLoginPage />
}

const router = createBrowserRouter([
  { path: '/', element: <RootPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/admission', element: <AdmissionPage /> },
  {
    path: '/dashboard',
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard/teachers" replace /> },
      { path: 'teachers', element: <Teachers /> },
      { path: 'notices', element: <Notices /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'posts', element: <Discuss /> },
      { path: 'results', element: <Results /> },
      { path: 'fees', element: <Fees /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  { path: '/admin/login', element: <AdminRootPage /> },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/admissions" replace /> },
      { path: 'admissions', element: <AdminAdmissions /> },
      { path: 'students', element: <AdminStudents /> },
      { path: 'teachers', element: <AdminTeachers /> },
      { path: 'notices', element: <AdminNotices /> },
      { path: 'calendar', element: <AdminCalendar /> },
      { path: 'posts', element: <AdminPosts /> },
      { path: 'fees', element: <AdminFees /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <RouterProvider router={router} />
      </AdminAuthProvider>
    </AuthProvider>
  </StrictMode>,
)
