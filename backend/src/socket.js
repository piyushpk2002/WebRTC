import http from 'http'
import { Server } from 'socket.io'
import express from 'express'


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

const connectedUserMap = {};



io.on("connection", (socket)=>{
    console.log("A user Connected", socket.id);

    io.emit('conn. successful', socket.id);
    const userId = socket.handshake.query.userId;

    if(userId){
        connectedUserMap[userId] = socket.id;
    }

    console.log(connectedUserMap);

    //To provide the frontend all the online users list
    io.emit('online-users', connectedUserMap)

    //Initiate WebRtc connection
    socket.on('offer', (offer) =>{
        console.log(offer);
        
        console.log('offer-running'); 
        io.to(offer.targetId).emit('offer', offer);
    });

    socket.on('ice-candidates', (candidate) => {
        console.log('ice-candidate-running', candidate);
        io.to(candidate.targetId).emit("ice-candidates", candidate);
    });

    socket.on('answer', (answer) => {
        console.log('answer-running', answer);
        io.to(answer.targetId).emit('answer', answer);
    })
    
    socket.on("disconnect", () =>{
        console.log(`A user with ${socket.id} disconnected`);  
        delete connectedUserMap[userId];
        console.log(connectedUserMap);
        io.emit('online-users', connectedUserMap)
        
    })
})

export {io, app, server}
