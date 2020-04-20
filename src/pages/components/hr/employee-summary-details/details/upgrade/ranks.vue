<template>
	<div class="v-rank g-flex ">
		<div style="paddingTop:5px" class=" g-flex-ac g-fw-w g-col">
			<div 
				v-for="(range,index) in rangesArr"
				:key="index"
				class="_range-item g-flex-ac g-m-r-10 g-m-b-10"
			>
				<span v-if="range&&range.staff_name">{{ range.staff_name }}</span>
				<span v-else>{{ range.depart_name }}</span>
				<i 
					class="iconfont icon-close2 g-fs-12"
					@click="handleDel(range,index)"
				/>
			</div>
			<i
				class="iconfont icon-add1 g-fs-18 g-c-blue-mid" 
				style="marginTop:-6px"
				@click="handleAdd"
			/>
		</div>
	</div>
</template>

<script>


export default {
	name: 'oa-tpl',
	components: {
		
	},
	props: {
		rangesArr: Array,
		handleAdd: Function
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
