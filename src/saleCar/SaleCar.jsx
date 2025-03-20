import React from "react";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  TextField,
  InputAdornment,
  Button,
  Typography,
  Box,
} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import PaletteIcon from "@mui/icons-material/Palette";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MoneyIcon from "@mui/icons-material/Money";
import SpeedIcon from "@mui/icons-material/Speed";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";
import { useNavigate } from "react-router-dom";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SettingsApplicationsTwoToneIcon from "@mui/icons-material/SettingsApplicationsTwoTone";
import Construction from "@mui/icons-material/Construction";
import LocationCity from "@mui/icons-material/LocationCity";
import BoltIcon from "@mui/icons-material/Bolt";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CollectionsIcon from "@mui/icons-material/Collections";
import SellIcon from "@mui/icons-material/Sell";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { useMediaQuery, useTheme } from "@mui/material";

function SaleCar() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormdata] = useState({
  
    car_name: "",
    company: "",
    color: "",
    condition: "",
    model: "",
    demand: "",
    city: "",
    milage: "",
    type: "",
    fuel_type: "",
    description: "",
    registered_in: "",
    assembly: "",
    engine_capacity: "",
    phone_number: "",
    secondary_number: "",
    photos: [],
  });

  useEffect(() => {
    setFormdata((prevState) => ({
      ...prevState,
      photos: images, // Sync images with formData.photos
    }));
  }, [images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImages = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        newImages.push(reader.result);
        console.log("Image added to array:", reader.result); // Log image base64 data
        if (newImages.length === files.length) {
          setImages((prevImages) => {
            const updatedImages = [...prevImages, ...newImages];
            console.log("Updated images state:", updatedImages); // Log the updated images array
            return updatedImages;
          });
        }
      };
    });
  };
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Log formData before submission to check if photos are included
    console.log("Form data before submission:", formData);

    const carData = {
    
      car_name: formData.car_name,
      company: formData.company,
      color: formData.color,
      condition: formData.condition,
      model: formData.model,
      demand: parseFloat(formData.demand),
      city: formData.city,
      type: formData.type,
      fuel_type: formData.fuel_type,
      registered_in: formData.registered_in,
      assembly: formData.assembly,
      milage: parseFloat(formData.milage),
      engine_capacity: formData.engine_capacity,
      description: formData.description,
      photos: formData.photos,
      phone_number: formData.phone_number,
      secondary_number: formData.secondary_number,
    };

    try {
      const response = await axiosInstance.post(urls.postCarDetails, carData);

      console.log("Response:", response.data);
      const {saler_car_id} = response.data
      setFormdata({
        car_name: "",
        company: "",
        color: "",
        condition: "",
        model: "",
        demand: "",
        city: "",
        milage: "",
        description: "",
        type: "",
        fuel_type: "",
        registered_in: "",
        engine_capacity: "",
        assembly: "",
        phone_number: "",
        secondary_number: "",
        photos: [],
      });

      setImages([]); // Clear images array

      // Optionally, show a success message
      alert("Car details submitted successfully!");
      navigate("/cardetail", {state:{saler_car_id}});
    } catch (error) {
      console.error(
        "Error submitting car details:",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        // justifyContent:"center"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: isSmallScreen ? "30px" : "0",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          // margin: 20,
        }}
      >
        <Box
          sx={{
            textAlign: isSmallScreen ? "center" : "left",
            mt: isSmallScreen ? 2 : 0,
            px: isSmallScreen ? 2 : 0, // Adds padding on small screens for better spacing
          }}
        >
          <Typography
            variant={isSmallScreen ? "h6" : "h5"} // Adjust font size based on screen
            sx={{
              fontWeight: "bold",
              color: "#233d7b",
              marginBottom: isSmallScreen ? "5px" : "2px",
              lineHeight: isSmallScreen ? "1.2" : "1.5",
            }}
          >
            Sell Your Car With 3 Easy & Simple Steps!
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              color: "#000000",
              fontSize: isSmallScreen ? "14px" : "16px", // Reduce font size on small screens
            }}
          >
            It's free & takes less than a minute
          </Typography>
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "100%",
            paddingTop: "25px",
            paddingBottom: "10px",
            boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <DirectionsCarIcon
              sx={{
                fontSize: "30px",
                borderRadius: "50%",
                backgroundColor: "#f2f3f3",
                padding: "5px",
                margin: "3px",
                color: "#233d7b",
              }}
            />
            <span>Enter Car Details</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <CollectionsIcon
              sx={{
                fontSize: "30px",
                borderRadius: "50%",
                backgroundColor: "#f2f3f3",
                padding: "5px",
                margin: "3px",
                color: "#233d7b",
              }}
            />
            <span>Upload Photos</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <SellIcon
              sx={{
                fontSize: "30px",
                borderRadius: "50%",
                backgroundColor: "#f2f3f3",
                padding: "5px",
                margin: "3px",
                color: "#233d7b",
              }}
            />
            <span>Sale Price</span>
          </div>
        </div>
      </div>

      {/* Car Detail Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          borderRadius: "10px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "2px",
          }}
        >
          <h2>Car Details</h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            gap: "20px",
            width: "100%",
            maxWidth: "750px",
            backgroundColor:"#fff"
          }}
        >
          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <TextField
              label="Car Name"
              variant="outlined"
              name="car_name"
              value={formData.car_name}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCarFilledIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Company"
              variant="outlined"
              name="company"
              value={formData.company}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmojiTransportationIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <TextField
              label="Model"
              variant="outlined"
              name="model"
              value={formData.model}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BuildCircleIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Color"
              variant="outlined"
              name="color"
              value={formData.color}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PaletteIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <TextField
              label="Condition"
              variant="outlined"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FactCheckIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Demand (PKR)"
              variant="outlined"
              name="demand"
              value={formData.demand}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <TextField
              label="Driven (KMs)"
              variant="outlined"
              name="milage"
              value={formData.milage}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SpeedIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Description (optional)"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <TextField
              label="Varient (Auto/manual)"
              variant="outlined"
              name="type"
              value={formData.type}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SettingsApplicationsTwoToneIcon
                      style={{ color: "#000" }}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Fuel Type"
              variant="outlined"
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalGasStationIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <TextField
              label="Registered In (city)"
              variant="outlined"
              name="registered_in"
              value={formData.registered_in}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationCity style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Assembly"
              variant="outlined"
              name="assembly"
              value={formData.assembly}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Construction style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div
            className="flex flex-row sm:flex-col gap-4 w-full"
            style={{
              display: "flex",
              flexDirection: isSmallScreen ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <TextField
              label="City"
              variant="outlined"
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AddLocationIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Engine Capacity"
              variant="outlined"
              name="engine_capacity"
              value={formData.engine_capacity}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BoltIcon style={{ color: "#000" }} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        {/* upload photo modal */}
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2px",
              }}
            >
              <h2>Upload Photos</h2>
            </div>

            {/* Upload Button */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                borderRadius: "8px",
                alignItems: "center",
                padding: "20px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="file-upload">
                  <button
                    style={{
                      backgroundColor: "#007bff",
                      color: "#fff",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    type="button"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    Upload Photos
                  </button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Display Selected Images */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)", // 4 images per row
                  gap: "5px",
                  // justifyContent: "center",
                  // width: "100%",
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      width: "100px",
                      height: "100px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Uploaded Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Delete Button */}
                    <button
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: "absolute",
                        top: "-1px",
                        right: "-1px",
                        backgroundColor: "green",
                        color: "#000000",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {/* Upload Tips */}
              <div
                style={{ marginTop: "20px", textAlign: "left", width: "80%" }}
              >
                <p style={{ fontSize: "14px", color: "#555" }}>
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>
                    ✔
                  </span>{" "}
                  Adding at least <strong>8 pictures</strong> improves the
                  chances for a quick sale.
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>
                    ✔
                  </span>{" "}
                  Photos should be in 'jpeg, jpg, png, gif' format only.
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>
                    ✔
                  </span>{" "}
                  Adding clear Front, Back, and Interior pictures of your car
                  increases the quality of your Ad and gets you noticed more.
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  <span style={{ color: "#28a745", fontWeight: "bold" }}>
                    ✔
                  </span>{" "}
                  Pictures should be <strong>800x600</strong> center frame
                  image.
                </p>
              </div>
            </div>
          </div>
          {/* contact information */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2px",
              }}
            >
              <h2>Contact Information</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                gap: "15px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                backgroundColor:"#fff"
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: isSmallScreen ? "100%" : "40%",
                }}
              >
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalPhoneIcon style={{ color: "#000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: isSmallScreen ? "100%" : "40%",
                }}
              >
                <TextField
                  label="Secondary Number Optional"
                  variant="outlined"
                  name="secondary_number"
                  value={formData.secondary_number}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalPhoneIcon style={{ color: "#000" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default SaleCar;
