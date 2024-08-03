// Header.jsx
import React from "react";
import "./Header.css"; // Create this file for custom styling


function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li><a href="#home">Home</a></li>
          <li><a href="#jobs">Jobs</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
