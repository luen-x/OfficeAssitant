<template>
	<set-title
		:routes="routes"
		title="查看详情"
	>
		<oa-school-content v-if="isSchool" :show-switch="false" />
		<oa-social-content v-else :show-switch="false" />
	</set-title>
</template>

<script>

import schoolContent from '@components/hr/recruit-school-summary-detail/content';
import Info from '@components/hr/recruit-social-details/info';

export default {
	name: 'oa-academy-transfer-transfer-detail',
	components: {
		'oa-school-content': schoolContent,
		'oa-social-content': Info
	},
	data() {
		let params = this.$route.params || {};

		return {
			isSchool: params.type === 'school',
			routes: [
				// {
				// 	path: '/academy/transfer/transfer',
				// 	name: `新人输送`
				// },
				{
					path: '',
					name: '查看详情'
				}
			]
		};
	},
	watch: {
		'$route.params.type': {
			handler(val) {
				this.isSchool = val === 'school';
			}
		}
	},
	created() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
