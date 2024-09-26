import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterFace from './components/RegisterFace';
import ScanFace from './components/ScanFace';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [registeredFace, setRegisteredFace] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<RegisterFace setRegisteredFace={setRegisteredFace} />} />
          <Route path="/scan" element={<ScanFace registeredFace={registeredFace} />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
