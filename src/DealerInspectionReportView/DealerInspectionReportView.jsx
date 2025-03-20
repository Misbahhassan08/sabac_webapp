import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useLocation } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Box,
  DialogActions,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import SpeedIcon from "@mui/icons-material/Speed";
import { Button, useMediaQuery, useTheme } from "@mui/material";
import { Dialog, DialogContent, TextField } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const DealerInspectionReportView = () => {
  const [report, setReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const location = useLocation();
  const { car_id } = location.state || {};

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [bidAmount, setBidAmount] = useState("");
  console.log("Bid posted:", bidAmount);
  // bidding price dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setBidAmount("");
  };

  const handleSelectBid = (amount) => {
    setBidAmount(amount.toString());
  };

  // bid successfully posted dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const handleShowSuccessDialog = () => {
    setShowSuccessDialog(true);
  };
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
  };

  // post bid
  const handlePlaceBid = async (
    car_id,
    bid_amount,
    setIsDialogOpen,
    setShowSuccessDialog
  ) => {
    // Error Handling with Specific Messages
    if (!car_id) {
      console.error("Error: Car ID is missing.");
      alert("Car ID is required.");
      return;
    }
    if (!bid_amount || Number(bid_amount) <= 0) {
      console.error("Error: Bid amount is missing or invalid.", bid_amount);
      alert("Please enter a valid bid amount.");
      return;
    }

    const bidData = {
      saler_car: car_id,
      bid_amount,
    };

    try {
      const response = await axiosInstance.post(urls.postBid, bidData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.status === 201) {
        console.log("✅ Bid placed successfully:", response.data);
        setIsDialogOpen(false);
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error(
        "❌ Error in posting bid:",
        error.response?.data || error.message
      );
      alert("Failed to place bid. Please try again.");
      setIsDialogOpen(false);
    }
  };

  // get inspection report fun
  useEffect(() => {
    const getInspectionReport = async () => {
      try {
        const response = await axiosInstance.get(
          `${urls.getInspectionReport}?car_id=${car_id}`,
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
  }, [car_id]);

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
        // alignItems: "center",
        width: "100%",
        // justifyContent: "center",
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
              marginTop: "60px",
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
          {/* prices section */}
          {/* <Box
            display="flex"
            flexDirection={isSmallScreen ? "column" : "row"} // Column on small screens, row otherwise
            gap={2}
            width="100%"
            maxWidth="500px"
            justifyContent="center"
            alignItems="center" // Ensures alignment in column mode
          >
            {[
              { label: "Seller Demands", value: report.saler_demand },
              { label: "Estimated Value", value: report.estimated_value },
            ].map((item, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                bgcolor="#fff"
                borderRadius={2}
                boxShadow={1}
                width={isSmallScreen ? "100%" : "auto"}
                minWidth="200px"
              >
                <Typography variant="body1" fontWeight="bold">
                  {item.label}
                </Typography>

                <Typography variant="body1" ml={2.5}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box> */}

          {/* percentage bars */}
          <Box
            sx={{
              width: "100%",
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
              { label: "Overall Points", value: report.overall_score },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  marginBottom: "15px",
                  width: "100%",
                  maxWidth: "600px", // Prevents stretching
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
                    minWidth: "70px",
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
                <Box sx={{ flex: 1, width: "100%", textAlign: "left" }}>
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
                width: "100%",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "row",
                position: "fixed",
                top: "60px", // Adjust the spacing from the top
                backgroundColor: "#007bff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px",
              }}
            >
              {/* First Box */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  color: "#007bff",
                  padding: "10px 10px",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  height: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span>Asking Price</span>
                <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                  {report.saler_demand}
                </span>
              </div>

              {/* Second Box */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  color: "#007bff",
                  padding: "10px 10px",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  height: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span>Max Bid</span>
                <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                  999999
                </span>
              </div>

              {/* third box */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  color: "#007bff",
                  padding: "10px 10px",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textAlign: "center",
                  height: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <span>Bid Now</span>
                <input
                  type="number"
                  placeholder="000.00"
                  value={bidAmount}
                  readOnly
                  onClick={() => setIsDialogOpen(true)}
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    width: "100%",
                  }}
                />
              </div>
              <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
              >
                <DialogContent
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {[5000, 10000, 20000, 30000, 50000].map((amount) => (
                    <Button
                      key={amount}
                      variant="contained"
                      onClick={() => handleSelectBid(amount)}
                    >
                      {amount}
                    </Button>
                  ))}
                  <TextField
                    label="Custom Bid"
                    type="number"
                    fullWidth
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                  />
                </DialogContent>

                <DialogActions>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "5px",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() =>
                        handlePlaceBid(
                          car_id,
                          bidAmount,
                          setIsDialogOpen,
                          setShowSuccessDialog
                        )
                      }
                    >
                      Submit
                    </Button>

                    <Button onClick={handleCloseDialog} variant="contained">
                      Cancel
                    </Button>
                  </div>
                </DialogActions>
              </Dialog>
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
          </Box>
        </div>
      )}
      {/* bis successfully posted dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      >
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <CheckCircleOutlineIcon
            style={{ fontSize: "60px", color: "#6fbf73", marginBottom: "10px" }}
          />

          {/* Success Message */}
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            Success!
          </Typography>
          <Typography variant="body1">Your Bid posted successfully</Typography>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} variant="contained">
              OK
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealerInspectionReportView;
