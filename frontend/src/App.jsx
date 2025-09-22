import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UserSelection from './Pages/UserSelection';
import Login from './Pages/Login';

// Admin pages
import Dashboard from './Pages/Dashboard';
import Room from './Pages/Room';
import Teacher from './Pages/Teacher';
import Student from './Pages/Student';
import Course from './Pages/Course';
import Announcements from './Pages/Announcements';
import Schedule from './Pages/Schedule';

// Teacher/Student pages
import StudentDashboard from './Pages/StudentDashboard';
import TeacherDashboard from './Pages/TeacherDashboard';
import StudentSchedule from './Pages/StudentSchedule'; // optional full-page schedule
import StudentAnnouncements from './Pages/StudentAnnouncements'; // optional full-page announcements

// PrivateRoute component for role-based access
const PrivateRoute = ({ element, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return element;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<UserSelection />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard redirects based on role */}
      <Route
        path="/dashboard"
        element={
          (() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return <Navigate to="/login" replace />;
            if (user.role === "student") return <StudentDashboard />;
            if (user.role === "teacher") return <TeacherDashboard />;
            return <Dashboard />; // Admin
          })()
        }
      />

      {/* Admin-only routes */}
      <Route path="/room" element={<PrivateRoute element={<Room />} role="admin" />} />
      <Route path="/teacher" element={<PrivateRoute element={<Teacher />} role="admin" />} />
      <Route path="/student" element={<PrivateRoute element={<Student />} role="admin" />} />
      <Route path="/course" element={<PrivateRoute element={<Course />} role="admin" />} />
      <Route path="/schedule" element={<PrivateRoute element={<Schedule />} role="admin" />} />
      <Route path="/announcements" element={<PrivateRoute element={<Announcements />} role="admin" />} />

      {/* Student-only routes */}
      <Route path="/student-dashboard" element={<PrivateRoute element={<StudentDashboard />} role="student" />} />
      <Route path="/student-schedule" element={<PrivateRoute element={<StudentSchedule />} role="student" />} />
      <Route path="/student-announcements" element={<PrivateRoute element={<StudentAnnouncements />} role="student" />} />

      {/* Teacher-only routes */}
      <Route path="/teacher-dashboard" element={<PrivateRoute element={<TeacherDashboard />} role="teacher" />} />
    </Routes>
  );
}

export default App;
