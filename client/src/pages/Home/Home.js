import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Carousel } from 'react-bootstrap';
import './Home.css'; 
import homeImage from '../../assets/images/home.jpg';
import shopping from '../../assets/images/image1.jpg';
import chores from '../../assets/images/image2.jpg';
import calendar from '../../assets/images/image3.jpg';
import splitWise from '../../assets/images/image4.jpg';

const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" id="mynav">
        <Navbar.Brand className="px-5 col-sm-12 col-md-6" as={Link} to="/">
          Apartment Amigo
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {/* <Nav.Item className="nav-item px-1">
              <Nav.Link as={Link} to="#">
                Discover
              </Nav.Link>
            </Nav.Item> */}
            <Nav.Item className="nav-item px-1">
              <Nav.Link as={Link} to="/features">
                Features
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="nav-item px-1">
              <Nav.Link as={Link} to="/about">
                About
              </Nav.Link>
            </Nav.Item>
           
          </Nav>
          <Link to="/login" className="btn btn-light px-4" id="loginButton">
            Login
          </Link>
        </Navbar.Collapse>
      </Navbar>

      {/* Main Section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 text-center custom-text">
            <p>
              Want your apartment to feel like home? <br />
              Want to live in harmony with your roommates? <br />
              Become an Amigo today, <br />
              <em>
                with <strong>Apartment Amigo</strong>
              </em>
            </p>
          </div>

          <div className="col-md-12 mt-3">
            {/* Bootstrap Carousel */}
            <Carousel>
              <Carousel.Item>
                <img
                  src={homeImage}
                  className="d-block w-100"
                  alt="Home"
                />
                <Carousel.Caption>
                  <h5>Welcome to Apartment Amigo!</h5>
                  <p>Your one-stop shop for managing your household</p>
                </Carousel.Caption>
              </Carousel.Item>

              {/* Additional Carousel Items */}
              <Carousel.Item>
                <img
                  src={chores}
                  className="d-block w-100"
                  alt="Image 2"
                />
                <Carousel.Caption>
                  <h5>Chore Charts</h5>
                  <p>Remind your roommates about chores</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  src={calendar}
                  className="d-block w-100"
                  alt="Image 3"
                />
                <Carousel.Caption>
                  <h5>Shared Calendars</h5>
                  <p>Share your class schedules and plans with your roommates</p>
                </Carousel.Caption>
              </Carousel.Item>

              <Carousel.Item>
                <img
                  src={splitWise}
                  className="d-block w-100"
                  alt="Image 4"
                />
                <Carousel.Caption>
                  <h5>Splitwise Integration</h5>
                  <p>Manage Budgets easily with Splitwise</p>
                </Carousel.Caption>
              </Carousel.Item>


              <Carousel.Item>
                <img
                  src={shopping}
                  className="d-block w-100"
                  alt="Image 5"
                />
                <Carousel.Caption>
                  <h5>Shopping Lists</h5>
                  <p>Share shopping lists with all your roommates</p>
                </Carousel.Caption>
              </Carousel.Item>
              {/* End of Additional Carousel Items */}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
