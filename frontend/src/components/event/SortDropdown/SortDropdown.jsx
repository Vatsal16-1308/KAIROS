import "./SortDropdown.css";

function SortDropdown({ sortBy, setSortBy }) {
  return (
    <div className="sort-dropdown">

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>

    </div>
  );
}

export default SortDropdown;