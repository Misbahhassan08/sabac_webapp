import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { Button } from "@mui/material";

const PopupNotification = () => {
  const [notifications, setNotifications] = useState(new Set());

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await axiosInstance.get(urls.BidNotifForSeller, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newNotifications = response.data.filter(
        (notif) => !notifications.has(notif.id)
      );

      if (newNotifications.length === 0) return;

      newNotifications.forEach((notif) => {
        showNotification(notif);
      });

      setNotifications((prev) => new Set([...prev, ...newNotifications.map((n) => n.id)]));

      await markNotificationsAsRead(newNotifications, token);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }, [notifications]);

  const markNotificationsAsRead = async (notifications, token) => {
    try {
      const notificationIds = notifications.map((notif) => notif.id);
      if (notificationIds.length === 0) return;

      await axiosInstance.post(
        urls.markBidNotifRead,
        { notification_ids: notificationIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      const response = await axiosInstance.post(
        `${urls.acceptBid}${bidId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Accepted bid:", response.data);
    } catch (error) {
      console.error("Error accepting bid:", error);
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      const response = await axiosInstance.post(
        `${urls.rejectBid}${bidId}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Reject bid:", response.data);
    } catch (error) {
      console.error("Error rejecting bid:", error);
    }
  };

  const showNotification = (notif) => {
    const NotificationContent = () => (
      <div>
        <p>{notif.message}</p>
        <Button
          onClick={() => handleAcceptBid(notif.bid_id)}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Accept
        </Button>
        <Button
          onClick={() => handleRejectBid(notif.bid_id)}
          style={{
            padding: "5px 10px",
            background: "red",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Reject
        </Button>
      </div>
    );

    toast.info(<NotificationContent />, {
      position: "top-right",
      autoClose: 10000, // Auto close after 10 seconds
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return <ToastContainer />;
};

export default PopupNotification;
