<template>
	<set-title title="促单提成" class="g-tabs-card" style="padding: 20px">
		<oa-tabs-list />
	</set-title>
</template>

<script>
import TabsList from '@components/collage/setting-promoting/tabs-list';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-collage-setting-promoting',
	components: {
		"oa-tabs-list": TabsList,
	},
	mixins: [navigator('COLLAGE_SETTING_PROMOTING')],
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
