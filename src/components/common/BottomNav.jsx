import { List, Home, ChefHat, Settings } from 'lucide-react';
import { VIEWS } from '../../utils/constants';

const BottomNav = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: VIEWS.GROCERY, icon: List, label: 'Lists' },
    { id: VIEWS.INVENTORY, icon: Home, label: 'Kitchen' },
    { id: VIEWS.RECIPES, icon: ChefHat, label: 'Recipes' },
    { id: VIEWS.SETTINGS, icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="nav-icon" size={22} />
              <span className="nav-label">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;