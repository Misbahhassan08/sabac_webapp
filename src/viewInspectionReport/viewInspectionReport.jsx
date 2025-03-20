import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useLocation } from "react-router-dom";
import { Typography, CircularProgress, Box } from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import SpeedIcon from "@mui/icons-material/Speed";
import { Button, useMediaQuery, useTheme } from "@mui/material";

const ViewInspectionReport = () => {
  const [report, setReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const location = useLocation();
  const salercarId = location.state?.salerCarId;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // get inspection report fun
  useEffect(() => {
    if (!salercarId) {
      console.error("Car id is missing");
      return;
    }

    const getInspectionReport = async () => {
      try {
        const response = await axiosInstance.get(
          `${urls.getInspectionReport}?car_id=${salercarId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Inspection report:", response.data);

        if (response.data.length > 0) {
          const reportData = response.data[0]; // Extract first object
          setReport(reportData);

          if (reportData.car_photos?.length > 0) {
            setSelectedImage(reportData.car_photos[0]); // Set first image
          }
        }
      } catch (error) {
        console.error("Error in fetching Inspection Report", error);
      }
    };
    getInspectionReport();
  }, [salercarId]);

  const getProgressColor = (value) => {
    if (value >= 80) return "#4caf50"; // Green
    if (value >= 50) return "#ffeb3b";
    return "#f44336";
  };

  const formatDateItalian = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div
      style={{
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent:"center"
      }}
    >
      {/* Report */}
      {report && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "90%",
            maxWidth: "1000px",
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          {/* name section */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" style={{ fontWeight: "bold" }}>
              {report.company.toUpperCase()} {report.car_name.toUpperCase()}{" "}
              {report.model.toUpperCase()}
            </Typography>
          </div>
          {/* image section */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "600px",
              height: "auto",
              textAlign: "center",
            }}
          >
            <img
              src={selectedImage}
              alt="Car"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {report.car_photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt="Thumbnail"
                  width="80px"
                  height="80px"
                  style={{
                    objectFit: "cover",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: selectedImage === photo ? "3px solid #000" : "none",
                  }}
                  onClick={() => setSelectedImage(photo)}
                />
              ))}
            </div>
          </div>
          {/* Feature Boxes */}
          <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: isSmallScreen ? "center" : "space-between",
                padding: "10px",
                gap: "10px",
                maxWidth: isSmallScreen ? "300px" : "100%", // Ensures proper wrapping
              }}
          >
            {/* Color */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ddd",
                width: "90px",
                height: "90px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e3e3e3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <ColorLensIcon fontSize="large" />
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", marginTop: "5px" }}
              >
                {report.color}
              </Typography>
            </div>

            {/* Condition */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ddd",
                width: "90px",
                height: "90px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e3e3e3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <DirectionsCarIcon fontSize="large" />
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", marginTop: "5px" }}
              >
                {report.condition}
              </Typography>
            </div>

            {/* Engine Type */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ddd",
                width: "90px",
                height: "90px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e3e3e3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <ElectricCarIcon fontSize="large" />
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", marginTop: "5px" }}
              >
                {report.engine_type}
              </Typography>
            </div>

            {/* Fuel Type */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ddd",
                width: "90px",
                height: "90px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e3e3e3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <LocalGasStationIcon fontSize="large" />
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", marginTop: "5px" }}
              >
                {report.fuel_type}
              </Typography>
            </div>

            {/* Mileage */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ddd",
                width: "90px",
                height: "90px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
                boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e3e3e3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f9f9f9")
              }
            >
              <SpeedIcon fontSize="large" />
              <Typography
                variant="body2"
                style={{ fontWeight: "bold", marginTop: "5px" }}
              >
                {report.mileage} km
              </Typography>
            </div>
          </div>
          {/* percentage bars */}
          <div style={{ width: "100%", marginTop: "20px" }}>
            {[
              { label: "Body Condition", value: report.body_condition },
              { label: "Engine Condition", value: report.engine_condition },
              { label: "AC Condition", value: report.ac_condition },
              { label: "Brakes Condition", value: report.brakes_condition },
              { label: "Clutch Condition", value: report.clutch_condition },
              {
                label: "Electrical Condition",
                value: report.electrical_condition,
              },
              { label: "Steering Condition", value: report.steering_condition },
              {
                label: "Suspension Condition",
                value: report.suspension_condition,
              },
              { label: "OverAll Points ", value: report.overall_score },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  marginBottom: "15px",
                  width: "100%",
                }}
              >
                {/* Circular Progress Bar */}
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "20px",
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={item.value}
                    size={60}
                    thickness={6}
                    sx={{ color: getProgressColor(item.value) }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {`${item.value}%`}
                    </Typography>
                  </Box>
                </Box>

                {/* Label & Linear Progress Bar */}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", marginBottom: "5px" }}
                  >
                    {item.label}
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "#ddd",
                      height: "8px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${item.value}%`,
                        height: "100%",
                        backgroundColor: getProgressColor(item.value),
                        transition: "width 0.5s ease-in-out",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "5px",
              }}
            >
              <Button
                sx={{
                  backgroundColor: "#4caf50",
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                Accept
              </Button>
              <Button
                sx={{
                  backgroundColor: "#f44336",
                  borderRadius: "8px",
                  color: "white",
                }}
              >
                Reject
              </Button>
            </div>
            <hr
              style={{
                width: "100%",
                border: "0.5px solid #ccc",
                margin: "10px 0",
              }}
            />
            <Typography
              sx={{ fontStyle: "italic", fontSize: "16px", color: "#333" }}
            >
              {formatDateItalian(report.inspection_date)}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInspectionReport;
