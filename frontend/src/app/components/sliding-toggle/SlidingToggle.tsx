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
            color="primary"
        />
    );
};

export default SlidingToggle;
