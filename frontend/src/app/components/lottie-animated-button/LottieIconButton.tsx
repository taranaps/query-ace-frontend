"use client";

import React, { useRef } from "react";
import Lottie from "lottie-react";
import styles from "./lottiebutton.module.css";

interface LottieIconButtonProps {
  animationData: object; // Lottie JSON animation data
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const LottieIconButton: React.FC<LottieIconButtonProps> = ({
  animationData,
  label,
  onClick,
  disabled = false,
}) => {
  const lottieRef = useRef<any>(null); // Reference for the Lottie instance

  const handleMouseEnter = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0, true); // Ensure the animation starts fresh
      lottieRef.current.play(); // Start playing on hover
    }
  };

  const handleMouseLeave = () => {
    if (lottieRef.current) {
      lottieRef.current.stop(); // Stop the animation when mouse leaves
    }
  };

  return (
    <button
      className={`${styles.lottieButton} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      <Lottie
        animationData={animationData}
        lottieRef={lottieRef} // Reference to the Lottie instance
        autoPlay={false} // Prevent autoplay on initial render
        loop={false} // Play only once on hover
        className={styles.lottieIcon}
      />
      <div className={styles.buttonLabelContainer}>
        <span className={styles.buttonLabel}>{label}</span>
      </div>
    </button>
  );
};

export default React.memo(LottieIconButton); // Prevent unnecessary re-renders