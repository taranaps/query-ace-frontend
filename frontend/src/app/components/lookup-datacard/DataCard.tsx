"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Button, Stack } from "@mui/material";

interface ButtonConfig {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "error" | "success";
}

interface DataCardProps {
  id: number;
  title: string;
  client: string;
  creator: string;
  date: string;
  details: string;
  buttons: ButtonConfig[];
  scrollable: boolean;
  buttonAlignment?: "left" | "center" | "right"; // 
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  client,
  creator,
  date,
  details,
  buttons,
  scrollable,
  buttonAlignment = "left", 
}) => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 2 }}>
      <CardContent>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {/* Details with optional scrolling */}
        <Box
          sx={{
            maxHeight: scrollable ? 100 : "auto",
            overflowY: scrollable ? "auto" : "visible",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {details}
          </Typography>
        </Box>

        {/* Meta Information */}
        <Typography variant="body2" color="text.secondary" mb={1}>
          {client && `Client: ${client}`}
          {creator && ` | Creator: ${creator}`}
          {date && ` | Date: ${date}`}
        </Typography>

        {/* Buttons with alignment */}
        <Box
          sx={{
            display: "flex",
            justifyContent:
              buttonAlignment === "right"
                ? "flex-end"
                : buttonAlignment === "center"
                ? "center"
                : "flex-start",
            mt: 2,
          }}
        >
          <Stack direction="row" spacing={1}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant="contained"
                size="small"
                color={button.color || "primary"}
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataCard;
