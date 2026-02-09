import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

import './HouseholdSelection.css'

const HouseholdSelection = () => {
  const [action, setAction] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [dashboardRedirect, setDashboardRedirect] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setRedirect(true);
      }
    };

    checkExistingToken();
  }, []);

  const handleConfirm = async () => {
    try {
      console.log(`Action: ${action}, Input Value: ${inputValue}`);

      const response = await AuthService.createOrJoinHousehold(action, inputValue);

      console.log("MAIN PAGE", response);
      if (response) {
        setDashboardRedirect(true);
      }
    } catch (error) {
      console.error('Error creating or joining household:', error);
    }
  };

  const handleButtonClick = (selectedAction) => {
    setAction(selectedAction);
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    handleConfirm();
    setShowInput(false);
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  const redirectToDashboard = () => {
    navigate('/userDashboard');
  };

  return (
    <div className="container mt-5" id='household-container'>
      <h2 className="mb-4 text-center">Household Selection</h2>

      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-success me-2" onClick={() => handleButtonClick('create')}>
          Create New Household
        </button>
        <button className="btn btn-primary" onClick={() => handleButtonClick('join')}>
          Join Existing Household
        </button>
      </div>

      {showInput && (
        <div className="mb-4 text-center">
          <label className="form-label">
            {action === 'create' ? 'Enter Household Name:' : 'Enter Household ID:'}
            <input
              className="form-control mt-2"
              type="text"
              placeholder={action === 'create' ? 'Household Name' : 'Household ID'}
              value={inputValue}
              onChange={handleInputChange}
            />
          </label>

          <button className="btn btn-info mt-3" onClick={handleSave} style={{}}>
            Save
          </button>
        </div>
      )}

      {redirect && redirectToLogin()}
      {dashboardRedirect && redirectToDashboard()}
    </div>
  );
};

export default HouseholdSelection;
