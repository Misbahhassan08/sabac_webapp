// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance/AxiosIstance";
// import urls from "../urls/urls";
// import { Typography, LinearProgress } from "@mui/material";
// import { useMediaQuery, useTheme } from "@mui/material";

// function InspectorDashboard() {
//   const [carList, setCarList] = useState([]);
//   const [totalCarsCount, setTtotalCarsCount] = useState(0);
//   const [todayCarsCount, setTodayCarsCount] = useState(0);
//   const [allcarsProgress, setAllCarsProgress] = useState(0);

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

//   useEffect(() => {
//     const fetchListOfCarsForInspection = async () => {
//       try {
//         const response = await axiosInstance.get(urls.listofcarsforinspection);
//         const data = response.data;
//         console.log("data:", data);
//         const data1 = response.data.cars;

//         setCarList(data1);
//         setTtotalCarsCount(data.total_cars);
//         setTodayCarsCount(data.cars_today);
//         setAllCarsProgress(data.all_cars_progress);
//       } catch (error) {
//         console.error("Error in fetching list of cars:", error);
//       }
//     };
//     fetchListOfCarsForInspection();
//   }, []);

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "20px",
//       }}
//     >
//       {/* Top Boxes */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: isSmallScreen ? "column" : "row", // Responsive layout
//           justifyContent: "center",
//           alignItems:"center",
//           gap: "20px",
//           padding: "20px",
//           width: "100%",
//         }}
//       >
//         {/* Total Cars Card */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             width: "300px",
//             height:"90px",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             background: "linear-gradient(90deg, #000000,rgb(31, 30, 30))", // Black gradient
//             padding: "15px",
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             style={{
//               fontWeight: "600",
//               fontSize: "16px",
//               color: "#fff",
//             }}
//           >
//             Total Cars
//           </Typography>
//           <Typography
//             variant="h2"
//             style={{
//               fontWeight: "600",
//               fontSize: "32px",
//               color: "#fff",
//             }}
//           >
//             {totalCarsCount}
//           </Typography>
//           {/* Progress Bar */}
//           <div style={{ marginTop: "15px", textAlign: "center" }}>
//             <LinearProgress
//               variant="determinate"
//               value={allcarsProgress}
//               style={{
//                 height: "8px",
//                 borderRadius: "5px",
//                 backgroundColor: "#f0f0f0",
//                 marginTop: "10px",
//               }}
//             />
//           </div>
//         </div>

//         {/* Cars Added Today Card */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             width: "300px",
//             height:"90px",
//             border: "1px solid #ddd",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//             background: "linear-gradient(90deg, #000000,rgb(31, 30, 30))", // Black gradient
//             padding: "15px",
//             textAlign: "center",
//           }}
//         >
//           <Typography
//             variant="h6"
//             style={{
//               fontWeight: "600",
//               fontSize: "16px",
//               color: "#fff",
//             }}
//           >
//             Recent Cars
//           </Typography>
//           <Typography
//             variant="h2"
//             style={{
//               fontWeight: "600",
//               fontSize: "32px",
//               color: "#fff",
//             }}
//           >
//             {todayCarsCount}
//           </Typography>
//         </div>
//       </div>

//       {/* Car List */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: isSmallScreen
//             ? "1fr" // Single column for small screens
//             : isMediumScreen
//             ? "repeat(2, 1fr)" // Two columns for medium screens
//             : "repeat(3, 1fr)", // Three columns for large screens
//           gap: "20px",
//           // width: "100%",
//           justifyContent: "center",
//         }}
//       >
//         {carList.map((car) => (
//           <div
//             key={car.saler_car_id}
//             style={{
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//               overflow: "hidden",
//               backgroundColor: "#fff",
//               transition: "transform 0.3s ease-in-out",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//             onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//           >
//             <img
//               src={car.photos[0]}
//               alt={car.car_name}
//               style={{
//                 width: "100%",
//                 height: "180px",
//                 objectFit: "cover",
//               }}
//             />
//             <div style={{ padding: "10px" }}>
//               <h3 style={{ margin: "0 0 3px", fontSize: "15px" }}>
//                 {car.company} {car.car_name}
//               </h3>
//               <p style={{ margin: "0 0", color: "#555", fontSize: "12px" }}>
//                 {car.type}
//               </p>
//               <p style={{ margin: "0 0", color: "#555", fontSize: "14px" }}>
//                 {car.model} - {car.color}
//               </p>
//               <p style={{ margin: "0 0", color: "#555", fontSize: "14px" }}>
//                 Registered: {car.registered_in}
//               </p>
//               <p style={{ margin: "0 0", color: "#555", fontSize: "12px" }}>
//                 Demand: {car.demand} PKR
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default InspectorDashboard;
