import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { Button, Typography, TextField, IconButton, Box } from "@mui/material";
import {
  DateCalendar,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Add, Delete } from "@mui/icons-material";
import { format, isBefore, startOfDay } from "date-fns";
import { useMediaQuery, useTheme } from "@mui/material";

function InspectorSchedule() {
  const [date, setDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [slots, setSlots] = useState({ freeSlots: {}, reservedSlots: {} });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const todayDate = new Date().toLocaleDateString();

  useEffect(() => {
    setDate(null);
    setTimeSlots([]);
  }, []);

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
        console.log("Free & Reserved Slots:", response.data);
  
        // Get today's date in "YYYY-MM-DD" format
        const today = format(new Date(), "yyyy-MM-dd");
  
        // Filter slots to remove past dates
        const groupedFreeSlots = response.data.free_slots.reduce((acc, slot) => {
          if (slot.date >= today) {  // Only include today and future dates
            if (!acc[slot.date]) acc[slot.date] = [];
            acc[slot.date].push(slot.time_slot);
          }
          return acc;
        }, {});
  
        const groupedReservedSlots = response.data.reserved_slots.reduce((acc, slot) => {
          if (slot.date >= today) {  // Only include today and future dates
            if (!acc[slot.date]) acc[slot.date] = [];
            acc[slot.date].push(slot.time_slot);
          }
          return acc;
        }, {});
  
        setSlots({
          freeSlots: groupedFreeSlots,
          reservedSlots: groupedReservedSlots,
        });
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };
  
    fetchSlots();
    const intervalId = setInterval(fetchSlots, 5000);
    return () => clearInterval(intervalId);
  }, [userId]);
  

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, null]);
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedSlots = [...timeSlots];
    updatedSlots.splice(index, 1);
    setTimeSlots(updatedSlots);
  };

  const handleTimeSlotChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = value;
    setTimeSlots(updatedSlots);
  };

  const handleSave = async () => {
    if (!date || timeSlots.some((slot) => !slot)) {
      alert("Please Select Date and Slot");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");
    const requestedData = {
      dateSlots: [
        {
          date: formattedDate,
          slots: timeSlots.map((slot) => format(slot, "HH:mm")),
        },
      ],
    };

    try {
      const response = await axiosInstance.post(
        urls.addAvailability,
        requestedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Availability added successfully!");
      setTimeSlots([]);
    } catch (error) {
      alert(
        "Failed to update Schedule: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const shouldDisableDate = (day) => {
    return isBefore(startOfDay(day), startOfDay(new Date()));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            width: "100%",
            // maxWidth: "600px",
            marginTop: "50px",
            boxSizing: "border-box",
          }}
        >
          <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <Typography
            variant="h5"
            gutterBottom
            style={{ fontWeight: "bold", color: "#f94449" }}
          >
            Slot Scheduling
          </Typography>

          <Typography variant="h5" style={{fontWeight:"bold", color:"#008565"}}>
            {todayDate}
          </Typography>

          </div>


          {/* Free & Reserved Slot Circle Legend */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              padding: "8px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Box
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#008565",
                  marginRight: "5px",
                }}
              />
              <Typography>Free Slots</Typography>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Box
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#f94449",
                  marginRight: "5px",
                }}
              />
              <Typography>Reserved Slots</Typography>
            </div>
          </div>

          {/* Today's Slots Section */}
          {Object.keys({ ...slots.freeSlots, ...slots.reservedSlots }).map(
            (date) => {
              const isToday = date === format(new Date(), "yyyy-MM-dd");

              if (isToday) {
                return (
                  <div key={date} style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "10px",
                        backgroundColor: "#fff",
                        padding: "10px",
                        transform: "scale(1)", 
                        transition: "transform 0.3s ease-in-out",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", 
                        borderRadius: "6px",
                        border: "1px dashed grey",
                        width:"100%"

                      }}
                    >
                      {/* Date Label */}
                      <Typography
                        variant="subtitle1"
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#ff9800",
                          color: "#fff",
                          borderRadius: "5px",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: "100px",
                          textAlign: "center",
                          height: "100%",
                          marginRight: "5px",
                        }}
                      >
                        Today
                      </Typography>

                      {/* Slots Container */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "5px",
                          flexGrow: 1,
                        }}
                      >
                        {/* Free Slots - Green */}
                        {slots.freeSlots[date]?.map((slot, index) => (
                          <div
                            key={`free-${index}`}
                            style={{
                              backgroundColor: "#008565",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              color: "#fff",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {slot}
                          </div>
                        ))}

                        {/* Reserved Slots - Red */}
                        {slots.reservedSlots[date]?.map((slot, index) => (
                          <div
                            key={`reserved-${index}`}
                            style={{
                              backgroundColor: "#f94449",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              color: "#fff",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
            }
          )}

          {Object.keys({ ...slots.freeSlots, ...slots.reservedSlots })
            .filter((date) => date !== format(new Date(), "yyyy-MM-dd"))
            .map((date) => (
              <div
                key={date}
                style={{
                  display: "flex",
                  // alignItems: "stretch",
                  marginBottom: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
                  borderRadius: "6px",
                  border: "1px dashed grey",
                }}
              >
                {/* Date Label */}
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#7986cb",
                    color: "#fff",
                    borderRadius: "5px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "100px",
                    textAlign: "center",
                    height: "100%",
                    marginRight: "5px",
                  }}
                >
                  {date}
                </Typography>

                {/* Slots */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    // paddingLeft: "10px",
                    flexGrow: 1,
                  }}
                >
                  {/* Free Slots - Green */}
                  {slots.freeSlots[date]?.map((slot, index) => (
                    <div
                      key={`free-${index}`}
                      style={{
                        backgroundColor: "#008565",
                        padding: "10px 15px",
                        borderRadius: "6px",
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {slot}
                    </div>
                  ))}

                  {/* Reserved Slots - Red */}
                  {slots.reservedSlots[date]?.map((slot, index) => (
                    <div
                      key={`reserved-${index}`}
                      style={{
                        backgroundColor: "#f94449",
                        padding: "10px 15px",
                        borderRadius: "6px",
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <DateCalendar
            date={date}
            onChange={(newDate) => setDate(newDate)}
            shouldDisableDate={shouldDisableDate}
          />
        </div>

        {date && timeSlots.length === 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddTimeSlot}
            style={{ marginTop: "20px" }}
          >
            Select Time Slot
          </Button>
        )}

        {timeSlots.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              width: isSmallScreen ? "100%" : "47%",
              backgroundColor: "#fff",
              alignItems: "flex-start",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              padding: "20px",
              boxSizing: "border-box",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {timeSlots.map((slot, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  marginBottom: "10px",
                }}
              >
                <TimePicker
                  label={`Time Slot ${index + 1}`}
                  value={slot}
                  onChange={(value) => handleTimeSlotChange(index, value)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <IconButton
                  onClick={() => handleRemoveTimeSlot(index)}
                  style={{ background: "transparent" }}
                >
                  <Delete />
                </IconButton>
              </div>
            ))}
            {/* button section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddTimeSlot}
                style={{ marginTop: "10px", width: "100%", maxWidth: "249px" }}
              >
                Add Time Slot
              </Button>
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={handleSave}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default InspectorSchedule;
