import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={{ margin: "20px auto", textAlign: "center" }}>
      <input
        type="text"
        placeholder="Search by title, topic, or language..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "600px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default SearchBar;