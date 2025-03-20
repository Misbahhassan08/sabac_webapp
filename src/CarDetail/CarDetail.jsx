import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  Slide,
  Button
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CarDetail() {
  const navigate = useNavigate();

  const location = useLocation();
  const {saler_car_id} = location.state || {}

  console.log("car id", saler_car_id)


  // Dialog state for car inspection
  const [open, setOpen] = useState(false);

  // Open dialog automatically upon navigation
  useEffect(() => {
    setOpen(true);
  }, []);

  // const handleClose = () => {
  //   setOpen(false);
  //   // navigate("/"); // Optionally navigate to a different route when closing the dialog
  // };

  const handleNavigate = () => {
    navigate("/basicinfo",{state: {saler_car_id}});
  };

  const [carDetail, setCarDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axiosInstance.get(urls.salerRecentCarDetails);
        setCarDetail(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError("Failed to load car details");
      }
    };
    fetchCarDetails();
  }, []);

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  if (!carDetail) {
    return <Typography variant="h6">Loading car details...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        gap: 3,
      }}
    >
      {/* Car Images */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="mySwiper"
        >
          {carDetail.photos?.map((photo, index) => (
            <SwiperSlide key={index}>
              <img
                src={photo}
                alt={`car ${index + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Sliding Dialog */}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        // onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            position: "fixed",
            bottom: 0,
            margin: 0,
            borderRadius: "16px 16px 0 0",
            width: "100%",
          },
        }}
      >
        <DialogContent>
          {/* Dialog Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Apply for Sabac Car Inspection
            </Typography>
            {/* <Typography
              onClick={handleClose}
              sx={{ color: "#999", cursor: "pointer" }}
            >
              ✕
            </Typography> */}
          </Box>

          {/* Pricing Information */}
          {/* <Typography
            variant="subtitle1"
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 1,
              textAlign: "center",
              borderRadius: "8px",
              mb: 2,
            }}
          >
            Starting From PKR 4,950
          </Typography> */}

          {/* Steps */}
          <Box>
            {[
              // "Our agent will book a time and place for the inspection service.",
              // "Our qualified technicians will check the car on 200+ points.",
              // "A computerized inspection report’s link will be sent to you via SMS/Email.",
              "Free Evaluation",
              "Free Inspection",
              "Best Market Price",
            ].map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: "#398BF4",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </Typography>
                <Typography>{step}</Typography>
              </Box>
            ))}
          </Box>

          {/* Start Now Button */}
          <Button
            onClick={handleNavigate}
            variant="contained"
            sx={{
              backgroundColor: "#398BF4",
              color: "#fff",
              borderRadius: "24px",
              width: "100%",
              padding: "12px",
              mt: 2,
            }}
          >
            Start Now
          </Button>

          {/* Learn More Link */}
          {/* <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#398BF4",
              mt: 2,
              cursor: "pointer",
            }}
          >
            Learn more &gt;
          </Typography> */}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default CarDetail;
