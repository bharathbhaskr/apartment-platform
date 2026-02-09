import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import image from "../../assets/images/img-avatar.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import apiCaller from "../../utils/apiCaller";
import AuthService from "../../services/authService";

const UserProfile = (props) => {
  const [userData, setUserData] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [household, setHousehold] = useState("");
  const [editMode, setEditMode] = useState(false); // Track edit mode for username and email
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          };

          const response = await apiCaller.get("/api/userData", { headers });
          setUserData(response.data.user);
        } else {
          setRedirect(true);
        }
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 401) {
          AuthService.logout();
          setRedirect(true);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchHouseholdData = async () => {
      try {
        const householdID = userData.household;

        const response = await apiCaller.get(`/households/${householdID}`);

        setHousehold(response.data);
      } catch (error) {
        console.error(error);

        if (error.response && error.response.status === 401) {
          AuthService.logout();
          setRedirect(true);
        }
      }
    };

    fetchHouseholdData();
  }, [userData]);

  const navigate = useNavigate();

  const handleEdit = () => {
    setEditMode(true);
    setEditedUsername(userData.username);
    setEditedEmail(userData.email);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Update the user data on the server
        const response = await apiCaller.put(
          `/api/userData/${userData._id}`,
          {
            username: editedUsername,
            email: editedEmail,
          },
          { headers }
        );

        console.log("RESPONSE ", response);

        if (response.status === 200) {
          // Update the local user data
          setUserData({
            ...userData,
            username: editedUsername,
            email: editedEmail,
          });

          setEditMode(false);
        } else {
          // Handle other status codes
          if (response.status === 400) {
            // Handle bad request (validation error)
            console.error("Bad Request:", response.data.message);
            // Show a message to the user
            alert("Update failed. Please provide valid details.");
          } else {
            // Handle other status codes as needed
            console.error("Update failed with status:", response.status);
          }
        }
      } else {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const navigateToDashboard = () => {
    navigate("/userDashboard");
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (

    <>
      <div className="cardUser">
        <div className="card-body-user">
          <img src={image} className="card-img-top-user" alt="User Avatar" />
          <h1 className="card-titleUser">
            <b>
              {editMode ? (
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  placeholder="Type your new username"
                  style={{ color: 'black' }}
                />
              ) : (
                userData.username
              )}
            </b>
          </h1>
          <p className="card-text-user-user">
            Your Email:{" "}
            {editMode ? (
              <input
                type="text"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="Type your new email"
              />
            ) : (
              userData.email
            )}
          </p>
          <p className="card-text-user">
            You belong to the <b>{household.name}</b> household
          </p>

          {editMode ? (
            <>
              <button
                onClick={handleSave}
                disabled={
                  editedUsername === userData.username &&
                  editedEmail === userData.email
                }
                className="btn-user btn-primary-user"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn-user btn-secondary-user ml-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className="btn-user btn-primary-user">
              Edit
            </button>
          )}

          <button onClick={navigateToDashboard} className="btn-user btn-info-user ml-2">
            Dashboard
          </button>

          <p className="card-text-user">Want to change household?</p>
          <Link to="/householdSelection" className="btn-user btn-link-user">
            Click Here
          </Link>
        </div>
      </div>
    </>



  );
};

export default UserProfile;
