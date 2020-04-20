<template>
	<set-title :routes="routes" title="社招Offer">
		<oa-offer />
	</set-title>
</template>

<script>

import Offer from '@components/hr/recruit-social-summary-offer/offer';

export default {
	name: 'oa-hr-recruit-social-summary-offer',
	components: {
		'oa-offer': Offer
	},
	data() {
		return {
			routes: [
				{
					path: '/hr/recruit/social/summary',
					name: '社招跟进'
				},
				{
					path: '',
					name: '发offer'
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

<style lang="scss">
</style>
