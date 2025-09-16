const FilterPills = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="filter-section">
      <div className="filter-pills">
        {filters.map((filter) => (
          <div
            key={filter}
            className={`filter-pill ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterPills;