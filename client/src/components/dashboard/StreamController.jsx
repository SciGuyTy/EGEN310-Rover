// Developed by Tyler Koon for EGEN 310R

import { createUseStyles } from "react-jss";

// Define styles used by the StreamController component
const useStyles = createUseStyles({
  streamContainer: {
    minWidth: 500,
    minHeight: "100vh",
  },
  stream: {
    height: "100vh",
  },
});

/**
 * Display a container that, when clicked, streams video feed from the camera
 */
export const StreamController = () => {
  const classes = useStyles();

  /**
   * Function that changes the visibility of the image container
   */
  const handleTouch = () => {
    // Get a refgerence to the container element
    const element = document.getElementById("stream");

    // Toggle the visiblity of the container
    if (element.style.visibility == "hidden") {
      element.style.visibility = "visible";
    } else {
      element.style.visibility = "hidden";
    }
  };

  return (
    <div onClick={handleTouch} className={classes.streamContainer}>
      <img
        id="stream"
        className={classes.stream}
        src="http://192.168.5.1:5000/video_stream"
      />
    </div>
  );
};
