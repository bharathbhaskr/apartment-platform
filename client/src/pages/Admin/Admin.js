import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../../services/authService";
import apiCaller from "../../utils/apiCaller";

const Admin = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalHouseholds, setTotalHouseholds] = useState(0);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [householdMembers, setHouseholdMembers] = useState([]);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  //const [selectedMemberUsername, setSelectedMemberUsername] = useState("");

  // Function to fetch household members based on the selected id
  const fetchHouseholdMembers = async () => {
    try {
      const members = await apiCaller.get(
        `/households/${selectedHouseholdId}/members`
      );

      if (!members) {
        console.log("Members not found");
      }
      setHouseholdMembers(members.data);
      console.log("The received members are", members.data);
    } catch (error) {
      console.error("Error fetching household members:", error);
    }
  };

  // Function to remove a member from a household
  const removeMemberFromHousehold = async (memberId, memberUsername) => {
    try {
      const response = await apiCaller.delete(
        `households/${selectedHouseholdId}/${memberUsername}/delete`
      );
      setSelectedHouseholdId(response.data);

      //Updating table
      fetchHouseholdMembers();
      console.log(
        "Received selected household after deletion",
        selectedHouseholdId
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    // Simulate logout by removing the fake token
    localStorage.removeItem("token");
    // Set the state to trigger the redirect
    setRedirectToLogin(true);
  };

  useEffect(() => {
    const checkExistingToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If the token is not present, redirect to the admin login page
        setRedirectToLogin(true);
      }
    };

    const fetchTotalUsersAndHouseholds = async () => {
      try {
        const users = await AuthService.getTotalUsers();

        setTotalUsers(users);

        console.log("Front end", users);

        const households = await AuthService.getTotalHouseholds();

        setTotalHouseholds(households);
      } catch (error) {
        console.error("Error fetching total users and households:", error);
      }
    };

    checkExistingToken();
    fetchTotalUsersAndHouseholds();
  }, []);

  // Use the Navigate component directly instead of returning it from the render function
  if (redirectToLogin) {
    return <Navigate to="/adminLogin" />;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Page</h2>

      <div className="mb-3">
        <p>Total Number of Users: {totalUsers}</p>
        <p>Total Number of Households: {totalHouseholds}</p>
      </div>

      <div className="mb-3">
        <h3>Select Household by ID</h3>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchHouseholdMembers}>
            Select Household
          </button>
        </div>
      </div>

      {selectedHouseholdId && (
        <div>
          <h3>Household Members</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Member Name</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {householdMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.username}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeMemberFromHousehold(member.id, member.username)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Admin;
