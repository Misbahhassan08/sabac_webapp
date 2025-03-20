import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery, useTheme, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import GarageIcon from "@mui/icons-material/Garage";
import PersonIcon from "@mui/icons-material/Person";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import EventIcon from "@mui/icons-material/Event";
import InputIcon from "@mui/icons-material/Input";
import { toast } from "react-toastify";

function SideBar({ onToggle }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const notify = () => toast("Wow so easy!"); // Define notify function

  // Then you can use notify() wherever needed

  const excludedRoutes = ["/", "/register", "/login"];
  if (excludedRoutes.includes(location.pathname)) return null;

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    onToggle(!isExpanded);
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "guest";

  const sabacPaths = [
    "/information",
    "/guest-inspector-list",
    "/guest-car-detail",
  ];

  const dashboardPath = sabacPaths.includes(location.pathname)
    ? "/information"
    : "/login";

  const sidebarTabs = {
    admin: [
      {
        path: "/admindashboard",
        label: "Dashboard",
        icon: <OtherHousesIcon sx={{ fontSize: "18px" }} />,
      },
    ],
    saler: [
      {
        path: "/salerdashboard",
        label: "Dashboard",
        icon: <OtherHousesIcon sx={{ fontSize: "18px" }} />,
      },
      {
        path: "/salercar",
        label: "Post Ad",
        icon: <GarageIcon sx={{ fontSize: "18px" }} />,
      },
      {
        path: "/userprofile",
        label: "Profile",
        icon: <PersonIcon sx={{ fontSize: "18px" }} />,
      },
      {
        path: "/saler-appointments",
        label: "Appointments",
        icon: <EventIcon sx={{ fontSize: "18px" }} />,
      },
    ],
    inspector: [
      {
        path: "/inspector-appointments",
        label: "Dashboard",
        icon: <OtherHousesIcon sx={{ fontSize: "18px" }} />,
      },
      {
        path: "/inspectorschedule",
        label: "Schedule",
        icon: <AvTimerIcon sx={{ fontSize: "18px" }} />,
      },
      {
        path: "/assign-slot",
        label: "Manual Entry",
        icon: <InputIcon sx={{ fontSize: "18px" }} />,
      },
    ],
    dealer: [
      {
        path: "/dealerdashboard",
        label: "Dashboard",
        icon: <OtherHousesIcon sx={{ fontSize: "18px" }} />,
      },
    ],
    guest: [
      {
        path: dashboardPath,
        label: "Dashboard",
        icon: <OtherHousesIcon sx={{ fontSize: "18px" }} />,
      },
    ],
  };

  // Determine which tabs to show
  let tabsToShow = sidebarTabs[userRole] || sidebarTabs["guest"];

  // ✅ If user is on a "guest" path, override tabs to show only guest dashboard
  if (sabacPaths.includes(location.pathname)) {
    tabsToShow = sidebarTabs["guest"];
  }

  return (
    <>
      {/* Show menu icon on small & medium screens when sidebar is collapsed */}
      {(isSmallScreen || isMediumScreen) && !isExpanded && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 2000,
            color: "#fff",
            // fontSize:"30px",
            // backgroundColor: "#2c3e50",
            "&:hover": { backgroundColor: "#34495e" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar */}
      <div
        style={{
          width: isExpanded
            ? "250px"
            : isSmallScreen || isMediumScreen
            ? "0px"
            : "60px",
          height: "100%",
          backgroundColor: "#2c3e50",
          color: "#ecf0f1",
          transition: "width 0.3s ease",
          padding: isExpanded ? "10px" : "0px",
          boxSizing: "border-box",
          position: "fixed",
          left: 0,
          top: 0,
          overflowX: "hidden",
          zIndex: 1300, // ✅ Ensure it's above other elements
          boxShadow: "none", // ✅ Corrected property
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isExpanded ? "space-between" : "center",
            padding: "10px 5px",
            borderBottom: "1px solid #34495e",
          }}
        >
          {isExpanded && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {sabacPaths.includes(location.pathname) ? (
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                  SABAC
                </span>
              ) : (
                <>
                  <span style={{ fontSize: "14px" }}>{user.role}</span>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {user.first_name} {user.last_name}
                  </span>
                </>
              )}
            </div>
          )}
          <IconButton
            onClick={toggleSidebar}
            sx={{ color: "#ecf0f1", background: "transparent" }}
          >
            {isExpanded ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        {/* Sidebar Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {tabsToShow.map((tab, index) => (
            <a
              key={index}
              href={tab.path}
              style={{
                color: "#ecf0f1",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "10px",
                borderRadius: "5px",
                transition: "background-color 0.3s ease",
                borderBottom: "1px solid #34495e",
                backgroundColor:
                  location.pathname === tab.path ? "#34495e" : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#34495e")
              }
              onMouseLeave={(e) => {
                if (location.pathname !== tab.path) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {tab.icon}
              {isExpanded && <span>{tab.label}</span>}
            </a>
          ))}
        </div>
        {isExpanded && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <button onClick={notify}>Notify!</button> */}

            <button
              style={{
                width: "80%", // Adjust width so it's not too wide
                padding: "10px",
                border: "none",
                backgroundColor: "#e74c3c",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                textAlign: "center",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#c0392b")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#e74c3c")}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close sidebar (only on small & medium screens) */}
      {isExpanded && (isSmallScreen || isMediumScreen) && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 900,
          }}
        />
      )}
    </>
  );
}

export default SideBar;
