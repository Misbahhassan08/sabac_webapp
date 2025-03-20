import React from "react";
import urls from "../urls/urls";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    adress:""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const response = await axios.post(urls.salerRegister, {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number || null, 
        adress: formData.adress
      });
  
      // Safely handle the API response
      if (response && response.data) {
        // navigate("salerdashboard/")
        setMessage(response.data.message || "Registration successful");
        setError("");
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          confirm_password: "",
          phone_number: "",
          adress:""
        });
        navigate("/salercar");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      // Handle error responses
      const errorMessage =
        err.response?.data?.message || "An error occurred during registration.";
      setError(errorMessage);
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
      position: "fixed", 
      top: 0,
      left: 0,
    }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "500px",
          // backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#ffffff",
          }}
        >
          Registration
        </h2>
        <form style={{ display: "flex", flexDirection: "column", gap: "15px" }} onSubmit={handleSubmit}>
          {/* First Name and Last Name */}
          <div style={{ display: "flex", gap: "30px" }}>
            <div style={{ flex: 1 }}>
              {/* <label
                htmlFor="first_name"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                First Name
              </label> */}
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* <label
                htmlFor="last_name"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Last Name
              </label> */}
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          {/* Username and Email */}
          <div style={{ display: "flex", gap: "30px" }}>
            <div style={{ flex: 1 }}>
              {/* <label
                htmlFor="username"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Username
              </label> */}
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              {/* <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Email
              </label> */}
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div style={{ display: "flex", gap: "30px" }}>
            <div style={{ flex: 1 }}>
              {/* <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Password
              </label> */}
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
          
            <div style={{ flex: 1 }}>
              {/* <label
                htmlFor="confirm_password"
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Confirm Password
              </label> */}
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm your password"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div style={{ display: "flex", gap: "30px" }}>
              <div>
            {/* <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Phone Number
            </label> */}
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>
          <div>
            {/* <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              adress
            </label> */}
            <input
              type="text"
              id="adress"
              name="adress"
              value={formData.adress}
              onChange={handleChange}
              placeholder="Enter Your Adress"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
                fontSize: "16px",
              }}
            />
          </div>
          </div>
 
          {error && <p style={{ color: "red" }}>{error}</p>}
          {message && <p style={{ color: "green" }}>{message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#9ED90D",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
    
          >
            Register
          </button>
          <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            color: "#ffffff",
          }}
        >
          Already have an account?
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#9ED90D",
              cursor: "pointer",
              textDecoration: "underline",
              padding: "0",
              fontSize: "14px",
            }}
          >
            Login
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
