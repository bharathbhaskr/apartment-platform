import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backendUrlPrefix from '../../utils/backendUrlPrefix.js';
import './Members.css'

function Members(props) {
    const [members, setMembers] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const householdID = props.householdID;

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch household members instead of hardcoded 'users'
            const membersResponse = await axios.get(`${backendUrlPrefix}/households/${householdID}/members`);
            const householdMembers = membersResponse.data;
            setMembers(householdMembers);
          } catch (error) {
            console.error('Error fetching data from the backend:', error);
          }
        };
    
        fetchData();
      }, [householdID]);

      const handleCopyClick = () => {
    const labelElement = document.querySelector('.code');

    if (labelElement) {
      const textToCopy = labelElement.textContent.trim();

      // Using the modern Clipboard API
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log('Text successfully copied to clipboard');
          setShowPopup(true);

          // Hide the popup after a short delay (e.g., 2 seconds)
          setTimeout(() => {
            setShowPopup(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Error copying text to clipboard:', err);
        });
    }
  };
  
      return (
        <div>
          <div>
          <label className='code'>{householdID}  <button onClick={handleCopyClick} style={{ background: 'transparent', border: 'none' }}><i class="cool-btn fa fa-sharp fa-thin fa-copy"></i></button></label>
          {showPopup && <div className="popup alert alert-success">Copied to clipboard</div>}
          
          
          </div>
          <table className='sl-table'>
      <thead className='sl-thead'>
      
        <th>Members</th>
      </thead>
        <tbody>
        {members.map((member) => (
              <tr key={member._id}>
                <td className='sl-td'>{member.username}</td></tr>
            ))}
        </tbody>
        </table>
        </div>
      );
    };


export default Members

