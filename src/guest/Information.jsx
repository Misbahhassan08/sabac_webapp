import React from "react";
import { useState } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useNavigate } from "react-router-dom";

const Information = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", number: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const postGuestDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(urls.postGuestDetail, formData);
      console.log("Guest post response:",response.data)
      const guestId = response.data.guest_id
      console.log("guestId:",guestId)
 
      localStorage.setItem("guestDetails", JSON.stringify(response.data));
      navigate("/guest-car-detail", { state: { guestId } });      
    } catch (error) {
      alert("Error: " + (error.response?.data || "Something went wrong"));
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          width: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333", fontSize: "24px" }}>
          Enter Your Information
        </h2>
        <form
          onSubmit={postGuestDetails}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <input
            type="tel"
            name="number"
            placeholder="Number"
            value={formData.number}
            onChange={handleChange}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Information;
