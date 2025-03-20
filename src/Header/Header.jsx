import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import {
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";


function Header({ isSidebarExpanded }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  // User Info
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user.role || "guest";
  // const name = `${user.first_name} ${user.last_name}`;

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);


  // Notification Colors
  const notificationColors = [
    "#FFAD2F",
    "#6EC1F8",
    "#A9FF2F",
    "#17ECEC",
    "#33ABF9",
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      let url = null;

      if (role === "saler") {
        url = urls.salerCarInspectionNotification;
      } else if (role === "inspector") {
        url = urls.inspectorGetsAppointmentNotification;
      }

      if (!url) return;

      try {
        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const data = response.data;
        console.log(`Notification for ${role}:`, data); // ✅ Debugging log

        if (Array.isArray(data) && data.length > 0) {
          setNotifications([...data]); // ✅ Force update
          setUnreadCounts(data.filter((n) => !n.is_read).length);
        } else {
          setNotifications([]); // ✅ Ensure empty state works
        }
      } catch (error) {
        console.error(`Error fetching ${role} notifications:`, error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 10000); // Auto-refresh every 10 sec
    return () => clearInterval(intervalId);
  }, [role]);

  // Open Notification Popover
  const handleOpenPopover = (event) => {
    console.log("Opening popover for", role); // Debugging
    setAnchorEl(event.currentTarget);
  };

  // Close Popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Mark notifications as read
  const handleViewAll = async () => {
    try {
      await axiosInstance.post(
        urls.markNotificationAsRead,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      navigate("/notification"); // Redirect to full notifications page
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  // page titles
  const pageTitles = {
    "/salerdashboard": "Dashboard",
    "/salercar": "Car Details",
    "/userprofile": "Profile",
    "/admindashboard": "Dashboard",
    "/inspectordashboard": "Dashboard",
    "/dealerdashboard": "Dashboard",
    "/basicinfo": "Information",
    "/cardetail": "Apply For Inspection",
    "/inspectorlist": "Select Inspector",
    "/inspectorschedule": "Schedule Slot",
    "/inspectorfreeslot": "Book Appointment",
    "/saler-appointments": "Appointments",
    "/inspection-report": "Inspection Report",
    "/notification": "Notifications",
    "/bidding-view": "Offer Details",
    "/inspector-appointments": "Appointments",
    "/assign-slot": "Assign Slot",
    "/report-view": "Inspection Report",
    "/inspection-report-view": "Report",
    "/dealer-inspection-report-view": "Report",
  
    // Add missing paths
    "/information": "Information",
    "/guest-inspector-list": "Guest Inspector List",
    "/guest-car-detail": "Guest Car Detail",
  };
  
  const pageTitle = pageTitles[location.pathname] || "Page";
  


  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left:
          isSmallScreen || isMediumScreen
            ? "0px"
            : isSidebarExpanded
            ? "250px"
            : "60px",
        width:
          isSmallScreen || isMediumScreen
            ? "100%"
            : `calc(100% - ${isSidebarExpanded ? "250px" : "60px"})`,
        height: "60px",
        backgroundColor: "#000",
        color: "#ecf0f1",
        display: "flex",
        alignItems: "center",
        // padding: "0 20px",
        transition: "left 0.3s ease, width 0.3s ease",
        zIndex: 1200,
      }}
    >
      {/* Left Side: Greeting */}
      <div
        style={{
          color: "#ffffff",
          flex: 1,
          fontSize: isSmallScreen ? "13px" : "24px",
          paddingLeft: isSmallScreen ? "40px" : "55px",
        }}
      >
        <Typography variant={isSmallScreen ? "h6" : "h4"}>
          {pageTitle}
        </Typography>
      </div>

      {/* Right Side: Notification Icon */}
      {(role === "inspector" || role === "saler" || role === "dealer" || role === "admin") && (
        <>
          <IconButton
            sx={{ color: "#ffffff", fontSize: "30px", marginRight: "20px" }}
            onClick={handleOpenPopover}
          >
            <Badge
              badgeContent={unreadCounts}
              color="error"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <CircleNotificationsIcon fontSize="large" />
            </Badge>
          </IconButton>

          {/* Notification Popover (Dropdown) */}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{ marginTop: "10px" }}
          >
            <List sx={{ width: 300, maxHeight: 250, overflow: "auto" }}>
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification, index) => (
                  <ListItem
                    key={notification.id}
                    divider
                    sx={{
                      backgroundColor:
                        notificationColors[index % notificationColors.length],
                    }}
                  >
                    <ListItemText
                      primary={notification.message}
                      sx={{ color: "#ffffff" }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No new notifications" />
                </ListItem>
              )}
            </List>
            <Button fullWidth onClick={handleViewAll} color="primary">
              View All
            </Button>
          </Popover>
        </>
      )}

    </header>
  );
}

export default Header;
