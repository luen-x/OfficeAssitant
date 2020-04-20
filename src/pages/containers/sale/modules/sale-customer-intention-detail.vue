<template>
	<set-title :before-back="beforeBack" :routes="routes" title="添加客户" >
		<oa-content ref="content" />
	</set-title>
</template>

<script>
import Content from '@components/sale/customer-intention-detail/content';
import { Confirm } from '@common/confirm/confirm';

export default {
	name: 'oa-sale-customer-intention-detail',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{ name: '添加客户', path: '' }
			]
		};
	},
	created() {
	},
	methods: {
		beforeBack() {
			if (this.$refs.content.isEmpty()) { 
				return new Promise((resolve, reject) => {
					resolve(true);
				});
			
			} else {
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

			}

		},
		
	},
};
</script>

<style lang="scss" scoped>
</style>
