"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Button, Stack, SxProps } from "@mui/material";

interface ButtonConfig {
  label: string; // Text label for the button
  onClick: () => void; // Click handler for the button
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning"; // Button color
  size?: "small" | "medium" | "large"; // Button size
  startIcon?: React.ReactNode; // Optional icon at the start of the button
  endIcon?: React.ReactNode; // Optional icon at the end of the button
}

interface DataCardProps {
  id: number;
  title?: string;
  client?: string;
  creator?: string;
  date?: string;
  details?: React.ReactNode; // Allow string or JSX
  buttons?: ButtonConfig[]; // Optional buttons
  scrollable?: boolean; // Optional scrollable feature
  buttonAlignment?: "left" | "center" | "right"; // Button alignment
  buttonPosition?: "below" | "same-row"; // Control button placement
  disableBoxShadow?: boolean; // prop to control box shadow
  sx?: SxProps; // Material-UI sx prop for custom styles
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  client,
  creator,
  date,
  details,
  buttons,
  scrollable = false,
  buttonAlignment = "left",
  buttonPosition = "below", // Default position is below the details
  disableBoxShadow = false, // Default to false (box shadow enabled)
  sx,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        mb: 2,
        boxShadow: disableBoxShadow ? "none" : 2, // Conditionally apply box shadow
        ...sx,
      }}
    >
      <CardContent>
        {/* Title */}
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}

        {/* Details and Buttons */}
        {buttonPosition === "same-row" ? (
          // Place buttons in the same row as details
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between", // Align details and buttons
              alignItems: "center", // Vertically align items
              flexWrap: "wrap", // Allow wrapping for smaller screens
              gap: "1rem", // Added spacing between details and buttons
              mb: 2,
            }}
          >
            {/* Details */}
            <Box
              sx={{
                maxWidth: "70%", 
                maxHeight: scrollable ? 100 : "auto",
                overflowY: scrollable ? "auto" : "visible",
              }}
            >
              {details && (
                <Typography variant="body2" color="text.secondary">
                  {details}
                </Typography>
              )}
            </Box>

            {/* Buttons */}
            {buttons && buttons.length > 0 && (
              <Stack direction="row" spacing={1}>
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    size={button.size || "medium"}
                    color={button.color || "primary"}
                    onClick={button.onClick}
                    startIcon={button.startIcon}
                    endIcon={button.endIcon}
                  >
                    {button.label}
                  </Button>
                ))}
              </Stack>
            )}
          </Box>
        ) : (
          <Box>
            {/* Details */}
            <Box
              sx={{
                maxHeight: scrollable ? 100 : "auto",
                overflowY: scrollable ? "auto" : "visible",
                mb: 2,
              }}
            >
              {details && (
                <Typography variant="body2" color="text.secondary">
                  {details}
                </Typography>
              )}
            </Box>

            {/* Buttons */}
            {buttons && buttons.length > 0 && (
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
                      size={button.size || "medium"}
                      color={button.color || "primary"}
                      onClick={button.onClick}
                      startIcon={button.startIcon}
                      endIcon={button.endIcon}
                    >
                      {button.label}
                    </Button>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}

        {/* Meta Information */}
        {(client || creator || date) && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {client && `Client: ${client}`}
            {creator && ` | Creator: ${creator}`}
            {date && ` | Date: ${date}`}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;