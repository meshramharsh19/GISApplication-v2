import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './KMZ.css';
import JSZip from 'jszip';

// Component to handle KML rendering for each layer
const KmlMap = ({ kmlContent, imageUrl, isActive }) => {
  const map = useMap();

  useEffect(() => {
    let overlay = null;

    if (isActive && kmlContent) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kmlContent, 'application/xml');

      const coordinatesNode = xmlDoc.getElementsByTagName('gx:LatLonQuad')[0];
      if (coordinatesNode) {
        const coordinatesText = coordinatesNode.getElementsByTagName('coordinates')[0].textContent;
        const coordinates = coordinatesText.trim().split('\n').map(coord => {
          const [lon, lat] = coord.split(',').map(Number);
          return [lat, lon];
        });

        if (coordinates.length >= 4) {
          const bounds = new L.LatLngBounds(coordinates);
          map.fitBounds(bounds);
          overlay = L.imageOverlay(imageUrl, bounds).addTo(map);
        }
      }
    }

    return () => {
      if (overlay) map.removeLayer(overlay);
    };
  }, [kmlContent, imageUrl, isActive, map]);

  return null;
};

const Map = () => {
  const [layers, setLayers] = useState({
    Orthophotos: { kmlContent: null, imageUrl: null, isActive: false },
    DTM: { kmlContent: null, imageUrl: null, isActive: false },
    DSM: { kmlContent: null, imageUrl: null, isActive: false },
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const handleFileUpload = (e, layerName) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.kmz')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const kmzData = event.target.result;
        try {
          const zip = await JSZip.loadAsync(kmzData);

          const targetFilePath = "0/0/0.kml";
          const kmlFile = zip.file(targetFilePath);

          if (!kmlFile) {
            console.error(`No KML file found at path: ${targetFilePath}`);
            return;
          }

          const kmlText = await kmlFile.async('text');
          const imageFile = zip.file("0/0/0.png");
          const imageBlob = imageFile ? await imageFile.async('blob') : null;

          setLayers(prev => ({
            ...prev,
            [layerName]: {
              kmlContent: kmlText,
              imageUrl: imageBlob ? URL.createObjectURL(imageBlob) : null,
              isActive: true,
            },
          }));
        } catch (error) {
          console.error('Error processing KMZ file:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid KMZ file.');
    }
  };

  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: {
        ...prev[layerName],
        isActive: !prev[layerName].isActive,
      },
    }));
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for Layer Controls and File Upload */}
      <div className={sidebarVisible ? 'sidebar' : 'sidebar hidden'}>
        {/* Top Section: File Upload Fields */}
        <div className="file-upload">
          <h2>File Uploads</h2>
          {Object.keys(layers).map((layerName) => (
            <div key={layerName}>
              <label>
                Upload for: <strong>{layerName}</strong>
              </label>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, layerName)}
                accept=".kmz"
              />
            </div>
          ))}
        </div>

        {/* Bottom Section: Layer Toggle Controls */}
        <div>
          <h2>Toggle Layers</h2>
          {Object.keys(layers).map((layerName) => (
            <div key={layerName} className="layer-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={layers[layerName].isActive}
                  onChange={() => toggleLayer(layerName)}
                />
                {layerName}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer center={[20.5937, 77.9629]} zoom={5} style={{ flex: 1 }}>
        {/* Satellite TileLayer */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
        />
        {Object.entries(layers).map(([layerName, { kmlContent, imageUrl, isActive }]) => (
          <KmlMap key={layerName} kmlContent={kmlContent} imageUrl={imageUrl} isActive={isActive} />
        ))}
      </MapContainer>

      {/* Hamburger Icon to Toggle Sidebar */}
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Map;
