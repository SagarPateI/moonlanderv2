import { useEffect, useRef } from "react";

const ASCENT_THRUST = 0.01;
const LATERAL_THRUST = 0.005;
const GRAVITY = 0.0005;

export default function useKeyControls() {
  const camera = useRef(null);
  const forward = useRef(false);
  const backward = useRef(false);
  const left = useRef(false);
  const right = useRef(false);
  const shift = useRef(false);
  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" || event.key === "w") {
        forward.current = true;
      } else if (event.key === "ArrowDown" || event.key === "s") {
        backward.current = true;
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        left.current = true;
      } else if (event.key === "ArrowRight" || event.key === "d") {
        right.current = true;
      } else if (event.key === "Shift") {
        shift.current = true;
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "ArrowUp" || event.key === "w") {
        forward.current = false;
      } else if (event.key === "ArrowDown" || event.key === "s") {
        backward.current = false;
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        left.current = false;
      } else if (event.key === "ArrowRight" || event.key === "d") {
        right.current = false;
      } else if (event.key === "Shift") {
        shift.current = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    // Clean up the event listeners on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const speed = shift.current ? 0.2 : 0.1;
    const acceleration = [0, 0, 0];

    if (camera.current) {
      // Calculate vertical ascent thrust
      if (forward.current) {
        acceleration[1] += ASCENT_THRUST;
      }

      // Calculate vertical descent due to gravity
      acceleration[1] -= GRAVITY;

      // Calculate lateral thrust
      if (left.current) {
        acceleration[0] += LATERAL_THRUST;
      } else if (right.current) {
        acceleration[0] -= LATERAL_THRUST;
      }

      // Update velocity based on acceleration
      velocity.current[0] += acceleration[0];
      velocity.current[1] += acceleration[1];
      velocity.current[2] += acceleration[2];

      // Update position based on velocity
      camera.position.x += velocity.current[0] * speed;
      camera.position.y += velocity.current[1] * speed;
      camera.position.z += velocity.current[2] * speed;
    }
  }, [forward, backward, left, right, shift, camera]);

  return { forward, backward, left, right, shift, camera: camera.current };
}
