<template>
	<div class="g-pd-20" style="padding-bottom: 80px">
		<oa-job-item />
		<oa-relation-item />
		<!-- <oa-footer /> -->
	</div>
</template>

<script>
import Footer from '@components/_common/footer/footer';

import JobItem from './job-item';
import RelationItem from './relation-item';


export default {
	name: 'oa-tpl',
	components: {
		'oa-job-item': JobItem,
		'oa-relation-item': RelationItem,
		'oa-footer': Footer
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
