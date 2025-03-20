import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [popupNotifications, setPopupNotifications] = useState([]);
  const [userRole, setUserRole] = useState(null); // ✅ Track userRole in state
  const [intervalId, setIntervalId] = useState(null); // ✅ Track polling interval

  useEffect(() => {
    // ✅ Get userRole from localStorage on mount and when it changes
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserRole(storedUser?.role);
  }, []); // ✅ Runs only once on mount

  const fetchNotifications = async () => {
    try {
      if (userRole !== "saler") return; // ✅ Only run for salers

      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("No access token, stopping polling.");
        clearInterval(intervalId); // ✅ Stop polling if no token
        return;
      }

      const response = await axiosInstance.get(urls.BidNotifForSeller, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Find new notifications
      const newNotifications = response.data.filter(
        (notif) => !notifications.some((n) => n.id === notif.id)
      );

      if (newNotifications.length > 0) {
        setPopupNotifications((prev) => [...prev, ...newNotifications]);

        setTimeout(() => {
          setPopupNotifications((prev) => prev.slice(newNotifications.length));
        }, 5000);
      }

      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);

      if (error.response?.status === 401) {
        console.warn("Unauthorized request, stopping polling.");
        clearInterval(intervalId); // ✅ Stop polling on unauthorized error
      }
    }
  };

  useEffect(() => {
    if (userRole === "saler") {
      fetchNotifications(); // ✅ Initial fetch

      // ✅ Set polling interval
      const id = setInterval(fetchNotifications, 5000);
      setIntervalId(id);

      return () => clearInterval(id); // ✅ Cleanup on unmount/logout
    }
  }, [userRole]);

  return (
    <NotificationContext.Provider value={{ notifications, popupNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
