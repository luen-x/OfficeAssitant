<template>
	<div>
		<oa-add-enroll ref="enroll"/>
	</div>
</template>

<script>
import addEnroll from './common/edit-add-enroll';

export default {
	name: 'oa-academy-detail-enroll-add',
	components: {
		'oa-add-enroll': addEnroll
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
