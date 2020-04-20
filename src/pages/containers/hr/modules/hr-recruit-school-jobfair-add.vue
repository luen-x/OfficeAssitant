<template>
	<set-title :before-back="beforeBack" :routes="routes" title="招聘会-录入信息" style="padding: 20px">
		<oa-tpl ref="content" />
	</set-title>
</template>

<script>
import Tpl from '@components/hr/recruit-school-jobfair-add/content';
import { Confirm } from '@components/hr/recruit-school-jobfair/popup/confirm';

export default {
	name: 'oa-hr-recruit-school-jobfair-add',
	components: {
		'oa-tpl': Tpl
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/recruit/school/jobfair`,
					name: '招聘会'
				},
				{
					path: '',
					name: '录入信息'
				}
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
						title: "确认",
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
