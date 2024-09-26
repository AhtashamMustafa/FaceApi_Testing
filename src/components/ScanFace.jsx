import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import users from '../users'; // Import the registered users

const ScanFace = () => {
  const videoRef = useRef();

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
    // Ensure that models are fully loaded before trying to detect faces
    
  };
  

  const handleScan = async () => {
    const detections = await faceapi.detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      // Loop through all registered users and compare their face descriptors
      console.log("Scanned face descriptor length:", detections.descriptor.length);
      let matchedUser = null;
      users.forEach(user => {
        if (detections.descriptor.length === user.faceDescriptor.length) {
          const distance = faceapi.euclideanDistance(detections.descriptor, user.faceDescriptor);
          if (distance < 0.5) {
            matchedUser = user;
          }
        } else {
          console.error("Descriptor lengths do not match");
        }
      });

      if (matchedUser) {
        toast.success(`Access Granted for ${matchedUser.name}`);
      } else {
        toast.error('Unregistered');
      }
    } else {
      toast.error('No face detected');
    }
  };

  return (
    <div>
      <h2>Scan Face</h2>
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <button onClick={handleScan}>Scan Face</button>
      <button onClick={() => window.history.back()}>Back</button>
    </div>
  );
};

export default ScanFace;
