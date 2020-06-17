const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const path = require('path')

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(router);
app.use(express.static(path.resolve("../", "client/dist")))

// redis做缓存
var rooms = {
	// 10000: {
	// 	users: [],
	// 	status: true
	// }
};
var socketIdMaps = {};

io.on('connect', (socket) => {
	socket.on('join', ({token, room}, callback) => {
		if(!token){
			return callback({code: 1, message: "当前未登录"});
		}

		// request third party api, recive user infomation object!
		const mockUser = {
			statusCode: 200,
			data: {
				username: token, // it shoud be token exchange from api to get the username
				age: 18,
				avatar: "",
				gender: 1
			}
		}

		if(mockUser.statusCode !== 200){
			return callback({code: 1, message: "token过期或者错误"})
		}

		if(!rooms[room]){
			rooms[room] = {
				users: [],
				status: true
			}
		}

		let UserExist = false;
		rooms[room].users.forEach(v => {
			if(v.username === token){
				UserExist = true;
			}
		})
		if(UserExist){
			return callback({code: 1, message: "用户名已存在"})
		}
		

		rooms[room].users.push({
			...mockUser.data,
			id: socket.id
		});

		// 映射对象,当前连接对应的房间，一个pu可以进去无数个房间
		socketIdMaps[socket.id] = room;

		// console.log(rooms);

		// 加入成功
		socket.join(room);

		socket.emit('message', {
			user: mockUser,
			text: `欢迎 ${mockUser.data.username}`
		});

		socket.broadcast.to(room).emit('message', {
			text: `通知：欢迎${mockUser.data.username}加入了直播间`
		})

		callback();
	})

	socket.on('sendMessage', (message, callback) => {
		const room = socketIdMaps[socket.id];
		const user = rooms[room].users.find((v) => v.id === socket.id);

		io.to(room).emit("message", {
			user,
			text: message
		})

		callback();
	})

	socket.on('disconnect', () => {

		try{
			const room = socketIdMaps[socket.id];

			delete socketIdMaps[socket.id];

			// 不知道干嘛一直报错
			if(!rooms[room]) return;

			const index = rooms[room].users.findIndex(function(v){
				return v.id === socket.id;
			});
			const user = rooms[room].users[index];
			rooms[room].users.splice(index, 1);

			if(!user) return;

			io.to(room).emit('message', {
				text: `通知：${user.username}离开了直播间`
			})
		}catch(err){
			console.log(err)
		}
	})
});

server.listen(
	process.env.PORT || 4999, 
	() => console.log(`Server has started.`)
);