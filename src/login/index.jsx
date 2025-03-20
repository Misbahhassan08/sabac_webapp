import React from "react";
// import car2 from "../assets/car2.jpg";
import urls from "../urls/urls";
import { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import whiteEdge from "../assets/Vector 2.png"
import whiteLandCruiser from "../assets/pngegg (17) 2 (1).png";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { username_or_email: username, password };
      const response = await axios.post(urls.login, userData);
      // console.log("LoginData:", response.data);
      if (response.data.success) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        const role = response.data.user.role;

        switch (role) {
          case "saler":
            navigate("/salercar/");
            break;

          case "admin":
            navigate("/admindashboard");
            break;
          case "inspector":
            navigate("/inspector-appointments");
            break;
          case "dealer":
            navigate("/dealerdashboard");
            break;
          default:
            console.log("invalid role");
            break;
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error in loggingIn", err);
      setError("Error! check your credentials");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#282931",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        position: "fixed", // Ensures it covers entire viewport
        top: 0,
        left: 0,
      }}
    >
      {/* Image Section */}
      <div>
        <img
          src={whiteLandCruiser}
          alt="Login"
          style={{ width: "300px", height: "auto", borderRadius: "10px" }}
        />
      </div>

      {/* Form Section */}
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
        }}
      >
        <h2
          style={{ textAlign: "center", color: "#ffffff", marginBottom: "5px" }}
        >
          Sell your CAR
        </h2>
        <h4
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#ffffff",
            marginTop: "0",
          }}
        >
          Faster
        </h4>
        <form
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          onSubmit={handleSubmit}
        >
          {/* Username Field */}
          <div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px", // Rounded corners
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px", // Rounded corners
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>
          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "10px", // Rounded corners
              border: "none",
              backgroundColor: "#9ED90D",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s",
              width: "100%",
            }}
          >
            Login
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              color: "#ffffff",
            }}
          >
            Do not have an account?
            <Button
              onClick={() => navigate("/register")}
              style={{
                backgroundColor: "#8e24aa",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              Register
            </Button>
            <Button
            onClick={()=> navigate("/information")}
              style={{
                backgroundColor: "#e53935",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "5px",
                fontSize: "14px",
              }}
            >
              Guest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
