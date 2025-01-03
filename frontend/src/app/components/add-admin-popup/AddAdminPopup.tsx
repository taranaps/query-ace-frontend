import React, { useState } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
 import Textfield from "../text-field/TextField";

import styles from "./AddAdminPopup.module.css"

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

    const workLocation = [
        {
            "id": 1,
            "name": "Kochi"
        },
        {
            "id": 2,
            "name": "Trivandrum"
        },
        {
            "id": 3,
            "name": "Bangalore"
        }
    ]

    const handleCreate = () => {
        if (formData.fullName && formData.email && formData.location) {

            console.log("New Admin Created:", formData);
            onClose();

        } else {
            alert("Please fill all fields before creating an account.");
        }
    };

    return (
        <Dialog
            open
            onClose={onClose}
            className={styles.addAdminPopUp}
        >
            <div className={styles.addAdminPopUpBody}>
                <DialogTitle
                    className={styles.addAdminPopUpHeader}
                >
                    Add Admin
                </DialogTitle>
                <DialogContent>
                    <div className={styles.addAdminPopUpFields}>
                        <Textfield
                            placeholder="Full name"
                            value={formData.fullName}
                            onChange={(value) => handleInputChange("fullName", value)}
                        />
                        <Textfield
                            placeholder="Email"
                            value={formData.email}
                            onChange={(value) => handleInputChange("email", value)}
                        />
                        <FormControl fullWidth>
                            {/* <InputLabel id="location-label">Work Location</InputLabel> */}
                            <Select
                                labelId="location-label"
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select location
                                </MenuItem>
                                {workLocation.map((location) => (
                                    <MenuItem key={location.id} value={location.name}>
                                        {location.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className={styles.addAdminPopUpFooter}>
                        <Button
                            className={`${styles.addAdminPopUpButton} ${styles.cancel}`}
                            onClick={onClose}
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            className={styles.addAdminPopUpButton}
                            onClick={handleCreate}
                            variant="contained"
                            color="success">
                            Create
                        </Button>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default AddAdminPopup;
