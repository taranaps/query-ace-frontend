import React from "react";
import { Box, Typography } from "@mui/material";

interface TwoColumnContentProps {
  Question: string;
  Answer: string;
}

const TwoColumnContent: React.FC<TwoColumnContentProps> = ({
  Question,
  Answer,
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
        {Question}
      </Typography>

      {/* Right Column */}
      <Typography
        variant="body1"
        sx={{
          flex: 1,
          textAlign: "left",
        }}
      >
        {Answer}
      </Typography>
    </Box>
  );
};

export default TwoColumnContent;
