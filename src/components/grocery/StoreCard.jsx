import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { storeIcons } from '../../data/mockData';
import ListItem from './ListItem';

const StoreCard = ({ storeName, items, onToggleCheck }) => {
  const [collapsed, setCollapsed] = useState(false);

  const checkedItems = items.filter(item => item.checked);
  const uncheckedItems = items.filter(item => !item.checked);
  const allItemsChecked = items.length > 0 && checkedItems.length === items.length;

  const getBadgeText = () => {
    if (allItemsChecked) return 'Completed!';
    const uncheckedCount = uncheckedItems.length;
    return uncheckedCount === 1 ? '1 item' : `${uncheckedCount} items`;
  };

  const getBadgeClass = () => {
    return allItemsChecked ? 'store-badge completed' : 'store-badge';
  };

  const sortedItems = [...uncheckedItems, ...checkedItems];

  return (
    <div className={`store-card ${collapsed ? 'collapsed' : ''}`}>
      <div className="store-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="store-title">
          {storeName === 'Farmers Market' ? (
            <span>{storeIcons[storeName] || '🥬'}</span>
          ) : (
            <img
              src={storeIcons[storeName]}
              alt={storeName}
              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
            />
          )}
          {storeName}
          <span className={getBadgeClass()}>{getBadgeText()}</span>
        </div>
        <ChevronDown className={`store-chevron ${collapsed ? 'collapsed' : ''}`} size={20} />
      </div>
      <div className={`store-content ${collapsed ? 'collapsed' : ''}`}>
        {sortedItems.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            onToggleCheck={() => onToggleCheck(storeName, item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreCard;