<template>
	<div >
		<div 
			v-for="(item,index) in data.list" 
			:key="index" 
			class="v-archives-person-details-other-mindset-item">
			<oa-auth-icon :type="item.appraiser_staff_identity"/>
			<div class="g-flex g-pd-10">	
				<div class="g-flex  g-flex-ac g-fd-c  _avatar">
					<img :src="item.head_img" class="__avatarimg" alt="">
					<div class="g-c-black3 g-m-tb-5">{{ item.staff_name }}</div>
					<div class="g-c-black4">{{ item.create_time }}</div>
				</div>
				<div class=" g-pd-r-20 _content">
					{{ item.content }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress, Button, Select, Option } from "iview";
import API_ROOT from "@stores/apis/root";
import authIcon from "@components/hr/_common/auth-icon";


export default {
	name: "v-archives-person-details-other-mindset-item",
	components: {
		"oa-auth-icon": authIcon
	},
	props: {
		itemInfo: Array,
		data: Object,
	},
	data() {
		return {
			
		};
	},
	methods: {
	}
};
</script>
<style lang="scss" scoped>
.v-archives-person-details-other-mindset-item{
	position: relative;
	overflow: hidden;
	margin-top:10px;
	width: 48%;
	margin-right: 10px;
	margin-left: 10px;
	float: left;
	background-color: #fff;
	._avatar{
		width: 100px;
		min-width: 100px;
		height: 120px;
		margin-left: 20px;
		.__avatarimg {
			width: 76px;
			min-width: 76px;
			height: 76px;
			border-radius: 50%;
			color: #fff;
			font-size: 24px;
			overflow: hidden;
		}
	}
	._content{
		text-align: justify;
		line-height:18px;
		overflow-y: auto;
		height: 120px;
		padding:10px;
		word-wrap: break-word;
	}
}

</style>
