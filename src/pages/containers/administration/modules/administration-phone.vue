<template>
	<set-title title="话机管理" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/administration/phone/list';
import Filter from '@components/administration/phone/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-administration-phone',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ADMINISTRATION_PHONE')],
	data() {
		return {
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
