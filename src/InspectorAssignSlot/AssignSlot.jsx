// import React, { useEffect, useState } from "react";
// import {
//   TextField,
//   InputAdornment,
//   Typography,
//   Button,
//   Box,
//   IconButton,
// } from "@mui/material";
// import EmailIcon from "@mui/icons-material/Email";
// import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
// import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
// import CarRepairIcon from "@mui/icons-material/CarRepair";
// import axiosInstance from "../axiosInstance/AxiosIstance";
// import urls from "../urls/urls";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PersonIcon from "@mui/icons-material/Person";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import { useMediaQuery, useTheme } from "@mui/material";

// const AssignSlot = () => {
//   const [slots, setSlots] = useState({});
//   console.log("Slots:", slots);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [sellerEmail, setSellerEmail] = useState("");
//   const [sellerName, setSellerName] = useState("");
//   const [sellerPhone, setSellerPhone] = useState("");
//   const [carName, setCarName] = useState("");
//   const [carCompany, setCarCompany] = useState("");
//   const [carModel, setCarModel] = useState("");
//   const [carPhoto, setCarPhoto] = useState([]);

//   const theme = useTheme();

//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

//   const containerWidth = isSmallScreen
//     ? "100%"
//     : isMediumScreen
//     ? "100%"
//     : "500px";

//   const Loggeduser = JSON.parse(localStorage.getItem("user"));
//   const userId = Loggeduser?.id;

//   useEffect(() => {
//     const fetchSlots = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token || !userId) return;

//         const response = await axiosInstance.get(
//           `${urls.getfreeslots}?inspector=${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         // Group free slots by date
//         const groupedFreeSlots = response.data.free_slots.reduce(
//           (acc, slot) => {
//             if (!acc[slot.date]) acc[slot.date] = [];
//             acc[slot.date].push(slot.time_slot);
//             return acc;
//           },
//           {}
//         );

//         setSlots(groupedFreeSlots);
//       } catch (error) {
//         console.error("Error fetching slots:", error);
//       }
//     };

//     fetchSlots();
//     const intervalId = setInterval(fetchSlots, 500);
//     return () => clearInterval(intervalId);
//   }, [userId]);

//   // Handle date selection from calendar
//   const handleDateChange = (date) => {
//     setSelectedDate(date);

//     // Convert to YYYY-MM-DD in local timezone to prevent shifting issues
//     const formattedDate = date.toLocaleDateString("en-CA");

//     setAvailableSlots(slots[formattedDate] || []);
//   };

//   // Convert images to Base64
//   const handleUploadPhoto = (event) => {
//     const files = Array.from(event.target.files);
//     const promises = files.map((file) => {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result); // ✅ Keep the full Base64 data URI
//         reader.onerror = reject;
//         reader.readAsDataURL(file);
//       });
//     });

//     Promise.all(promises)
//       .then((base64Images) => {
//         setCarPhoto((prevPhotos) => [...prevPhotos, ...base64Images]); // ✅ Store full data URI
//       })
//       .catch((error) => console.error("Error converting images:", error));
//   };

//   const handleRemovePhoto = (index) => {
//     setCarPhoto(carPhoto.filter((_, i) => i !== index));
//   };

