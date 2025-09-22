import React from "react";
import TopBar from "../component/TopBar";
import SideBar from "../component/SideBar";
import "../styles/styles.css";
import { useAuth } from "../context/AuthContext"; 

function Layout({ children }) {
  const { user } = useAuth(); // get current logged-in user

  return (
    <div className="layout">
      <TopBar />
      <div className="layout-content">
        <SideBar role={user?.role} /> {/* pass role to sidebar */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
