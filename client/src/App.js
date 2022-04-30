// Developed by Tyler Koon for EGEN 310R

import "./App.css";
import { SocketContext, socket } from "./context/socket";
import { Box } from "@mui/material";
import { JoystickController } from "./components/dashboard/JoystickController";
import { createUseStyles } from "react-jss";

// Define styles used by the App component
const useStyles = createUseStyles({
  rootContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    margin: 0,
    padding: 0,
    backgroundColor: "#273E47",
  },
});

function App() {
  const classes = useStyles();

  return (
    <SocketContext.Provider value={socket}>
      <Box className={classes.rootContainer}>
        <JoystickController />
      </Box>
    </SocketContext.Provider>
  );
}

export default App;
