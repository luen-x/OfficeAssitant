<template>
	<set-title :routes="routes" title="我的素材" class="g-tabs-card g-hide-scroll" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/sale/fraction-material-upload-my/list';
import Filter from '@components/sale/fraction-material-upload-my/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-sale-fraction-material-upload-my',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('SALE_FRACTION_MATERIAL_UPLOAD_MY')],
	data() {
		return {
			routes: [
				{
					path: '/sale/fraction/material/upload',
					name: '上传素材'
				},
				{
					path: '',
					name: '我的素材'
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
