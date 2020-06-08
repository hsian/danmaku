<template>
	<div>
		<div v-if="currentRoom">
			<ul class="messages">
				<li v-for="(item, index) in messages">
					<div v-if="item.user">{{item.user.username}}: </div>
					<div>{{item.text}}</div>
				</li>
			</ul>
			<div>
				<input type="text" v-model="inputValue" @keyup.enter="sendMessage">
				<button @click="sendMessage">发送</button>
			</div>
		</div>
	</div>
</template>

<script>
	import io from "socket.io-client";
	export default {
		data(){
			return {
				messages: [],
				currentRoom: "",
				inputValue: "",
				socket: ""
			}
		},
		mounted(){
			this.currentRoom = this.$route.params.room;
			this.handInRoom();
		},
		methods: {
			handInRoom(){
				const socket = io("http://localhost:4999/");
				this.socket = socket;

				socket.emit('join', {
					token: "token123",
					room: this.currentRoom
				}, (error) => {
					if(error){
						console.log(error)
						//alert(error);
					}
				});

				socket.on('message', data => {
					this.messages = [
						...this.messages,
						data
					]
				})
			},

			sendMessage(){
				this.socket.emit("sendMessage", this.inputValue, () => {
					this.inputValue = "";
				})
			}
		}
	}
</script>
<style scpoed lang="less">
	.room-list{
		margin: 20px 0;
		list-style: none;
		display:flex;

		li{
			margin: 10px;
			border: 1px #eee solid;
			padding: 5px;
			cursor: pointer;
		}
	}

	.messages{
		text-align: left;
		li {
			display: flex;
		}
	}
</style>
