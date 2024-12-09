"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";

const Pagination: React.FC = () => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="outlined" size="small" disabled>
                {"<"}
            </Button>
            <Typography>Showing Page 1 out of 1</Typography>
            <Button variant="outlined" size="small" disabled>
                {">"}
            </Button>
        </Box>
    );
};

export default Pagination;
