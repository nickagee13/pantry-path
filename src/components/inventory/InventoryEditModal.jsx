import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

const InventoryEditModal = ({ item, isOpen, onClose, onSave }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [percentage, setPercentage] = useState(item?.percentage || 100);
  const [daysLeft, setDaysLeft] = useState(item?.daysLeft || 7);
  const [location, setLocation] = useState(item?.location || 'Fridge');

  if (!isOpen || !item) return null;

  const handleSave = () => {
    onSave({
      ...item,
      quantity,
      percentage: Math.max(0, Math.min(100, percentage)),
      daysLeft: Math.max(0, daysLeft),
      location
    });
    onClose();
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(0, prev - 1));

  const getFreshnessColor = () => {
    if (daysLeft <= 1) return '#EF4444'; // Red
    if (daysLeft <= 3) return '#F59E0B'; // Orange
    return '#10B981'; // Green
  };

  const getFreshnessLabel = () => {
    if (daysLeft <= 1) return 'Use today!';
    if (daysLeft <= 3) return 'Use soon';
    return 'Fresh';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit {item.name}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="edit-section">
            <label className="edit-label">Quantity</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={decrementQuantity}
                disabled={quantity <= 0}
              >
                <Minus size={16} />
              </button>
              <span className="quantity-display">
                {quantity}
              </span>
              <button className="quantity-btn" onClick={incrementQuantity}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="edit-section">
            <label className="edit-label">Amount Remaining</label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="percentage-slider"
              />
              <span className="slider-value">{percentage}%</span>
            </div>
          </div>

          <div className="edit-section">
            <label className="edit-label">Freshness</label>
            <div className="freshness-container">
              <input
                type="range"
                min="0"
                max="14"
                value={daysLeft}
                onChange={(e) => setDaysLeft(Number(e.target.value))}
                className="freshness-slider"
                style={{
                  '--slider-color': getFreshnessColor()
                }}
              />
              <div className="freshness-info">
                <span className="freshness-days">{daysLeft} days left</span>
                <span
                  className="freshness-label"
                  style={{ color: getFreshnessColor() }}
                >
                  {getFreshnessLabel()}
                </span>
              </div>
            </div>
          </div>

          <div className="edit-section">
            <label className="edit-label">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-select"
            >
              <option value="Fridge">🧊 Fridge</option>
              <option value="Pantry">🥫 Pantry</option>
              <option value="Freezer">❄️ Freezer</option>
              <option value="Counter">🏠 Counter</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryEditModal;