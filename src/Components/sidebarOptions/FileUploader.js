import React from 'react';

const FileUploader = ({ onFileUpload }) => {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check for valid KML file extension
    if (!file.name.endsWith('.kml')) {
      alert('Please upload a valid KML file.');
      return;
    }

    const formData = new FormData();
    formData.append('kml', file); // The name 'kml' should match the backend

    try {
      const response = await fetch('http://localhost:5000/api/kml/upload', {  // Correct endpoint
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        alert(`File uploaded successfully with ID: ${result.id}`);
        onFileUpload(result); // Pass the result to the parent if needed
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error processing file. Please check the console for details.');
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
        Upload KML File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".kml"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default FileUploader;
