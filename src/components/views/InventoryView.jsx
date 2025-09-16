import { useState } from 'react';
import { BarChart } from 'lucide-react';
import Header from '../common/Header';
import FilterPills from '../common/FilterPills';
import InventoryCard from '../inventory/InventoryCard';
import InventoryEditModal from '../inventory/InventoryEditModal';
import { categories } from '../../data/mockData';

const InventoryView = ({ inventory, onRemoveItem, onAddToList, onUpdateItem, onShowNotification }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleSaveItem = (updatedItem) => {
    if (onUpdateItem) {
      onUpdateItem(updatedItem);
    }
    setEditModalOpen(false);
    setSelectedItem(null);
  };

  const locationFilters = ['All', 'Fridge', 'Pantry', 'Freezer', 'Counter'];
  const statusFilters = ['All', 'Running Low', 'Expiring', 'Fresh'];

  const filteredInventory = inventory.filter(item => {
    const categoryMatch = activeFilter === 'All' || item.category === activeFilter;
    const locationMatch = locationFilter === 'All' || item.location === locationFilter;

    let statusMatch = true;
    if (statusFilter === 'Running Low') {
      statusMatch = item.percentage <= 25;
    } else if (statusFilter === 'Expiring') {
      statusMatch = item.daysLeft <= 2;
    } else if (statusFilter === 'Fresh') {
      statusMatch = item.percentage > 50 && item.daysLeft > 7;
    }

    return categoryMatch && locationMatch && statusMatch;
  });

  const headerActions = (
    <button className="icon-btn">
      <BarChart size={16} />
    </button>
  );

  return (
    <div className="view active">
      <Header
        title="Kitchen Inventory"
        subtitle="Swipe ← remove • Swipe → add to list"
        actions={headerActions}
      />

      <FilterPills
        filters={categories}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <FilterPills
        filters={locationFilters}
        activeFilter={locationFilter}
        onFilterChange={setLocationFilter}
      />

      <FilterPills
        filters={statusFilters}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="inventory-grid">
        {filteredInventory.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onRemoveItem={onRemoveItem}
            onAddToList={onAddToList}
            onEditItem={handleEditItem}
            onShowNotification={onShowNotification}
          />
        ))}
      </div>

      <InventoryEditModal
        item={selectedItem}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default InventoryView;