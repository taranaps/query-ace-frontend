"use client";

import React from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC<{ sx?: object; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
    sx,
    onChange,
}) => {    
    return (
        <Box sx={{ ...sx }}>
            <TextField
                fullWidth
                sx={{
                    "& .MuiOutlinedInput-root": {
                        border: "none",
                        // borderRadius: "8px",
                        // height: "38px",
                        // backgroundColor: "#F9FBFF",
                        // border: "1px solid #E7E7E7",
                        // color: "#B5B7C0",
                        // "&:hover": {
                        //     backgroundColor: "#FFEBD8", // Orangeish background
                        //     borderColor: "#FF9500",
                        // },
                    },
                    "& .MuiInputBase-input": {
                        // color: "#B5B7C0",
                    },
                }}
                placeholder="Search"
                size="small"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
                onChange={onChange}
            />
        </Box>
    );
};

export default SearchBar;
