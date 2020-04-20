<template>
	<set-title
		:before-back="beforeBack"
		:routes="routes"
		title="校招总表-录入信息"
		style="padding: 20px;">
		<oa-content ref="content" />
	</set-title>
</template>

<script>

import Content from '@components/hr/recruit-school-summary-add/content';
import { PModal } from '@components/hr/recruit-school-summary-add/popup/modal';

export default {
	name: 'oa-hr-recruit-school-summary-add',
	components: {
		'oa-content': Content
	},
	data() {
		let params = this.$route.params || {};
		return {
			routes: [
				{
					path: `/hr/recruit/school/summary`,
					name: '校招总表'
				},
				{
					path: '',
					name: '录入信息'
				}
			]
		};
	},
	created() {},
	methods: {
		beforeBack() {
			if (this.$refs.content.infoForm.mobile) {
				return PModal.popup({}).then(res => {
					return true;
				}).catch(err => {
					return false;
				});
			} else {
				return true;
			}
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
