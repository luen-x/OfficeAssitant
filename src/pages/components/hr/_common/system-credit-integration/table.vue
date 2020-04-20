<template>
	<div class="v-hr-system-table">
		<div class="_title g-flex g-jc-sb">
			<slot name="title" />
			<slot name="extra" />
		</div>
		<div 
			v-for="(item, index) of data.types"
			:key="index"
			:class="{ '_item': true, 'g-flex': true, '_border': index < data.types.length - 1 }">
			<div style="width: 180px">{{ item.type_name }}</div>
			<div style="width: 240px" class="_middle">
				<span>{{ name }}上限：{{ item.year_maximum }}</span>
				<span v-if="cate === '2'">每月上限：{{ item.month_maximum }}</span>
			</div>
			<div>{{ item.description }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'hr-system-table',
	props: {
		info: Object,
		cate: String
	},
	data() {
		return {
			data: this.info,
			name: this.cate === '1' ? '积分' : '学分'
		};
	}
};
</script>

<style lang="scss" scoped>
.v-hr-system-table {
	border: 1px solid #E8E8E8;
	border-radius: 4px;
	font-size: 14px;

	& > ._title {
		padding: 15px 20px;
		background: #f8f8f8;
	}
	& > ._border {
		border-bottom: 1px solid #EBEEF1;
	}
	& > ._item {

		& > div {
			padding: 15px 20px;
		}
		._middle {
			border-right: 1px solid #EBEEF1;
			border-left: 1px solid #EBEEF1;
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>


