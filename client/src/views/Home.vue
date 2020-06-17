<template>
	<div>
		<div class="container">
			<h3>直播间列表</h3>
			<ul class="room-list">	
				<li
				v-for="(item, index) in streams"
				:key="index">
					<router-link target="_blank" :to="`/${item.app}`">
						<div>房间ID：{{item.id}}</div>
						<div>观看人数：{{item.clients}}</div>	
						<div>房间名：{{item.app}}</div>	
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
				streams: []
			}
		},
		mounted(){
			fetch(liveURL + ":1985/api/v1/streams/")
			.then(res => {
				return res.json()
			}).then(res => {
				const {code, streams} = res;
				if(code === 0){
					this.streams = streams;
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
				color: inherit;
				text-decoration: none;
			}

			button{
				margin: 10px auto;
				display: block;
			}
		}
	}
</style>
