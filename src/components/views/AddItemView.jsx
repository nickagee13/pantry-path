import { useState } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import Header from '../common/Header';
import { itemSuggestions, storeSuggestions } from '../../data/mockData';

const AddItemView = ({ onAddItem, onNavigateBack }) => {
  const [itemName, setItemName] = useState('');
  const [quantityAmount, setQuantityAmount] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('count');
  const [store, setStore] = useState('');
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [showStoreSuggestions, setShowStoreSuggestions] = useState(false);

  const quantityUnits = [
    { value: 'count', label: 'count' },
    { value: 'oz', label: 'oz' },
    { value: 'lbs', label: 'lbs' },
    { value: 'grams', label: 'grams' },
    { value: 'kg', label: 'kg' },
    { value: 'cups', label: 'cups' },
    { value: 'pints', label: 'pints' },
    { value: 'quarts', label: 'quarts' },
    { value: 'gallons', label: 'gallons' },
    { value: 'liters', label: 'liters' },
    { value: 'ml', label: 'ml' },
    { value: 'boxes', label: 'boxes' },
    { value: 'bags', label: 'bags' },
    { value: 'bunches', label: 'bunches' },
    { value: 'packages', label: 'packages' }
  ];

  // Filter suggestions based on input
  const getFilteredItemSuggestions = () => {
    if (!itemName.trim()) return itemSuggestions;
    const query = itemName.toLowerCase().trim();
    return itemSuggestions.filter(item =>
      item.name.toLowerCase().includes(query)
    );
  };

  const getFilteredStoreSuggestions = () => {
    if (!store.trim()) return storeSuggestions;
    const query = store.toLowerCase().trim();
    return storeSuggestions.filter(storeItem =>
      storeItem.name.toLowerCase().includes(query)
    );
  };

  const handleItemInputChange = (e) => {
    const value = e.target.value;
    setItemName(value);
    setShowItemSuggestions(value.length > 0);
  };

  const handleStoreInputChange = (e) => {
    const value = e.target.value;
    setStore(value);
    setShowStoreSuggestions(true); // Show suggestions when typing
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

    const quantity = quantityAmount.trim()
      ? `${quantityAmount.trim()} ${quantityUnit}`
      : '1 count';

    onAddItem({
      name: itemName.trim(),
      quantity: quantity,
      store: store.trim() || 'Farmers Market'
    });

    // Reset form
    setItemName('');
    setQuantityAmount('');
    setQuantityUnit('count');
    setStore('');
  };

  const headerActions = (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button className="icon-btn" onClick={onNavigateBack}>
        <ArrowLeft size={16} />
      </button>
      <button className="icon-btn">
        <Camera size={16} />
      </button>
    </div>
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
            {getFilteredItemSuggestions().length > 0 ? (
              getFilteredItemSuggestions().map((item, index) => (
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
              ))
            ) : itemName.trim() ? (
              <div className="quick-no-results">
                <span>No items match "{itemName}"</span>
              </div>
            ) : (
              getFilteredItemSuggestions().map((item, index) => (
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
              ))
            )}
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
                {getFilteredItemSuggestions().map((item, index) => (
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
                {getFilteredItemSuggestions().length === 0 && (
                  <div className="suggestion-item no-results">
                    <span className="suggestion-text">No matching items found</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="input-group">
            <label className="input-label">Quantity</label>
            <div className="quantity-input-container">
              <input
                type="number"
                className="input-field quantity-amount"
                placeholder="Amount"
                value={quantityAmount}
                onChange={(e) => setQuantityAmount(e.target.value)}
                min="0"
                step="0.1"
              />
              <select
                className="input-field quantity-unit"
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
              >
                {quantityUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
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
                {getFilteredStoreSuggestions().map((storeItem, index) => (
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
                {getFilteredStoreSuggestions().length === 0 && (
                  <div className="suggestion-item no-results">
                    <span className="suggestion-text">No matching stores found</span>
                  </div>
                )}
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