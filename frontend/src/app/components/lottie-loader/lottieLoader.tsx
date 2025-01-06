import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../../public/assets/animatedIcons/circle-loader.json';

interface LottieLoaderProps {
    size?: string | number;
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({ size = '100%' }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <Lottie
                animationData={animationData}
                autoPlay={true}
                loop={true}
                style={{
                    width: size,
                    height: size,
                }}
            />
        </div>
    );
};
