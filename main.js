// JavaScript Document
console.log('hello from main.js');

var socket = io();

var canvas0 = document.getElementById("gameCanvas0");
var ctx0 = canvas0.getContext("2d");
var canvas1 = document.getElementById("gameCanvas1");
var ctx1 = canvas1.getContext("2d");

var hWidth = canvas0.width/2;
var hHeight = canvas0.height/2;
ctx0.translate(hWidth,hHeight);

var pathColor = '#ffffff';

ctx0.fillStyle = pathColor;
ctx0.strokeStyle = pathColor;
ctx0.lineWidth = 60;

ctx0.beginPath();
ctx0.arc(0,0,160,0,2*Math.PI);
ctx0.stroke();


var messagerID = Math.random();
var player = 'x';

//ctx.fill();

var position = {
	x : 0,
	y : 0
};

$('#gameCanvas0').mousemove(function(e){

	
	
	
	if(player == 'x'){
		position.x = e.offsetX;	
	}
	if(player == 'y'){
		position.y = e.offsetY;	
	}
	
	
	drawLocation();

	socket.emit('position', position);

});


function drawLocation(){
	var c = ctx0.getImageData(position.x, position.y, 1, 1).data;
	var hex = "#" + ("000000" + rgbToHex(c[0], c[1], c[2])).slice(-6);
	
	var playerRadius = 5;
	var playerColor = 'Blue';
	if(hex == pathColor){
		playerColor = 'Red';
	}

	ctx1.fillStyle = playerColor;
	ctx1.strokeStyle = playerColor;
	
	
	ctx1.clearRect(0, 0, 500,500);
	
	ctx1.beginPath();
	ctx1.arc(position.x,position.y,playerRadius,0,2*Math.PI);
	ctx1.fill();

}

socket.on('position', function(data){
	lastSocket = data;
	
	if(player == 'x'){
		position.y = data.y;
	}
	
	if(player == 'y'){
		position.x = data.x;
	}
	
	drawLocation();

	
});


socket.on('message', function(data){
	//idea
	//add message to message set and display with v-for in view
	if(data.sender === messagerID){
		$('#messageBox').append('<div class="w-100 d-flex"><div class="message selfMessage ml-auto">' + emojify.replace(data.message) + '</div></div>');
	}
	else{
		$('#messageBox').append('<div class="w-100 d-flex"><div class="message mr-auto">' + emojify.replace(data.message) + '</div></div>');
	}
	
	$("#messageBox").scrollTop($("#messageBox")[0].scrollHeight);
	
});
		  

$('#sendMessage').click(function(e){
	
	var messageInput = $('#messageInput').val();
	
	//if theres a message send it, otherwise do nothing
	if(messageInput != ''){
		socket.emit('message', {
			message: messageInput,
			sender: messagerID,
		});
	$('#messageInput').val('');
	}
	
});


$('#messageInput').keyup(function (e){
	if (e.keyCode === 13) {
       	$('#sendMessage').trigger('click');
    }	
});

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

$('#x').click((e) => {
	player = 'x';
	console.log('player',player);
});

$('#y').click((e) => {
	player = 'y';
	console.log('player',player);
});

