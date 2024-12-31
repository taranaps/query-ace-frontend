import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Textfield from "../text-field/TextField"; // Adjust the path to your custom Textfield component
import styles from "./AdminTogglePopup.module.css"

interface AddAdminPopupProps {
    onClose: () => void;
    onConfirm: () => void;
}

const AdminTogglePopup: React.FC<AddAdminPopupProps> = ({ onClose, onConfirm }) => {


    const handleCreate = () => {
        console.log("Account Disabled");
        onClose();
    };

    return (
        <Dialog
            open
            onClose={onClose}
            className={styles.toggleAdminPopUp}
        >
            <div className={styles.toggleAdminPopUpBody}>
                <DialogTitle
                    className={styles.toggleAdminPopUpHeader}
                >
                    Are you sure ?
                </DialogTitle>
                <DialogContent
                    className={styles.toggleAdminPopUpSubHeading}
                >
                    <p>Are you sure you want to change this account status ?</p>
                </DialogContent>
                <DialogActions>
                    <div className={styles.toggleAdminPopUpFooter}>
                        <Button
                            className={`${styles.toggleAdminPopUpButton} ${styles.cancel}`}
                            onClick={onClose}
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            className={styles.toggleAdminPopUpButton}
                            onClick={onConfirm}
                            variant="contained"
                            color="success">
                            Confirm
                        </Button>
                    </div>
                </DialogActions>
            </div>
        </Dialog>
    );
};

export default AdminTogglePopup;
