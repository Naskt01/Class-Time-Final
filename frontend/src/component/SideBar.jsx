import React from "react";
import { FaChalkboardTeacher, FaBook, FaCalendarAlt } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { RiDashboardFill } from "react-icons/ri";
import { PiStudentBold } from "react-icons/pi";
import { MdAnnouncement, MdMeetingRoom } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import "../styles/styles.css";

function SideBar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear user data
    navigate("/"); // redirect to user selection
  };

  return (
    <aside className="sidebar">
      <nav>
        {/* Admin links */}
        {role === "admin" && (
          <>
            <Link to="/dashboard"><RiDashboardFill /> Dashboard</Link>
            <Link to="/room"><MdMeetingRoom /> Room</Link>
            <Link to="/teacher"><FaChalkboardTeacher /> Teacher</Link>
            <Link to="/student"><PiStudentBold /> Student</Link>
            <Link to="/course"><FaBook /> Course</Link>
            <Link to="/schedule"><FaCalendarAlt /> Schedule</Link>
            <Link to="/announcements"><MdAnnouncement /> Announcements</Link>
          </>
        )}

        {/* Teacher links */}
        {role === "teacher" && (
          <>
            <Link to="/teacher-dashboard"><RiDashboardFill /> Dashboard</Link>
            <Link to="/teacher-dashboard"><FaCalendarAlt /> My Schedule</Link>
            <Link to="/announcements"><MdAnnouncement /> Announcements</Link>
          </>
        )}

        {/* Student links */}
        {role === "student" && (
          <>
            <Link to="/student-dashboard"><RiDashboardFill /> Dashboard</Link>
            <Link to="/student-schedule"><FaCalendarAlt /> My Schedule</Link>
            <Link to="/student-announcements"><MdAnnouncement /> Announcements</Link>
          </>
        )}

        {/* Logout button for all roles */}
        <button className="logout-button" onClick={handleLogout}>
          <TbLogout2 /> Logout
        </button>
      </nav>
    </aside>
  );
}

export default SideBar;
