# Developed by Tyler Koon for EGEN 310R

# Dependencies for hardware control
from controllers.hardwareController import Motor, Stepper, Camera

# Dependencies for the flask webserver 
from flask import Flask, send_from_directory, request, Response
from flask_socketio import SocketIO

# Instantiate the DC motors
M1 = Motor("motor1")
M2 = Motor("motor2")

# Instantiate the stepper motors
S1 = Stepper("stepper1")
S2 = Stepper("stepper2")

# Instantiate the camera
camera = Camera(0)

async_mode = "eventlet"

# Define the Flask webserver and the static folder (where the HTML/JS lives)
app = Flask(__name__, static_url_path="", static_folder="./client/build")

# Define the server socket
socketio = SocketIO(app, cors_allowed_origins="*")

# Define the root route (that serves the actual React application)
@app.route("/", defaults={'path':''})
def serve(path):
    # Serve React application
    return send_from_directory(app.static_folder, "index.html")

# Define the video stream route (that serves the camera feed)
@app.route("/video_stream")
def video_stream():
    # Serve camera stream
    return Response(camera.stream(), mimetype="multipart/x-mixed-replace; boundary=frame")

# Define a socket command for establishing a connection with the server socket
@socketio.on("connect")
def connect():
    # Print out the client ID
    print("\nConnection Established\nSessionID Assigned: {}".format(request.sid))

# Define a socket command for sending a motor command
@socketio.on("motor_command")
def connect(data):
    # Parse the motor ID from the JSON object sent with the request
    motor = data["motor"]

    # Set the throttle of the appropriate motor
    if(motor == "motor1"):
        M1.setThrottle(data["throttle"])
    elif(motor == "motor2"):
        M2.setThrottle(data["throttle"])
    elif(motor == "stepper1"):
        S1.step(data["direction"])
    elif(motor == "stepper2"):
        S2.step(data["direction"])

# Define a socket command for disconnecting from the server socket
@socketio.on("disconnect")
def disconnect():
    # Print out the client ID
    print("\nConnection Terminated\nSessionID Revoked {}".format(request.sid))

# Start the web server
if __name__ == '__main__':
    socketio.run(app, host="192.168.5.1", port=5000, debug=True)
