// client/src/components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import backendUrlPrefix from '../../utils/backendUrlPrefix';
import './document.css';

const FileUpload = (props) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // Add state for file name
  
  const [householdID, setHouseholdID] = useState(props.householdID);
  const { onFileUpload, refreshDocumentList } = props;

  const backendApiUrl = `${backendUrlPrefix}/uploads/${householdID}`;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Call the callback function with the selected file
    if (onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

//   const handleFileNameChange = (e) => {
//     setFileName(e.target.value);
//   };

  const handleUpload = async () => {
    if (!file ) return;

    const formData = new FormData();
    formData.append('file', file);
    //formData.append('fileName', fileName); // Append the file name
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log('form obj:',formDataObject)

    try {
      await axios.post(backendApiUrl, formData);
      console.log('File uploaded successfully');
      if (refreshDocumentList) {
        refreshDocumentList();
      }
      setFile(null);
    setFileName('');
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className='file-upload'>
    {file ? (
      <>
        <span>{file.name}</span>
        <button onClick={handleUpload}>Upload</button>
      </>
    ) : (
      <input type="file" onChange={handleFileChange} />
    )}
  </div>
  );
};

export default FileUpload;
