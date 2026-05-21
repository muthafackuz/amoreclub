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

let requests = [];
let playlist = [];

function updatePlaylist(){
  playlist = [...requests]
  .sort((a,b)=> b.votes - a.votes);

  io.emit("playlistUpdate", playlist);
}

let requests = [
{
id: "1",
videoId: "kJQP7kiw5Fk",
title: "Despacito",
votes: 0,
createdAt: Date.now()
},
{
id: "2",
videoId: "fRh_vgS2dFE",
title: "Justin Timberlake",
votes: 0,
createdAt: Date.now()
}
];

let playlist = [];

];

let currentSongIndex = 0;

let currentVideo = "qKjJeQCpbZk";

let videoStartedAt = Date.now();

/* =========================
HELPERS
========================= */



/* =========================
SOCKET CONNECTION
========================= */

io.on("connection",(socket)=>{

console.log("User connected");
/* 👇 ТУК СЕ СЛАГАТ */

socket.emit("requestsUpdate", requests);
socket.emit("playlistUpdate", playlist);
  
/* SEND CURRENT MUSIC */

socket.emit("musicSync",{

videoId: currentVideo,

startedAt: videoStartedAt

});

/* SEND QUEUE */



/* =========================
novoto
========================= */
socket.on("addRequest",(data)=>{

const song = {
id: Date.now().toString(),
videoId: data.videoId,
title: data.title,
votes: 0,
createdAt: Date.now()
};

requests.push(song);

updatePlaylist();

io.emit("requestsUpdate", requests);

});  

/* =========================
REQUEST SONG
========================= */



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
