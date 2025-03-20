import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InspectorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  // console.log("Appoinment:", appointments);
  const [assignedSlots, setAssignedSlots] = useState([]);
  console.log("slots:", assignedSlots);
  const [slotTimers, setSlotTimers] = useState({});
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // navigate to inspection report
  const handleNavigate = (car_id, car_name, car_company, car_model) => {
    navigate("/inspection-report", {
      state: { car_id, car_company, car_name, car_model },
    });
  };

  // manual entry navigation to inspection report
  const manualNavigtion = () => {
    navigate("/inspection-report");
  };

  const handleNavigateToInspectionReport = (car_id) => {
    navigate("/inspection-report-view", {
      state: { car_id },
    });
  };

  useEffect(() => {
    const fetchInspectorAppointments = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Ensure token exists
        if (!token) {
          console.error("❌ No access token found");
          return;
        }

        const response = await axiosInstance.get(urls.inspectorAppointment, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.appointments || [];

        // console.log("Fetched Appointments:", data);

        // if (data.length === 0) {
        //   console.warn("⚠️ No Appointments Found!");
        // }

        const fixedData = data.map((appointment) => ({
          ...appointment,
          car_photos: appointment.car_photos.map((photo) =>
            photo.startsWith("data:image/")
              ? photo
              : `data:image/jpeg;base64,${photo}`
          ),
          remainingTime: calculateRemainingTime(appointment),
        }));

        console.log("Processed Appointments:", fixedData);

        setAppointments(fixedData);
        console.log("📌 Appointments Updated in State!", fixedData);
      } catch (error) {
        console.error("❌ API Error:", error);
      }
    };

    fetchInspectorAppointments();
  }, []);

  // ✅ Function to calculate remaining time
  const calculateRemainingTime = (appointment) => {
    const now = new Date();
    const inspectionTime = new Date(
      `${appointment.date}T${appointment.time_slot}`
    );
    const difference = inspectionTime - now;

    if (difference <= 0) {
      return "Inspection time has passed";
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  // ✅ Update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) => ({
          ...appointment,
          remainingTime: calculateRemainingTime(appointment),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAssignedSlots = async () => {
      try {
        const response = await axiosInstance.get(urls.getAssignedSlot);
        const data = response.data;

        console.log("Assigned slot fetched:", data);

        if (!Array.isArray(data)) {
          console.error("Unexpected data format", data);
          return;
        }

        const updatedData = data.map((slot) => ({
          ...slot,
          date: new Date(slot.date).toISOString().split("T")[0],
          remainingTime: calculateRemainingTime(slot.date, slot.time_slot),
          car_photos: slot.car.photos
            ? slot.car.photos.map((photo) =>
                photo.startsWith("data:image")
                  ? photo
                  : `data:image/jpeg;base64,${photo}`
              )
            : [],
        }));

        setAssignedSlots(updatedData);
      } catch (error) {
        console.error("Error fetching assigned slots:", error);
      }
    };

    fetchAssignedSlots();

    const interval = setInterval(() => {
      setAssignedSlots((prevSlots) =>
        prevSlots.map((slot) => ({
          ...slot,
          remainingTime: calculateRemainingTime(slot.date, slot.time_slot),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // update the car status
  const updateCarStatus = async (carId, newStatus) => {
    try {
      await axiosInstance.patch(
        urls.updateCarStatus(carId),
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      alert("Status updated successfully");

      setAppointments((prevCars) =>
        prevCars.map((car) =>
          car.saler_car_id === carId
            ? {
                ...car,
                status: newStatus,
                is_inspected: newStatus !== "pending",
              }
            : car
        )
      );

      console.log(`Car ${carId} updated:`, {
        status: newStatus,
        is_inspected: newStatus !== "pending",
      });
    } catch (error) {
      console.error("Error in updating car status", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = {};

      assignedSlots.forEach((slot) => {
        updatedTimers[slot.id] = calculateRemainingTimeofAssignedSlot(
          slot.date,
          slot.time_slot
        );
      });

      setSlotTimers(updatedTimers);
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [assignedSlots]);

  // function to calculate remaining time
  const calculateRemainingTimeofAssignedSlot = (date, timeSlot) => {
    const targetTime = new Date(`${date}T${timeSlot}`).getTime();
    const now = new Date().getTime();
    const remaining = targetTime - now;

    if (remaining <= 0) return "Inspection Time Passed";

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  // const getReportId = (car_id) => {
  //   return localStorage.getItem(`inspection_report_${car_id}`);
  // };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Info Header */}

      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
          marginTop: "50px",
        }}
      ></div>

      {/* Appointment List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          width: "100%",
        }}
      >
        {appointments.length === 0 ? (
          <Typography>No Appointments Available</Typography>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.appointment_id}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: isSmallScreen ? "column" : "row",
                backgroundColor: "#fff",
                marginBottom: "20px",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "-15px",
                  backgroundColor:
                    appointment.selected_by === "seller"
                      ? "#ff5733"
                      : "#337ab7",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                {appointment.selected_by.toUpperCase()}
              </div>
              {/* car img car detail and inspector detail */}
              {/* <Typography>{appointment.car_id}</Typography> */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                }}
              >
                {/* Car Image */}
                <div style={{ flex: "1", paddingRight: "15px" }}>
                  <img
                    src={appointment.car_photos[0]} // First car image
                    alt="Car"
                    style={{
                      width: "250px",
                      height: "250px",
                      borderRadius: "10px",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "20px",
                    justifyContent: "space-evenly",
                  }}
                >
                  {/* Car Details */}
                  <div style={{ flex: "2", padding: "10px" }}>
                    <Typography
                      variant="h5"
                      style={{ color: "#233d7b", fontWeight: "bold" }}
                    >
                      {appointment.car_company} {appointment.car_name}{" "}
                      {appointment.car_model}
                    </Typography>
                  </div>

                  {/* Seller Details */}
                  <div style={{ flex: "2", padding: "10px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#233d7b",
                        backgroundColor: "#f2f3f3",
                        padding: "5px",
                        width: "100%",
                        maxWidth: "120px",
                        textAlign: "center",
                        display: "block",
                        borderRadius: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Seller Detail{" "}
                    </span>
                    <Typography variant="h5" style={{ fontWeight: "bold" }}>
                      {appointment.seller_first_name}{" "}
                      {appointment.seller_last_name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <LocalPhoneIcon
                        style={{
                          backgroundColor: "#f2f3f3",
                          color: "#233d7b",
                          padding: "5px",
                          borderRadius: "50%",
                          fontSize: "20px",
                        }}
                      />
                      <Typography>{appointment.seller_phone_number}</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <EmailIcon
                        style={{
                          backgroundColor: "#f2f3f3",
                          color: "#233d7b",
                          padding: "5px",
                          borderRadius: "50%",
                          fontSize: "20px",
                        }}
                      />
                      <Typography>{appointment.seller_email}</Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspection Time */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  width: "100%",
                  maxWidth: "300px",
                }}
              >
                {/* Inspection Date & time Box */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "linear-gradient(to bottom, #BBDEFB, #E3F2FD)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px dashed grey",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      padding: "7px",
                      width: "100%",
                      maxWidth: "180px",
                      textAlign: "center",
                      borderRadius: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Inspection Date & Time
                  </span>
                  <Typography>{appointment.date}</Typography>
                  <Typography>{appointment.time_slot}</Typography>
                </div>

                {/* Remaining Time Section */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    background: "linear-gradient(to bottom, #FFCC80, #FFE0B2)", // Darker Light Orange Gradient
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px dashed grey",
                    width: "100%",
                    maxWidth: "150px",
                    marginBottom: "10px",
                  }}
                >
                  <Typography>{appointment.remainingTime}</Typography>

                  {/* ✅ Check if report exists */}
                  {appointment.is_inspected ? (
                    <button
                      onClick={() =>
                        handleNavigateToInspectionReport(appointment.car_id)
                      }
                      style={{
                        marginTop: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#28a745", // Green for "View Report"
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      View Report
                    </button>
                  ) : (
                    appointment.remainingTime ===
                      "Inspection time has passed" && (
                      <button
                        onClick={async () => {
                          await updateCarStatus(
                            appointment.saler_car_id,
                            "in_inspection"
                          );
                          handleNavigate(
                            appointment.car_id,
                            appointment.car_name,
                            appointment.car_company,
                            appointment.car_model
                          );
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "5px 10px",
                          backgroundColor: "#337ab7",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Start Inspection
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {/* Assigned Slots List/ manual entries */}

        <div>
          {assignedSlots.length === 0 ? (
            <Typography>No Assigned Slots</Typography>
          ) : (
            assignedSlots.map((slot) => (
              <div
                key={slot.id}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  backgroundColor: "#fff",
                  marginBottom: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "-15px",
                    backgroundColor:
                      slot.assigned_by === "inspector" ? "#ff5733" : "#337ab7",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
                  }}
                >
                  {slot.assigned_by.toUpperCase()}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                  }}
                >
                  {/* Car Image */}
                  <div style={{ flex: "1", paddingRight: "15px" }}>
                    <img
                      src={
                        slot.car.photos?.[0].startsWith("data:image")
                          ? slot.car.photos[0]
                          : `data:image/jpeg;base64,${slot.car.photos?.[0]}`
                      } // First car image
                      alt="Car"
                      style={{
                        width: "250px",
                        height: "250px",
                        borderRadius: "10px",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "20px",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {/* Car Details */}
                    <div style={{ flex: "2", padding: "10px" }}>
                      <Typography
                        variant="h5"
                        style={{ color: "#233d7b", fontWeight: "bold" }}
                      >
                        {slot.car.company} {slot.car.car_name} {slot.car.model}
                      </Typography>
                    </div>

                    {/* Seller Details */}
                    {slot.car.guest ? (
                      <>
                        <Typography variant="h5" style={{ fontWeight: "bold" }}>
                          {slot.car.guest.name}
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <LocalPhoneIcon
                            style={{
                              backgroundColor: "#f2f3f3",
                              color: "#233d7b",
                              padding: "5px",
                              borderRadius: "50%",
                              fontSize: "20px",
                            }}
                          />
                          <Typography>{slot.car.guest.number}</Typography>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <EmailIcon
                            style={{
                              backgroundColor: "#f2f3f3",
                              color: "#233d7b",
                              padding: "5px",
                              borderRadius: "50%",
                              fontSize: "20px",
                            }}
                          />
                          <Typography>{slot.car.guest.email}</Typography>
                        </div>
                      </>
                    ) : (
                      <Typography>No guest details available</Typography>
                    )}
                  </div>
                </div>

                {/* Inspection Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    width: "100%",
                    maxWidth: "300px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background:
                        "linear-gradient(to bottom, #BBDEFB, #E3F2FD)",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px dashed grey",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "7px",
                        width: "100%",
                        maxWidth: "180px",
                        textAlign: "center",
                        borderRadius: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      Inspection Date & Time
                    </span>
                    <Typography>{slot.date}</Typography>
                    <Typography>{slot.time_slot}</Typography>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background:
                        "linear-gradient(to bottom, #FFCC80, #FFE0B2)", // Darker Light Orange Gradient
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px dashed grey",
                      width: "100%",
                      maxWidth: "150px",
                      marginBottom: "10px",
                    }}
                  >
                    {/* ✅ If car is inspected, show only "View Report" */}
                    {slot.car.is_inspected ? (
                      <button
                        onClick={() =>
                          handleNavigateToInspectionReport(
                            slot.car.saler_car_id
                          )
                        }
                        style={{
                          marginTop: "10px",
                          padding: "5px 10px",
                          backgroundColor: "#28a745", // Green for "View Report"
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        View Report
                      </button>
                    ) : (
                      <>
                        {/* ✅ If time is remaining, show the timer */}
                        {slotTimers[slot.id] !== "Inspection Time Passed" && (
                          <Typography>{slotTimers[slot.id]}</Typography>
                        )}

                        {/* ✅ If time has passed and car is NOT inspected, show "Start Inspection" */}
                        {slotTimers[slot.id] === "Inspection Time Passed" && (
                          <button
                            onClick={async () => {
                              await updateCarStatus(
                                slot.car.saler_car_id,
                                "in_inspection"
                              );
                              handleNavigate(
                                slot.car.saler_car_id,
                                slot.car.car_name,
                                slot.car.company,
                                slot.car.model
                              );
                            }}
                            style={{
                              marginTop: "10px",
                              padding: "5px 10px",
                              backgroundColor: "#337ab7", // Blue for "Start Inspection"
                              color: "#fff",
                              border: "none",
                              borderRadius: "5px",
                              cursor: "pointer",
                            }}
                          >
                            Start Inspection
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectorAppointments;
