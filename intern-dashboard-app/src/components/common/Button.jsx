import React from "react";

const Button = ({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  style = {},
  className = "",
  type = "button",
  ...props
}) => {
  const getButtonClass = () => {
    switch (variant) {
      case "primary":
        return "btn-primary";
      case "secondary":
        return "btn-secondary";
      case "ghost":
        return "btn-ghost";
      case "danger":
        return "btn-danger-outline";
      default:
        return "btn-primary";
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={`${getButtonClass()} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
