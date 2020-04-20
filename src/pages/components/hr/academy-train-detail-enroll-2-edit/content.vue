<template>
	<div style="margin-top: 4px">
		<oa-edit-enroll ref="enroll"/>
	</div>
</template>

<script>
import editEnroll from '../academy-train-detail-enroll-1-add/common/edit-add-enroll';

export default {
	name: 'oa-tpl',
	components: {
		'oa-edit-enroll': editEnroll
	},
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
