<template>
	<set-title 
		:routes="routes" 
		title="发送邮件" 
		class="g-tabs-card" 
		style="padding: 20px"
	>
		<oa-email class="g-m-t-20"/>
	</set-title>
</template>

<script>

import SendEmail from '@components/sc/customer-cooperate-send-email/send-email';
import { delItem } from '@utils/utils';

export default {
	name: 'oa-sc-customer-cooperate-send-email',

	components: {
		'oa-email': SendEmail
	},

	data() {
		return {
			routes: [
				{
					path: "",
					name: "发送邮件"
				}
			]
		};
	},

	created() {
	},

	beforeRouteLeave(to, from, next) {
		delItem(`contract_data_${app.$global.version}`);

		next();
	},

	methods: {
	}
};
</script>

<style lang="scss" scoped>
</style>