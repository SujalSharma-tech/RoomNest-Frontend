/* eslint-disable react/prop-types */
import axios from "axios";
import { useAppStore } from "../../store";
import "./itemcard.scss";
import { Bookmark, Share } from "lucide-react";
import toast from "react-hot-toast";
import { apiClient } from "../../lib/api-client";
import { TOGGLE_STATUS } from "../../utils/constants";

const Itemcard = ({ property }) => {
  const { savedProperties, setSavedProperties, userInfo } = useAppStore();
  if(savedProperties && savedProperties.length>0){
  const isSaved = savedProperties?.includes(property.id);
  }
  const image = JSON.parse(property?.additional_photos)?.[0];
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
    <div className="f-listing">
      <div className="item-image">
        {/* <img src={CLODUINARY_LINK + product?.images[0].url || crown} /> */}
        <img src={image} />
      </div>
      <div className="listing-title-box">
        <p className="listing-title">
          {property?.title || "iphone 12 pro max"}
        </p>
      </div>
      <div className="item-category">
        location: {property?.address || "Electronics"}
      </div>
      <div className="listing-footer">
        <p className="item-price">₹ {property?.rent || "45000"}</p>

        <div className="listing-social">
          {userInfo && (
            <button
              className={`icon ${isSaved ? "saved" : ""}`}
              onClick={(e) => toggleSaveProperty(e, property.id)}
            >
              <Bookmark fill={`${isSaved ? "#ffb100" : "none"}`} />
            </button>
          )}
          <Share />
        </div>
      </div>
    </div>
  );
};

export default Itemcard;
