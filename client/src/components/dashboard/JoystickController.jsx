// Developed by Tyler Koon for EGEN 310R

import { Box } from "@mui/material";
import { JoystickWrapper } from "./JoystickWrapper";
import { StreamController } from "./StreamController";
import { createUseStyles } from "react-jss";

// Define styles used by the JoysticController component
const useStyles = createUseStyles({
  controllerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
  },
});

/**
 * Implement the JoystickWrapper and StreamController components
 */
export const JoystickController = () => {
  const classes = useStyles();

  return (
    <Box className={classes.controllerContainer}>
      <JoystickWrapper
        motor={"motor1"}
        stepper={"stepper1"}
        idUpper={"left"}
        idLower={"right"}
      />
      <StreamController />
      <JoystickWrapper
        motor={"motor2"}
        stepper={"stepper2"}
        idUpper={"up"}
        idLower={"down"}
      />
    </Box>
  );
};
