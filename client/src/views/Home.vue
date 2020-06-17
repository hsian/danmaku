<template>
	<div>
		<div class="container">
			<h3>直播间列表</h3>
			<ul class="room-list">	
				<li
				v-for="(item, index) in clients"
				:key="index">
					<router-link target="_blank" :to="`/${item.url.split('\/')[1]}`">
						<div>房间ID：{{item.id}}</div>
						<div>在线时长：{{item.alive}}秒</div>	
						<div>房间名：{{item.url.split("\/")[1]}}</div>	
						<button>进入直播间</button>
					</router-link>
				</li>
			
			</ul>
		</div>
	</div>
</template>

<script>
	import {pluginOptions} from "../../vue.config.js"
	const liveURL = pluginOptions.liveURL;

	export default {
		data(){
			return {
				clients: []
			}
		},
		mounted(){
			fetch(liveURL + ":1985/api/v1/clients/")
			.then(res => {
				return res.json()
			}).then(res => {
				const {code, clients} = res;
				if(code === 0){
					this.clients = clients;
				}
			})
		},
		methods: {
			// handleChangeRoom(item){
			// 	window.open(`/${item.url.split("\/")[1]}`, "_blank");
			// },
		}
	}
</script>
<style scpoed lang="less">
	.container{
		max-width: 900px;
		margin: 20px auto;
	}
	.room-list{
		margin: 20px 0;
		list-style: none;
		display:flex;

		li{
			margin: 10px;
			border: 1px #eee solid;
			padding: 10px;
			cursor: pointer;
			text-align: left;

			a{
				color: inherit
			}

			button{
				margin: 10px auto;
				display: block;
			}
		}
	}
</style>
