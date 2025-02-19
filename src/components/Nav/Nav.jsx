import React, { useState } from "react";
import "./Nav.css";
import { useSnackbar } from "notistack";

const Nav = ({ page, setPage }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar(); // Access enqueueSnackbar and closeSnackbar
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className={`nav-wrapper ${isMenuOpen ? "open" : ""}`}>
      {/* Hamburger Icon */}
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div
          className="bar"
          style={{
            backgroundColor:
              page === "memory-grid" && !isMenuOpen ? "black" : "white",
          }}
        ></div>
        <div
          className="bar"
          style={{
            backgroundColor:
              page === "memory-grid" && !isMenuOpen ? "black" : "white",
          }}
        ></div>
        <div
          className="bar"
          style={{
            backgroundColor:
              page === "memory-grid" && !isMenuOpen ? "black" : "white",
          }}
        ></div>
      </div>
      {/* Navigation Menu */}
      <div className={`nav-menu ${isMenuOpen ? "slide-in" : "slide-out"}`}>
        <ul>
          <li>
            <a
              onClick={() => {
                setPage("memories");
                localStorage.setItem("page", "memories");
                toggleMenu();
              }}
              className={page === "memories" ? "selected" : ""}
            >
              🖼️ Memories
            </a>
          </li>

          <li>
            <a
              onClick={() => {
                setPage("memory-grid");
                localStorage.setItem("page", "memory-grid");
                toggleMenu();
              }}
              className={page === "memory-grid" ? "selected" : ""}
            >
              💌 Memory Grid
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                setPage("form");
                localStorage.setItem("page", "form");
                toggleMenu();
              }}
              className={page === "form" ? "selected" : ""}
            >
              ✍️ Submit Memories
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
