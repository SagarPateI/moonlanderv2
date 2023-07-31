import { useEffect, useState } from "react";

export default function useKeyControls() {
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false
  });

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "ArrowUp" || event.key === "w") {
        setControls((prevControls) => ({ ...prevControls, forward: true }));
      } else if (event.key === "ArrowDown" || event.key === "s") {
        setControls((prevControls) => ({ ...prevControls, backward: true }));
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        setControls((prevControls) => ({ ...prevControls, left: true }));
      } else if (event.key === "ArrowRight" || event.key === "d") {
        setControls((prevControls) => ({ ...prevControls, right: true }));
      } else if (event.key === "Shift") {
        setControls((prevControls) => ({ ...prevControls, shift: true }));
      }
    };

    const keyUpHandler = (event) => {
      if (event.key === "ArrowUp" || event.key === "w") {
        setControls((prevControls) => ({ ...prevControls, forward: false }));
      } else if (event.key === "ArrowDown" || event.key === "s") {
        setControls((prevControls) => ({ ...prevControls, backward: false }));
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        setControls((prevControls) => ({ ...prevControls, left: false }));
      } else if (event.key === "ArrowRight" || event.key === "d") {
        setControls((prevControls) => ({ ...prevControls, right: false }));
      } else if (event.key === "Shift") {
        setControls((prevControls) => ({ ...prevControls, shift: false }));
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    // Clean up the event listeners on unmount
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  return { ...controls };
}
