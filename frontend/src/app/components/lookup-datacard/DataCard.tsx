"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Button, Stack, SxProps } from "@mui/material";

interface ButtonConfig {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning";
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

interface DataCardProps {
  id: number;
  title?: string;
  client?: string;
  creator?: string;
  date?: string;
  details?: React.ReactNode;
  buttons?: ButtonConfig[];
  scrollable?: boolean;
  buttonAlignment?: "left" | "center" | "right";
  buttonPosition?: "below" | "same-row";
  disableBoxShadow?: boolean;
  sx?: SxProps;
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
  buttonPosition = "below",
  disableBoxShadow = false,
  sx,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        mb: 2,
        boxShadow: disableBoxShadow ? "none" : 2,
        ...sx,
      }}
    >
      <CardContent>
        {title && (
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        )}

        {buttonPosition === "same-row" ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              mb: 2,
            }}
          >
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
