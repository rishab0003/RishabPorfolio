import React from 'react';
import { createRoot } from 'react-dom/client';
import Grainient from './Grainient.jsx';

const mounts = document.querySelectorAll('.grainient-bg-mount');
mounts.forEach(mount => {
  const root = createRoot(mount);
  const color1 = mount.getAttribute('data-color1') || '#FF9FFC';
  const color2 = mount.getAttribute('data-color2') || '#5227FF';
  const color3 = mount.getAttribute('data-color3') || '#B497CF';
  const timeSpeed = parseFloat(mount.getAttribute('data-time-speed') || '0.15');
  const grainAmount = parseFloat(mount.getAttribute('data-grain-amount') || '0.04');

  root.render(
    <Grainient
      color1={color1}
      color2={color2}
      color3={color3}
      timeSpeed={timeSpeed}
      grainAmount={grainAmount}
      warpStrength={0.5}
      warpFrequency={4.0}
      noiseScale={1.5}
      contrast={1.0}
      zoom={1.0}
    />
  );
});
