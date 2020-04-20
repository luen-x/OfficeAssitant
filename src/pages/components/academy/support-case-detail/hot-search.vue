<template>
	<div class="v-academy-case-detail-hot-search">
		<div class="_hot-search-title">
			{{ title }}
		</div>
		<div class="g-pd-l-20 g-pd-tb-15">
			<div 
				v-for="(item,index) in labelListC" 
				:key="index" 
				class="_hot-search-item g-pointer" 
				@click="$emit('click-label',item)"
			>
				{{ item }}
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';

export default {
	name: 'oa-',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		title: {
			type: String,
			default: '推荐案例',
			
		},
		labelList: Array
	},
	computed: {
		labelListC() {
			return this.labelList.map(i => {
				if (i.length > 8) {
					return i.substr(0, 8); 
				} else {
					return i;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.v-academy-case-detail-hot-search {
	border:1px solid rgba(235,235,235,1);
	width:250px;

	._hot-search-title {
		background:rgba(246,246,246,1);
		padding:10px 20px;
		border-bottom:1px solid rgba(235,235,235,1);
	}

	._hot-search-item {
		display: inline-block;
		color: #E74854;
		background:rgba(231,72,84,0.1);
		border-radius:12px;
		height: 24px;
		padding:4px 8px;
		margin-right: 10px;
		margin-bottom: 10px;
	}
}
</style>