import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../axiosInstance/AxiosIstance";
import urls from "../urls/urls";

function BasicInfo() {
  const theme = useTheme();

  const location = useLocation();
  const {saler_car_id} = location.state || {}



  const [sellerName , setSellerName] = useState("")
  const [sellerPhoneNumber , setSellerPhoneNumber] = useState("")

  useEffect(()=>{

    const user = JSON.parse(localStorage.getItem("user"))

    if (user){
      setSellerName(`${user.first_name} ${user.last_name}`)
      setSellerPhoneNumber(user.phone_number)
  

    }

  },[])

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();


  const postAdditionalDetails = async ()=>{
    try{
      const response = await axiosInstance.post(urls.additionalDetails,{
        name : sellerName,
        number : sellerPhoneNumber

      })
      console.log("API Response:", response.data);
      navigate("/inspectorlist", {state:{saler_car_id}});
    }

    catch (error){
      console.error("Error in posting Data",error)
    }
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", backgroundColor: "#f0f4ff" }}>
      <AppBar position="static" sx={{ backgroundColor: "#003e85" }}>
        <Toolbar sx={{justifyContent:"center"}}>
          <Typography variant={isSmallScreen ? "h6" : "h5"} style={{alignItems:"center"}}>
            Basic Info
          </Typography>
        </Toolbar>
      </AppBar>
      {/* pregress bar box */}
      <Box sx={{  backgroundColor: "#003e85", color: "ffffff" }}>
        {/* <Stepper activeStep={0} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography
                  sx={{
                    color: "#ffffff",
                    fontSize: isSmallScreen ? "10px" : "12px",
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper> */}
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{ textAlign: "center", color: "#ffffff", }}
        >
          Let's Get You Started
        </Typography>
      </Box>
      {/* form */}
      <Box
        sx={{
          mt: isSmallScreen ? 2 : 4,
          mx: "auto",
          p: isSmallScreen ? 2 : 3,
          maxWidth: isSmallScreen ? "80%" : isMediumScreen ? "70%" : "400px",
          alignItems: isSmallScreen ? "center" : "",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <AccountCircleIcon sx={{ color: "#A9A9A9", mr: 2 }} />
            Your Full Name
          </Typography>
          <TextField
            fullWidth
            placeholder="Name"
            value={sellerName}
            variant="outlined"
            inputProps={{
              borderRadius: "8px",
            }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <PhoneIcon sx={{ color: "#A9A9A9", mr: 2 }} />
            Phone Number
          </Typography>
          <TextField
            fullWidth
            value={sellerPhoneNumber}
            placeholder="00000000000"
            variant="outlined"
            inputProps={{
              borderRadius: "8px",
            }}
          />
        </Box>
        <Button
          onClick={postAdditionalDetails}
          style={{
            backgroundColor: "#1878F3",
            width: "100%",
            borderRadius: "10px",
            color: "#fff",
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}

export default BasicInfo;
