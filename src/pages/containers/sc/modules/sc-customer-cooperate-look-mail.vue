<template>
	<set-title 
		:routes="routes" 
		title="查看邮件" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-look-email/>
	</set-title>
</template>

<script>

import LookEmail from '@components/sc/customer-cooperate-look-mail/look-email';

export default {
	name: 'oa-sc-customer-cooperate-look-mail',
	components: {
		'oa-look-email': LookEmail
	},
	data() {
		return {
			routes: [
				{
					path: "",
					name: "查看邮件"
				}
			]
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
