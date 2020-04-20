<template>
	<set-title title="产品制作" class="g-tabs-card" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sc/product/tabs-list';
import Filter from '@components/sc/product/filter';
import navigator from '@extends/mixins/navigator';
import { delItem } from '@utils/utils';

export default {
	name: 'oa-sc-product',

	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},

	mixins: [navigator('SC_PRODUCT')],

	data() {
		return {
		};
	},

	created() {
	},

	beforeRouteLeave(to, from, next) {
		delItem(`look_mail_${app.$global.version}`);

		next();
	},

	methods: {
	},
};
</script>

<style lang="scss" scoped>
</style>
