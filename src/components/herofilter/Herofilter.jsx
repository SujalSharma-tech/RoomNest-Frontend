import { useState } from "react";
import "./herofilter.scss"; // Import CSS file for styling
import { useNavigate } from "react-router-dom";
const Herofilter = () => {
  const [activeTab, setActiveTab] = useState("Rent");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigateTo = useNavigate();
  const handleSearch = (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams({
      location,
      minPrice,
      maxPrice,
    }).toString();

    // Redirect to the property page with the query parameters
    navigateTo(`/property?${queryParams}`);
  };

  return (
    <div className="filter-box">
      <div className="tabs">
        {/* <span
          className={`tab ${activeTab === "Buy" ? "active" : ""}`}
          onClick={() => setActiveTab("Buy")}
        >
          Buy
        </span> */}
        <span
          className={`tab ${activeTab === "Rent" ? "active" : ""}`}
          onClick={() => setActiveTab("Rent")}
        >
          Rent
        </span>
      </div>

      <div className="filters">
        {/* <div className="filter">
          <label>Location</label>
          <select>
            <option>Bogor, Jawa Barat</option>
            <option>Jakarta, DKI Jakarta</option>
            <option>Bali</option>
           
          </select>
        </div> */}
        <div className="filter">
          <label>Location</label>
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="filter">
          <label>Min Price</label>

          <input
            type="number"
            placeholder="Min Price"
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="filter">
          <label>Max Price</label>

          <input
            type="number"
            placeholder="Max Price"
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default Herofilter;
