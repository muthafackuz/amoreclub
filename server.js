const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
cors:{
origin:"*"
}
});

let dancers = [];

io.on("connection",(socket)=>{

console.log("User connected");

/* JOIN DANCEFLOOR */

socket.on("joinDancefloor",(user)=>{

const alreadyExists =
dancers.find(d=>d.id === socket.id);

if(alreadyExists){
return;
}

const dancer = {

id: socket.id,
nickname: user.nickname,

x: Math.floor(Math.random()*80),
y: Math.floor(Math.random()*80)

};

dancers.push(dancer);

io.emit("dancefloorUpdate",dancers);

});

/* LEAVE DANCEFLOOR */

socket.on("leaveDancefloor",()=>{

dancers =
dancers.filter(d=>d.id !== socket.id);

io.emit("dancefloorUpdate",dancers);

});

/* DISCONNECT */

socket.on("disconnect",()=>{

dancers =
dancers.filter(d=>d.id !== socket.id);

io.emit("dancefloorUpdate",dancers);

});

});

server.listen(3000,()=>{

console.log("Server running");

});
