import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Features from '../pages/Features/Features';
import About from '../pages/About/About';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import UserDashboard from '../pages/UserDashboard/UserDashboard';
import HouseholdSelection from '../pages/HouseholdSelection/HouseholdSelection';
import UserProfile from '../pages/UserProfile/UserProfile';
import Admin from '../pages/Admin/Admin';
import AdminLogin from '../pages/AdminLogin/AdminLogin';

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userDashboard" element={<UserDashboard />} />
        <Route path="/householdSelection" element={<HouseholdSelection/>}/>
        <Route path='/profile' element={<UserProfile/>}/>
        <Route path='/adminLogin' element={<AdminLogin/>}/>
        <Route path='/admin' element={<Admin/>}/>
        {/* Additional routes can go here */}
      </Routes>
    </Router>
  );
};

export default Routing;
