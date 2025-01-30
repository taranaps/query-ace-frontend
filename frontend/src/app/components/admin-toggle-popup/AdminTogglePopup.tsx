import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import styles from "./AdminTogglePopup.module.css";

/**
 * Props for the AdminTogglePopup component.
 * @typedef {Object} AddAdminPopupProps
 * @property {Function} onClose - The function to be called when the popup is closed.
 * @property {Function} onConfirm - The function to be called when the confirmation action is triggered.
 */
interface AddAdminPopupProps {
    onClose: () => void;
    onConfirm: () => void;
}

/**
 * AdminTogglePopup is a modal that confirms whether the user is sure about changing the account status.
 * It includes buttons for canceling or confirming the action.
 *
 * @component
 * @example
 * // Usage
 * <AdminTogglePopup
 *   onClose={handleClose}
 *   onConfirm={handleToggleAdminStatus}
 * />
 * 
 * @param {AddAdminPopupProps} props - The properties passed to the component.
 * @returns {JSX.Element} The AdminTogglePopup component.
 */
const AdminTogglePopup: React.FC<AddAdminPopupProps> = ({ onClose, onConfirm }) => {

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
