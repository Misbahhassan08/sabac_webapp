import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { Typography } from "@mui/material";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DetailsIcon from "@mui/icons-material/Details";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useMediaQuery, useTheme } from "@mui/material";

const SalerAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const salerAppointment = async () => {
      try {
        const response = await axiosInstance.get(urls.salerAppointments);
        const data = response.data.appointments;
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    salerAppointment();
  }, []);

  // Function to calculate remaining time until inspection
  const calculateRemainingTime = (appointmentDate) => {
    const now = new Date();
    const inspectionTime = new Date(appointmentDate);
    const difference = inspectionTime - now;

    if (difference <= 0) {
      return "Inspection time passed";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s `;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prevAppointments) => [...prevAppointments]); // Triggers re-render
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Info Header */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <Typography
            variant="h4"
            style={{ color: "#233d7b", fontWeight: "bold", padding: "7px" }}
          >
            Appointments!
          </Typography>
          <Typography>Your scheduled appointments at a glance!</Typography>
        </div>

        {/* Icons and Info Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            padding: "15px 0",
            boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <DetailsIcon
              sx={{
                fontSize: "30px",
                backgroundColor: "#f2f3f3",
                padding: "5px",
                color: "#233d7b",
                borderRadius: "50%",
              }}
            />
            <span style={{ marginLeft: "10px" }}>Inspector Details</span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <AvTimerIcon
              sx={{
                fontSize: "30px",
                backgroundColor: "#f2f3f3",
                padding: "5px",
                color: "#233d7b",
                borderRadius: "50%",
              }}
            />
            <span style={{ marginLeft: "10px" }}>Inspection Time</span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <DirectionsCarIcon
              sx={{
                fontSize: "30px",
                backgroundColor: "#f2f3f3",
                padding: "5px",
                color: "#233d7b",
                borderRadius: "50%",
              }}
            />
            <span style={{ marginLeft: "10px" }}>Car Details</span>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          width: "80%",
        }}
      >
        {appointments.length === 0 ? (
          <Typography>No appointments scheduled.</Typography>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              style={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                backgroundColor: "#fff",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                justifyContent: "space-between",
              }}
            >
              {/* car img car detail and inspector detail */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                }}
              >
                {/* Car Image section*/}
                <div>
                  <img
                    src={appointment.car_photos?.[0] || "default-car-image.jpg"} // Access first image in the array
                    alt={appointment.car_name}
                    style={{
                      width: "100%",

                      height: isMediumScreen ? "200px" : "auto",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                {/* car detail $inspector detail */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "20px",
                    justifyContent: "space-evenly",
                  }}
                >
                  <div>
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                      {appointment.company} {appointment.car_name}{" "}
                      {appointment.car_year}
                    </Typography>
                  </div>

                  {/* Inspector Details */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                      gap: "8px", // Adds spacing between elements
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#233d7b",
                        backgroundColor: "#f2f3f3",
                        padding: "5px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        display: "block",
                        borderRadius: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Your Inspector
                    </span>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      {appointment.inspector_first_name}{" "}
                      {appointment.inspector_last_name}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <LocalPhoneIcon
                        style={{
                          backgroundColor: "#f2f3f3",
                          color: "#233d7b",
                          padding: "5px",
                          borderRadius: "50%",
                          fontSize: "20px",
                        }}
                      />
                      <Typography>
                        {appointment.inspector_phone_number}
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <MyLocationIcon
                        style={{
                          backgroundColor: "#f2f3f3",
                          color: "#233d7b",
                          padding: "5px",
                          borderRadius: "50%",
                          fontSize: "20px",
                        }}
                      />
                      <Typography>{appointment.inspector_adress}</Typography>
                    </div>
                  </div>
                </div>
              </div>
              {/* time section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1.5px dashed grey",
                  justifyContent: "space-around",
                  alignItems: "center",
                  minWidth: "170px", // Ensure enough space
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#233d7b",
                    backgroundColor: "#f2f3f3",
                    padding: "5px",
                    width: "100%",
                    maxWidth: "140px",
                    textAlign: "center",
                    display: "block",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Remaining Time in Inspection
                </span>

                <Typography
                  variant="h6"
                  style={{
                    backgroundColor: "#f2f3f3",
                    borderRadius: "8px",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    fontSize: "14px", // Keep it compact
                    fontWeight: "bold",
                    whiteSpace: "nowrap", // Prevents wrapping
                  }}
                >
                  {calculateRemainingTime(appointment.appointment_date)}
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalerAppointments;
