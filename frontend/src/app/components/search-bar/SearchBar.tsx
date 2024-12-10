"use client";

import React from "react";
import { TextField, Box } from "@mui/material";

const SearchBar: React.FC<{ sx?: object }> = ({ sx }) => {
    return (
        <Box sx={{ width: "100%", maxWidth: 300 }}>
            <TextField
                fullWidth
                sx={{ ...sx, maxWidth: "300px" }}
                variant="outlined"
                placeholder="Search"
                size="small"
                slotProps={{
                    input: {
                        sx: { borderRadius: 4 },
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;
