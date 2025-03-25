/* eslint-disable react/prop-types */
import "./propertycard.scss";
import house from "../../assets/house1.png";
import {
  Bookmark,
  Share,
  Bed,
  Bath,
  Wifi,
  PawPrint,
  ParkingSquare,
  Sofa,
} from "lucide-react";
import axios from "axios";
import { useAppStore } from "../../store";
import toast from "react-hot-toast";
import { apiClient } from "../../lib/api-client";
import { TOGGLE_STATUS } from "../../utils/constants";
const PropertyCard = ({ place }) => {
  //   return (
  //     <div className="propertycard">
  //       <div className="property-img">
  //         <img src={house} />
  //       </div>
  //       <div className="info-container">
  //         <div className="property-info">
  //           <h2>Property Name</h2>
  //           <p>Location</p>
  //           <p>Price</p>
  //         </div>

  //         <div className="footer-tags">
  //           <div className="tags">
  //             <div className="tag">Bedrooms</div>
  //             <div className="tag">Bathrooms</div>
  //           </div>
  //           <div className="share">
  //             <button>Share</button>
  //             <button>Bookmark</button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  const { savedProperties, setSavedProperties, userInfo } = useAppStore();

  const isSaved = savedProperties?.includes(place._id);

  const images = place.additional_photos;
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

  const toggleSaveProperty = async (e, propertyId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await apiClient.post(
        TOGGLE_STATUS,
        { property_id: propertyId },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSavedProperties((prev) => {
          const updatedState = prev.includes(propertyId)
            ? prev.filter((id) => id !== propertyId)
            : [...prev, propertyId];
          return updatedState;
        });
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error("Error toggling save property:", error);
    }
  };

  return (
    <div className="property-card">
      <div className="image-section">
        <img
          src={images?.[0] || house}
          alt="Apartment"
          className="property-image"
        />
      </div>
      <div className="details-section">
        <div className="details">
          <div className="date">
            <p>{timeAgo(place.createdAt)}</p>
          </div>
          <h2 className="property-title">
            {/* A Great Apartment Next to the Beach! */}

            {place.title}
          </h2>
          <p className="property-location">
            {place.address || "456 Park Avenue, London"}
          </p>
          <p className="property-price">₹ {place.rent}</p>
        </div>
        <div className="container">
          <div className="property-info">
            <span className="info-item">
              <Bed /> {place.no_of_rooms}
              <div className="text"> bedroom</div>
            </span>
            <span className="info-item">
              <Bath />
              {place.no_of_bathrooms}
              <div className="text"> bathroom</div>
            </span>
            {place.wifi ? (
              <span className="info-item">
                <Wifi />
                <div className="text"> Wifi Available</div>
              </span>
            ) : (
              ""
            )}
            {place.pets_allowed ? (
              <span className="info-item">
                <PawPrint />
                <div className="text"> Pets Allowed</div>
              </span>
            ) : (
              ""
            )}
            {place.parking ? (
              <span className="info-item">
                <ParkingSquare />
                <div className="text"> Parking Facility</div>
              </span>
            ) : (
              ""
            )}
            {place.furnished ? (
              <span className="info-item">
                <Sofa />
                <div className="text">Furnished</div>
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="action-icons">
            {userInfo && (
              <button
                className={`icon ${isSaved ? "saved" : ""}`}
                onClick={(e) => toggleSaveProperty(e, place._id)}
              >
                <Bookmark fill={`${isSaved ? "#ffb100" : "none"}`} />
              </button>
            )}
            <button className="icon">
              <Share />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
