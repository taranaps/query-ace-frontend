"use client";

import React, { useRef } from "react";
import Lottie from "lottie-react";
import styles from "./lottiebutton.module.css";

interface LottieIconButtonProps {
  animationData: object;
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
  const lottieRef = useRef<any>(null); 

  const handleMouseEnter = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndStop(0, true); 
      lottieRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (lottieRef.current) {
      lottieRef.current.stop(); 
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
        lottieRef={lottieRef} 
        autoPlay={false}
        loop={false} 
        className={styles.lottieIcon}
      />
      <div className={styles.buttonLabelContainer}>
        <span className={styles.buttonLabel}>{label}</span>
      </div>
    </button>
  );
};

export default React.memo(LottieIconButton); 