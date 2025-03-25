// import { MapComponent } from "../../components/mapcomponent/MapComponent";
import axios from "axios";
import SimpleMap from "../../components/mapcomponent/SimpleMap";
import PropertyCard from "../../components/propertycard/PropertyCard";
import "./property.scss";
import { useEffect, useState } from "react";
import { useAppStore } from "../../store";
import { Link } from "react-router-dom";
import { GET_FILTERED_LISTINGS } from "../../utils/constants";
import { apiClient } from "../../lib/api-client";
import { CircleX, MapIcon } from "lucide-react";
const Property = () => {
  const queryParams = new URLSearchParams(location.search);
  // const [data, setData] = useState([]);
  const { properties, setProperties } = useAppStore();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "any",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    // const queryParams = new URLSearchParams(location.search);
    filters.location = queryParams.get("location") || "";
    filters.minPrice = queryParams.get("minPrice") || "";
    filters.maxPrice = queryParams.get("maxPrice") || "";

    const fetchFilteredProperties = async () => {
      try {
        // setLoading(true);
        const response = await apiClient.post(
          GET_FILTERED_LISTINGS,
          {
            location: filters.location || queryParams.get("location") || "",
            propertyType: filters.propertyType || "any",
            bedrooms: filters.bedrooms || "",
            minPrice: filters.minPrice || queryParams.get("minPrice") || "",
            maxPrice: filters.maxPrice || queryParams.get("maxPrice") || "",
          },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data.success) {
          setFilteredProperties(response.data.properties);
        } else {
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching filtered properties:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, []);
  const fetchFilteredProperties = async () => {
    try {
      // setLoading(true);
      const response = await apiClient.post(
        GET_FILTERED_LISTINGS,
        {
          location: filters.location || "",
          propertyType: filters.propertyType || "any",
          bedrooms: filters.bedrooms || "",
          minPrice: filters.minPrice || "",
          maxPrice: filters.maxPrice || "",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        setFilteredProperties(response.data.properties);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching filtered properties:", error);
    } finally {
      // setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredProperties();
  };
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const toggleMapModal = () => {
    setIsMapModalOpen(!isMapModalOpen);
  };

  return (
    <div className="property">
      <div className="left">
        <div className="filter-section">
          <h2>
            Search results for{" "}
            {filters.location || queryParams.get("location") || "Phagwara"}
          </h2>
          <form className="filter-container" onSubmit={handleSubmit}>
            <div className="input-section">
              <div className="location">
                <p>Location</p>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="filter-types">
                <div className="property-type">
                  <div className="type">
                    <p>Property</p>
                    <select
                      name="propertyType"
                      value={filters.propertyType}
                      onChange={handleInputChange}
                    >
                      <option value="any">Any</option>
                      <option value="house">House</option>
                      <option value="apartment">Private Room</option>
                      <option value="apartment">Apartment</option>
                      <option value="shared">Shared</option>
                    </select>
                  </div>
                  <div className="bedrooms">
                    <p>Bedrooms</p>
                    <input
                      type="number"
                      name="bedrooms"
                      value={filters.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="price">
                    <div className="minprice">
                      <p>Min Price</p>
                      <input
                        type="number"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="maxprice">
                      <p>Max Price</p>
                      <input
                        type="number"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="search">
                    <button type="submit">Search</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="device-map-btn">
          <div className="toggle-map-btn">
            <button className="btn" onClick={toggleMapModal}>
              <MapIcon />
            </button>
          </div>
        </div>

        <div className="property-list">
          {filteredProperties?.length > 0 ? (
            filteredProperties.map((place, index) => {
              return (
                <Link key={index} to={`/propertydetails/${place._id}`}>
                  <PropertyCard place={place} />
                </Link>
              );
            })
          ) : (
            <h1>No Listing Found!</h1>
          )}
        </div>
      </div>
      <div className="right">
        <SimpleMap properties={properties} />
      </div>
      {isMapModalOpen && (
        <div className="map-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={toggleMapModal}>
              <CircleX />
            </button>
            <SimpleMap properties={properties} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Property;
