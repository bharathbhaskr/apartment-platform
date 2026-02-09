import React from 'react';
import { Card, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Features.css';
import homeImage from '../../assets/images/home.jpg';
import shopping from '../../assets/images/image1.jpg';
import chores from '../../assets/images/image2.jpg';
import calendar from '../../assets/images/image3.jpg';
import splitWise from '../../assets/images/image4.jpg';


const Features = () => {
  // Sample data for the CardLayout component
  const cardData = [
    {
      imageUrl: homeImage,
      title: 'Document sharing system',
      description: 'Experience seamless collaboration with our Document Sharing System. Effortlessly share, organize, and access important documents within your living space. Enhance communication and coordination as you securely upload, manage, and retrieve files, ensuring that everyone in your community stays informed and connected. Simplify document workflows, reduce clutter, and foster a more efficient and organized living environment.',

    },
    {
      imageUrl: shopping,
      title: 'Shopping Lists',
      description: 'Keep track of your shopping needs with our Shopping Lists feature. Easily create, manage, and check off items as you shop. Stay organized and ensure you never miss anything on your grocery or shopping trips.',
    },
    {
      imageUrl: chores,
      title: 'Chore Chart',
      description: 'Simplify household responsibilities with our Chore Chart feature. Assign and track chores effortlessly, promoting a collaborative and organized approach to maintaining a clean and tidy living space. Foster teamwork and ensure everyone plays a role in keeping your home in top shape.',
    },
    {
      imageUrl: calendar,
      title: 'Shared Calendars ',
      description: 'Stay organized and connected with our Shared Calendars feature. Coordinate schedules, events, and important dates effortlessly with your housemates. Whether its planning social gatherings, managing appointments, or coordinating activities, our Shared Calendars make it easy for everyone to stay on the same page and enjoy a well-coordinated living experience.',
    },

    // Add more card data as needed
  ];

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
              <Nav.Link as={Link} to="/">
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
        {/* ... (Your existing text) */}
        <Row>
          {cardData.map((card, index) => (
            <Col key={index} className="mb-3">
              <Card style={{ width: '50rem', marginBottom: '50px' }}>

                <Card.Img variant="top" src={card.imageUrl} alt={card.title} />
                <Card.Body>
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

    </div>
  );
};

export default Features;
