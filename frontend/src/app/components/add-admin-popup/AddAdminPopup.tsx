import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import Textfield from "../text-field/TextField";
import styles from "./AddAdminPopup.module.css";
import { LottieLoader } from "../lottie-loader/lottieLoader";

export interface AdminData {
    id: number;
    firstName: string;
    email: string;
    location: string;
    username: string;
    password: string;
    userRole: string;
}

interface AdminFormData {
    firstName: string;
    email: string;
    location: string;
    username: string;
    password: string;
    userRole: "SUPER_ADMIN" | "ADMIN";
}

interface AddAdminPopupProps {
    header: string;
    onClose: () => void;
    onConfirm: (adminData: AdminFormData) => void;
    closePopup: () => void;
    passwordOn?: boolean;
    formData?: Partial<AdminFormData>; // Allow partial data for initialization
}

const AddAdminPopup: React.FC<AddAdminPopupProps> = ({
    header,
    onClose,
    onConfirm,
    closePopup,
    passwordOn = true,
    formData = {}, // Default to an empty object if not provided
}) => {
    const [formState, setFormState] = useState<AdminFormData>({
        firstName: formData.firstName || "",
        email: formData.email || "",
        location: formData.location || "TRIVANDRUM",
        username: formData.username || "",
        password: formData.password || "",
        userRole: formData.userRole || "ADMIN",
    });

    const handleInputChange = (field: keyof AdminFormData, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        const { firstName, email, location, username, password } = formState;

        if (firstName && email && location && username && (password || !passwordOn)) {
            setLoading(true);
            await onConfirm(formState);
            setLoading(false);
            closePopup();
        } else {
            alert("Please fill all required fields before creating an account.");
        }
    };


    return (
        <Dialog open onClose={onClose} className={styles.addAdminPopUp}>
            <div className={styles.addAdminPopUpBody}>
                {loading ? (
                    <LottieLoader size={"180px"} />
                ) : (
                    <>
                        <DialogTitle className={styles.addAdminPopUpHeader}>
                            {header}
                        </DialogTitle>
                        <DialogContent>
                            <div className={styles.addAdminPopUpFields}>
                                <Textfield
                                    placeholder="Full name"
                                    value={formState.firstName}
                                    onChange={(value) =>
                                        handleInputChange("firstName", value)
                                    }
                                />
                                <Textfield
                                    placeholder="Email"
                                    value={formState.email}
                                    onChange={(value) =>
                                        handleInputChange("email", value)
                                    }
                                />
                                <Textfield
                                    placeholder="Username"
                                    value={formState.username}
                                    onChange={(value) =>
                                        handleInputChange("username", value)
                                    }
                                />
                                {passwordOn && (
                                    <Textfield
                                        type="password"
                                        placeholder="Password"
                                        value={formState.password}
                                        onChange={(value) =>
                                            handleInputChange("password", value)
                                        }
                                    />
                                )}
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
                                    onClick={handleConfirm}
                                    variant="contained"
                                    color="success"
                                >
                                    Confirm
                                </Button>
                            </div>
                        </DialogActions>
                    </>
                )}
            </div>
        </Dialog>
    );
};

export default AddAdminPopup;
