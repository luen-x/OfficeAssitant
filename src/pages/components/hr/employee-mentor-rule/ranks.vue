<template>
	<div class="v-rank g-flex">
		<div style="paddingTop:5px" class="g-flex-ac g-fw-w g-col">
			<div 
				v-for="(range,index) in rangesArr"
				:key="range.sort_id"
				class="_range-item g-flex-ac g-m-r-10 g-m-b-10"
			>
				<span>职位：{{ range.position_name }}</span>
				<template v-if="range.role_id">
					<i class="iconfont icon-vertical-line g-c-white" />
					<span>角色：{{ range.role_name }}</span>
				</template>
				<i 
					class="iconfont icon-close2 g-fs-12"
					@click="handleDel(range,index)"
				/>
			</div>
		</div>
	</div>
</template>

<script>


export default {
	name: 'oa-tpl',
	components: {
		
	},
	props: {
		rangesArr: Array
	},
	data() {
		return {};
	},
	methods: {
		handleDel(range, index) {
			this.rangesArr.splice(index, 1);
		},
	},
};
</script>

<style lang="scss" scoped>
.v-rank{
	._range-item {
		background-color: #e84c57;
		color: #ffffff;
		padding: 4px 6px;
		display: inline-block;
		border-radius: 4px;
		line-height: 1;
		font-size: 12px;
	}
}
</style>
