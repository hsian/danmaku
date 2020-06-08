<template>
	<div>
		<div>
			直播间列表
			<ul class="room-list">
				<li @click="handleChangeRoom(item)" 
				v-for="(item, index) in ['10000', '10001', '10002', '10003']"
				:key="index">{{item}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
			}
		},
		mounted(){

		},
		methods: {
			handleChangeRoom(room){
				window.open(`/${room}`, "_blank");
			},
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
</style>
