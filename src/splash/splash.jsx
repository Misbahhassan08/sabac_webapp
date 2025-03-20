import React from "react";
import { Typography, Button } from "@mui/material";
import sabaclogo from "../assets/6 1.png";
import landCruiser from "../assets/image.png";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate("/login");
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
      {/* Logo Section */}
      <img
        src={sabaclogo}
        alt="sabacLogo"
        style={{
          width: "150px",
          height: "auto",
        }}
      />

      {/* Car Images */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <img
          src={landCruiser}
          alt="landCruiser"
          style={{
            width: "250px",
            height: "auto",
          }}
        />
        <Typography
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          Premium Cars.
          <br />
          Enjoy the luxury
        </Typography>
        <Typography
          style={{
            color: "#bbb",
            fontSize: "14px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Premium and prestige car daily rental.
          <br />
          Experience the thrill at a lower price.
        </Typography>
      </div>

      {/* Button */}
      <Button
        onClick={navigateToLogin}
        variant="contained"
        style={{
          backgroundColor: "#fff",
          color: "#282931",
          fontSize: "16px",
          padding: "10px 30px",
          borderRadius: "30px",
          textTransform: "none",
          marginTop: "20px",
        }}
      >
        Let's Go
      </Button>
    </div>
  );
};

export default Splash;
