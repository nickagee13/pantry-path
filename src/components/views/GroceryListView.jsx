import { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react';
import Header from '../common/Header';
import SearchBar from '../common/SearchBar';
import StatsCard from '../common/StatsCard';
import FilterPills from '../common/FilterPills';
import StoreCard from '../grocery/StoreCard';
import { stores } from '../../data/mockData';

const GroceryListView = ({
  groceryList,
  shoppingMode,
  onToggleShoppingMode,
  onToggleCheck,
  stats,
  onNavigateToExpiring,
  onNavigateToRecipes,
  onReorderStores,
  storeOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Stores');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const storeFilters = ['All Stores', ...stores];

  const handleDragStart = (e, storeIndex) => {
    setDraggedItem(storeIndex);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentElement);
    e.dataTransfer.setDragImage(e.target.parentElement, 0, 0);
  };

  const handleDragOver = (e, storeIndex) => {
    e.preventDefault();
    setDragOverItem(storeIndex);
  };

  const handleDragEnd = () => {
    if (draggedItem !== null && dragOverItem !== null && draggedItem !== dragOverItem) {
      const storeOrder = getVisibleStores();
      const newOrder = [...storeOrder];
      const draggedStore = newOrder[draggedItem];
      newOrder.splice(draggedItem, 1);
      newOrder.splice(dragOverItem, 0, draggedStore);

      if (onReorderStores) {
        onReorderStores(newOrder);
      }
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getVisibleStores = () => {
    const orderedStores = storeOrder || Object.keys(groceryList);
    if (activeFilter === 'All Stores') {
      return orderedStores.filter(store => groceryList[store]);
    }
    return orderedStores.filter(store => store === activeFilter && groceryList[store]);
  };

  const filterItems = (items) => {
    if (!searchQuery) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const completedStores = Object.keys(groceryList).filter(store => {
    const items = groceryList[store];
    return items.length > 0 && items.every(item => item.checked);
  }).length;

  const totalStores = Object.keys(groceryList).length;

  const headerActions = (
    <>
      <button
        className={`icon-btn ${shoppingMode ? 'shopping-active' : ''}`}
        onClick={onToggleShoppingMode}
        title="Shopping Mode"
      >
        <ShoppingCart size={16} />
      </button>
      <button className="icon-btn">
        <User size={16} />
      </button>
    </>
  );

  return (
    <div className="view active">
      <Header
        title="Grocery List"
        subtitle={`${stats.list} items • ${totalStores} stores • ${completedStores} completed`}
        actions={headerActions}
      />

      <SearchBar
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="stats-row">
        <StatsCard
          type="list"
          value={stats.list}
          label="List"
          description="To buy"
        />
        <StatsCard
          type="expiring"
          value={stats.expiring}
          label="Expiring"
          description="Use soon"
          className="blue"
          onClick={onNavigateToExpiring}
        />
        <StatsCard
          type="canMake"
          value={stats.canMake}
          label="Can Make"
          description="Recipes"
          className="green"
          onClick={onNavigateToRecipes}
        />
      </div>

      <FilterPills
        filters={storeFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="list-container">
        {getVisibleStores().map((storeName, index) => {
          const filteredItems = filterItems(groceryList[storeName] || []);
          if (filteredItems.length === 0 && searchQuery) return null;

          return (
            <div
              key={storeName}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`store-container ${draggedItem === index ? 'dragging' : ''} ${dragOverItem === index ? 'drag-over' : ''}`}
            >
              <StoreCard
                storeName={storeName}
                items={filteredItems}
                onToggleCheck={onToggleCheck}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroceryListView;