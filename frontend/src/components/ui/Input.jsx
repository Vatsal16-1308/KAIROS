function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}

export default Input;
