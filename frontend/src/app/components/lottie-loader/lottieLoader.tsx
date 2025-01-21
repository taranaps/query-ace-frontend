/**
 * @module LottieLoader
 * @description
 * A reusable loading animation component using Lottie animations.
 * Provides a smooth, professional loading indicator that can be:
 * - Sized dynamically
 * - Centered automatically
 * - Used across different contexts
 * - Customized through props
 */
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../../public/assets/animatedIcons/circle-loader.json';

/**
 * @interface LottieLoaderProps
 * @description
 * Props for customizing the loader appearance.
 * Size can be specified as string (e.g., '100%', '200px') or number.
 * 
 * @property {string|number} [size='100%'] - Controls width and height of loader
 */
interface LottieLoaderProps {
    size?: string | number;
}

/**
 * @component LottieLoader
 * @description
 * Displays a centered, animated loading indicator using Lottie animation.
 * Features:
 * - Auto-playing animation
 * - Infinite loop
 * - Responsive sizing
 * - Centered alignment
 * - Configurable dimensions
 * 
 * @param {LottieLoaderProps} props - Component properties
 * @returns {JSX.Element} Rendered loader component
 */
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