import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = 'Search items...', value, onChange, onSearch }) => {
  const handleKeyUp = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyUp={handleKeyUp}
        />
      </div>
    </div>
  );
};

export default SearchBar;