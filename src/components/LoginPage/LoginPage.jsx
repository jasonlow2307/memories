import React, { useState } from "react";
import "./LoginPage.css";
import { useSnackbar } from "notistack";
import useFirestoreWrite from "../../firebase/useFirestoreWrite";
import { loginUser } from "../../firebase/auth"; // Import the loginUser function

const LoginPage = ({ setUser, setPage, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { writeData } = useFirestoreWrite();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any existing errors

    try {
      // Attempt to login with Firebase
      const userCredential = await loginUser(email, password);

      // If successful, update the app state
      setUser(userCredential);
      localStorage.setItem("user", JSON.stringify(userCredential.email));

      enqueueSnackbar("Logged In Successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        autoHideDuration: 3000,
        className: "custom-snackbar",
        action: (key) => (
          <button
            onClick={() => closeSnackbar(key)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Dismiss
          </button>
        ),
      });

      setPage("memories"); // Navigate to memories page instead of quiz
      localStorage.setItem("page", "memories");

      // Record login in Firestore
      const record = {
        time: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        user: userCredential.email,
        uid: userCredential.uid,
      };
      await writeData("login", record);
    } catch (error) {
      // Handle specific Firebase auth errors
      let errorMessage = "Login failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }

      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  };

  return (
    <div className="login-form-container">
      <div className="form-section">
        <h1 className="login-form-title">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="loginForm">
          <input
            type="email" // Changed to email type
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="switch-auth">
            Don't have an account?{" "}
            <span onClick={switchToRegister} className="switch-link">
              Register here
            </span>
          </p>
        </form>
      </div>
      <div className="background-section">
        <div className="content-overlay">
          <h2 className="background-title">Welcome to Stars 📸</h2>
          <p className="background-text">Login to view your memories</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
