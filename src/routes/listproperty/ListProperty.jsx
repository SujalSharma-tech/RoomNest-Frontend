/* eslint-disable no-unused-vars */
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { useMemo, useRef, useState } from "react";
import "./listproperty.scss";
import homeaddress from "../../assets/home-address.png";
import axios from "axios";
import { Loader } from "lucide-react";
import { useAppStore } from "../../store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { CREATE_PRODUCT_ROUTE } from "../../utils/constants";
import { apiClient } from "../../lib/api-client";
// import placedata from "./placedata.json";
// const libraries = ["places"];
const ListProperty = () => {
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: "AIzaSyBdPDiqHlsiyUGU9jTvCTMaRx08Pl0fKMw",
  //   libraries,
  // });
  const { isLoadingMaps } = useAppStore();

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const center = useMemo(() => ({ lat: 31.2232, lng: 75.767 }), []);

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
    console.log("Place Selected:", newPosition);
  };

  const handleMarkerDragEnd = (e) => {
    const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(newPosition);
    console.log(newPosition);
  };
  const handleAddCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setMarkerPosition(newPosition);
          console.log("Current Location:", { lat: latitude, lng: longitude });

          if (mapRef.current) {
            mapRef.current.panTo(newPosition);
            mapRef.current.setZoom(16);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to fetch your location. Please check location permissions."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleMapClick = (e) => {
    const clickedPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(clickedPosition);
  };

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
  const [images, setImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();
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
    formData.append("petAllowed", petAllowed);
    formData.append("wifiAvailable", wifiAvailable);
    formData.append("laundryAvailable", laundryAvailable);
    formData.append("parking", parking);
    formData.append("furnished", furnished);
    formData.append("utilitiesAvailable", utilitiesAvailable);
    formData.append("addToMap", addToMap);

    if (addToMap) {
      formData.append("latitude", markerPosition.lat);
      formData.append("longitude", markerPosition.lng);
    }

    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image.file);
    });
    console.log("FormData Content:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    try {
      setLoading(true);
      const response = await apiClient.post(CREATE_PROPERTY, formData, {
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        navigate("/property");
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="add-post">
      <div className="form-container">
        <div className="image-upload-container">
          <label htmlFor="imageInput" className="upload-btn">
            Upload Images
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
        <div className="image-preview-container">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img src={image.preview} alt={`preview-${index}`} />
              <div
                className="delete-overlay"
                onClick={() => handleDeleteImage(index)}
              >
                Delete
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Deposit"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="form-row">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Bedroom Number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
            <input
              type="number"
              placeholder="Bathroom Number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
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
            {loading ? <Loader /> : "Submit"}
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
                center={center}
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
    </div>
  );
};

export default ListProperty;
