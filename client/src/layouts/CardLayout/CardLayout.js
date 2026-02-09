import React from 'react';
import './CardLayout.css';
const CardLayout = ({ title, content }) => (
  <div className='card-layout1'
   
  >
    <div className='card-title1'
     
    >
      <h1>{title}</h1>
    </div>
    <div className='card-content1'
    >
      {content}
    </div>
  </div>
);

export default CardLayout;


