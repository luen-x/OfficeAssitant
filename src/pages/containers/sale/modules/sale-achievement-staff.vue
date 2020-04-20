<template>
	<set-title :routes="routes" class="g-tabs-card" title="实时业绩" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/achievement-staff/tabs-list';
import Filter from '@components/sale/achievement-staff/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-achievement-staff',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_ACHIEVEMENT_STAFF')],
	data() {
		return {

		};
	},
	computed: {
		routes() {
			if (this.$global.staff.is_charge || this.$global.staff.depart_is_charge) {
				return [{ name: this.$route.query.name }];
			} else {
				return [];
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
