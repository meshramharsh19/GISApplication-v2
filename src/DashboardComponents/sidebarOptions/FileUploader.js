import React from 'react';

const FileUploader = ({ onFileUpload }) => {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            if (file.name.endsWith('.kml')) { // Ensure only KML files are processed
                const reader = new FileReader();
                reader.onload = (e) => {
                    console.log("KML File Data:", e.target.result);
                    onFileUpload(e.target.result); // Send the KML data to parent component
                };
                reader.readAsText(file);
            } else {
                alert('Please upload a valid KML file.');
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
