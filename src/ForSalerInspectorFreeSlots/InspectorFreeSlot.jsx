import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { Typography, Box, Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useMediaQuery, useTheme } from "@mui/material";

function InspectorFreeSlot() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { state } = useLocation();
  const inspector = state?.inspector;
  const id = inspector?.id;
  const saler_car_id = state?.saler_car_id;
  const first_name = inspector?.first_name;
  const last_name = inspector?.last_name;

  const [availableSlots, setAvailableSlots] = useState({}); 
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]); // Store full slot data

  const [selectedSlot, setSelectedSlot] = useState(null); 
  console.log("Selected slot:",selectedSlot)
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error("Inspector ID is missing. Cannot fetch available slots.");
      return;
    }

    const fetchAvailableSlot = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axiosInstance.get(
          `${urls.getfreeslots}?inspector=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Date Time:", response.data);

        // Group time slots by date
        const groupedSlots = response.data.free_slots.reduce((acc, slot) => {
          if (!acc[slot.date]) {
            acc[slot.date] = [];
          }
          acc[slot.date].push(slot);
          return acc;
        }, {});

        setAvailableSlots(groupedSlots);
        setAvailabilityData(response.data.free_slots);
      } catch (error) {
        console.error("Error in fetching availability:", error);
      }
    };

    fetchAvailableSlot();
    const intervalId = setInterval(fetchAvailableSlot,500)
    return ()=> clearInterval(intervalId)
  }, [id]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    setSelectedTimeSlots(availableSlots[formattedDate] || []);
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setOpenDialog(true);
  };

  const confirmBooking = async () => {
    if (!selectedSlot) return;
    
    try {
      const requestedData = {
        saler_car_id: saler_car_id,
        availability_id: selectedSlot.availability_id,
        time_slot: selectedSlot.time_slot,
      };
      console.log("Requested Data:",requestedData)

      const token = localStorage.getItem("access_token");
      const response = await axiosInstance.post(urls.selectSlot, requestedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Slot selection successful:", response.data);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error in selecting slot:", error);
      setOpenDialog(false);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: 2,
          backgroundColor: "#fff",
          width: "100%",
          margin: "10px 0",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: isSmallScreen ? "0" : 5,
        }}
      >
        <Typography variant="h4">
          {first_name} {last_name} Free Slots
        </Typography>
        <Typography>
          Select a Date to view available Time Slots & Book Appointment
        </Typography>
      </Box>

      {/* Calendar for Selecting Available Dates */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={(date) => {
            const formattedDate = dayjs(date).format("YYYY-MM-DD");
            return !availableSlots.hasOwnProperty(formattedDate);
          }}
        />
      </LocalizationProvider>

      {/* Show Available Time Slots */}
      {selectedTimeSlots.length > 0 && (
        <Grid
          container
          justifyContent="center"
          sx={{
            mt: 2,
            margin: "10px auto",
            maxWidth: "600px",
          }}
          spacing={2}
        >
          {selectedTimeSlots.map((slot, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  padding: "20px",
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {slot.time_slot}
                <Button
                  sx={{
                    mt: 1,
                    backgroundColor: "rgb(22, 22, 146)",
                    color: "#fff",
                  }}
                  onClick={() => handleBookSlot(slot)}
                >
                  Book
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to book the appointment for{" "}
            <b>{selectedSlot?.time_slot}</b> on{" "}
            <b>{selectedSlot?.date}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={confirmBooking} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InspectorFreeSlot;
