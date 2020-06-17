<template>
	<div class="container">
		<!-- <script src="https://cdn.bootcdn.net/ajax/libs/flv.js/1.5.0/flv.min.js"></script> -->
		<div class="video-wrapper">
			<h3>房间名: {{ $route.params.room }}</h3>
			<div id="dplayer"></div>
			<p>如果未自动播放请手动点击播放。</p>
		</div>

		<div class="discuss">
			<div class="statement">
				公告：每天下午14:00-19:00直播
			</div>	
			<ul class="messages">
				<li v-for="(item, index) in messages">
					<div v-if="item.user && item.user.username">{{item.user.username}}：</div>
					<div>{{item.text}}</div>
				</li>
			</ul>
			<div v-if="token">
				<div class="tips">我是： {{token}}</div>
				<div class="form" v-if="token">
					<input type="text" v-model="inputValue" @keyup.enter="sendMessage">
					<button @click="sendMessage">发送</button>
				</div>
			</div>
			<div v-else>
				<div class="tips">参与聊天，请输入名字</div>
				<div class="form">
					<input type="text" v-model="cachetoken" @keyup.enter="setToken">
					<button @click="setToken">确定</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import io from "socket.io-client";
	import flvjs from "flv.js"
	import DPlayer from 'dplayer';
	import {pluginOptions} from "../../vue.config.js"
	const liveURL = pluginOptions.liveURL;
	const localURL = pluginOptions.localURL;

	export default {
		data(){
			return {
				messages: [],
				currentRoom: "",
				inputValue: "",
				socket: "",
				token: "",
				cachetoken: "",
				dp: "",
				// isplay: false
				danmakaType: 0 // 0是右侧input，1是播放器上输入框
			}
		},
		mounted(){
			this.currentRoom = this.$route.params.room;
			const dp = new DPlayer({
			    container: document.getElementById('dplayer'),
			    autoplay: true,
			    live: true,
			    danmaku: true,
			    apiBackend: {
			        read: (options) => {
			        	options.success();
			        },
			        send: (options) => {
			        	this.sendMessageDplay(options.data.text)
			        },
			    },
			    video: {
			        url: `${liveURL}:8080/${this.currentRoom}/livestream.flv`,
			        type: 'flv',
			    },
			    video: {
			        url: `${liveURL}:8080/${this.currentRoom}/livestream.flv`,
			        type: 'customFlv',
			        customType: {
			            customFlv: (video, player) => {
			                const flvPlayer = flvjs.createPlayer({
			                    type: 'flv',
			                    url: video.src,
			                    isLive: true
			                });

			                // flvPlayer.on(flvjs.Events.STATISTICS_INFO,function(){
							//     if(flvPlayer.muted === false && !this.isplay){
							//     	flvPlayer.muted = true;
							//     }
							// })
			                flvPlayer.attachMediaElement(video);
			                flvPlayer.load();
			                flvPlayer.play();
			            },
			        },
			    },
			    pluginOptions: {
			        flv: {
			            // refer to https://github.com/bilibili/flv.js/blob/master/docs/api.md#flvjscreateplayer
			            mediaDataSource: {
			                // mediaDataSource config
			            },
			            config: {
			                // config
			            },
			        },
			    },
			});

			const comment = document.querySelector(".dplayer-comment");
			comment.style.display = "none";

			this.dp = dp;
			
			
			this.handInRoom();
		},
		methods: {
			handInRoom(){
				const socket = io(`${localURL}:4999/`);
				this.socket = socket;

				socket.emit('join', {
					token: this.token, //"token123",
					room: this.currentRoom
				}, (error) => {
					if(error){
						if(error.code === 1){
							//alert(error.message);
						}
						if(error.message === "用户名已存在"){
							alert(error.message);
							this.token = "";
							this.cachetoken = "";
						}

						const comment = document.querySelector(".dplayer-comment");
						comment.style.display = "none";
					}
				});


				const comment = document.querySelector(".dplayer-comment");
				comment.style.display = "inline-block";

				socket.on('message', data => {
					this.messages = [
						...this.messages,
						data
					]

					if(data.user && data.user.username === this.token){
						return;
					}

					const danmaku = {
					    text: data.text,
					    color: '#00db33',
					    type: 'right',
					};
					this.dp.danmaku.draw(danmaku);

				})
			},

			sendMessageDplay(value){
				this.danmakaType = 1;
				this.socket.emit("sendMessage", value, () => {
					document.querySelector(".dplayer-comment-input").value = "";
				})
			},

			sendMessage(){

				this.danmakaType = 0;

				if(this.inputValue){
					this.dp.danmaku.send(
					    {
					        text: this.inputValue,
					        color: '#b7daff',
					        type: 'right', // should be `top` `bottom` or `right`
					    },
					    function () {
					        // console.log('success');
					    }
					);
				}

				// this.socket.emit("sendMessage", this.inputValue, () => {
				// 	this.inputValue = "";
				// 	document.querySelector(".dplayer-comment-input").value = "";
				// })
			},

			setToken(){
				if(this.cachetoken.trim() === ""){
					alert("请输入名字");
					return;
				}
				this.token = this.cachetoken;
				this.handInRoom();
			}
		}
	}
</script>
<style scpoed lang="less">
	.container{
		width: 950px;
		display: flex;
		.video-wrapper{
			width: 650px;

			h3{
				margin-bottom: 20px;
			}

			p{
				margin-top: 10px;
				background: #eee;
				border: #ddd solid 1px;
				padding: 5px 10px;
				font-size: 12px;
				color: #999;
			}
		}

		.discuss{
			flex: 1;
			margin: 45px 0 0 20px;
			height: 365px;
			background: #eee;
			border: 1px #ddd solid;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 5px;
			font-size: 13px;

			.statement{
				color: orange;
			}
		}
	}

	.dplayer-video-wrap .dplayer-video{
		height: 365px;
	}

	.messages{
		flex: 1;
		padding: 15px 0;
		overflow: auto;
		li {
			display: flex;
			margin-bottom: 5px;
		}
	}

	.form{
		display: flex;
		justify-content: space-between;

		input{
			height: 28px;
			padding: 0 5px;
			outline: none;
		}

		button{
			flex: 1;
			outline: none;
		}
	}

	.tips{
		padding: 5px 0;
		font-weight: bold;
	}
</style>
