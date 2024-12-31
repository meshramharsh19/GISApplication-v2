import React, { useState } from 'react';
import MapComponent from './MapComponent';
import FileUploader from './FileUploader';
import ErrorBoundary from './ErrorBoundary';

const KML = () => {
  const [kmlData, setKmlData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileUpload = (data, imgUrl) => {
    setKmlData(data);
    setImageUrl(imgUrl);  // Set the image URL if it's available
  };

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h1>KML File Uploader and Map Viewer</h1>
        <FileUploader onFileUpload={handleFileUpload} />
        <div style={{ marginTop: '20px', height: '500px' }}>
          <MapComponent kmlData={kmlData} imageUrl={imageUrl} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default KML;
