import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import Header from "./Header/Header";
import SideBar from "./SideBar/SideBar";
import Splash from "./splash/splash";
import Login from "./login";
import Register from "./Register/Register";
import SalerDashboard from "./salerDashboard/salerDashboard";
import SaleCar from "./saleCar/SaleCar";
import UserProfile from "./UserProfie/UserProfile";
import AdminDashboard from "./adminDashboard/AdminDashboard";
import DealerDashboard from "./dealerDashboard/DealerDashboard";
import BasicInfo from "./ForInspectionSalerBasicInfo/BasicInfo";
import CarDetail from "./CarDetail/CarDetail";
import InspectorList from "./inspectorlist/InspectorList";
import InspectorSchedule from "./inspectorSetsSehedule/InspectorSchedule";
import InspectorFreeSlot from "./ForSalerInspectorFreeSlots/InspectorFreeSlot";
import SalerAppointments from "./SalerAppointments/SalerAppointments";
import InspectorAppointmnts from "./InspectorAppointments/InspectorAppointmnts";
import AssignSlot from "./InspectorAssignSlot/AssignSlot";
import InspectionReport from "./InspectionReport/InspectionReport";
import Notification from "./Notification/Notification";
import BiddingView from "./BiddingView/BiddingView";
import ViewInspectionReport from "./viewInspectionReport/viewInspectionReport";
import InspectionReportView from "./InspectorViewReport/InspectionReportView";
import DealerInspectionReportView from "./DealerInspectionReportView/DealerInspectionReportView";
import PopupNotification from "./PopupNotification/popupNotification";
import Information from "./guest/Information";
import { NotificationProvider } from "./ForSellerBidNotificationContext/NotificationContext";
import GuestInspectorList from "./GuestInspectorList/GuestInspectorList";
import GuestCarDetail from "./GuestCarDetail/GuestCarDetail";
import InspectorViewFreeSlot from "./InspectorViewFreeSlots/InspectorViewFreeSlot";


import "./App.css";

import { ToastContainer, toast } from "react-toastify";

function AppContent() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const hideSidebar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideSidebar && <SideBar onToggle={setIsSidebarExpanded} />}
      {!hideSidebar && <Header isSidebarExpanded={isSidebarExpanded} />}
      <div
        style={{
          marginLeft: isSmallScreen
            ? "0px"
            : hideSidebar
            ? "0px"
            : isSidebarExpanded
            ? "250px"
            : "60px",
          padding: "20px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowX: "hidden",
        }}
      >
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/salerdashboard" element={<SalerDashboard />} />
          <Route path="/salercar" element={<SaleCar />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/dealerdashboard" element={<DealerDashboard />} />
          <Route path="/basicinfo" element={<BasicInfo />} />
          <Route path="/cardetail" element={<CarDetail />} />
          <Route path="/inspectorlist" element={<InspectorList />} />
          <Route path="/inspectorschedule" element={<InspectorSchedule />} />
          <Route path="/inspectorfreeslot" element={<InspectorFreeSlot />} />
          <Route path="/saler-appointments" element={<SalerAppointments />} />
          <Route path="/inspection-report" element={<InspectionReport />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/bidding-view" element={<BiddingView />} />
          <Route path="/report-view" element={<ViewInspectionReport />} />
          <Route path="/information" element={<Information/>}/>
          <Route path="/guest-inspector-list" element={<GuestInspectorList/>}/>
          <Route path="/guest-car-detail" element={<GuestCarDetail/>}/>
          <Route path="/inspector-view-free-slot" element={<InspectorViewFreeSlot/>}/>
          <Route
            path="/inspection-report-view"
            element={<InspectionReportView />}
          />
          <Route
            path="/dealer-inspection-report-view"
            element={<DealerInspectionReportView />}
          />

          <Route
            path="/inspector-appointments"
            element={<InspectorAppointmnts />}
          />
          <Route path="/assign-slot" element={<AssignSlot />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <NotificationProvider> {/* Ensure notifications are available */}
      <Router>
      <PopupNotification />
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}

export default App;
