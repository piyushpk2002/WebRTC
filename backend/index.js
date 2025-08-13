import express from "express";
import { server } from "./src/socket.js"


const PORT = 5000;

server.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`);
})