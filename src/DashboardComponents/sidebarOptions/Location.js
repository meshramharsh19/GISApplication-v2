import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet'; // Import L from Leaflet
import './Location.css';

const MapPage = () => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [position, setPosition] = useState([21.1498, 79.0806]); // Default location (Nagpur, India)
  const [zoom, setZoom] = useState(16); // Default zoom level

  // Default marker icon
  const defaultIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'), // Default marker icon path
    iconSize: [25, 41], // Set size for the marker
    iconAnchor: [12, 41], // Set anchor position
    popupAnchor: [1, -34], // Position of the popup
  });

  const updateMap = (lat, lng) => {
    setPosition([lat, lng]);
    setZoom(18); // Adjust the zoom level when a new location is provided
  };

  const MapUpdater = ({ position, zoom }) => {
    const map = useMap();
    map.setView(position, zoom); // Update map position and zoom level
    return null;
  };

  const handleGoClick = () => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      updateMap(latitude, longitude);
    } else {
      alert('Please enter valid coordinates.');
    }
  };

  return (
    <div className="map-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
        <button onClick={handleGoClick}>Go</button>
      </div>
      <div className="map-wrapper">
        <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          />
          <Marker position={position} icon={defaultIcon}>
            <Popup>Location: {position[0]}, {position[1]}</Popup>
          </Marker>
          <MapUpdater position={position} zoom={zoom} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
