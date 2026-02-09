// client/src/components/DocumentList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import backendUrlPrefix from '../../utils/backendUrlPrefix';
import FileUpload from './FileUpload';
import './document.css';

const DocumentList = (props) => {
  const [documents, setDocuments] = useState([]);
  const [householdID, setHouseholdID] = useState(props.householdID);

  const backendApiUrl = `${backendUrlPrefix}/uploads/${householdID}/`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendApiUrl);
        setDocuments(response.data);
        console.log(response)
      } catch (error) {
        console.error('Error fetching documents from the backend:', error);
      }
    };

    fetchData();
  }, [backendApiUrl]);

  const handleDownload = (fileName, filePath) => {
    const downloadUrl = `${backendUrlPrefix}/uploads/${householdID}/${fileName}`;

    // Create a link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = fileName;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const refreshDocumentList = async () => {
    try {
      const response = await axios.get(backendApiUrl);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error refreshing document list:', error);
    }
  };

  const handleFileUpload = (selectedFile) => {
    // Access the lastModified property from the selectedFile
    const lastModified = selectedFile.lastModified;
    console.log('Last Modified Date from FileUpload:', lastModified);

    // Implement any additional logic with the lastModified value as needed
  };

  
  const formatDocumentDate = (lastModified) => {
    // Assuming lastModified is a Unix timestamp
    const formattedDate = new Date(lastModified).toLocaleDateString();
    return formattedDate;
  };
  
  return (
    <div>
     <FileUpload
        householdID={householdID}
        refreshDocumentList={refreshDocumentList}
        onFileUpload={handleFileUpload}
      />
      <table className='sl-table'>
        <thead className='sl-thead'>
          <tr>
            <th>Document Name</th>
            {/* <th>Created On</th> */}
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document._id}>
              <td className='dl-td'>{document.fileName.split('-')[0]}</td>
              {/* <td>{formatDocumentDate(document.lastModified)}</td> */}
              <td className='dl-td'>
                <button onClick={() => handleDownload(document.fileName, document.filePath)}>
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default DocumentList;
