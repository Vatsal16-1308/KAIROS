import "./FilterSidebar.css";

const categories = [
  "Hackathon",
  "Workshop",
  "Music",
  "Sports",
];

function FilterSidebar({ selectedCategory, setSelectedCategory }) {
  return (
    <aside className="filter-sidebar">

      <h3>Categories</h3>

      <label>
        <input
          type="radio"
          name="category"
          value="All"
          checked={selectedCategory === "All"}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
        All
      </label>

      {categories.map((category) => (
        <label key={category}>

          <input
            type="radio"
            name="category"
            value={category}
            checked={selectedCategory === category}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />

          {category}

        </label>
      ))}

    </aside>
  );
}

export default FilterSidebar;