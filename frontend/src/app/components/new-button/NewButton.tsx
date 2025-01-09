import React, { ReactNode } from 'react';

type ButtonProps = {
    variant: 'cancel' | 'submit' | 'info' | 'outlined' | 'custom';
    width?: 'max' | 'fit' | 'fixed';
    onClick?: () => void;
    icon?: ReactNode;
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
};

const NewButton: React.FC<ButtonProps> = ({
    variant,
    width = 'fit',
    onClick,
    icon,
    children,
    type = 'button',
    disabled = false
}) => {
    const baseStyles: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 18px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        width: width === 'max' ? '100%' : width === 'fixed' ? '200px' : 'fit-content',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        cancel: { backgroundColor: 'transparent', color: '#FF4D4D', borderColor: '#FF4D4D' },
        submit: { backgroundColor: '#4CAF50', color: '#fff', borderColor: '#4CCF60' },
        info: { backgroundColor: '#2196F3', color: '#fff', borderColor: '#2196F3' },
        outlined: { backgroundColor: 'transparent', color: '#000', borderColor: '#000' },
        custom: { backgroundColor: 'orange', color: 'white' },
    };

    const hoverStyles: Record<string, React.CSSProperties> = {
        cancel: { backgroundColor: '#FF4D4D', color: '#FFFFFF' },
        submit: { backgroundColor: '#388E3C' },
        info: { backgroundColor: '#1976D2' },
        outlined: { backgroundColor: '#f5f5f5', color: '#000' },
        custom: { backgroundColor: 'orange' },
    };

    const currentStyle = { ...baseStyles, ...variantStyles[variant] };

    return (
        <button
            type={type}
            disabled={disabled}
            style={currentStyle}
            onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, hoverStyles[variant]);
            }}
            onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, currentStyle);
            }}
            onClick={onClick}
        >
            {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
            {children}
        </button>
    );
};

export default NewButton;