//   // Assign selected slot
//   const handleAssignSlot = async (slot) => {
//     try {
//       const token = localStorage.getItem("access_token");
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (!token || !user) {
//         alert("User not authenticated");
//         return;
//       }

//       const requestData = {
//         inspector_id: user.id,
//         seller_name: sellerName,
//         seller_email: sellerEmail,
//         seller_phone: sellerPhone,
//         car_name: carName,
//         car_company: carCompany,
//         car_model: carModel,
//         date: selectedDate.toISOString().split("T")[0],
//         time_slot: slot,
//         car_photos: carPhoto.map((photo) => `data:image/jpeg;base64,${photo}`), // ✅ Ensure valid format
//       };

//       console.log("Sending request data:", requestData); // ✅ Debugging line

//       const response = await axiosInstance.post(urls.assignSlot, requestData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.status === 201) {
//         alert("Successfully assigned slot!");
//       } else {
//         alert("Slot assignment failed");
//       }
//     } catch (error) {
//       console.error(
//         "Error assigning slot:",
//         error.response?.data || error.message
//       );
//       alert(
//         `Failed to assign slot: ${
//           error.response?.data?.error || "Unknown error"
//         }`
//       );
//     }
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         gap: "15px",
//         alignItems: "center",
//         justifyContent: "center",
//         width: containerWidth,
//         height: "100%",
//         marginTop: "50px",
//       }}
//     >
//       {/* Seller detail Section */}
//       <Box
//         sx={{
//           width: containerWidth,
//           bgcolor: "#fff",
//           p: 2,
//           borderRadius: 2,
//           boxShadow: 2,
//           textAlign: "center",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Typography variant="h5" style={{ fontWeight: "bold" }}>
//           Seller Details
//         </Typography>
//         <TextField
//           placeholder="Seller Name"
//           fullWidth
//           value={sellerName}
//           onChange={(e) => setSellerName(e.target.value)}
//           style={{ marginBottom: "10px" }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <PersonIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <TextField
//           placeholder="Seller Phone Number"
//           fullWidth
//           value={sellerPhone}
//           onChange={(e) => setSellerPhone(e.target.value)}
//           style={{ marginBottom: "10px" }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <LocalPhoneIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <TextField
//           placeholder="Seller Email"
//           fullWidth
//           value={sellerEmail}
//           onChange={(e) => setSellerEmail(e.target.value)}
//           style={{ marginBottom: "10px" }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <EmailIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//       {/* Car Details Section */}
//       <Box
//         sx={{
//           width: containerWidth,
//           p: 2,
//           bgcolor: "#fff",
//           borderRadius: 2,
//           boxShadow: 2,
//           textAlign: "center",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
//           Car Details
//         </Typography>
//         <TextField
//           placeholder="Car Name"
//           value={carName}
//           onChange={(e) => setCarName(e.target.value)}
//           fullWidth
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <DirectionsCarIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{ mb: 1 }}
//         />
//         <TextField
//           placeholder="Company"
//           value={carCompany}
//           onChange={(e) => setCarCompany(e.target.value)}
//           fullWidth
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <EmojiTransportationIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{ mb: 1 }}
//         />
//         <TextField
//           placeholder="Year"
//           value={carModel}
//           onChange={(e) => setCarModel(e.target.value)}
//           fullWidth
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <CarRepairIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>
//       {/* car photo section */}
//       <Box
//         sx={{
//           backgroundColor: "#fff",
//           width: containerWidth,
//           p: 2,
//           borderRadius: 2,
//           boxShadow: 2,
//           textAlign: "center",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
//           Upload Car Photos
//         </Typography>

//         {/* Hidden file input */}
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           id="upload-photo"
//           style={{ display: "none" }} 
//           onChange={handleUploadPhoto}
//         />

//         {/* Custom Upload Button */}
//         <label htmlFor="upload-photo">
//           <Button
//             variant="contained"
//             component="span"
//             sx={{
//               backgroundColor: "#1976d2",
//               color: "#fff",
//               textTransform: "none",
//               fontSize: "16px",
//               px: 3,
//               py: 1,
//               borderRadius: "8px",
//               "&:hover": { backgroundColor: "#1565c0" },
//               alignSelf: "center",
//             }}
//           >
//             Upload Photos
//           </Button>
//         </label>

//         {/* Image Previews */}
//         {carPhoto.length > 0 && (
//           <Box
//             sx={{
//               mt: 2,
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 2,
//               justifyContent: "center",
//             }}
//           >
//             {carPhoto.map((photo, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   position: "relative",
//                   width: 100,
//                   height: 100,
//                   borderRadius: "8px",
//                   overflow: "hidden",
//                   boxShadow: 2,
//                 }}
//               >
//                 <img
//                   src={photo}
//                   alt={`Car ${index + 1}`}
//                   width="100"
//                   height="100"
//                   style={{ objectFit: "cover", borderRadius: "8px" }}
//                 />

