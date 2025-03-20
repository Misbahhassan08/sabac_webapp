import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import EventIcon from "@mui/icons-material/Event";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";

function DealerDashboard() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  console.log("cars:", cars);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Live");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const navigateToReportView = (car_id) => {
    navigate("/dealer-inspection-report-view", { state: { car_id } });
  };

  const handleOpenDialog = (car) => {
    setSelectedCar(car);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCar(null);
  };
  // const handleNavigate = (carId) => {
  //   if (activeTab === "live") {
  //     console.log("active tab:", activeTab);
  //     navigate(`/bidding-view?car_id=${carId}`);
  //   } else if (activeTab === "upcoming") {
  //     console.log("upcoming tab clicked");
  //   } else if (activeTab === "deals") {
  //     console.log("deal tab clicked");
  //   } else if (activeTab === "inventory") {
  //     console.log("inventory tab clicked");
  //   } else {
  //     console.log("invalid click");
  //   }
  // };

  const fetchCars = async (apiUrl) => {
    setLoading(true);
    setCars([]);
    try {
      const response = await axiosInstance.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCars(response.data.cars || []);
    } catch (error) {
      console.error("Error in fetching cars:", console.error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setActiveTab("live");
    fetchCars(urls.getCarsWithStatusBidding);
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: "50px" }}>
      {/* Navbar */}
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          padding: "10px 10px",
          display: "flex",
          justifyContent: "space-between",
          gap: "5px",
        }}
      >
        <Button
          sx={{
            flexGrow: 1,
            backgroundColor: activeTab === "live" ? "#1976d2" : "#cecece",
            color: activeTab === "live" ? "#fff" : "#000",
          }}
          onClick={() => {
            setActiveTab("live");
            fetchCars(urls.getCarsWithStatusBidding);
          }}
        >
          <LiveTvIcon sx={{ marginRight: "5px" }} /> Live
        </Button>

        <Button
          sx={{
            flexGrow: 1,
            backgroundColor: activeTab === "upcoming" ? "#1976d2" : "#cecece",
            color: activeTab === "upcoming" ? "#fff" : "#000",
          }}
          onClick={() => {
            setActiveTab("upcoming");
            fetchCars(urls.getUpcomingCars);
          }}
        >
          <EventIcon sx={{ marginRight: "5px" }} /> Upcoming
        </Button>
        <Button
          sx={{ flexGrow: 1, backgroundColor: "#cecece", color: "#000" }}
          onClick={{}}
        >
          <LocalOfferIcon sx={{ marginRight: "5px" }} /> Deals
        </Button>
        <Button sx={{ flexGrow: 1, backgroundColor: "#cecece", color: "#000" }}>
          <InventoryIcon sx={{ marginRight: "5px" }} /> Inventory
        </Button>
      </Paper>

      {/* Show loading indicator */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      ) : cars.length === 0 ? (
        <Typography
          variant="h6"
          color="error"
          textAlign="center"
          marginTop="20px"
          fontWeight="bold"
        >
          No cars available for bidding Right Now!
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: "20px" }}>
          {cars.map((car, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                // onClick={() => navigateToReportView(car.saler_car_id)}
                sx={{
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                  padding: "10px",
                }}
              >
                <img
                  src={
                    car.photos[0]
                      ? car.photos[0].startsWith("data:image")
                        ? car.photos[0]
                        : `data:image/jpeg;base64,${car.photos[0]}`
                      : "placeholder.jpg"
                  }
                  alt={`${car.car_name} by ${car.company}`}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    display: "block",
                    margin: "auto",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      marginTop="5px"
                      marginBottom="0"
                    >
                      {car.car_name} {car.company}
                    </Typography>

                    <Typography variant="body2" alignSelf="center">
                      {car.model}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      Demand
                    </Typography>
                    <Typography variant="body2" style={{ alignSelf: "center" }}>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {Math.round(car.demand)} PKR
                      </span>
                    </Typography>
                  </div>
                </div>

                {activeTab === "live" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        style={{ fontSize: "12px", alignSelf: "center" }}
                      >
                        Report Score
                      </Typography>
                      <div
                        style={{
                          backgroundColor:
                            car.overall_rating >= 80
                              ? "#4CAF50"
                              : car.overall_rating >= 50
                              ? "#FFC107"
                              : "#F44336",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontWeight: "bold",
                          fontSize: "14px",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                          minWidth: "80px",
                          textAlign: "center",
                        }}
                      >
                        {car.overall_rating
                          ? `${car.overall_rating}/100`
                          : "N/A"}
                      </div>
                    </div>

                    <Button
                      onClick={() => navigateToReportView(car.saler_car_id)}
                      variant="contained"
                      style={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        // fontWeight: "bold",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                        fontSize: "12px",
                        marginTop: "15px",
                      }}
                    >
                      View Report
                    </Button>
                  </div>
                )}

                {activeTab === "upcoming" && (
                  <div>
                    <Button
                      onClick={() => handleOpenDialog(car)}
                      variant="contained"
                      style={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        // fontWeight: "bold",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                        fontSize: "12px",
                        marginTop: "15px",
                      }}
                    >
                      Detail
                    </Button>
                    {/* Popover for Car Details */}
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      sx={{
                        "& .MuiBackdrop-root": {
                          backdropFilter: "blur(10px)", 
                          backgroundColor: "rgba(0, 0, 0, 0.3)", 
                        },
                      }}
                      PaperProps={{
                        sx: {
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)", 
                          width: "90%", 
                          maxWidth: "500px", 
                          borderRadius: "16px", 
                          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)", 
                          padding: "24px", 
                          backgroundColor: "#ffffff", 
                        },
                      }}
                    >
                      {selectedCar && (
                        <>
                          {/* Dialog Title */}
                          <DialogTitle
                            sx={{
                              fontSize: "1.5rem", 
                              fontWeight: "600", 
                              color: "#333333", 
                              paddingBottom: "16px", 
                              borderBottom: "1px solid #e0e0e0", 
                            }}
                          >
                            {selectedCar.company} {selectedCar.car_name} (
                            {selectedCar.model})
                          </DialogTitle>

                          {/* Dialog Content */}
                          <DialogContent sx={{ paddingTop: "16px" }}>
                            <Typography
                              variant="body1"
                              sx={{
                                marginBottom: "12px",
                                color: "#555555",
                              }}
                            >
                              <strong>Condition:</strong>{" "}
                              {selectedCar.condition}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "12px", color: "#555555" }}
                            >
                              <strong>Color:</strong> {selectedCar.color}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "12px", color: "#555555" }}
                            >
                              <strong>Fuel Type:</strong>{" "}
                              {selectedCar.fuel_type}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "12px", color: "#555555" }}
                            >
                              <strong>Demand:</strong> {selectedCar.demand}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ marginBottom: "16px", color: "#555555" }}
                            >
                              <strong>Description:</strong>{" "}
                              {selectedCar.description}
                            </Typography>

                            {/* Car Image */}
                            <img
                              src={
                                selectedCar.photos &&
                                selectedCar.photos.length > 0
                                  ? selectedCar.photos[0].startsWith("/9j/") // Check if it's Base64 (JPEG signature)
                                    ? `data:image/jpeg;base64,${selectedCar.photos[0]}` // Convert Base64
                                    : selectedCar.photos[0] // Use URL directly
                                  : "https://via.placeholder.com/300" // Default placeholder if no image
                              }
                              alt={selectedCar.car_name}
                              style={{
                                width: "100%",
                                maxHeight: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          </DialogContent>

                          {/* Dialog Actions */}
                          <DialogActions sx={{ padding: "16px 24px" }}>
                            <Button
                              onClick={handleCloseDialog}
                              variant="contained"
                              sx={{
                                backgroundColor: "#1976d2",
                                color: "#ffffff",
                                borderRadius: "8px",
                                padding: "8px 16px",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "#1565c0",
                                },
                              }}
                            >
                              Close
                            </Button>
                          </DialogActions>
                        </>
                      )}
                    </Dialog>
                  </div>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default DealerDashboard;
