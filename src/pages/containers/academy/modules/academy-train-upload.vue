<template>
	<set-title title="通关上传" class="g-tabs-card g-of-h" style="padding: 20px">
		<oa-filter />
		<oa-list />
	</set-title>
</template>

<script>
import List from '@components/academy/train-upload/list';
import Filter from '@components/academy/train-upload/filter';
import navigator from '@extends/mixins/navigator';

export default {
	name: 'oa-academy-train-upload',
	components: {
		"oa-list": List,
		"oa-filter": Filter,
	},
	mixins: [navigator('ACADEMY_TRAIN_UPLOAD')],
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
