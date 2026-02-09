import React, { useState, useEffect } from 'react';
import './ChoreChart.css'; // Import the CSS file
import axios from 'axios';
import backendUrlPrefix from '../../utils/backendUrlPrefix.js';

const ChoreChart = (props) => {
  const [chores, setChores] = useState([]);
  const [newChore, setNewChore] = useState('');
  const [editingChore, setEditingChore] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);

  const householdID = props.householdID;
  //const householdID = '656dffd6e3baf8051351da1a'; // HARDCODED FOR NOW -- UPDATE DYNAMICALLY LATER
  const backendApiUrl = `${backendUrlPrefix}/households/${householdID}/chores`; // Replace 'your_household_id'

  console.log(backendApiUrl);

  // ...

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch household members instead of hardcoded 'users'
        const membersResponse = await axios.get(`${backendUrlPrefix}/households/${householdID}/members`);
        const householdMembers = membersResponse.data;

        const choresResponse = await axios.get(backendApiUrl);
        setChores(choresResponse.data);

        // Set household members to be used in the dropdown
        setMembers(householdMembers);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, [backendApiUrl, householdID]);

  // ...


  const addChore = () => {
    if (newChore.trim() === '') return;

    const newChoreObject = {
      choreName: newChore,
      assignee: null,
    };

    axios.post(backendApiUrl, newChoreObject)
      .then(response => {
        setChores([...chores, response.data]);
      })
      .catch(error => {
        console.error('Error adding chore to the backend:', error);
      });

    setNewChore('');
  };

  const deleteChore = (choreId) => {
    axios.delete(`${backendApiUrl}/${choreId}`)
      .then(() => {
        setChores(chores.filter((chore) => chore._id !== choreId));
      })
      .catch(error => {
        console.error('Error deleting chore from the backend:', error);
      });

    setEditingChore(null);
  };

  const toggleChoreStatus = (choreId) => {
    axios.patch(`${backendApiUrl}/${choreId}`, { completed: !chores.find(chore => chore._id === choreId).completed })
      .then(response => {
        const updatedList = chores.map((chore) =>
          chore._id === choreId ? response.data : chore
        );
        setChores(updatedList);
      })
      .catch(error => {
        console.error('Error toggling chore status in the backend:', error);
      });

    setEditingChore(null);
  };

  const startEditingChore = (chore) => {
    const assigneeId = chore.assignee ? chore.assignee : ''; // Use the _id of the assignee or an empty string

    setEditingChore({
      ...chore,
      assignee: assigneeId,
    });
    setIsModalOpen(true);
  };


  const finishEditingChore = () => {
    const updatedChoreData = {
      choreName: editingChore.choreName,
      // Send assignee as an object containing the _id
      assignee: editingChore.assignee ? editingChore.assignee : null,
    };

    axios.put(`${backendApiUrl}/${editingChore._id}`, updatedChoreData)
      .then(response => {
        const updatedList = chores.map((chore) =>
          chore._id === editingChore._id ? response.data : chore
        );
        setChores(updatedList);
      })
      .catch(error => {
        console.error('Error updating chore in the backend:', error);
      });

    setEditingChore(null);
    setIsModalOpen(false);
  };



  const handleModalClose = () => {
    setEditingChore(null);
    setIsModalOpen(false);
  };

  return (
    <div className="chore-chart">
      <div className="add-chore">
        <div className="input-container">
          <input
            type="text"
            placeholder="Add a new chore"
            value={newChore}
            onChange={(e) => setNewChore(e.target.value)}
          />
          <button className="add-button" onClick={addChore}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <table className='cc-table'>
      <thead className='cc-thead'>
        <th>Actions</th>
        <th>Chore Name</th>
        <th>Assignee</th>
        <th>Status</th>
      </thead>
        <tbody>
          {chores.map((chore) => (
            <tr key={chore._id} className={chore.completed ? 'completed' : ''}>
              <td className='cc-td'> 
                <div>
                  <button onClick={() => startEditingChore(chore)} disabled={chore.completed} className='my-btn edit-btn'>
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => deleteChore(chore._id)} className='my-btn'>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
              <td className='cc-td'>
                {editingChore && editingChore._id === chore._id ? (
                  <div className="modal1">
                   
                    <input
                      type="text"
                      value={editingChore.choreName}
                      onChange={(e) => setEditingChore({ ...editingChore, choreName: e.target.value })}
                    />

                  </div>
                ) : (
                  <span>{chore.choreName}</span>
                )}
              </td>
              <td className='cc-td'> 
                {editingChore && editingChore._id === chore._id ? (
                  <div>
                    <select defaultValue={editingChore.assignee ? editingChore.assignee : ''}
                      onChange={(e) => {
                        const selectedMemberId = e.target.value;
                        const selectedMember = members.find((member) => member._id === selectedMemberId);

                        setEditingChore({
                          ...editingChore,
                          assignee: selectedMember,
                        });
                      }}
                    >
                      <option value="" disabled>Select Assignee</option>
                      {/* <option value="debugger">Debugger</option> */}
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.username}
                        </option>
                      ))}
                    </select>
                    <button onClick={finishEditingChore}>
                      <i className="fas fa-check"></i>
                    </button>
                    <button onClick={handleModalClose}>
                      <i className="fas fa-times"></i>
                    </button>

                  </div>
                ) : (
                  <span>
                    {chore.assignee && members.some((member) => member._id === chore.assignee)? (
                      members.find((member) => member._id === chore.assignee).username
                    ) : (
                      'UnAssigned'
                    )}
                    
                  </span>
                )}
              </td>
              <td className='cc-td'>
                <button onClick={() => toggleChoreStatus(chore._id)}>
                  {chore.completed ? 'Undo' : 'Done'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {editingChore && (
        <div>
          <button onClick={finishEditingChore}>
            <i className="fas fa-check"></i> Save
          </button>
          <button onClick={handleModalClose}>
            <i className="fas fa-times"></i> Cancel
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ChoreChart;

