import React from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useEffect } from "react";
import { useState } from "react";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {


  const navigate = useNavigate()

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [cars, setCars] = useState([]);

  useEffect(() => {
    const getcarsWithStatusAwaitngApproval = async () => {
      try {
        const response = await axiosInstance.get(urls.getCarsForApproval, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = response.data;
        setCars(data);
        console.log("cars awaiting approval:", data);
      } catch (error) {
        console.error("Error in fething cars:", error);
      }
    };
    getcarsWithStatusAwaitngApproval();
  }, []);

  // navigate to view inspection report
  const handleNavigate = (salerCarId) =>{
    navigate("/report-view", {state:{salerCarId}})
    console.log("carIdSent:",salerCarId)
  }



  

  return (
    // main
    <div
      style={{
        marginTop: "50px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {cars.length > 0 ? (
          cars.map((car) => (
            <div
              key={car.saler_car_id}
              style={{
                width: isSmallScreen ? "100%" : "200px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#fff",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
                position: "relative",
                padding: "5px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={car.photos[0] || "placeholder.jpg"}
                alt={`${car.car_name} by ${car.company}`}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              {/* Status Badge */}
              <div
                style={{
                  backgroundColor:
                    car.status === "pending"
                      ? "#f01e2c"
                      : car.status === "in_inspection"
                      ? "#76BA1B"
                      : "#FFA500",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                  position: "absolute",
                  top: "10px",

                  right: "-15px",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                }}
              >
                {car.status.toUpperCase()}
              </div>
              <h3 style={{ fontSize: "16px" }}>
                {car.company} {car.car_name} - {car.model}
              </h3>
              <p style={{ fontSize: "14px", color: "#777" }}>
                Color: {car.color}
              </p>
              <p style={{ fontSize: "14px", color: "#777" }}>
                Demand: {car.demand}
              </p>
              <Button
              onClick={()=>handleNavigate(car.saler_car_id)}
                style={{
                  backgroundColor: "#4caf50",
                  borderRadius: "8px",
                  color:"#fff"
                }}
              >
                View Report
              </Button>
            </div>
          ))
        ) : (
          <p>No cars Found</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
