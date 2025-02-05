import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@mui/material";
import Textfield from "../text-field/TextField";
import styles from "./AddAdminPopup.module.css";
import { LottieLoader } from "../lottie-loader/lottieLoader";
import MessagePopup from "../message-popup/MessagePopup";

/**
 * Represents the structure of the admin form data.
 * @typedef {Object} AdminFormData
 * @property {string} firstName - The admin's first name.
 * @property {string} email - The admin's email address.
 * @property {string} location - The admin's location.
 * @property {string} username - The admin's username.
 * @property {string} password - The admin's password.
 * @property {"SUPER_ADMIN" | "ADMIN"} userRole - The admin's role (either SUPER_ADMIN or ADMIN).
 */
interface AdminFormData {
    firstName: string;
    email: string;
    username: string;
    password: string;
    userRole: "SUPER_ADMIN" | "ADMIN";
}

/**
 * Props for the AddAdminPopup component.
 * @typedef {Object} AddAdminPopupProps
 * @property {string} header - The header text for the popup.
 * @property {Function} onClose - The function to be called when the popup is closed.
 * @property {Function} onConfirm - The function to handle the admin data submission.
 * @property {Function} closePopup - Function to close the popup.
 * @property {boolean} [passwordOn=true] - Determines if the password field is shown.
 * @property {Partial<AdminFormData>} [formData={}] - Optional partial data to initialize the form with.
 */
interface AddAdminPopupProps {
    header: string;
    onClose: () => void;
    // eslint-disable-next-line no-unused-vars
    onConfirm: (adminData: AdminFormData) => boolean;
    closePopup: () => void;
    passwordOn?: boolean;
    formData?: Partial<AdminFormData>;
}

/**
 * AddAdminPopup is a modal that allows the creation of a new admin.
 * It includes fields for first name, email, username, and password.
 *
 * @component
 * @example
 * // Usage
 * <AddAdminPopup
 *   header="Add Admin"
 *   onClose={handleClose}
 *   onConfirm={handleCreateAdmin}
 *   closePopup={handleClosePopup}
 * />
 *
 * @param {AddAdminPopupProps} props - The properties passed to the component.
 * @returns {JSX.Element} The AddAdminPopup component.
 */
const AddAdminPopup: React.FC<AddAdminPopupProps> = ({
  header,
  onClose,
  onConfirm,
  closePopup,
  passwordOn = true,
  formData = {},
}) => {
  const [formState, setFormState] = useState<AdminFormData>({
    firstName: formData.firstName || "",
    email: formData.email || "",
    username: formData.username || "",
    password: formData.password || "",
    userRole: formData.userRole || "ADMIN",
  });

  /**
     * Handles input changes for the admin form fields.
     * @param {keyof AdminFormData} field - The field being updated.
     * @param {string} value - The new value for the field.
     */
  const handleInputChange = (field: keyof AdminFormData, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);
  const [loadingAnimationState, setLoadingAnimationState] = useState("loading");

  /**
     * Handles the form submission to create a new admin.
     * @async
     * @function
     */
  const handleCreate = async() => {
    const { firstName, email, username, password } = formState;

    if (firstName && email  && username && (password || !passwordOn)) {
      setLoading(true);
      const confirmSave = await onConfirm(formState);
      if (!confirmSave) {
        MessagePopup({ message:"Failed to create admin", buttonLabel: "OK",buttonFunction: () => {} });
      } else {
        setLoadingAnimationState("success");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      setLoading(false);
      closePopup();
    } else {
      MessagePopup({ message:"Please fill in all the fields", buttonLabel: "OK",buttonFunction: () => {} });
    };
  };

  return (
    <Dialog open onClose={onClose} className={styles.addAdminPopUp}>
      <div className={styles.addAdminPopUpBody}>
        {loading ? (
          <LottieLoader size={"180px"} state={loadingAnimationState}/>
        ) : (
          <>
            <DialogTitle className={styles.addAdminPopUpHeader}>
              {header}
            </DialogTitle>
            <DialogContent>
              <div className={styles.addAdminPopUpFields}>
                <Textfield
                  id="fullname-input"
                  placeholder="Full name"
                  value={formState.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                />
                <Textfield
                  id="email-input"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(value) => handleInputChange("email", value)}
                />
                <Textfield
                  id="username-input"
                  placeholder="Username"
                  value={formState.username}
                  onChange={(value) => handleInputChange("username", value)}
                />
                {passwordOn && (
                  <Textfield
                    id="password-input"
                    type="password"
                    placeholder="Password"
                    value={formState.password}
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
                  onClick={handleCreate}
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
