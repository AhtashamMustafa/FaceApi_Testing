import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Home</h2>
      <button onClick={() => navigate('/register')}>Register Face</button>
      <button onClick={() => navigate('/scan')}>Scan Face</button>
    </div>
  );
};

export default Home;
