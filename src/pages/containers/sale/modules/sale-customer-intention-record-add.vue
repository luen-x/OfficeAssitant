<template>
	<set-title :before-back="beforeBack" :routes="routes" title="录入到账" >
		<oa-content @create="handleCreate" />
	</set-title>
</template>

<script>
import Content from '@components/sale/customer-intention-record-add/content';
import { Confirm } from '@common/confirm/confirm';

export default {
	name: 'oa-sale-customer-intention-record-add',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: []
		};
	},
	created() {
	},
	methods: {
		handleCreate(arr) {
			this.routes = arr;
		},
		beforeBack() {
			return Confirm.popup(
				{
					title: "提示",
					msg: '返回之前的页面你所填写的内容将无法恢复，确认返回吗？'

				}
			).then((res) => {
				return true;
			}).catch(res => {
				return false;
			});

		},
	},
};
</script>

<style lang="scss" scoped>
</style>
