function Button({ children, variant = "primary", className = "", ...props }) {
  const baseClass = variant === "secondary" ? "btn-secondary" : "btn-primary";
  return (
    <button className={`btn ${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
