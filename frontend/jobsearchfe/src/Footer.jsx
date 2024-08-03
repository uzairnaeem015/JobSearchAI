// Footer.jsx
import React from "react";
import "./Footer.css"; // Create this file for custom styling

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
