<template>
	<div class="v-sale-fraction-index-month">
		<div 
			v-if="monthInfo.detail.length" 
			class="g-flex"
		>
			<div 
				v-for="(item, index) in monthInfo.detail"
				:key="index"
				:style="'width:' + 100/(monthInfo.detail.length + 1) + '%;' + 'border-right: 2px solid #ebeef1;'"
				class="g-m-tb-30"
			>
				<div>{{ item.type_name }}</div>
				<div class="g-m-t-5 _point">{{ item.point }}</div>
			</div>
			<div 
				:style="'width:' + 100/(monthInfo.detail.length + 1) + '%;'"
				class="g-m-tb-30"
			>
				<div>合计{{ type }}</div>
				<div class="g-m-t-5 _point">{{ monthInfo.sum }}</div>
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
	name: 'oa-fraction-index-month',
	props: {
		type: String,
		monthInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			
		};
	}
};

export const FractionIndexMonth = module.exports.default;
</script>

<style lang="scss">
.v-sale-fraction-index-month {
	._point {
		font-size: 24px;
		color: #333;
	}
}
</style>
