import React from "react";
import { Box, Typography, Divider } from "@mui/material";

interface TwoColumnContentProps {
  Questions: string;
  Answers: string;
}

const TwoColumnContent: React.FC<TwoColumnContentProps> = ({
    Questions,
    Answers,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        padding: "1rem",
      }}
    >
      {/* Left Column */}
      <Typography
        variant="body1"
        sx={{
          flex: 1,
          textAlign: "left",
        }}
      >
        {Questions}
      </Typography>

      {/* Center Divider */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          backgroundColor: "#d3d3d3", // Color of the divider
          width: "2px", // Width of the line
        }}
      />

      {/* Right Column */}
      <Typography
        variant="body1"
        sx={{
          flex: 1,
          textAlign: "left",
        }}
      >
        {Answers}
      </Typography>
    </Box>
  );
};

export default TwoColumnContent;
