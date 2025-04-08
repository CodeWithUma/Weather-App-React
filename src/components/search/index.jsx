export default function Search({ search, setSearch, handleSearch }) {
  return (
    <div className="search-engine">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter City Name..."
          name="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>
    </div>
  );
}
