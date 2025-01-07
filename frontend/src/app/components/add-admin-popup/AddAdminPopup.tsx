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

interface AddAdminPopupProps {
    header: string;
    onClose: () => void;
    onConfirm: (adminData: {
        id: number,
        firstName: string;
        email: string;
        location: string;
        username: string;
        password: string;
        userRole: string;
    }) => Promise<void>;

    closePopup: () => void;
    passwordOn?: boolean;
    adminData?: AdminData;
}

const AddAdminPopup: React.FC<AddAdminPopupProps> = ({
    header,
    onClose,
    onConfirm,
    closePopup,
    passwordOn = true,
    adminData,
}) => {
    const [formData, setFormData] = useState<{
        id: number,
        firstName: string;
        email: string;
        location: string;
        username: string;
        password: string;
        userRole: string;
    }>({
        id:0,
        firstName: "",
        email: "",
        location: "TRIVANDRUM",
        username: "",
        password: "",
        userRole: "ADMIN",
    });

    useEffect(() => {
        if (adminData) {
            setFormData({
                id:adminData.id,
                firstName: adminData.firstName,
                email: adminData.email,
                location: adminData.location,
                username: adminData.username,
                password: "",
                userRole: adminData.userRole,
            });
        }
    }, [adminData]);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if ((formData.id && formData.firstName && formData.email && formData.username) || (passwordOn && ((formData.firstName && formData.email && formData.username && formData.password)))) {
            setLoading(true);
            await onConfirm(formData);
            setLoading(false);
            closePopup();
        } else {
            alert("Please fill all fields.");
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
                                    value={formData.firstName}
                                    onChange={(value) => handleInputChange("firstName", value)}
                                />
                                <Textfield
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(value) => handleInputChange("email", value)}
                                />
                                <Textfield
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(value) => handleInputChange("username", value)}
                                />
                                {passwordOn && (
                                    <Textfield
                                        type="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={(value) => handleInputChange("password", value)}
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
