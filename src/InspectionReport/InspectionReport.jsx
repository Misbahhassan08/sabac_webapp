import React, { useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
function InspectionReport() {
  const location = useLocation();
  const { car_id, car_name, car_company, car_model } = location.state || {};

  const [formData, setFormdata] = useState({
    carId: "",
    name: "",
    company: "",
    model: "",
    condition: "",
    color: "",
    photos: [],
    fuelType: "",
    registryNumber: "",
    engineCapacity: "",
    mileage: "",
    chassisNumber: "",
    engineType: "",
    transmissionType: "",
    engineCondition: 0,
    bodyCondition: 0,
    clutchCondition: 0,
    steeringCondition: 0,
    suspensionCondition: 0,
    brakesCondition: 0,
    acCondition: 0,
    electricalCondition: 0,
    estimatedValue: "",
    salerDemand: "",
  });
  console.log("Engine capacity:",formData.engineCapacity)

  const [overallRating, setOverallRating] = useState(0);
  console.log("Overall rating:", overallRating);

  const calculateOverallRating = () => {
    const conditions = [
      Number(formData.engineCondition) || 0,
      Number(formData.bodyCondition) || 0,
      Number(formData.clutchCondition) || 0,
      Number(formData.steeringCondition) || 0,
      Number(formData.suspensionCondition) || 0,
      Number(formData.brakesCondition) || 0,
      Number(formData.acCondition) || 0,
      Number(formData.electricalCondition) || 0,
    ];

    const total = conditions.reduce((sum, value) => sum + value, 0);
    return (total / conditions.length).toFixed(2); // Ensures the correct average
  };
  useEffect(() => {
    setOverallRating(Number(calculateOverallRating()));
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFilechange = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files);

    const base64Files = fileArray.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject;
      });
    });
    Promise.all(base64Files).then((base64Data) => {
      setFormdata((prevData) => ({
        ...prevData,
        photos: base64Data,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inspectionData = {
      car_id,
      car_name: formData.name,
      company: formData.company,
      color: formData.color,
      condition: formData.condition,
      model: formData.model,
      car_photos: formData.photos,
      fuel_type: formData.fuelType,
      registry_number: formData.registryNumber,
      engine_capacity: formData.engineCapacity,
      mileage: formData.mileage,
      chassis_number: formData.chassisNumber,
      engine_type: formData.engineType,
      transmission_type: formData.transmissionType,
      engine_condition: formData.engineCondition,
      body_condition: formData.bodyCondition,
      clutch_condition: formData.clutchCondition,
      steering_condition: formData.steeringCondition,
      suspension_condition: formData.suspensionCondition,
      brakes_condition: formData.brakesCondition,
      ac_condition: formData.acCondition,
      electrical_condition: formData.electricalCondition,
      estimated_value: formData.estimatedValue,
      saler_demand: formData.salerDemand,
      overall_score: formData.overallRating,
    };
    try {
      const response = await axiosInstance.post(
        urls.postInspectionreport,
        inspectionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200){
        console.log("report submited")
        localStorage.setItem(`inspection_report_${car_id}`, response.data.id);
      }
      console.log("Data Posted:", response.data);
      alert("Inspection Report submitted successfully");
      setFormdata({
        carId: "",
        name: "",
        company: "",
        model: "",
        condition: "",
        color: "",
        photos: [],
        fuelType: "",
        registryNumber: "",
        engineCapacity: "",
        mileage: "",
        chassisNumber: "",
        engineType: "",
        transmissionType: "",
        engineCondition: 0,
        bodyCondition: 0,
        clutchCondition: 0,
        steeringCondition: 0,
        suspensionCondition: 0,
        brakesCondition: 0,
        acCondition: 0,
        electricalCondition: 0,
        estimatedValue: "",
        salerDemand: "",
      })
     
    } catch (error) {
      console.error("Failed to Post Inspection Report:", console.error);
      alert("Failed to submit report");
    }
  };

  // update the car status to bidding
  const updateCarStatus = async (carId , newStatus) =>{
    try{
      const response = await axiosInstance.patch(
        urls.updateCarStatus(carId),
        {status : newStatus},
        {
          headers: {Authorization : `Bearer ${localStorage.getItem("access_token")}`}

        }
      
      )
      console.log("new status:", newStatus)
      alert("Status updated successfully")
    }
    catch(error){
      console.error("Error in updating user",error)
    }

  }

  return (
    // main
    <div
      style={{
        width: "80%",
        maxWidth: "900px",
        margin: "50px auto",
        backgroundColor: "#fff",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Car Details */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h2>Inspection Report</h2>

          <div style={{ width: "150px", height: "150px" }}>
            <CircularProgressbar
              value={overallRating}
              text={`${Math.round(overallRating)}%`}
              styles={buildStyles({
                textColor: "#000",
                pathColor:
                  overallRating > 70
                    ? "green"
                    : overallRating > 40
                    ? "orange"
                    : "red",
                trailColor: "#ddd",
                pathTransitionDuration: 0.5,
                textSize: "10px",
              })}
            />
          </div>
        </div>
        <div style={{ marginBottom: "30px",padding:"20px",boxSizing:"border-box" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Car Details
          </h3>
          <div style={{ marginBottom: "15px" }}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Model(Year)</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Condition</label>
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Fuel Type</label>
            <input
              type="text"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Registry Number</label>
            <input
              type="text"
              name="registryNumber"
              value={formData.registryNumber}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Engine Capacity</label>
            <input
              type="text"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Mileage</label>
            <input
              type="text"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Chassis Number</label>
            <input
              type="text"
              name="chassisNumber"
              value={formData.chassisNumber}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Engine Type</label>
            <input
              type="text"
              name="engineType"
              value={formData.engineType}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Transmission Type</label>
            <input
              type="text"
              name="transmissionType"
              value={formData.transmissionType}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Seller Demand</label>
            <input
              type="text"
              name="salerDemand"
              value={formData.salerDemand}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>Estimated Price</label>
            <input
              type="text"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            />
          </div>
        </div>

        {/* Inspection Ratings */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Inspection Ratings
          </h3>
          <div style={{ marginBottom: "20px" }}>
            <label>Engine Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.engineCondition}
              name="engineCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.engineCondition}%</span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Body Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.bodyCondition}
              name="bodyCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.bodyCondition}%</span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Brakes Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.brakesCondition}
              name="brakesCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.brakesCondition}%</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Clutch Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.clutchCondition}
              name="clutchCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.clutchCondition}%</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Steering Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.steeringCondition}
              name="steeringCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.steeringCondition}%</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Suspension Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.suspensionCondition}
              name="suspensionCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.suspensionCondition}%</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>AC Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.acCondition}
              name="acCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.acCondition}%</span>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label>Electric System Condition (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.electricalCondition}
              name="electricalCondition"
              onChange={handleInputChange}
              style={{ width: "100%" }}
            />
            <span>{formData.electricalCondition}%</span>
          </div>
        </div>

        {/* Image Upload Section */}
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Upload Car Photos
          </h3>

          <label
            htmlFor="upload-image"
            style={{
              display: "inline-block",
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              textAlign: "center",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Upload Image
          </label>

          <input
            id="upload-image"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFilechange}
            style={{ display: "none" }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}>
            {formData.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Car Photo ${index + 1}`}
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  margin: "5px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-end"}}>
          <button
            type="submit"
            style={{
              padding: "15px",
              backgroundColor: "#007bff",
              color: "white",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              alignSelf: "end",
            }}
            onMouseOver={(e)=> e.target.style.backgroundColor="green"}
            onMouseDown={(e)=> e.target.style.backgroundColor="#007bff"}
            onClick={()=>updateCarStatus(car_id, "bidding")}
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
}

export default InspectionReport;
