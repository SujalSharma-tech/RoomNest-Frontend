import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard from "../../components/propertycard/PropertyCard";
import { Link } from "react-router-dom";

import "./savedlistings.scss";
import { apiClient } from "../../lib/api-client";
import { GET_ALL_SAVED_PROP } from "../../utils/constants";
const SavedListings = () => {
  const [savedListings, setSavedListings] = useState([]);

  useEffect(() => {
    const fetchsaved = async () => {
      try {
        const response = await apiClient.get(GET_ALL_SAVED_PROP, {
          withCredentials: true,
        });

        if (response.data) {
          setSavedListings(response.data.listings);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchsaved();
  }, []);
  return (
    <div className="savedlistings">
      <h1>Saved Listings</h1>
      <div className="listing-container">
        {savedListings && savedListings.length > 0 ? (
          savedListings.map((listing, index) => {
            return (
              <Link to={`/propertydetails/${listing._id}`} key={index}>
                <PropertyCard place={listing} />
              </Link>
            );
          })
        ) : (
          <h2>No Listing Saved!</h2>
        )}
      </div>
    </div>
  );
};

export default SavedListings;
