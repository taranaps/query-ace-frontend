"use client";

import React from "react";
import { Switch } from "@mui/material";

interface SlidingToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const SlidingToggle: React.FC<SlidingToggleProps> = ({ checked, onChange }) => {
    return (
        <Switch
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            color="default" // Use default color for the switch (iOS appearance)
            sx={{
                // Custom styling for iOS-like toggle
                width: 56,
                height: 34,
                padding: 0,
                "& .MuiSwitch-switchBase": {
                    padding: 1,
                    "&.Mui-checked": {
                        transform: "translateX(22px)",
                        color: "#fff", // White color for the knob when checked
                        "& + .MuiSwitch-track": {
                            backgroundColor: "#4CAF50", // Green background when checked (Active)
                        },
                    },
                    "&.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#80e27e", // Lighter green when checked
                    },
                },
                "& .MuiSwitch-track": {
                    borderRadius: 34 / 2,
                    backgroundColor: "#bdbdbd", // Grey background when unchecked (Inactive)
                    opacity: 1,
                    transition: "background-color 0.2s",
                },
            }}
        />
    );
};

export default SlidingToggle;
