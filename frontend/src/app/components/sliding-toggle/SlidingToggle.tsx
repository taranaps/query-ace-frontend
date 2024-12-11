"use client";

import React from "react";

interface SlidingToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const SlidingToggle: React.FC<SlidingToggleProps> = ({ checked, onChange }) => {
    return (
        <div
            className={`relative w-[40px] h-[20px] flex items-center rounded-full cursor-pointer transition duration-300 ${checked ? "bg-[#A6E7D8]" : "bg-[#FFC5C5]"
                }`}
            style={{
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)", // Inner shadow
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
