# Developed by Tyler Koon for EGEN 310R

import time

# Dependencies controlling the motors
from adafruit_motorkit import MotorKit
from adafruit_motor import stepper

# Dependencies for capturing and manipulating camera feed
import cv2

# Define objects that represent motor bonnets
kit1 = MotorKit()
# Specify different I2C address for the second motor bonnet (sperate communication channels)
kit2 = MotorKit(address=0x61)

# Camera class used to fetch data from the camera
class Camera:
    # Constructor
    # Required 'index' argument repesents the index of the camera device (as is defined in the OS)
    def __init__(self, index):
        self.index = index

    # Stream method
    # Returns a string containing header information (including an encoded version of the current frame)
    def stream(self):
        # Attempt to capture frame from camera
        capture = cv2.VideoCapture(self.index)

        # Infinite loop that reads in the captured frame, encodes it, and then returns the data as a HTML header
        while True:
            # Read in frame
            ret, frame = capture.read()
            # If the frame is not empty
            if ret:
                # Encode the frame
                ret, buffer = cv2.imencode(".jpg", cv2.rotate(frame, cv2.ROTATE_180))
                frame = buffer.tobytes()

                # Return the frame as a string with correct headings for HTML response
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            else:
                # Break the looop if the captured frame is empty (or there is an error capturing the frame)
                break

# Motor class
class Motor:
    # Constructor
    # Required 'id' argument represents the motor channel as defined on the motor bonnet
    def __init__(self, id):
        self.id = id

# DCMotor class (extends Motor class)
class DCMotor(Motor):
    # Constructor
    # Required 'throttleMin' argument represents the minimum throttle for the motor
    # Required 'throttleMax' argument represents the maximum throttle for the motor
    def __init__(self, throttleMin=-0.75, throttleMax=0.75):
        self.THROTTLE_MIN = throttleMin
        self.THROTTLE_MAX = throttleMax

    # setThrottle method
    # Sets the throttle of the motor to the provided throttle value
    def setThrottle(self, throttle):
        # Bound the inputted throttle to be within the min/max bounds
        if(throttle == "None"):
            throttle = None
        elif(throttle > self.THROTTLE_MAX):
            throttle = self.THROTTLE_MAX
        elif(throttle < self.THROTTLE_MIN):
            throttle = self.THROTTLE_MIN

        if(self.id == "motor1"):
            # Set the throttle for motor 1
            kit1.motor1.throttle = throttle
        else:
            # Set the throttle for motor 2
            kit1.motor2.throttle = throttle

        # Sleep for one ten-thousandth of a second (to ensure the motor bonnet has time to process the command)
        time.sleep(0.0001)
        # Print the command to the console (for logging/debugging purposes)
        print(self.id, throttle)

# StepperMotor class (extends Motor class)
class StepperMotor(Motor):
    # step method
    # Steps the motor by one step in the specified direction
    def step(self, direction):
        if(self.id == "stepper1"):
            if(direction.upper() == "FORWARD"):
                # Step the stepper1 motor in the forwards direction
                kit2.stepper1.onestep(direction=stepper.FORWARD)
        elif(direction.upper() == "BACKWARD"):
                # Step the stepper1 motor in the backwards direction
                kit2.stepper1.onestep(direction=stepper.BACKWARD)
        elif(self.id == "stepper2"):
            if(direction.upper() == "FORWARD"):
                # Step the stepper2 motor in the forwards direction
                kit2.stepper2.onestep(direction=stepper.FORWARD)
            elif(direction.upper() == "BACKWARD"):
                # Step the stepper2 motor in the backwards direction
                kit2.stepper2.onestep(direction=stepper.BACKWARD)

        # Sleep for one ten-thousandth of a second (to ensure the motor bonnet has time to process the command)
        time.sleep(0.0001)
        # Print the command to the console (for logging/debugging purposes)
        print(self.id, "One step: " + direction)