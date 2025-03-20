import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { DatePicker, TimePicker,LocalizationProvider  } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";

function BookInspector() {
  const steps = ["Basic Info", "Expert Visit", "Checkout"];

  const [openDialog, setOpenDialog] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Date state
  const [selectedTime, setSelectedTime] = useState(dayjs()); // Time state

    // Open dialog
    const handleOpenDialog = () => {
        setOpenDialog(true);
      };
    
      // Close dialog
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box sx={{ height: "100vh", backgroundColor: "#f0f4ff" }}>
      <AppBar position="static" sx={{ backgroundColor: "#003e85" }}>
        <Toolbar>
          <Typography variant={isSmallScreen ? "h6" : "h5"}>
            Book Expert
          </Typography>
        </Toolbar>
      </AppBar>
      {/* progress Bar */}
      <Box sx={{ p: "2", backgroundColor: "#003e85", color: "ffffff" }}>
        <Stepper activeStep={1} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography
                  sx={{
                    color: "ffffff",
                    fontSize: isSmallScreen ? "10px" : "12px",
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography
          variant={isSmallScreen ? "h5" : "h4"}
          sx={{ textAlign: "center", m: 5, color: "#ffffff" }}
        >
          Expert Visit
        </Typography>
      </Box>
      <Box
        sx={{
          mt: isSmallScreen ? 2 : 4,
          mx: "auto",
          p: isSmallScreen ? 2 : 3,
          width: isSmallScreen ? "90%" : isMediumScreen ? "70%" : "400px",
          backgroundColor: "#F5F5F5",
          boxShadow: 2,
        }}
      >
        <Button
        onClick={handleOpenDialog}
          fullWidth
          variant="contained"
          sx={{
            mb: 2,
            backgroundColor: "#003e85",
            color: "white",
            textTransform: "none",
          }}
          startIcon={<CalendarMonthIcon />}
        >
          Select Date & Time
        </Button>
         {/* Dialog for Date and Time Pickers */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Select Date & Time</DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {/* Date Picker */}
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{ mb: 2, width: "100%", mt:2 }}
              />

              {/* Time Picker */}
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log("Selected Date:", selectedDate.format("YYYY-MM-DD"));
              console.log("Selected Time:", selectedTime.format("HH:mm"));
              handleCloseDialog();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#003e85",
            color: "white",
            textTransform: "none",
          }}
          startIcon={<LocalPhoneIcon />}
        >
          Call Expert
        </Button>
      </Box>
    </Box>
  );
}

export default BookInspector;
