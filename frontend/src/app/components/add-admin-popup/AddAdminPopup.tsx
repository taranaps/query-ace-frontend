import React, { useState } from "react";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface AddAdminPopupProps {
    onClose: () => void;
}

const AddAdminPopup: React.FC<AddAdminPopupProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        location: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
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
                    <TextField
                        name="fullName"
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={formData.fullName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="location"
                        label="Location"
                        variant="outlined"
                        fullWidth
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleCreate} variant="contained" color="success">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAdminPopup;
