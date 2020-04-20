<template>
	<set-title title="上传素材" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/sale/fraction-material-upload/tabs-list';
import Filter from '@components/sale/fraction-material-upload/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-material-upload',
	components: {
		"oa-tabs-list": TabsList,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_FRACTION_MATERIAL_UPLOAD')],
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
