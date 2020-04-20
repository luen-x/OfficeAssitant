<template>
	<div class="v-sale-fraction-index-year">
		<div v-if="yearInfo.detail.length" class="g-flex g-jc-sa">
			<div 
				v-for="(item, index) in yearInfo.detail"
				:key="index"
				:style="'width:' + 100/(yearInfo.detail.length + 2) + '%;' + 'border-right: 2px solid #ebeef1;'"
				class="g-m-tb-30"
			>
				<div>{{ item.month }}</div>
				<div class="g-m-t-5 _point">{{ item.point|| '--' }}</div>
			</div>
			<div 
				:style="'width:' + 100/(yearInfo.detail.length + 2) + '%;' + 'border-right: 2px solid #ebeef1;'" 
				class="g-m-tb-30"
			>
				<div>合计{{ type }}</div>
				<div class="g-m-t-5 _point">{{ yearInfo.sum|| '--' }}</div>
			</div>
			<div 
				:style="'width:' + 100/(yearInfo.detail.length + 2) + '%;'" 
				class="g-m-tb-30"
			>
				<div>可用晋升{{ type }}</div>
				<div class="g-m-t-5 _point">{{ yearInfo.usable_sum|| '--' }}</div>
			</div>
		</div>
		<div
			v-else
			style="line-height: 108px;"
		>
			<span>暂无数据</span>
		</div>
	</div>
</template>

<script>

export default {
	name: 'oa-fraction-index-year',
	props: {
		type: String,
		yearInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
		};
	},
	created() {
	},
	methods: {
	},
};

export const FractionIndexYear = module.exports.default;
</script>

<style lang="scss">
.v-sale-fraction-index-year {
	._point {
		font-size: 24px;
		color: #333;
	}
}
</style>
