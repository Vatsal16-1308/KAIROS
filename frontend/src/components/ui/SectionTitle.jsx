function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`section-title ${className}`}>
      {title && <h2>{title}</h2>}
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default SectionTitle;
