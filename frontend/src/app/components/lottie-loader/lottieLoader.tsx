import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimationData from "../../../../public/assets/animatedIcons/circle-loaderv3.json";
import failedAnimationData from "../../../../public/assets/animatedIcons/circle-loader.json";
import successAnimationData from "../../../../public/assets/animatedIcons/successv2.json";

interface LottieLoaderProps {
    size?: string | number;
    state: string;
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({ size = "100%", state }) => {
  const [animationData, setAnimationData] = useState<any>(loadingAnimationData);
  const [repeat, setRepeat] = useState(true);

  useEffect(() => {
    switch (state) {
    case "loading":
      setAnimationData(loadingAnimationData);
      setRepeat(true);
      break;
    case "failed":
      setAnimationData(failedAnimationData);
      setRepeat(false);
      break;
    case "success":
      setAnimationData(successAnimationData);
      setRepeat(false);
      break;
    default:
      setAnimationData(loadingAnimationData);
      setRepeat(true);
      break;
    }
  }, [state]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Lottie
        animationData={animationData}
        autoPlay={true}
        loop={repeat}
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};
