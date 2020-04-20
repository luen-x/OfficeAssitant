<template>
	<set-title :routes="routes" title="PK现场">
		<div style="padding-right: 30px">
			<div class="v-pk-scene">
				<oa-pk-filter/>
			</div>
		</div>
	</set-title>
</template>

<script>
import pkFilter from '@components/sale/main-scene/filter';

export default {
	name: 'oa-sale-main-scene',
	components: {
		'oa-pk-filter': pkFilter
	},
	data() {
		const getNowMonth = () => {
			const date = new Date();
			const year = date.getFullYear();
			let month = date.getMonth() + 1;
			month = month < 10 ? '0' + month : month;
			return year + '-' + month;
		};
		const nowMonth = getNowMonth();
		return {
			routes: [
				{
					path: `/sale/main/pk/staff?month=${nowMonth}&pk_type=0&guard_is_victory=2`,
					name: 'PK'
				},
				{
					path: '',
					name: 'PK现场'
				}
			]
		};
	},
	mounted() {
	},
	beforeDestroy() {
	},
	methods: {
	},
};
</script>

<style lang="scss" scoped>
	.v-pk-scene {
		width: 100%;
		min-width: 800px;	
	}

</style>
