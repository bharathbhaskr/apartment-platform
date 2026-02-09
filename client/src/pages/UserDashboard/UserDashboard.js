import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiCaller from '../../utils/apiCaller';
import AuthService from '../../services/authService';
import ChoreChart from '../../components/ChoreChart/ChoreChart';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import UserNavbar from '../../components/User Navbar/UserNavbar';
import CardLayout from '../../layouts/CardLayout/CardLayout';
import './UserDashboard.css';
import Members from '../../components/Members/Members';
import DocumentList from '../../components/Document/DocumentList';
import FileUpload from '../../components/Document/FileUpload';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleLogout = () => {
    console.log("Handling logout")
    // Clear the token from localStorage
    AuthService.logout();

    // Set redirect to true to navigate to the login page
    setRedirect(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        //console.log('Token' ,token);
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          };
          console.log(headers)
          const response = await apiCaller.get('/api/userData', { headers });
          console.log('response data file ', response.data.user.household);

          setUserData(response.data.user);

        } else {
          // Token is not available, setRedirect to true
          setRedirect(true);
        }
      } catch (error) {
        // Handle errors
        console.error(error);

        // Check if the error is due to an invalid/expired token
        if (error.response && error.response.status === 401) {
          // Clear the invalid token and redirect to login
          AuthService.logout();
          setRedirect(true);
        }
      }
    };

    fetchUserData();
  }, []);

  // Redirect to login page if redirect state is true
  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='body'>

      {userData && (

        <div>
          <div class="header">
            <h2 id='topNav'>{userData.username}'s Dashboard</h2>
            <UserNavbar user={userData} handleLogout={handleLogout} />
          </div>

          <div className='details'>
            <h3>WELCOME, {userData.username}!</h3>
          </div>
          <div className="row">
            
            <div className="col-md-6">
              <CardLayout title={'Chore Chart'} content={<ChoreChart householdID={userData.household} />} />
            </div>
            <div className="col-md-6">
              <CardLayout title={'Shopping List'} content={<ShoppingList householdID={userData.household} />} />
              </div>
            </div>
            <div className='row'>
            <div className="col-md-3">
              <CardLayout title={'Household'} content={<Members householdID={userData.household} />} />
            </div>

           
            <div className="col-md-5">
              <CardLayout title={'Documents'} content={<DocumentList householdID={userData.household} />} />
            </div>

            <div className="col-md-4">
              <CardLayout title={'Calendar'} content={
               <div className="text-center">
               <h2>Feature coming soon!</h2>
             </div>
              } />
            </div>
            
            </div>
          </div>



          
       
      )}
    </div>
  );
};

export default UserDashboard;
