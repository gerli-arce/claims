import type React from "react";

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: "pending" | "process" | "resolved" | "primary" | "secondary";
}

export function Badge({
    children,
    className = "",
    variant = "primary",
}: BadgeProps) {
    const getVariantClass = () => {
        switch (variant) {
            case "pending":
                return "bg-warning-subtle border border-warning-subtle text-warning-emphasis";
            case "process":
                return "bg-info-subtle border border-info-subtle text-info-emphasis";
            case "resolved":
                return "bg-success-subtle border border-success-subtle text-success-emphasis";
            case "primary":
                return "text-bg-primary";
            case "secondary":
                return "text-bg-secondary";
            default:
                return "text-bg-primary";
        }
    };

    return (
        <span
            className={`badge rounded-pill ${getVariantClass()} ${className}`}
        >
            {children}
        </span>
    );
}
