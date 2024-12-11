"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface PaginationProps {
    sx?: object;
}

const Pagination: React.FC<PaginationProps> = ({ sx }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2, ...sx }}>
            <Button variant="outlined" size="small" disabled>
                {"<"}
            </Button>
            <Typography> 1 </Typography>
            <Button variant="outlined" size="small" disabled>
                {">"}
            </Button>
        </Box>
    );
};

export default Pagination;
