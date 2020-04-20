<template>
	<div class="g-box-shadow v-hr-level-item">
		<div class="_head">{{ info.rank_name }}</div>
		<div class="g-pd-lr-20 g-pd-tb-10">
			<p class="g-c-red-mid">
				<span>{{ info.regular_subsidy }}/月</span>
				<span class="g-m-l-10">+{{ info.commission_rate }}%</span>
			</p>
			<p class="g-tr g-c-black4 g-m-t-5">
				<span v-if="true && type===2">上期评定</span>{{ info.staff_num }}人
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'oa-hr-level-item',
	props: {
		info: {
			type: Object,
			default() {
				return {};
			}
		},
		type: Number
	}
};
</script>

<style lang="scss" scoped>
.v-hr-level-item {
	border-radius: 4px;
	margin-right: 30px;
	margin-bottom: 25px;
	._head {
		width: 220px;
		height: 40px;
		line-height: 40px;
		padding-left: 20px;
		background-color: #f0f4fd;
	}
}
</style>


