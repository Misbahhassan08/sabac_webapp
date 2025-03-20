import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { Typography, CircularProgress, Paper } from "@mui/material";


const BiddingView = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const carId = queryParams.get("car_id");

  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // inspection report API for car detail for bidding
  useEffect(() => {
    const fetchInspectionReport = async () => {
      try {
        const response = await axiosInstance.get(
          `${urls.getInspectionReport}?car_id=${carId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        console.log("Report Fetched:", response.data);
        setReports(response.data);

        // Set the first image as default for zoom view
        if (
          response.data.length > 0 &&
          response.data[0].car_photos.length > 0
        ) {
          setSelectedImage(response.data[0].car_photos[0]);
        }
      } catch (error) {
        console.error("Error in fetching Reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInspectionReport();
  }, [carId]);

  return (
    <div
      style={{
        marginTop: "50px",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Paper
        style={{
          maxWidth: "600px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
            textAlign: "center",
            backgroundColor: "#c6ff00",
            borderTopLeftRadius:"8px",
            borderTopRightRadius:"8px"
          }}
        >
          Offer Details
        </Typography>

        {/* Show Loader while Fetching */}
        {loading ? (
          <CircularProgress />
        ) : reports && reports.length > 0 ? (
          reports.map((report, index) => (
            <div key={index} style={{ padding: "20px" }}>
              {/* Large Main Image (Zoom View) */}
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Car"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}

              {/* Small Thumbnail Images in Row */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  overflowX: "auto",
                  marginBottom: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {report.car_photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Car ${idx + 1}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border:
                        selectedImage === photo
                          ? "3px solid #007BFF"
                          : "2px solid #ddd",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                    onClick={() => setSelectedImage(photo)}
                  />
                ))}
              </div>
              {/* prices section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "5px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding:"10px",
                    backgroundColor:"#80deea",
                    borderRadius:"8px"
                  }}
                >
                  <Typography style={{fontWeight:"bold"}}>Minimum Bid</Typography>
                  <Typography style={{fontWeight:"bold"}}>bid</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                     padding:"10px",
                     backgroundColor:"#80cbc4",
                     borderRadius:"8px",
                     marginBottom:"5px"
                  }}
                >
                  <Typography style={{fontWeight:"bold"}}>Car Name</Typography>
                  <Typography style={{fontWeight:"bold"}}>{report.company}{" "}{report.car_name}</Typography>
                </div>
                {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Seller Price</Typography>
                  <Typography>Price</Typography>
                </div> */}
              </div>
              {/* buttons section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#673ab7",
                    color: "#fff",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <Typography style={{fontSize:"14px"}}>Ask Price</Typography>
                  <Typography style={{fontSize:"14px"}}>{report.saler_demand} PKR</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#3f51b5",
                    color: "#fff",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <Typography>Max Bid</Typography>
                  <Typography>Price</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                  }}
                >
                  <Typography>Your Bid</Typography>
                  {/* <Typography>Price</Typography> */}
                </div>
              </div>

              <hr style={{ margin: "5px 0" }} />
              <Typography
                variant="body2"
                style={{ marginTop: "10px", fontStyle: "italic" }}
              >
                Inspection Date:{" "}
                {new Date(report.inspection_date).toLocaleDateString()}
              </Typography>
            </div>
          ))
        ) : (
          <Typography variant="body1" color="error">
            No inspection report found for this car.
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default BiddingView;
