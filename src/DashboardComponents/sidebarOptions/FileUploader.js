import React from 'react';
import axios from 'axios';

const FileUploader = ({ onFileUpload }) => {
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            if (file.name.endsWith('.kml')) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const fileData = e.target.result;
                    console.log("KML File Data:", fileData);

                    // Send file to backend
                    await axios.post('http://localhost:5000/api/files/upload', {
                        name: file.name,
                        data: fileData,
                    });
                    alert('File uploaded successfully.');
                    onFileUpload(fileData);
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

    const triggerFileInput = () => {
        document.getElementById('file-upload').click();
    };

    return (
        <div>
            <button
    style={{
      cursor: 'pointer',
      padding: '10px 20px',
      backgroundColor: 'rgb(21, 93, 103)',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease, transform 0.2s ease'
    }}
    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(18, 78, 89)'}
    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(21, 93, 103)'}
    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
  >
    Upload KML File
  </button>
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
