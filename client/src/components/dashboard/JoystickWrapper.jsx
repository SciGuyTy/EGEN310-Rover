// Developed by Tyler Koon for EGEN 310R

import { useCallback, useContext } from "react";
import { Joystick } from "react-joystick-component";
import { SocketContext } from "../../context/socket";
import { Box, Button } from "@mui/material";
import { createUseStyles } from "react-jss";
import { useRef } from "react";

// Define styles used by the JoysticWrapper component
const useStyles = createUseStyles({
  btnContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    maxHeight: 400,
  },
  btn: {
    width: 150,
    height: "100%",
  },
});

/**
 * Implements the 'Joystick' library and buttons for controlling the arm assembly
 * @param {string} motor The ID of the DC motor to control with the joystick
 * @param {string} stepper The ID of the stepper motor to control with the buttons
 * @param {string} idUpper The ID of the lower button component
 * @param {string} idLower The ID of the upper button component
 * @returns
 */
export const JoystickWrapper = ({ motor, stepper, idUpper, idLower }) => {
  const classes = useStyles();

  // Setup web socket for communicating
  const socket = useContext(SocketContext);

  // Define a reference for keeping track of how long a button is being pressed
  const interval = useRef(null);

  /**
   * Function that sends a motor command to the webserver using sockets
   * @param {Event} event The joystic manipulation event
   */
  const handleMove = useCallback((event) => {
    // Emit socket event on 'motor_command' channel with motorID and throttle
    socket.emit("motor_command", {
      motor: motor,
      throttle: event.y / 100,
    });
  });

  /**
   * Function that sends a motor halt command to the webserver using sockets
   */
  const handleStop = useCallback(() => {
    // Emit socket event on 'motor_command' channel with motorID and 'none' for throttle
    socket.emit("motor_command", {
      motor: motor,
      throttle: "None",
    });
  });

  /**
   * Function that sends a motor command to actuate stepper motors
   * @param {string} dir The string representing step direction
   */
  const handleActuate = useCallback((dir) => {
    // Emit socket event on 'motor_command' channel with stepperID and step direction
    socket.emit("motor_command", {
      motor: stepper,
      direction: dir,
    });
  });

  /**
   * Function that starts an interval when a button is pressed
   * @param {Event} event The click event
   */
  const handlePress = (event) => {
    // Get button ID
    const dir = event.target.id;

    if (!interval.current) {
      // Set the interval and timeout for 100ms
      interval.current = setInterval(() => {
        // Actuate the stepper with the correct direction corresponding to the button pressed
        handleActuate(dir == idUpper ? "FORWARD" : "BACKWARD");
      }, 100);
    }
  };

  /**
   * Function that ends an interval when a button is released
   */
  const handleRelease = () => {
    if (interval.current) {
      // Clear the interval
      clearInterval(interval.current);
      interval.current = null;
    }
  };

  /**
   * Function for actuating a stepper (for quick taps)
   * @param {Event} event The click event
   */
  const handleClick = (event) => {
    const dir = event.target.id;

    handleActuate(dir == idUpper ? "FORWARD" : "BACKWARD");
  };

  return (
    <Box className={classes.btnContainer}>
      <Button
        id={idUpper}
        className={classes.btn}
        onClick={handleClick}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
      >
        {idUpper}
      </Button>
      <Joystick
        size={100}
        sticky={false}
        throttle={5}
        baseColor="#023047CC"
        stickColor="#fb8500EE"
        move={handleMove}
        stop={handleStop}
      />
      <Button
        id={idLower}
        className={classes.btn}
        onClick={handleClick}
        onTouchStart={handlePress}
        onTouchEnd={handleRelease}
      >
        {idLower}
      </Button>
    </Box>
  );
};
