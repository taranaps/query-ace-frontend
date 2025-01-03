import React, { useState } from "react";
import {
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
    FormControl,
    Button,
} from "@mui/material";
import Textfield from "../text-field/TextField";

import styles from "./AddAdminPopup.module.css";

interface AddAdminPopupProps {
    onClose: () => void;
    onConfirm: (adminData: {
        firstName: string;
        email: string;
        location: string;
        username: string;
        password: string;
        userRole: "SUPER_ADMIN" | "ADMIN";
    }) => void;
}

const AddAdminPopup: React.FC<AddAdminPopupProps> = ({ onClose, onConfirm }) => {
    const [formData, setFormData] = useState<{
        firstName: string;
        email: string;
        location: string;
        username: string;
        password: string;
        userRole: "SUPER_ADMIN" | "ADMIN";
    }>({
        firstName: "",
        email: "",
        location: "",
        username: "",
        password: "",
        userRole: "ADMIN", // Default user role
    });

    const workLocations = [
        { id: 1, name: "KOCHI" },
        { id: 2, name: "TRIVANDRUM" },
    ];

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleRoleChange = (value: "SUPER_ADMIN" | "ADMIN") => {
        setFormData((prev) => ({ ...prev, userRole: value }));
    };

    const handleCreate = () => {
        if (
            formData.firstName &&
            formData.email &&
            formData.location &&
            formData.username &&
            formData.password
        ) {
            onConfirm(formData);
        } else {
            alert("Please fill all fields before creating an account.");
        }
    };

    return (
        <Dialog open onClose={onClose} className={styles.addAdminPopUp}>
            <div className={styles.addAdminPopUpBody}>
                <DialogTitle className={styles.addAdminPopUpHeader}>
                    Add Admin
                </DialogTitle>
                <DialogContent>
                    <div className={styles.addAdminPopUpFields}>
                        <Textfield
                            placeholder="Full name"
                            value={formData.firstName}
                            onChange={(value) => handleInputChange("firstName", value)}
                        />
                        <Textfield
                            placeholder="Email"
                            value={formData.email}
                            onChange={(value) => handleInputChange("email", value)}
                        />
                        <FormControl fullWidth>
                            <Select
                                value={formData.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select location
                                </MenuItem>
                                {workLocations.map((location) => (
                                    <MenuItem key={location.id} value={location.name}>
                                        {location.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Textfield
                            placeholder="Username"
                            value={formData.username}
                            onChange={(value) => handleInputChange("username", value)}
                        />
                        <Textfield
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(value) => handleInputChange("password", value)}
                        />
                        <FormControl fullWidth>
                            <Select
                                value={formData.userRole}
                                onChange={(e) => handleRoleChange(e.target.value as "SUPER_ADMIN" | "ADMIN")}
                            >
                                <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
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
                            color="success"
                        >
                            Create
                        </Button>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default AddAdminPopup;
