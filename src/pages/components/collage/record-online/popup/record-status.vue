<template>
	<span 
		:style="{ background: STATUS[type].color }"
		class="oa-collage-status-item">{{ STATUS[type].label }}</span>
</template>

<script>

export const STATUS = {
	'1': { label: '待录单', color: '#ED8F4A' },
	'2': { label: '已录单', color: '#BBBBBB' },
	'3': { label: '待审核', color: '#ED8F4A' },
	'4': { label: '已通过', color: '#4FC43D' },
	'5': { label: '已驳回', color: '#E84C57' }
};

export default {
	props: {
		type: {
			type: String | Number,
			required: true
		}
	},
	data() {
		return {
			STATUS
		};
	}
};
</script>

<style lang="scss" scoped>
.oa-collage-status-item {
    width: 70px;
    height: 32px;
    border-radius: 4px;
    color: #FFFEFE!important;
    font-size: 12px;
    display: inline-block;
    text-align: center;
}
</style>


