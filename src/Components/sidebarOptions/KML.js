import React, { useState } from 'react';
import MapComponent from './MapComponent';
import FileUploader from './FileUploader';
import ErrorBoundary from './ErrorBoundary';

const KML = () => {
  const [kmlData, setKmlData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileUpload = async (data, imgUrl) => {
    setIsLoading(true);
    setErrorMessage(null); // Reset previous error message

    try {
      // Check if valid KML data and image URL are provided
      if (!data || !imgUrl) {
        throw new Error('Invalid KML file or image URL.');
      }

      setKmlData(data);
      setImageUrl(imgUrl);  // Set the image URL if available
    } catch (error) {
      setErrorMessage(error.message || 'Error processing the uploaded file.');
    } finally {
      setIsLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px' }}>
        <h1>KML File Uploader and Map Viewer</h1>

        <FileUploader onFileUpload={handleFileUpload} />

        {isLoading && <p>Loading...</p>} {/* Display loading state */}
        
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Show error message */}

        <div style={{ marginTop: '20px', height: '500px' }}>
          {kmlData && imageUrl ? (
            <MapComponent kmlData={kmlData} imageUrl={imageUrl} />
          ) : (
            <p>No KML file loaded. Please upload a valid KML file to display the map.</p>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default KML;
