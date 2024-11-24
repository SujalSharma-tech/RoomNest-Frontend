/* eslint-disable react/prop-types */
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useMemo, useState } from "react";
import "./simplemap.scss";
import home from "../../assets/home.png";

import { useAppStore } from "../../store";
const SimpleMap = ({ properties }) => {
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const center = useMemo(() => ({ lat: 31.2232, lng: 75.767 }), []);
  const handleMarkerClick = (id, lat, lng, address) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  const { isLoadingMaps } = useAppStore();
  // console.log({ lat: properties[0].latitude, lng: properties[0].longitude });

  return properties ? (
    <div className="App">
      {!isLoadingMaps ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={
            properties.length === 1
              ? {
                  lat: Number(properties[0].latitude),
                  lng: Number(properties[0].longitude),
                }
              : center
          }
          zoom={properties.length === 1 ? 15 : 13}
          onClick={() => setIsOpen(false)}
        >
          {properties &&
            properties.map((place, index) => {
              const image =
                place?.additional_photos &&
                JSON.parse(place?.additional_photos);
              return (
                <MarkerF
                  key={index}
                  position={{
                    lat: Number(place.latitude),
                    lng: Number(place.longitude),
                  }}
                  icon={{
                    url: home,
                    scaledSize: new window.google.maps.Size(25, 25),
                  }}
                  onClick={() => {
                    handleMarkerClick(
                      index,
                      place.latitude,
                      place.longitude,
                      place.address
                    );
                  }}
                >
                  {isOpen && infoWindowData?.id === index && (
                    <InfoWindowF
                      onCloseClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <div className="marker-popup-box">
                        <div className="place-img-marker">
                          <img src={image?.[0]} alt="house" />
                        </div>
                        <div className="info-box-marker">
                          <h2>{place.title}</h2>
                          <p>{place.address}</p>
                          <a
                            href={`https://www.google.com/maps?q=${place.latitude},${place.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                            }}
                          >
                            Open in Google Maps
                          </a>
                        </div>
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              );
            })}
        </GoogleMap>
      )}
    </div>
  ) : (
    <h1>Loading...</h1>
  );
};

export default SimpleMap;
