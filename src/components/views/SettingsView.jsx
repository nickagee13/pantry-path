import { useState } from 'react';
import Header from '../common/Header';
import { NOTIFICATION_SETTINGS, FAMILY_MEMBERS, STORE_CATEGORIES } from '../../utils/constants';
import { storeIcons } from '../../data/mockData';

const ToggleSwitch = ({ active, onToggle }) => (
  <div
    className={`toggle-switch ${active ? 'active' : ''}`}
    onClick={onToggle}
  >
    <div className="toggle-knob"></div>
  </div>
);

const SettingsView = ({ darkMode, onToggleDarkMode, storeOrder, onReorderStores }) => {
  const [notifications, setNotifications] = useState(
    NOTIFICATION_SETTINGS.reduce((acc, setting) => {
      acc[setting.id] = setting.active;
      return acc;
    }, {})
  );
  const [draggedStore, setDraggedStore] = useState(null);
  const [dragOverStore, setDragOverStore] = useState(null);

  const toggleNotification = (id) => {
    setNotifications(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleStoreDragStart = (e, storeIndex) => {
    setDraggedStore(storeIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStoreDragOver = (e, storeIndex) => {
    e.preventDefault();
    setDragOverStore(storeIndex);
  };

  const handleStoreDragEnd = () => {
    if (draggedStore !== null && dragOverStore !== null && draggedStore !== dragOverStore) {
      const newOrder = [...storeOrder];
      const draggedStoreItem = newOrder[draggedStore];
      newOrder.splice(draggedStore, 1);
      newOrder.splice(dragOverStore, 0, draggedStoreItem);

      if (onReorderStores) {
        onReorderStores(newOrder);
      }
    }
    setDraggedStore(null);
    setDragOverStore(null);
  };

  return (
    <div className="view active">
      <Header
        title="Settings"
        subtitle="Customize your experience"
      />

      <div className="settings-container">
        {/* Appearance Settings */}
        <div className="settings-section">
          <div className="settings-header">Appearance</div>
          <div className="settings-item" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600 }}>Dark Mode</div>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginTop: '2px'
              }}>
                Easier on the eyes at night
              </div>
            </div>
            <ToggleSwitch active={darkMode} onToggle={onToggleDarkMode} />
          </div>
        </div>

        {/* Store Management */}
        <div className="settings-section">
          <div className="settings-header">Your Stores</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '0 18px 12px', fontStyle: 'italic' }}>
            Drag to reorder stores
          </div>
          {storeOrder.map((storeName, index) => (
            <div
              key={storeName}
              draggable
              onDragStart={(e) => handleStoreDragStart(e, index)}
              onDragOver={(e) => handleStoreDragOver(e, index)}
              onDragEnd={handleStoreDragEnd}
              className={`settings-item store-item ${draggedStore === index ? 'dragging' : ''} ${dragOverStore === index ? 'drag-over' : ''}`}
              style={{ cursor: 'grab' }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {storeName === 'Farmers Market' ? (
                    <span>{storeIcons[storeName]}</span>
                  ) : (
                    <img
                      src={storeIcons[storeName]}
                      alt={storeName}
                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                    />
                  )}
                  {storeName}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>
                  {STORE_CATEGORIES[storeName] || 'General'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="settings-header">Notifications</div>
          {NOTIFICATION_SETTINGS.map((setting) => (
            <div
              key={setting.id}
              className="settings-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>
                  {setting.title}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '2px'
                }}>
                  {setting.description}
                </div>
              </div>
              <ToggleSwitch
                active={notifications[setting.id]}
                onToggle={() => toggleNotification(setting.id)}
              />
            </div>
          ))}
        </div>

        {/* Family Sharing */}
        <div className="settings-section">
          <div className="settings-header">Family Sharing</div>
          {FAMILY_MEMBERS.map((member) => (
            <div key={member.id} className="settings-item">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    background: member.gradient,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700
                  }}>
                    {member.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {member.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      {member.permissions}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--success)'
                }}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
          <div className="settings-item">
            <div style={{ textAlign: 'center' }}>
              <button style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-blue)',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                + Invite Family Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;