//                 {/* Delete Button */}
//                 <IconButton
//                   onClick={() => handleRemovePhoto(index)}
//                   sx={{
//                     position: "absolute",
//                     top: 5,
//                     right: 5,
//                     backgroundColor: "rgba(255, 0, 0, 0.7)",
//                     color: "#fff",
//                     borderRadius: "50%",
//                     p: 0.5,
//                     "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.9)" },
//                   }}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>
//       {/* Assign Slot Button */}
//       <Box
//         sx={{
//           width: containerWidth,
//           bgcolor: "#fff",
//           p: 2,
//           borderRadius: 2,
//           boxShadow: 2,
//           textAlign: "center",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
//           Assign Slot
//         </Typography>
//         <Button
//           variant="contained"
//           component="span"
//           sx={{
//             backgroundColor: "#1976d2",
//             color: "#fff",
//             textTransform: "none",
//             fontSize: "16px",
//             px: 3,
//             py: 1,
//             borderRadius: "8px",
//             "&:hover": { backgroundColor: "#1565c0" },
//             alignSelf: "center",
//           }}
//           onClick={() => setShowCalendar(true)}
//         >
//           Assign Slot
//         </Button>
//       </Box>
//       {/* Calendar Popup */}
//       {showCalendar && (
//         <Box
//           sx={{
//             width: 500,
//             bgcolor: "#fff",
//             p: 2,
//             mt: 2,
//             borderRadius: 2,
//             boxShadow: 2,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Select Date
//           </Typography>
//           <DatePicker
//             selected={selectedDate}
//             onChange={handleDateChange}
//             inline
//             filterDate={(date) => {
//               const formattedDate = date.toLocaleDateString("en-CA"); 
//               return slots.hasOwnProperty(formattedDate); 
//             }}
//           />
//         </Box>
//       )}
//       {/* Available Slots */}
//       {selectedDate && (
//         <Box
//           sx={{
//             width: 500,
//             bgcolor: "#fff",
//             p: 2,
//             mt: 2,
//             borderRadius: 2,
//             boxShadow: 2,
//             textAlign: "center",
//           }}
//         >
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Available Slots
//           </Typography>
//           {availableSlots.length > 0 ? (
//             availableSlots.map((slot, index) => (
//               <Button
//                 key={index}
//                 sx={{ bgcolor: "green", color: "#fff", m: 1 }}
//                 onClick={() => handleAssignSlot(slot)}
//               >
//                 Assign {slot}
//               </Button>
//             ))
//           ) : (
//             <Typography>No Slots Available</Typography>
//           )}
//         </Box>
//       )}
//     </div>
//   );
// };

// export default AssignSlot;

import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useNavigate } from "react-router-dom";

const AssignSlot = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  console.log("assign slot user:", user);

  const user_id = user?.user_id || user?.id;
  console.log("Extracted user_id:", user_id);

  const [carList, setCarList] = useState([]); // Guest cars
  const [sellerCarList, setSellerCarList] = useState([]); // Seller cars
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Guest Cars
  useEffect(() => {
    const fetchGuestCars = async () => {
      if (!user_id) {
        console.error("User ID is missing. API request not made.");
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `${urls.guestCarListForInspector}?inspector_id=${user_id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          }
        );
        setCarList(response.data || []);
        console.log("✅ Guest cars:", response.data);
      } catch (err) {
        console.error("Error fetching guest cars:", err);
        setError("Failed to fetch guest car data.");
      } finally {
        setLoading(false);
      }
    };

    fetchGuestCars();
  }, [user_id]);

  // Fetch Seller Cars
  useEffect(() => {
    const fetchSellerCars = async () => {
      if (!user_id) {
        console.error("User ID is missing. API request not made.");
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(
          `${urls.sellerManualEntries}?inspector_id=${user_id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          }
        );
        setSellerCarList(response.data?.linked_cars || []);
        console.log("✅ Seller cars:", response.data);
      } catch (err) {
        console.error("Error fetching seller cars:", err);
        setError("Failed to fetch seller car data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerCars();
  }, [user_id]);

  const handleNavigate = (car_id) => {
    navigate("/inspector-view-free-slot", { state: { car_id } });
  };

  // Ensure images have the correct base64 prefix
  const getImageSrc = (image) => {
    if (!image) return "placeholder.jpg"; // Default placeholder image
    return image.startsWith("data:image") ? image : `data:image/jpeg;base64,${image}`;
  };

  return (
    <div style={{ marginTop: "50px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Loading & Error Messages */}
      {loading && <p>Loading cars...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Cars Grid */}
      <div style={{ display: "flex", flexWrap: "wrap", padding: "20px", gap: "16px" }}>
        {carList.length === 0 && sellerCarList.length === 0 && !loading && <p>No cars found.</p>}

        {[...carList, ...sellerCarList].map((car, index) => (
          <div
            onClick={() => handleNavigate(car.saler_car_id)}
            key={index}
            style={{
              width: "200px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              position: "relative",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* Car Image */}
            <img
              src={getImageSrc(car.photos?.[0])}
              alt={`${car.car_name} by ${car.company}`}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />

            {/* Status Badge */}
            <div
              style={{
                backgroundColor:
                  car.status === "pending"
                    ? "#f01e2c"
                    : car.status === "in_inspection"
                    ? "#76BA1B"
                    : "#FFA500",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "12px",
                fontWeight: "bold",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                position: "absolute",
                top: "10px",
                right: "-15px",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              {car.added_by || "Unknown"}
            </div>

            {/* Car Details */}
            <h3 style={{ fontSize: "16px", margin: "8px 0" }}>{car.car_name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {car.company} - {car.model}
            </p>
            <p style={{ fontSize: "14px", color: "#777" }}>Color: {car.color}</p>
            <p style={{ fontSize: "14px", color: "#777" }}>Demand: {car.demand}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AssignSlot;

