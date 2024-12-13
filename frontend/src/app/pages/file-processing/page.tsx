"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import DataCard from "@/app/components/lookup-datacard/DataCard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; 
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; 

const FileProcessingPage = () => {
  const handleImportFile = () => {
    console.log("Import File button clicked");
  };

  const handleProceed = () => {
    console.log("Proceed button clicked");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Top Section  DataCard */}
      <DataCard
        id={1}
        title="File Processing"
        details="Let's start by importing an Excel file"
        scrollable={false}
        buttonAlignment="right"
        buttonPosition="same-row" // Place button in the same row 
        disableBoxShadow={true} // Box shadow disabled
        buttons={[
          {
            label: "Import File",
            onClick: handleImportFile,
            color: "primary",
            startIcon: <CloudUploadIcon />,
          },
        ]}
        sx={{
          marginBottom: "1.5rem",
          padding: "2rem",
          borderRadius: 0,
          backgroundColor: "#FFFFFF",
        }}
      />

      {/*  Image Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" sx={{ marginBottom: "1rem" }}>
            Import File to Get a Preview
          </Typography>
          <Image
            src="/images.png" 
            alt="File Processing Illustration"
            width={300}
            height={300} 
          />
        </Box>
      </Box>

      {/* Bottom Section  DataCard */}
      <DataCard
        id={2}
        title=""
        details={
          <>
            Having trouble with importing Excel?{" "}
            <a href="#" style={{ color: "#007BFF", textDecoration: "none" }}>
              Download template
            </a>
          </>
        }
        scrollable={false}
        buttonAlignment="right"
        buttonPosition="same-row" // Place button in same row
        disableBoxShadow={true} // Box shadow disabled
        buttons={[
          {
            label: "Proceed",
            onClick: handleProceed,
            color: "primary",
            endIcon: <ArrowForwardIcon />,
          },
        ]}
        sx={{
          marginTop: "1.5rem",
          padding: "2rem",
          borderRadius: 0,
          backgroundColor: "#FFFFFF",
        }}
      />
    </Box>
  );
};

export default FileProcessingPage;
