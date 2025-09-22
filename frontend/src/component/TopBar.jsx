import React from "react";
import LOGO2 from "../assets/Logo2.png";
import { FaUserCircle } from "react-icons/fa";


import "../styles/styles.css";

  function Topbar() {
    return (
    <header className="topbar">
      <div className="topbar-left">
        <img src={LOGO2} alt="ClassTime Logo" className="topbar-logo" />
        <h1 className="topbar-title">ClassTime</h1>
      </div>
      <div className="topbar-right">
        <div className="profile-container">
          <FaUserCircle className="profile-icon" />
        </div>
      </div>
    </header>
  );
}

export default Topbar;
