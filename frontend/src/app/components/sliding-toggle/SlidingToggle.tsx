"use client";

import React from "react";

interface SlidingToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

/**
 * A functional component that renders a sliding toggle switch.
 * The toggle can be in an "on" or "off" state, and it triggers a callback when clicked.
 * 
 * @component
 * @example
 * return (
 *   <SlidingToggle
 *     checked={true}
 *     onChange={(checked) => console.log(checked)} 
 *   />
 * );
 * 
 * @param {Object} props - The component's props.
 * @param {boolean} props.checked - The current state of the toggle, `true` for "on" and `false` for "off".
 * @param {function} props.onChange - A callback function that is triggered when the toggle is clicked, providing the new checked state.
 * 
 * @returns {React.Element} The rendered sliding toggle component.
 */
const SlidingToggle: React.FC<SlidingToggleProps> = ({ checked, onChange }) => {
    return (
        <div
            className={`relative w-[40px] h-[20px] flex items-center rounded-full cursor-pointer transition duration-300 ${checked ? "bg-[#A6E7D8]" : "bg-[#FFC5C5]"
                }`}
            style={{
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            onClick={() => onChange(!checked)}
        >
            <div
                className={`absolute w-[16px] h-[16px] rounded-full bg-white shadow-lg transform transition duration-300 ${checked ? "translate-x-[20px]" : "translate-x-[2px]"
                    }`}
            ></div>
        </div>
    );
};

export default SlidingToggle;
