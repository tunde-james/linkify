import React from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

// Base style that all buttons share
const baseStyles =
  "inline-flex items-center justify-center rounded-lg text-base font-semibold transition-colors leading-6 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

// Variant-specific styles
const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white active:bg-primary-100",
  secondary:
    "border border-primary hover:bg-primary-50 active:bg-primary-50 hover:text-white active:text-white",
};

// Size-specific styles
const sizeStyles: Record<ButtonSize, string> = {
  default: " py-[11px] px-4",
  sm: "",
  lg: "",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const buttonClasses = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button className={buttonClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
