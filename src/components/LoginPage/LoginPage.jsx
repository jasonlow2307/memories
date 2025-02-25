import React, { useState } from "react";
import "./LoginPage.css";
import { useSnackbar } from "notistack";
import useFirestoreWrite from "../../firebase/useFirestoreWrite";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const LoginPage = ({ setUser, setPage, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
  const { enqueueSnackbar } = useSnackbar();
  const { writeData } = useFirestoreWrite();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("images-")) {
        localStorage.removeItem(key);
      }
      console.log("🔑 Cleared image cache");
    });
    console.log("🔐 Attempting login with:", { email });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Login successful:", userCredential.user);

      setUser(userCredential.user);
      localStorage.setItem("user", JSON.stringify(userCredential.user.email));

      enqueueSnackbar("Login successful!", {
        variant: "success",
        autoHideDuration: 2000,
      });

      writeData("login", {
        email: userCredential.user.email,
        date: new Date(),
      });
      setPage("memories");
    } catch (error) {
      console.error("❌ Login error:", error.code, error.message);

      let errorMessage = "Login failed";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleGuestLogin = () => {
    setUser({ uid: "default" });
    setPage("memories");
    localStorage.setItem("user", "guest");
    enqueueSnackbar("Continuing as guest", {
      variant: "info",
      autoHideDuration: 2000,
    });
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
          <p className="switch-auth">
            <span onClick={handleGuestLogin} className="switch-link">
              Continue as guest
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
