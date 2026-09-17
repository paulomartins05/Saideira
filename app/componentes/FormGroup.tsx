import React from "react";

interface FormGroupProps {
    label: React.ReactNode;
    error?: string;
    children: React.ReactNode;
}

export default function FormGroup({ label, error, children }: FormGroupProps) {
    return (
        <div>
            <label className="block text-[13px] font-bold text-night mb-1.5">
                {label}
            </label>
            {children}
            {error && (
                <span className="text-coral text-xs mt-1 font-medium flex items-center gap-1">
                    {error}
                </span>
            )}
        </div>
    );
}
