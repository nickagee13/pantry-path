import { List, Clock, ChefHat } from 'lucide-react';

const StatsCard = ({ type, value, label, description, className = '', onClick }) => {
  const getIcon = () => {
    switch (type) {
      case 'list':
        return <List className="stat-icon" size={20} />;
      case 'expiring':
        return <Clock className="stat-icon" size={20} />;
      case 'canMake':
        return <ChefHat className="stat-icon" size={20} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`stat-card ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-desc">{description}</div>
      {getIcon()}
    </div>
  );
};

export default StatsCard;