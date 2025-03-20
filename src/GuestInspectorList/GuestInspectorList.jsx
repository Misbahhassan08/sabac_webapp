import React from "react";
import { useEffect, useState, useRef } from "react";
import urls from "../urls/urls";
import axiosInstance from "../axiosInstance/AxiosIstance";
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  IconButton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const GuestInspectorList = () => {
  const location = useLocation();

  const { car_id } = location.state || {};
  console.log("carid received at inspector list:", car_id);

  const navigate = useNavigate();
  const [inspectors, setInspectors] = useState([]);
  const [selectedInspector, setSelectedInspector] = useState(null);
  const listRef = useRef(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const inspectorsList = async () => {
      try {
        const response = await axiosInstance.get(urls.inspectorsList);
        const data = response.data;
        setInspectors(data);
        // console.log("Response:", data);
      } catch (error) {
        console.error("Error in fetching", error);
      }
    };
    inspectorsList();
  }, []);

  const openWhatsapp = (phoneNumber) => {
    if (!phoneNumber) {
      console.log("Phone number is not given");
      return;
    }
    const message = "Hello";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSelect = async (inspector_id) => {
    if (!car_id) {
      alert("Car ID not found. Please submit car details first.");
      return;
    }

    try {
      const response = await axiosInstance.post(urls.linkInspectorAndGuestCar, {
        car_id: car_id,
        inspector_id: inspector_id,
      });

      console.log("Inspector linked successfully:", response.data);
      alert("Inspector linked to the car successfully!");

      setSelectedInspector(inspector_id); // Update selected inspector
    } catch (error) {
      console.error("Error linking inspector:", error.response?.data || error);
      alert("Failed to link inspector. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setSelectedInspector(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box sx={{ width: "100%", marginTop: "50px" }}>
      <List
        sx={{
          backgroundColor: "#eee",
          border: "1.5px dashed #000",
          padding: "3px",
        }}
      >
        {inspectors.map((inspector) => (
          <Box key={inspector.id}>
            {/* Inspector List Item */}
            <ListItem
              button
              onClick={() => handleSelect(inspector.id)}
              sx={{
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                alignItems: "center",
                backgroundColor: "#2E3135",
                borderBottom: "1px solid #ddd",
                "&:hover": { bgcolor: "#484547" },
                padding: 2,
              }}
            >
              {/* Small Screen Layout */}
              {isSmallScreen ? (
                <>
                  {/* First Row: Avatar, Name, Email */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={inspector.avatar}
                        alt={inspector.first_name}
                      />
                    </ListItemAvatar>
                    <Typography
                      fontWeight="bold"
                      color="#fff"
                      fontSize="14px"
                      sx={{ ml: 1 }}
                    >
                      {`${inspector.first_name} ${inspector.last_name}`}
                    </Typography>
                  </Box>

                  {/* Second Row: Phone Number & Expand Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      mt: 1,
                    }}
                  >
                    <Typography color="#fff" fontSize="12px">
                      {inspector.phone_number}
                    </Typography>
                    <Typography
                      color="#fff"
                      fontSize="12px"
                      sx={{ textAlign: "center", width: "100%", mt: 0.5 }}
                    >
                      {inspector.email}
                    </Typography>
                    <IconButton
                      onClick={() => handleSelect(inspector.id)}
                      sx={{
                        transition: "transform 0.3s",
                        transform:
                          selectedInspector === inspector.id
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                      }}
                    >
                      <ExpandMore sx={{ color: "white" }} />
                    </IconButton>
                  </Box>
                </>
              ) : (
                // Medium & Larger Screen Layout
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={inspector.avatar} alt={inspector.first_name} />
                  </ListItemAvatar>

                  <Typography fontWeight="bold" color="#fff" fontSize="16px">
                    {`${inspector.first_name} ${inspector.last_name}`}
                  </Typography>

                  <Typography color="#fff" fontSize="14px">
                    {inspector.email}
                  </Typography>

                  <Typography color="#fff" fontSize="14px">
                    {inspector.phone_number}
                  </Typography>

                  <IconButton
                    onClick={() => handleSelect(inspector.id)}
                    sx={{
                      transition: "transform 0.3s",
                      transform:
                        selectedInspector === inspector.id
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                    }}
                  >
                    <ExpandMore sx={{ color: "white" }} />
                  </IconButton>
                </Box>
              )}
            </ListItem>

            {/* Expandable Buttons */}
            {selectedInspector === inspector.id && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  padding: 2,
                  bgcolor: "#f0f0f0",
                  gap: 2,
                }}
              >
                <Button
                  onClick={() => {
                    handleSelect(inspector.id);
                    openWhatsapp(inspector.phone_number);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Call
                </Button>
                {/* <Button
                    onClick={()=>navigateToFreeSlot(inspector)}
                      variant="contained"
                      color="secondary"
                    >
                      Select Time
                    </Button> */}
              </Box>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default GuestInspectorList;
