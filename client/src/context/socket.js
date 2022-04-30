import { createContext, useContext } from "react";
import {io} from "socket.io-client";

export const socket = io.connect("http://192.168.5.1:5000");
export const SocketContext = createContext();
