import { Link } from "react-router-dom";
import { useAppStore } from "../../store";
import "./mylistings.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiClient } from "../../lib/api-client";
import { CHANGE_STATUS, GET_USER_PROPERTIES } from "../../utils/constants";
const MyListings = () => {
  const [listings, setListings] = useState({});
  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {
    const fetchUserListings = async () => {
      if (userInfo) {
        try {
          const response = await apiClient.get(GET_USER_PROPERTIES, {
            withCredentials: true,
          });
          setListings(response.data || []);
        } catch (err) {
          console.error("Error fetching user listings:", err);
        }
      }
    };

    fetchUserListings();
  }, [userInfo, setUserInfo]);

  const handleStatusChange = async (id, updatedListings) => {
    const status = updatedListings.filter((listing) => listing.id == id);

    try {
      const data = await apiClient.post(
        CHANGE_STATUS,
        { id: id, status: status[0].is_active },
        { withCredentials: true }
      );
      if (data.data.success) {
        // console.log("added");
        // toast.success("Added to Saved!");
      }
    } catch (err) {
      console.error("Error changing status:", err);
    }
  };

  const toggleListingStatus = (e, id) => {
    e.preventDefault();

    setListings((prevListings) => {
      // Update the local state
      const updatedListings = prevListings.map((listing) =>
        listing.id === id
          ? { ...listing, is_active: listing.is_active === 1 ? 0 : 1 }
          : listing
      );

      // You can log here if you want to check the updated state
      console.log(updatedListings);
      handleStatusChange(id, updatedListings);
      return updatedListings;
    });
  };

  const handleDeleteListing = async (id) => {
    try {
      const data = await post(
        "http://localhost/roomnestserver/index.php/api/v1/listing/deletelisting",
        { id: id },
        { withCredentials: true }
      );
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteListing = (e, id) => {
    e.preventDefault();
    setListings((prevListings) =>
      prevListings.filter((listing) => listing.id !== id)
    );
    handleDeleteListing(id);
  };

  const editListing = (id) => {
    alert(`Edit feature for Listing ID: ${id} coming soon!`);
  };
  function timeAgo(dateString) {
    const now = new Date();

    const formattedDateString = dateString.replace(" ", "T");

    const date = new Date(formattedDateString);

    const diffInSeconds = Math.floor((now - date) / 1000);
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const count = Math.floor(diffInSeconds / interval.seconds);

      if (count > 0) {
        return `Posted ${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Posted just now";
  }

  return (
    <div className="listing-page">
      <h1>Manage Listings</h1>
      <div className="listings-container">
        {listings && listings.length > 0 ? (
          listings.map((listing) => (
            <Link key={listing.id} to={"/propertydetails/" + listing.id}>
              <div className="listing-card">
                {
                  <img
                    src={JSON.parse(listing.additional_photos)[0]}
                    alt={listing.title}
                    className="listing-image"
                  />
                }
                <div className="listing-info">
                  <p>{timeAgo(listing.created_at)}</p>
                  <h2>{listing.title}</h2>
                  <p>{listing.address}</p>
                  <p>₹ {listing.rent.toLocaleString()}</p>
                </div>
                <div className="listing-actions">
                  <button
                    className={`toggle-status ${
                      listing.is_active ? "active" : "inactive"
                    }`}
                    onClick={(e) => toggleListingStatus(e, listing.id)}
                  >
                    {listing.is_active ? "Active" : "Disabled"}
                  </button>
                  <button
                    className="edit-listing"
                    onClick={() => editListing(listing.id)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-listing"
                    onClick={(e) => deleteListing(e, listing.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h1>No Listing</h1>
        )}
      </div>
    </div>
  );
};

export default MyListings;
