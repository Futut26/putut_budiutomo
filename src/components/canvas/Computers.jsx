import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import CanvasLoader from '../Loader';

const Computers = ({ isMobile, rotation }) => {
  const computer = useGLTF('./laptop/scene.gltf');
  
  return (
    <mesh>
      <hemisphereLight intensity={4} groundColor="purple" />
      <spotLight position={[-20, 50, 10]} angle={0.1} penumbra={1} intensity={1} castShadow shadow-mapSize={1024} />
      <pointLight intensity={2} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 10 : 15}
        position={isMobile ? [0, -2.5, 0] : [0, -2.5, 0]}
        rotation={[0, rotation, 0]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    setIsMobile(mediaQuery.matches)
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setRotation((rotation) => rotation + 0.01);
    }, 16.67);
    return () => {
      clearInterval(rotateInterval); 
    };
  }, []);

  return (
    <Canvas frameloop="demand" shadows camera={{ position: [20, 3, 5], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
        <Computers isMobile={isMobile} rotation={rotation} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
