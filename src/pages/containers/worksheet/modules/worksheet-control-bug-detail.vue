<template>
	<set-title :before-back="beforeBack" :routes="routes" title="工单详情">
		<oa-content/>
	</set-title>
</template>

<script>

import Content from '@components/worksheet/control-bug-detail/contents';

let name = '';

export default {
	name: 'oa-worksheet-control-bug-detail',
	components: {
		'oa-content': Content
	},
	data() {
		return {
			routes: [
				{
					path: '',
					name: '工单详情'
				}
			]
		};
	},
	beforeRouteEnter(to, from, next) {
		name = from.name;
		next();
	},
	beforeRouteLeave(to, from, next) {
		name = null;
		next();
	},
	methods: {
		beforeBack() {
			name ? this.$router.go(-1) : this.$router.push({
				path: '/worksheet/control/bug'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>