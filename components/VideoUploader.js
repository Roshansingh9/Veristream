//components/VideoUploader.js

"use client"
import React, { useState } from 'react';

const VideoUploader = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        } else {
            alert('Please select a file first.');
        }
    };

    return (
        <div>
            <h2>Upload Your Video</h2>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default VideoUploader;