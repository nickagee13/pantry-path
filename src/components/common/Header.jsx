const Header = ({ title, subtitle, actions, children }) => {
  return (
    <div className="header">
      <div className="header-top">
        <div>
          <h1>{title}</h1>
          {subtitle && <div className="header-subtitle">{subtitle}</div>}
        </div>
        {actions && (
          <div className="header-actions">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default Header;