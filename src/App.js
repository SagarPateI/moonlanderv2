import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import useKeyControls from "./useKeyControls";
import ErrorBoundary from "./ErrorBoundary";

const MOON_LANDER_MASS = 15200; // Mass of NASA moon lander in kg

export default function App() {
  const { forward, backward, left, right, shift, camera } = useKeyControls();

  return (
    <ErrorBoundary>
      <Canvas
        camera={{ position: [0, 3, 5], fov: 75 }}
        shadows
        onKeyDown={() => {}}
        onKeyUp={() => {}}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[10, 20, 5]}
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Physics>
          <CameraFollow
            forward={forward}
            backward={backward}
            left={left}
            right={right}
            shift={shift}
            camera={camera} // Pass the camera to the CameraFollow component
          >
            <Box position={[0, 1, 0]} castShadow receiveShadow />
            <Floor position={[0, -0.5, 0]} receiveShadow />
          </CameraFollow>
        </Physics>
      </Canvas>
    </ErrorBoundary>
  );
}

function CameraFollow({ children, forward, backward, left, right, shift }) {
  const group = useRef();
  const boxRef = useRef();

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp" || event.key === "w") {
      forward.set(true);
    } else if (event.key === "ArrowDown" || event.key === "s") {
      backward.set(true);
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      left.set(true);
    } else if (event.key === "ArrowRight" || event.key === "d") {
      right.set(true);
    } else if (event.key === "Shift") {
      shift.set(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "ArrowUp" || event.key === "w") {
      forward.set(false);
    } else if (event.key === "ArrowDown" || event.key === "s") {
      backward.set(false);
    } else if (event.key === "ArrowLeft" || event.key === "a") {
      left.set(false);
    } else if (event.key === "ArrowRight" || event.key === "d") {
      right.set(false);
    } else if (event.key === "Shift") {
      shift.set(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Clean up the event listeners on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [forward, backward, left, right, shift]);

  useFrame(({ camera }) => {
    if (boxRef.current && group.current) {
      let speed = 0.1;
      if (shift.value) speed = 0.2;

      // Update cube's rotation based on tilt
      boxRef.current.rotation.z =
        (right.value ? -1 : left.value ? 1 : 0) * Math.PI * 0.1;

      // Update cube's position based on thrust and tilt
      boxRef.current.position.y +=
        (forward.value ? 1 : backward.value ? -1 : 0) * speed;
      boxRef.current.position.x +=
        (left.value ? 1 : right.value ? -1 : 0) * speed;

      // Camera follows the cube with a little offset
      group.current.position.copy(boxRef.current.position);
      camera.position.lerp(
        {
          x: boxRef.current.position.x,
          y: boxRef.current.position.y + 5,
          z: boxRef.current.position.z + 10
        },
        0.1
      );
    }
  });

  return <group ref={group}>{children}</group>;
}

function Box(props) {
  const [boxRef, api] = useBox(() => ({
    mass: MOON_LANDER_MASS, // Set the mass of the cube
    position: props.position,
    args: [1, 1, 1]
  }));

  return (
    <mesh ref={boxRef}>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Floor(props) {
  const [floorRef] = usePlane(() => ({
    type: "Static",
    position: [0, -1.5, 0],
    rotation: [-Math.PI / 2, 0, 0]
  }));

  return (
    <mesh ref={floorRef}>
      <planeGeometry args={[100, 100, 64, 64]} />
      <meshStandardMaterial color="#999999" />{" "}
      {/* Set the floor color to gray */}
    </mesh>
  );
}
