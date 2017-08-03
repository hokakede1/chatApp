// const localtunnel = require('localtunnel');
var express = require('express');
var app = express();

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

var server = require('http').Server(app);
var io = require('socket.io')(server);

// const tunnel = localtunnel(3000, { subdomain: 'hello'} (err, tunnel) => {
//   console.log('working')
//  });

server.listen(3001, () => {
  console.log('server is running on port 3000')
});

var mangUsers = []

io.on("connection", function(socket){
  console.log("A Person is connected with id: " + socket.id)

  socket.on('client-send-Username', function(data) {
    if(mangUsers.indexOf(data) >= 0){
      socket.emit("failToLogin")
    } else {
      mangUsers.push(data);
      socket.Username = data;
      socket.emit("SuccessLogin", data );
      io.sockets.emit("Userlist", mangUsers);
    }
  })

  socket.on("logout", function(){
    mangUsers.splice(
      mangUsers.indexOf(socket.Username), 1
    );

    io.sockets.emit("Userlist", mangUsers);

  });

  socket.on("user-send-message", function(data){
    io.sockets.emit("server-send-message", {un: socket.Username, nd: data});
  })

  socket.on('typing', function(){
    var mes = socket.Username+ ' ' + 'is typing...'
    socket.broadcast.emit('someoneIsTyping', mes)
  })

  socket.on('stopTyping', function(){
    console.log(socket.Username + ' ' + 'stop typing')
    socket.broadcast.emit('someoneStopTyping')
  })
})

app.get('/', (req, res) => {
  res.render('index');
})
