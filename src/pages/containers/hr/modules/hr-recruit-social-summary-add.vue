<template>
	<set-title
		:before-back="beforeBack"
		:routes="routes"
		title="社招跟进-录入信息"
		style="padding: 0 20px 20px 20px">
		<oa-content ref="content"/>
	</set-title>
</template>

<script>
import Content from '@components/hr/recruit-social-summary-add/content';
import { PModal } from '@components/hr/recruit-social-summary-add/popup/modal';

export default {
	name: 'oa-hr-recruit-social-summary-add',
	components: {
		"oa-content": Content,
	},
	data() {
		return {
			routes: [
				{
					path: `/hr/recruit/social/summary`,
					name: '社招跟进'
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
			if (!this.$refs.content.formValidate.mobile) {
				return true;
			} else {
				return PModal.popup({}).then(res => {
					return true;
				}).catch(err => {
					return false;
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
