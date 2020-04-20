<template>
	<set-title title="通话管理" style="padding: 20px">
		<oa-sale-content />
	</set-title>
</template>

<script>
import Content from '@components/sale/call-manage/content';


export default {
	name: 'oa-sale-call-manage',
	components: {
		"oa-sale-content": Content,

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
</script>

<style lang="scss" scoped>
</style>
