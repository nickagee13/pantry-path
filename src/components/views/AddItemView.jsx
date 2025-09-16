import { useState } from 'react';
import { Camera } from 'lucide-react';
import Header from '../common/Header';
import { itemSuggestions, storeSuggestions } from '../../data/mockData';

const AddItemView = ({ onAddItem }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [store, setStore] = useState('');
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [showStoreSuggestions, setShowStoreSuggestions] = useState(false);

  const handleItemInputChange = (e) => {
    const value = e.target.value;
    setItemName(value);
    setShowItemSuggestions(value.length > 0);
  };

  const handleStoreInputChange = (e) => {
    const value = e.target.value;
    setStore(value);
  };

  const handleStoreFocus = () => {
    setShowStoreSuggestions(true);
  };

  const handleStoreBlur = () => {
    setTimeout(() => setShowStoreSuggestions(false), 200);
  };

  const selectItem = (item) => {
    setItemName(item.name);
    setShowItemSuggestions(false);
  };

  const selectStore = (storeName) => {
    setStore(storeName);
    setShowStoreSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    onAddItem({
      name: itemName.trim(),
      quantity: quantity.trim() || '1',
      store: store.trim() || 'Farmers Market'
    });

    // Reset form
    setItemName('');
    setQuantity('');
    setStore('');
  };

  const headerActions = (
    <button className="icon-btn">
      <Camera size={16} />
    </button>
  );

  return (
    <div className="view active">
      <Header
        title="Add Items"
        subtitle="What do you need?"
        actions={headerActions}
      />

      <div className="add-container">
        <div className="quick-suggestions">
          <h3 className="suggestions-title">Quick Add</h3>
          <div className="quick-items">
            {itemSuggestions.map((item, index) => (
              <button
                key={index}
                type="button"
                className="quick-item-btn"
                onClick={() => selectItem(item)}
              >
                <span className="quick-item-emoji">{item.emoji}</span>
                <span className="quick-item-name">{item.name}</span>
                <span className="quick-item-hint">{item.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="input-group">
            <label className="input-label">Item Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Start typing..."
              value={itemName}
              onChange={handleItemInputChange}
            />

            {showItemSuggestions && (
              <div className="suggestions-box">
                {itemSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => selectItem(item)}
                  >
                    <span className="suggestion-text">
                      {item.emoji} {item.name}
                    </span>
                    <span className="suggestion-hint">{item.hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Quantity</label>
            <input
              type="text"
              className="input-field"
              placeholder="How much? (optional)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Store</label>
            <input
              type="text"
              className="input-field"
              placeholder="Select or type store..."
              value={store}
              onChange={handleStoreInputChange}
              onFocus={handleStoreFocus}
              onBlur={handleStoreBlur}
            />

            {showStoreSuggestions && (
              <div className="suggestions-box">
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  padding: '8px 12px 4px'
                }}>
                  Your Stores
                </div>
                {storeSuggestions.map((storeItem, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => selectStore(storeItem.name)}
                  >
                    <span className="suggestion-text">
                      {storeItem.emoji ? (
                        storeItem.emoji
                      ) : (
                        <img
                          src={storeItem.logo}
                          alt={storeItem.name}
                          style={{ width: '16px', height: '16px', objectFit: 'contain', marginRight: '4px' }}
                        />
                      )} {storeItem.name}
                    </span>
                    <span className="suggestion-hint">{storeItem.hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary add-submit-btn">
            Add to List
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemView;