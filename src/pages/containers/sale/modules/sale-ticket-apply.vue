<template>
	<set-title :before-back="beforeBack" :routes="routes" title="开票申请">
		<oa-content />
	</set-title>
</template>

<script>
import Content from '@components/sale/ticket-apply/content';
import { Confirm } from '@common/confirm/confirm';

export default {
	name: 'oa-sale-ticket-apply',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: '/sale/ticket',
					name: this.$route.fullPath.includes('invoice_id') ? '编辑申请' : '开票申请'
				}
			]

		};
	},
	created() {
	},
	methods: {
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

<style lang="scss" >
	.oa-sale-ticket-apply-content-poptip {
		/deep/ .ivu-poptip-inner {
			background: inherit;
			/deep/ .ivu-poptip-body {
				background: rgba(0, 0, 0, 0.6);
				border-radius: 4px;
				color: #fff;
				/deep/ .__know-btn {
					border: 1px solid white;
					background: #dbd9d94f;
					border-radius: 4px;
					padding: 6px 10px;
				}
			}
		}
    }
</style>
