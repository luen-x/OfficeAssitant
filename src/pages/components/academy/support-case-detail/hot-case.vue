<template>
	<div class="v-academy-case-detail-hot-case">
		<div class="_hot-case-title">
			{{ title }}
		</div>

		<div class="g-pd-l-20 g-pd-t-15">
			<div 
				v-for="(item,index) in caseListC" 
				:key="index" 
				class="g-pd-b-10 g-pointer" 
				@click="$emit('click-case',item)"
			>
				<span class="g-dp-ib" style="width:16px" > 
					<i v-if="item.hot" class="icon iconfont icon-yiqiangdao g-c-red-mid g-fs-14"/>
					<span v-else class="g-inline-block g-tc _sequence">
						{{ index + 1 }}
					</span>
				</span>
				<span>{{ item.title }}</span>
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
		'i-button': Button
	},
	props: {
		title: {
			type: String,
			default: '推荐案例'	
		},
		caseList: Array
	},
	computed: {
		caseListC() {
			return this.caseList.map(i => {
				if (i.title.length > 20) {
					return {
						...i,
						title: i.title.substr(0, 20) + '...'
					};
				} else {
					return i;
				}
			});
		}
	}
};
</script>
<style lang="scss">
.v-academy-case-detail-hot-case {
	border:1px solid rgba(235,235,235,1);
	width:250px;

	._hot-case-title {
		background:rgba(246,246,246,1);
		padding:10px 20px;
		border-bottom:1px solid rgba(235,235,235,1);
	}

	._sequence {
		width: 14px;
		height: 14px;
		line-height: 14px;
		color: #E74C57;
		background: rgba(231,76,87,0.1);
		border-radius: 2px;
	}
}
</style>