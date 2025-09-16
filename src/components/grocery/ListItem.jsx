import { Check } from 'lucide-react';

const ListItem = ({ item, onToggleCheck }) => {
  return (
    <div
      className={`list-item ${item.checked ? 'checked' : ''}`}
      onClick={onToggleCheck}
    >
      <div className={`checkbox ${item.checked ? 'checked' : ''}`}>
        {item.checked && <Check size={13} />}
      </div>
      <div className="item-content">
        <div className="item-name">{item.name}</div>
        <div className="item-meta">
          <span>{item.quantity}</span>
          {item.addedBy && (
            <>
              <span>•</span>
              <span>Added by {item.addedBy}</span>
            </>
          )}
          {item.meta && (
            <>
              <span>•</span>
              <span>{item.meta}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListItem;