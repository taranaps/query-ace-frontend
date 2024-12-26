"use client";

import React from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC<{ sx?: object; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
    sx,
    onChange,
}) => {
    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#F9FBFF",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            "&:focus-within": {
                backgroundColor: "#FCF4E7",
                outline: "2px solid #FF9500",
            },
            "&:hover": {
                backgroundColor: "#FFEBD8",
                borderColor: "#FF9500",
            },
            ...sx,
        }}>
            <TextField
                fullWidth
                size="small"
                placeholder="Search"
                onChange={onChange}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "inherit",
                        backgroundColor: "inherit",
                        color: "#7E7E7E",
                        border: "none",
                        outline: "none",
                        "& fieldset": {
                            border: "none",
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "#4E4E4E", 
                        "&::placeholder": {
                            color: "#B5B7C0", 
                            opacity: 1,
                        },
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        </Box>
    );
};

export default SearchBar;
