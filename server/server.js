const express = require('express')
const app = express()
const cors = require("cors");
const port = 8080
const path = require('path');
const fs = require('fs');

const pathURL = "./data/memes.json";
// const loginRoute = require("./routes/loginRoutes")
// const signupRoute = require("./routes/signupRoutes")
const botRoute= require('./routes/botroute')
app.use(express.json());
app.use(cors());
app.use("/bot", botRoute)
// app.use('/login', loginRoute);
// app.use('/signup', signupRoute);


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// New code below...

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: true,
    methods: ['GET', 'POST']
  }
});

const readFile = (pathURL) => {
  let data = fs.readFileSync(pathURL);
  return JSON.parse(data)
  }

  const memeData = readFile(pathURL);

  console.log(memeData)
  
  
   const newMeme = {
      name: "One Does Not Simply",
      id: "61579",
      box_count: 2,
      url: "https://i.imgflip.com/1bij.jpg"
   }

   memeData.data.memes.push(newMeme);

   console.log("after push", memeData)


app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  next();
})
// this is important. If not we will not be able to transmit data across our server

io.on('connection', (socket) => {
  console.log('a user is connected', socket.id);

  socket.on('send message', function (msg) {
    io.emit('receive message', msg);
  });

  socket.on('disconnect', () => {
    console.log('...and disconnected');
  });
});

// Change app.listen to http.listen
http.listen(port, () => {
  console.log(`API listening on port ${port}...`);
});