/* eslint-disable no-unused-vars */
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { useEffect, useMemo, useRef, useState } from "react";
import "./updatelisting.scss";
import homeaddress from "../../assets/home-address.png";
import axios from "axios";
import { CircleX, Loader, MapIcon } from "lucide-react";
import { useAppStore } from "../../store";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import {
  CREATE_PROPERTY,
  GET_PROPERTY_BY_ID,
  UPDATE_PROPERTY,
} from "../../utils/constants";
import { apiClient } from "../../lib/api-client";

const UpdateListing = () => {
  const { isLoadingMaps, setPropertiesTriggered } = useAppStore();

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const center = useMemo(() => ({ lat: 31.2232, lng: 75.767 }), []);

  const [property, setProperty] = useState({});
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [propertyType, setPropertyType] = useState("privateroom");
  const [listingType, setListingType] = useState("rent");
  const [responsibility, setResponsibility] = useState("owner");
  const [petAllowed, setPetAllowed] = useState(false);
  const [wifiAvailable, setWifiAvailable] = useState(false);
  const [laundryAvailable, setLaundryAvailable] = useState(false);
  const [parking, setParking] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [utilitiesAvailable, setUtilitiesAvailable] = useState(false);
  const [addToMap, setAddToMap] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const getPropertyById = async () => {
      try {
        const response = await apiClient.post(
          GET_PROPERTY_BY_ID,
          { property_id: id },
          { withCredentials: true }
        );
        if (response.data.success) {
          setProperty(response.data.listing);
          const listing = response.data.listing;
          setTitle(listing?.title || "");
          setPrice(listing?.rent || "");
          setDeposit(listing?.deposit || "");
          setAddress(listing?.address || "");
          setDescription(listing?.description || "");
          setCity(listing?.city || "");
          setPropertyType(listing?.property_type || "privateroom");
          setListingType(listing?.listing_type || "rent");
          setResponsibility(listing?.responsibility || "owner");
          setBedrooms(listing?.no_of_rooms || "");
          setBathrooms(listing?.no_of_bathrooms || "");
          setPetAllowed(listing?.pets_allowed || false);
          setWifiAvailable(listing?.wifi || false);
          setParking(listing?.parking || false);
          setPhone(listing?.phone || "");
          setFurnished(listing?.furnished || false);
          setMarkerPosition({
            lat: Number(listing?.latitude) || center.lat,
            lng: Number(listing?.longitude) || center.lng,
          });
          setLatitude(listing?.latitude || "");
          setLongitude(listing?.longitude || "");
          setLaundryAvailable(listing?.laundry || false);
          setUtilitiesAvailable(listing?.utensils_included || false);
          setAddToMap(listing?.maps_included || false);

          // Handle existing images
          if (
            listing?.additional_photos &&
            listing.additional_photos.length > 0
          ) {
            setExistingImages(
              listing.additional_photos.map((image, index) => ({
                id: index,
                url: image,
                isExisting: true,
              }))
            );
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch property details");
      }
    };

    getPropertyById();
  }, [id, center.lat, center.lng]);

  const [markerPosition, setMarkerPosition] = useState({
    lat: 31.2232,
    lng: 75.767,
  });

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry || !place.geometry.location) {
      alert("Please select a valid place.");
      return;
    }

    const newPosition = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setMarkerPosition(newPosition);

    if (mapRef.current) {
      mapRef.current.panTo(newPosition);
      mapRef.current.setZoom(16);
    }
  };

  const handleMarkerDragEnd = (e) => {
    const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(newPosition);
  };

  const handleAddCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setMarkerPosition(newPosition);
          if (mapRef.current) {
            mapRef.current.panTo(newPosition);
            mapRef.current.setZoom(16);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Unable to fetch your location. Please check location permissions."
          );
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handleMapClick = (e) => {
    const clickedPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(clickedPosition);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDeleteImage = (index, isExistingImage = false) => {
    if (existingImages?.length == 0 || images?.length == 0) {
      toast.error("You must have at least one image");
      return;
    }
    if (isExistingImage) {
      const imageToDelete = existingImages[index];
      setImagesToDelete((prev) => [...prev, imageToDelete.url]);
      setExistingImages((prevImages) =>
        prevImages.filter((_, i) => i !== index)
      );
    } else {
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }
  };

  const toggleMapModal = () => {
    setIsMapModalOpen(!isMapModalOpen);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
    formData.append("property_id", id);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("deposit", deposit);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("city", city);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("propertyType", propertyType);
    formData.append("listingType", listingType);
    formData.append("responsibility", responsibility);
    formData.append("pets_allowed", petAllowed);
    formData.append("wifi", wifiAvailable);
    formData.append("laundry", laundryAvailable);
    formData.append("parking", parking);
    formData.append("phone", phone);
    formData.append("furnished", furnished);
    formData.append("utilities_included", utilitiesAvailable);
    formData.append("maps_included", addToMap);

    if (addToMap) {
      formData.append("latitude", markerPosition.lat);
      formData.append("longitude", markerPosition.lng);
    }

    // Add new images
    images.forEach((image) => {
      formData.append("newImages", image.file);
    });

    // Add images to delete
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    try {
      setLoading(true);
      const response = await apiClient.put(UPDATE_PROPERTY, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);

        // Trigger a refresh of the properties data
        setPropertiesTriggered(true);

        setLoading(false);
        navigate("/property");
      } else {
        toast.error(response.data.message || "Update failed");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return property && property?.title ? (
    <div className="add-post">
      <div className="form-container">
        <div className="image-upload-container">
          <label htmlFor="imageInput" className="upload-btn">
            Upload New Images
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* Display existing images */}
        {existingImages.length > 0 && (
          <div className="existing-images">
            <h3>Existing Images</h3>
            <div className="image-preview-container">
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="image-preview">
                  <img src={image.url} alt={`existing-${index}`} />
                  <div
                    className="delete-overlay"
                    onClick={() => handleDeleteImage(index, true)}
                  >
                    Delete
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display new images */}
        {images.length > 0 && (
          <div className="new-images">
            <h3>New Images</h3>
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={`new-${index}`} className="image-preview">
                  <img src={image.preview} alt={`new-${index}`} />
                  <div
                    className="delete-overlay"
                    onClick={() => handleDeleteImage(index)}
                  >
                    Delete
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Deposit"
              min={0}
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number (10 digit only)"
              value={phone}
              maxLength={10}
              pattern="[0-9]{10}"
              onChange={(e) => {
                // Only allow numeric input
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                setPhone(numericValue);
              }}
              required
            />
          </div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          <div className="form-row">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Bedroom Number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Bathroom Number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="privateroom">Private Room</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="sharedroom">Shared Room</option>
            </select>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
            >
              <option value="rent">Rent</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="yes-no-options">
            <div className="option">
              <label>Add Listing on Map:</label>
              <div
                className="select-button"
                onClick={() => setAddToMap(!addToMap)}
              >
                {addToMap ? "Yes" : "No"}
              </div>
            </div>
            {addToMap && (
              <div className="form-row map-coordinates">
                <div className="lat-container">
                  <p>Latitude</p>
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={markerPosition.lat}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>
                <div className="lng-container">
                  <p>Longitude</p>
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={markerPosition.lng}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
                <div className="device-map-btn">
                  <div className="toggle-map-btn">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => toggleMapModal()}
                    >
                      <MapIcon />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="option">
              <label>Pets Allowed:</label>
              <div
                className="select-button"
                onClick={() => setPetAllowed(!petAllowed)}
              >
                {petAllowed ? "Yes" : "No"}
              </div>
            </div>
            <div className="option">
              <label>WiFi Available:</label>
              <div
                className="select-button"
                onClick={() => setWifiAvailable(!wifiAvailable)}
              >
                {wifiAvailable ? "Yes" : "No"}
              </div>
            </div>
            <div className="option">
              <label>Laundry Available:</label>
              <div
                className="select-button"
                onClick={() => setLaundryAvailable(!laundryAvailable)}
              >
                {laundryAvailable ? "Yes" : "No"}
              </div>
            </div>
            <div className="option">
              <label>Parking:</label>
              <div
                className="select-button"
                onClick={() => setParking(!parking)}
              >
                {parking ? "Yes" : "No"}
              </div>
            </div>
            <div className="option">
              <label>Furnished:</label>
              <div
                className="select-button"
                onClick={() => setFurnished(!furnished)}
              >
                {furnished ? "Yes" : "No"}
              </div>
            </div>
            <div className="option">
              <label>Utilities Available:</label>
              <div
                className="select-button"
                onClick={() => setUtilitiesAvailable(!utilitiesAvailable)}
              >
                {utilitiesAvailable ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            {loading ? <Loader /> : "Update Listing"}
          </button>
        </form>
      </div>
      <div className="map-container">
        <div
          className="App"
          style={{ height: "100vh", width: "100%", position: "relative" }}
        >
          {!isLoadingMaps ? (
            <h1>Loading...</h1>
          ) : (
            <div style={{ height: "90%", width: "100%" }}>
              <Autocomplete
                onLoad={(autocomplete) =>
                  (autocompleteRef.current = autocomplete)
                }
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  type="text"
                  placeholder="Search for a place"
                  style={{
                    position: "absolute",
                    top: "60px",
                    left: "10px",
                    zIndex: 1000,
                    width: "300px",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}
                />
              </Autocomplete>
              <GoogleMap
                mapContainerClassName="map-container"
                center={markerPosition}
                zoom={15}
                onLoad={(map) => (mapRef.current = map)}
                onClick={handleMapClick}
              >
                <MarkerF
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  icon={{
                    url: homeaddress,
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                />
              </GoogleMap>
              <button onClick={handleAddCurrentLocation}>
                Add Current location
              </button>
            </div>
          )}
        </div>
      </div>

      {isMapModalOpen && (
        <div className="map-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={toggleMapModal}>
              <CircleX />
            </button>
            <div className="map-container-sm">
              <div
                className="App"
                style={{ height: "100vh", width: "100%", position: "relative" }}
              >
                {!isLoadingMaps ? (
                  <h1>Loading...</h1>
                ) : (
                  <div style={{ height: "90%", width: "100%" }}>
                    <Autocomplete
                      onLoad={(autocomplete) =>
                        (autocompleteRef.current = autocomplete)
                      }
                      onPlaceChanged={handlePlaceSelect}
                    >
                      <input
                        type="text"
                        placeholder="Search for a place"
                        style={{
                          position: "absolute",
                          top: "60px",
                          left: "10px",
                          zIndex: 1000,
                          width: "300px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        }}
                      />
                    </Autocomplete>
                    <GoogleMap
                      mapContainerClassName="map-container-sm"
                      center={markerPosition}
                      zoom={15}
                      onLoad={(map) => (mapRef.current = map)}
                      onClick={handleMapClick}
                      mapContainerStyle={{ height: "100%" }}
                    >
                      <MarkerF
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={handleMarkerDragEnd}
                        icon={{
                          url: homeaddress,
                          scaledSize: new window.google.maps.Size(50, 50),
                        }}
                      />
                    </GoogleMap>
                    <button
                      className="current-loc-btn"
                      onClick={handleAddCurrentLocation}
                    >
                      Add Current location
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <h1>Loading property data...</h1>
  );
};

export default UpdateListing;
