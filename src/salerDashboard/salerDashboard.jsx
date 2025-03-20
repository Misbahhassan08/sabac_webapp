import React from "react";
import { useState, useEffect } from "react";
import urls from "../urls/urls";
import axiosInstance from "../axiosInstance/AxiosIstance";
import { useMediaQuery, useTheme} from "@mui/material";

function SalerDashboard() {
  const [carList, setCarList] = useState([]);
  console.log("carss", carList);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchUserCars = async () => {
      try {
        const respone = await axiosInstance.get(urls.userCarList, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setCarList(respone.data.cars);
        console.log("Carlist:", respone.data);
      } catch (error) {
        console.error("Error in fetching seller car:", error);
      }
    };
    fetchUserCars();
  }, []);

  return (
    // main
    <div
      style={{
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "20px",
          gap: "16px",
          // flexDirection:"row"
        }}
      >
        {carList.map((car, index) => (
          <div
            key={index}
            style={{
              width: isSmallScreen?"100%": "200px",
              // padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              position: "relative",
              // overflow: "hidden",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                top:"10px",
               
                right: "-15px",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              {car.status.toUpperCase()}
            </div>
            <h3 style={{ fontSize: "16px", margin: "8px 0" }}>
              {car.car_name}
            </h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {car.company} - {car.model}
            </p>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Color: {car.color}
            </p>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Demand: {car.demand}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalerDashboard;
