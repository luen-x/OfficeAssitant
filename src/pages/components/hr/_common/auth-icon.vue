<template>
	<div class="c-auth-icons">
		<div v-if="type===0" class="_icon g-bg-green-mid" >超管</div>
		<div v-else-if="type===3" class="_icon g-bg-orange-mid">总监</div>
		<div v-else-if="type===2" class="_icon g-bg-blue-mid">经理</div>
		<div v-else-if="type===4" class="_icon g-bg-red-mid">政委</div>
		<div v-else-if="type===1" class="_icon" style="backgroundColor:#4B4F57">员工</div>
		<div v-else class="_icon">其他</div>
	</div>

</template>

<script>
import { Progress, Button, Select, Option } from "iview";
import API_ROOT from "@stores/apis/root";



export default {
	name: "c-auth-icons",
	components: {
	
	},
	props: {
		type: Number
	},
	
	data() {
		return {
			
		};
	},
	methods: {
	}
};
</script>
<style lang="scss" >
.c-auth-icons{
	._icon{
		position: absolute;
		top:7px;
		left:-16px;
		text-align: center;
		width: 60px;
		height: 16px;
		line-height: 16px;
		color: #fff;
		background-color: #ab45e6;
		transform:rotate(-45deg)
	}
}
	
</style>
