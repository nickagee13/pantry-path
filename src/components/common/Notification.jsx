import { useEffect } from 'react';
import { CheckCircle, X, RotateCcw } from 'lucide-react';

const Notification = ({ message, type, isVisible, onClose, onUndo, showUndo = false }) => {
  useEffect(() => {
    if (isVisible && !showUndo) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else if (isVisible && showUndo) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Longer timeout for undo actions
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, showUndo]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'added':
        return <CheckCircle size={20} />;
      case 'removed':
        return <X size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const getClassName = () => {
    const baseClass = 'notification';
    switch (type) {
      case 'added':
        return `${baseClass} success`;
      case 'removed':
        return `${baseClass} removed`;
      default:
        return `${baseClass} success`;
    }
  };

  return (
    <div className={getClassName()}>
      {getIcon()}
      <span className="notification-message">{message}</span>
      <div className="notification-actions">
        {showUndo && onUndo && (
          <button className="notification-undo" onClick={onUndo}>
            <RotateCcw size={16} />
            Undo
          </button>
        )}
        <button className="notification-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;