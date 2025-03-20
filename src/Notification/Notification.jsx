import React from "react";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
} from "@mui/material";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const userData = JSON.parse(localStorage.getItem("user")) || {}
  // console.log("user:",userData)
  const role = userData.role

  const notificationColors = [
    "#FFAD2F",
    "#6EC1F8",
    "#A9FF2F",
    "#17ECEC",
    "#33ABF9",
  ];
  useEffect(() => {
    let url = null
    if (role === 'saler'){
      url = urls.salerCarInspectionNotification
    }else if(role === 'inspector'){
      url = urls.inspectorGetsAppointmentNotification
    }
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        setNotifications(response.data);
        console.log("Notification page:", response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
        width: "70%",
        padding: "20px",
        marginTop: "50px",
        borderRadius:"10px",
        border: "1px solid #ddd"
      }}
    >

      <List>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <ListItem
              key={notification.id}
              divider
              sx={{
                backgroundColor:
                  notificationColors[index % notificationColors.length],
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)", 
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", 
                },
              }}
            >
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.created_at).toLocaleString()}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No notifications found</Typography>
        )}
      </List>
    </Container>
  );
};

export default Notification;
