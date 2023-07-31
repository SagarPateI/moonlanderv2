import React, { useRef, useEffect } from "react"; // Import useEffect from React
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import useKeyControls from "./useKeyControls";
import ErrorBoundary from "./ErrorBoundary"; // Import the ErrorBoundary component

export default function App() {
  const { forward, backward, left, right, shift } = useKeyControls();

  return (
    <ErrorBoundary>
      {" "}
      {/* Wrap the entire application with ErrorBoundary */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        onKeyDown={() => {}}
        onKeyUp={() => {}}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Physics>
          <CameraFollow
            forward={forward}
            backward={backward}
            left={left}
            right={right}
            shift={shift}
          >
            <Box position={[0, 1, 0]} />
            <Floor position={[0, -0.5, 0]} />
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
      if (shift) speed = 0.2;

      // Update cube's rotation based on tilt
      boxRef.current.rotation.z = (right ? -1 : left ? 1 : 0) * Math.PI * 0.1;

      // Update cube's position based on thrust and tilt
      boxRef.current.position.y += (forward ? 1 : backward ? -1 : 0) * speed;
      boxRef.current.position.x += (left ? 1 : right ? -1 : 0) * speed;

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
  const [boxRef] = useBox(() => ({
    mass: 1,
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
    position: props.position,
    rotation: [-Math.PI / 2, 0, 0]
  }));

  return (
    <mesh ref={floorRef}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="lightgray" />
    </mesh>
  );
}
