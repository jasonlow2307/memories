import React, { useState } from "react";
import "./Nav.css";
import { useSnackbar } from "notistack";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const Nav = ({ page, setPage }) => {
  const { enqueueSnackbar } = useSnackbar(); // Access enqueueSnackbar and closeSnackbar
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear(); // Clear all local storage
      enqueueSnackbar("Logged out successfully!", {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      enqueueSnackbar("Logout failed", {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
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
          <li className="logout-item">
            <a
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="logout-button"
            >
              🚪 Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
