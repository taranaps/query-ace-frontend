import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Textfield from "../text-field/TextField"; // Adjust the path to your custom Textfield component

interface AddAdminPopupProps {
    onClose: () => void;
}

const AddAdminPopup: React.FC<AddAdminPopupProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        location: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleCreate = () => {
        if (formData.fullName && formData.email && formData.location) {
            console.log("New Admin Created:", formData); // Replace this with actual logic
            onClose(); // Close popup after creating the account
        } else {
            alert("Please fill all fields before creating an account.");
        }
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>Add Admin</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Textfield
                        label="Full Name"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(value) => handleInputChange("fullName", value)}
                    />
                    <Textfield
                        label="Email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={(value) => handleInputChange("email", value)}
                    />
                    <Textfield
                        label="Location"
                        placeholder="Enter location"
                        value={formData.location}
                        onChange={(value) => handleInputChange("location", value)}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Box display="flex" gap={1} justifyContent="flex-start">
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} variant="contained" color="success">
                        Create
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default AddAdminPopup;
