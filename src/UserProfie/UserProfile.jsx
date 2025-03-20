import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import Modal from "react-modal";

function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [carList, setCarList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarPhotos, setSelectedCarPhotos] = useState([]);

  useEffect(() => {
    const fetchUserCar = async () => {
      try {
        const response = await axiosInstance.get(urls.salerCarList);
        const data = response.data;
        setCarList(data);
        console.log("Car list:", data);
      } catch (err) {
        console.error("Error fetching list of cars", err);
      }
    };
    fetchUserCar();
  }, []);

  const openModal = (photos) => {
    setSelectedCarPhotos(photos);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCarPhotos([]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
        justifyContent: "center",
      }}
    >
      {/* User information */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "20px",
          backgroundColor: "#eeeeee",
          width: "auto",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#eeeeee",
          }}
        >
          <TextField label="Username" value={user.username} />
          <TextField label="First Name" value={user.first_name} />
          <TextField label="Last Name" value={user.last_name} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            margin: "20px",
            backgroundColor: "#eeeeee",
          }}
        >
          <TextField label="Email" value={user.email} />
          <TextField label="Phone Number" value={user.phone_number} />
        </div>
      </div>

      {/* Car list section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {carList.map((car, index) => (
          <div
            key={index}
            style={{
              width: "200px",
              // padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
            onClick={() => openModal(car.photos)}
          >
            <img
              src={car.photos[0] || "placeholder.jpg"} // Placeholder if no image exists
              alt={`${car.car_name} by ${car.company}`}
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <h3 style={{ fontSize: "16px", margin: "8px 0" }}>
              {car.car_name}
            </h3>
            <p style={{ fontSize: "14px", color: "#555" }}>
              {car.company} - {car.model}
            </p>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Color: {car.color}
            </p>
            <p style={{ fontSize: "14px", color: "#777" }}>
              Demand: {car.demand}
            </p>
          </div>
        ))}
      </div>

      {/* Modal for car photos */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Ensures a dark overlay
            zIndex: 1000, // Ensures it appears above other content
          },
          content: {
            backgroundColor: "#ffffff", // Fully opaque background for the modal content
            padding: "20px",
            maxWidth: "600px",
            margin: "auto",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            border: "none",
          },
        }}
      >
        <h2 style={{ textAlign: "center" }}>Car Photos</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            // backgroundColor:"#eeeeee"
          }}
        >
          {/* Main Image */}
          <div>
            <img
              src={selectedCarPhotos[0]} // Display the first image initially
              alt="Selected Car"
              style={{
                width: "400px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>

          {/* Thumbnails */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {selectedCarPhotos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  width: "100px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "2px solid transparent",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // Update the main image when a thumbnail is clicked
                  const mainImg = selectedCarPhotos[0];
                  selectedCarPhotos[0] = selectedCarPhotos[idx];
                  selectedCarPhotos[idx] = mainImg;
                  setSelectedCarPhotos([...selectedCarPhotos]); // Trigger state update
                }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={closeModal}
          style={{
            display: "block",
            margin: "20px auto 0",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "#007BFF",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default UserProfile;
