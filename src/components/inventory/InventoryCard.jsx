import { useState, useRef } from 'react';

const InventoryCard = ({ item, onRemoveItem, onAddToList, onEditItem, onShowNotification }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [hasMoved, setHasMoved] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setTouchStartTime(Date.now());
    setHasMoved(false);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const currentTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const deltaX = Math.abs(currentTouch.x - touchStart.x);
    const deltaY = Math.abs(currentTouch.y - touchStart.y);

    // If moved more than 10px in any direction, it's not a tap
    if (deltaX > 10 || deltaY > 10) {
      setHasMoved(true);
    }

    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const touchDuration = Date.now() - touchStartTime;
    const swipeDistance = touchStart.x - touchEnd.x;
    const threshold = 50;

    // If it's a quick tap (less than 200ms) and minimal movement, treat as click
    if (touchDuration < 200 && !hasMoved) {
      handleClick();
      return;
    }

    // Only process swipe if there was significant movement
    if (Math.abs(swipeDistance) >= threshold && hasMoved) {
      if (swipeDistance > threshold) {
        // Swipe left - remove from inventory
        handleSwipeLeft();
      } else if (swipeDistance < -threshold) {
        // Swipe right - add to grocery list
        handleSwipeRight();
      }
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartTime(null);
    setHasMoved(false);
  };

  const handleClick = () => {
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const handleSwipeLeft = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(-100%)';
      cardRef.current.style.opacity = '0';
      setTimeout(() => {
        onRemoveItem(item.id);
        if (onShowNotification) {
          const undoAction = () => {
            // Restore the item - this would need to be passed down as a prop
            window.location.reload(); // Temporary solution
          };
          onShowNotification(`${item.name} removed from inventory`, 'removed', undoAction);
        }
      }, 300);
    }
  };

  const handleSwipeRight = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(100%)';
      cardRef.current.style.opacity = '0';
      setTimeout(() => {
        onAddToList(item);

        // If item is at 0% or below, remove it from inventory
        const shouldRemoveFromInventory = item.percentage <= 0;

        if (onShowNotification) {
          const undoAction = () => {
            // Remove the item from grocery list - this would need proper implementation
            window.location.reload(); // Temporary solution
          };
          const message = shouldRemoveFromInventory
            ? `${item.name} added to grocery list and removed from inventory (empty)`
            : `${item.name} added to grocery list`;
          onShowNotification(message, 'added', undoAction);
        }

        if (shouldRemoveFromInventory) {
          onRemoveItem(item.id);
        } else {
          resetCard();
          // Show a temporary feedback message
          if (cardRef.current) {
            cardRef.current.style.transform = 'translateX(0)';
            cardRef.current.style.opacity = '1';
          }
        }
      }, 300);
    }
  };

  const resetCard = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'translateX(0)';
      cardRef.current.style.opacity = '1';
    }
  };

  const getProgressColor = () => {
    if (item.percentage <= 25) return 'var(--warning)';
    if (item.percentage <= 50) return 'var(--warning)';
    return 'var(--success)';
  };

  const getProgressLabel = () => {
    if (item.percentage <= 25) return 'Running low - add to list?';
    return `${item.percentage}% remaining`;
  };

  return (
    <div
      className={`inventory-card ${item.expiring ? 'expiring' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="inventory-content" ref={cardRef}>
        <div className="inventory-header">
          <div>
            <div className="inventory-name">{item.name}</div>
            <div className="inventory-details">
              {item.details.map((detail, index) => (
                <span key={index} className="detail-pill">{detail}</span>
              ))}
              {item.location && (
                <span className="detail-pill location-tag">{item.location}</span>
              )}
            </div>
          </div>
          <div className="inventory-emoji">{item.emoji}</div>
        </div>
        <div className="inventory-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${item.percentage}%`,
                background: getProgressColor()
              }}
            />
          </div>
          <div
            className="progress-label"
            style={{ color: item.percentage <= 25 ? 'var(--warning)' : 'var(--text-secondary)' }}
          >
            {getProgressLabel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;