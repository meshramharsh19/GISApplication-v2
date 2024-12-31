import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
// import L from "leaflet";
import "leaflet/dist/leaflet.css";
import omnivore from "leaflet-omnivore"; // Import leaflet-omnivore for handling KML files

// KML Layer to parse and display KML on the map
const KmlLayer = ({ kmlData }) => {
  const map = useMap();

  useEffect(() => {
    if (kmlData) {
      try {
        // Parse KML data using omnivore.kml
        const kmlLayer = omnivore.kml.parse(kmlData);

        // Check if the KML layer is valid
        if (kmlLayer) {
          kmlLayer.addTo(map); // Add the layer to the map
          map.fitBounds(kmlLayer.getBounds()); // Fit map to the KML layer bounds
        } else {
          console.warn("Invalid KML data.");
          map.setView([20.5937, 78.9629], 5); // Default to India
          alert("The KML file does not contain valid data.");
        }
      } catch (error) {
        console.error("Error loading KML Layer:", error);
        alert("Error processing KML file.");
      }
    }
  }, [kmlData, map]);

  return null;
};

// Map component with KML layer rendering
const MapComponent = ({ kmlData, imageUrl }) => {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Default coordinates
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {kmlData && <KmlLayer kmlData={kmlData} />}
    </MapContainer>
  );
};

export default MapComponent;
