import React from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './Lanyard.jsx';

const container = document.getElementById('lanyard-container');
if (container) {
  // Clear fallback loader/image and initialize React root
  container.innerHTML = '';
  const root = createRoot(container);
  root.render(
    <Lanyard 
      position={[0, 0, 20]} 
      gravity={[0, -40, 0]} 
      frontImage="./images/hero-image.png" 
      backImage="./images/hero-image.png" 
      imageFit="cover" 
      lanyardWidth={1.2} 
    />
  );
}
