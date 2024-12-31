import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
// const files = zip.files;

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
      <div
        style={{
          width: sidebarVisible ? '280px' : '0', // Sidebar width toggles based on visibility
          padding: '10px 20px',
          background: '#f4f4f4',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'width 0.3s', // Smooth transition for sliding effect
        }}
      >
        {/* Top Section: File Upload Fields */}
        <div style={{ marginBottom: '10px' }}>
          <h2 style={{ marginBottom: '10px' }}>File Uploads</h2>
          {Object.keys(layers).map((layerName) => (
            <div key={layerName} style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Upload for: <strong>{layerName}</strong>
              </label>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, layerName)}
                accept=".kmz"
                style={{ marginBottom: '5px' }}
              />
            </div>
          ))}
        </div>

        {/* Bottom Section: Layer Toggle Controls */}
        <div>
          <h2 style={{ marginBottom: '10px' }}>Toggle Layers</h2>
          {Object.keys(layers).map((layerName) => (
            <div key={layerName} style={{ marginBottom: '5px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={layers[layerName].isActive}
                  onChange={() => toggleLayer(layerName)}
                  style={{ marginRight: '10px' }}
                />
                {layerName}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer center={[20.5937, 77.9629]} zoom={5} style={{ height: '100vh', flex: 1 }}>
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
      <div
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '50%',
          padding: '10px',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ width: '20px', height: '3px', backgroundColor: '#333', margin: '4px 0' }}></div>
        <div style={{ width: '20px', height: '3px', backgroundColor: '#333', margin: '4px 0' }}></div>
        <div style={{ width: '20px', height: '3px', backgroundColor: '#333', margin: '4px 0' }}></div>
      </div>
    </div>
  );
};

export default Map;
