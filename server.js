try{

var express = require('express');
var app = express();
const path = require('path');

var http = require('http').Server(app);
var url = require('url');
const io = require('socket.io')(http);
	
var fs = require('fs');


const hostname = '127.0.0.1';
const port = 3000;


//default index.html
app.get('/', (req,res) =>{
	res.sendFile(path.join(__dirname, 'app/views/index.html'));
});

//allows any file to be fetched with get
app.get('*', (req,res) =>{
	var q = url.parse(req.url, true);
	res.sendFile(path.join(__dirname, q.pathname));
});
	

	

io.on('connection', (socket) => {
	console.log('user connected to socket');
	
	
	//on messsage, broadcast to clients
	socket.on('position', function (data) {
		socket.broadcast.emit('position', data);
  	});
	
	socket.on('message', function (data) {
		io.emit('message', data);
  	});
});
	
http.listen(port, function(){
  console.log('listening on *:' + port);
});

	

}catch(err){console.log(err);}