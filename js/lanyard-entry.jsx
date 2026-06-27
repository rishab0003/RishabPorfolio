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
      position={[0, 0, 13.5]} // Zoomed camera closer to make the card visually bigger
      gravity={[0, -40, 0]} 
      frontImage="./assests/idcard.png" // Load the specific idcard.png from assets
      backImage="./assests/idcard.png" 
      imageFit="cover" 
      lanyardWidth={1.2} 
    />
  );
}
