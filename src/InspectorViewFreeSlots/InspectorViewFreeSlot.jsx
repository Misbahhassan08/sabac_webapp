import urls from "../urls/urls";
import axiosInstance from "../axiosInstance/AxiosIstance";
import { useLocation } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useMediaQuery, useTheme } from "@mui/material";

const InspectorViewFreeSlot = () => {
  const location = useLocation();
  const car_id = location.state?.car_id
  const [slots, setSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const containerWidth = isSmallScreen
    ? "100%"
    : isMediumScreen
    ? "100%"
    : "500px";

  const Loggeduser = JSON.parse(localStorage.getItem("user"));
  const userId = Loggeduser?.id;

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token || !userId) return;

        const response = await axiosInstance.get(
          `${urls.getfreeslots}?inspector=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const groupedFreeSlots = response.data.free_slots.reduce(
          (acc, slot) => {
            if (!acc[slot.date]) acc[slot.date] = [];
            acc[slot.date].push(slot.time_slot);
            return acc;
          },
          {}
        );

        setSlots(groupedFreeSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };

    fetchSlots();
    const intervalId = setInterval(fetchSlots, 500);
    return () => clearInterval(intervalId);
  }, [userId]);

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);

    const formattedDate = date.toISOString().split("T")[0];
    setAvailableSlots(slots[formattedDate] || []);
  };

  useEffect(() => {
    // Open calendar automatically on page load
    if (Object.keys(slots).length > 0) {
      setSelectedDate(new Date()); // Set to current date or first available date
    }
  }, [slots]);

  const handleAssignSlot = async (slot) => {
    try {
      const token = localStorage.getItem("access_token");
      const user = JSON.parse(localStorage.getItem("user"));
  
      if (!token || !user) {
        alert("User not authenticated");
        return;
      }
  
      if (!car_id) {
        alert("Car ID is missing. Cannot assign slot.");
        return;
      }
  
      const requestData = {
        inspector_id: user.id,
        car_id: car_id,  // ✅ Include car_id
        date: selectedDate.toISOString().split("T")[0],
        time_slot: slot,
      };
  
      console.log("🚀 Sending request data:", requestData);
  
      const response = await axiosInstance.post(urls.assignSlot, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 201) {
        alert("✅ Successfully assigned slot!");
  
        // ✅ Remove assigned slot from `availableSlots`
        setAvailableSlots((prevSlots) => prevSlots.filter((s) => s !== slot));
  
        // ✅ Remove slot from `slots` state
        setSlots((prevSlots) => {
          const updatedSlots = { ...prevSlots };
          updatedSlots[selectedDate.toISOString().split("T")[0]] = updatedSlots[
            selectedDate.toISOString().split("T")[0]
          ].filter((s) => s !== slot);
  
          // ✅ If no slots remain, remove the date from the list
          if (updatedSlots[selectedDate.toISOString().split("T")[0]].length === 0) {
            delete updatedSlots[selectedDate.toISOString().split("T")[0]];
          }
  
          return updatedSlots;
        });
      } else {
        alert("❌ Slot assignment failed");
      }
    } catch (error) {
      console.error("❌ Error assigning slot:", error.response?.data || error.message);
      alert(`Failed to assign slot: ${error.response?.data?.error || "Unknown error"}`);
    }
  };


    // update the car status to bidding
    const updateCarStatus = async (carId , newStatus) =>{
      try{
        const response = await axiosInstance.patch(
          urls.updateCarStatus(carId),
          {status : newStatus},
          {
            headers: {Authorization : `Bearer ${localStorage.getItem("access_token")}`}
  
          }
        
        )
        console.log("new status:", newStatus)
        alert("Status updated successfully")
      }
      catch(error){
        console.error("Error in updating user",error)
      }
  
    }
  

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        alignItems: "center",
        justifyContent: "center",
        width: containerWidth,
        height: "100%",
        marginTop: "50px",
      }}
    >
      {/* Calendar (Now Opens Automatically) */}
      <Box
        sx={{
          width: 500,
          bgcolor: "#fff",
          p: 2,
          mt: 2,
          borderRadius: 2,
          boxShadow: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Date
        </Typography>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
          filterDate={(date) => {
            const formattedDate = date.toLocaleDateString("en-CA");
            return slots.hasOwnProperty(formattedDate);
          }}
        />
      </Box>

      {/* Available Slots */}
      {selectedDate && (
        <Box
          sx={{
            width: 500,
            bgcolor: "#fff",
            p: 2,
            mt: 2,
            borderRadius: 2,
            boxShadow: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Available Slots
          </Typography>
          {availableSlots.length > 0 ? (
            availableSlots.map((slot, index) => (
              <Button
                key={index}
                sx={{ bgcolor: "green", color: "#fff", m: 1 }}
                onClick={() => {
                  handleAssignSlot(slot)
                    .then(() => updateCarStatus(car_id, "assigned"))
                    .catch((err) => console.error("Error:", err));
                }}
              >
                Assign {slot}
              </Button>
            ))
          ) : (
            <Typography>No Slots Available</Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default InspectorViewFreeSlot;
