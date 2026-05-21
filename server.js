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

/* =========================
DANCEFLOOR
========================= */

let dancers = [];

/* =========================
MUSIC SYSTEM
========================= */

let queue = [

{
videoId:"kJQP7kiw5Fk",
title:"Despacito",
requestedBy:"System"
},

{
videoId:"fRh_vgS2dFE",
title:"Justin Timberlake",
requestedBy:"System"
}

];

let currentSongIndex = 0;

let currentVideo = queue[0].videoId;

let videoStartedAt = Date.now();

/* =========================
HELPERS
========================= */



/* =========================
SOCKET CONNECTION
========================= */

io.on("connection",(socket)=>{

console.log("User connected");

/* SEND CURRENT MUSIC */

socket.emit("musicSync",{

videoId: currentVideo,

startedAt: videoStartedAt

});

/* SEND QUEUE */

socket.emit("queueUpdate",queue);

/* =========================
NEXT SONG
========================= */
  

/* =========================
REQUEST SONG
========================= */

socket.on("requestSong",(song)=>{

queue.push({

videoId:song.videoId,

title:song.title,

requestedBy:song.requestedBy

});

io.emit("queueUpdate",queue);

console.log("Song added:",song.title);

});

/* =========================
JOIN DANCEFLOOR
========================= */

socket.on("joinDancefloor",(user)=>{

const alreadyExists =
dancers.find(
d => d.nickname === user.nickname
);

if(alreadyExists){

socket.emit(
"alreadyDancing"
);

return;

}

const dancer = {

id: socket.id,

nickname: user.nickname,

gender: user.gender,

avatar: user.avatar,

x: Math.floor(Math.random()*80),

y: Math.floor(Math.random()*80)

};

dancers.push(dancer);

io.emit("dancefloorUpdate",dancers);

});

/* =========================
LEAVE DANCEFLOOR
========================= */

socket.on("leaveDancefloor",()=>{

dancers =
dancers.filter(
d => d.id !== socket.id
);

io.emit(
"dancefloorUpdate",
dancers
);

});

/* =========================
DISCONNECT
========================= */

socket.on("disconnect",()=>{

dancers =
dancers.filter(
d => d.id !== socket.id
);

io.emit(
"dancefloorUpdate",
dancers
);

});

});

/* =========================
START SERVER
========================= */

server.listen(3000,()=>{

console.log("Server running");

});
