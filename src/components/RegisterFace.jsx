import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { useNavigate } from "react-router-dom";
import users from "../users"; // Import the users array

const RegisterFace = () => {
  const [name, setName] = useState("");
  const videoRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      // Load all necessary models before starting the video stream
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      startVideo();
    };
  
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => (videoRef.current.srcObject = stream))
        .catch(err => console.error("Error accessing camera:", err));
    };
  
    loadModels();  // Ensure this function runs on component mount
  }, []);
  

  const handleCapture = async () => {
    if (!faceapi.nets.ssdMobilenetv1.isLoaded || 
        !faceapi.nets.faceRecognitionNet.isLoaded || 
        !faceapi.nets.faceLandmark68Net.isLoaded) {
      console.error("Models not loaded");
      return;
    }
    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      console.log(
        "Registered face descriptor length:",
        detections.descriptor.length
      );
      const newUser = {
        id: users.length + 1,
        name: name,
        faceDescriptor: detections.descriptor,
      };
      users.push(newUser); // Add the new user to the users array

      console.log("New user registered:", newUser); // Log for debugging
      navigate("/home"); // Redirect back to home
    }
  };

  return (
    <div>
      <h2>Register Face</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <button onClick={handleCapture}>Capture Face</button>
    </div>
  );
};

export default RegisterFace;
