<template>
	<div class="g-pd-20" style="min-width: 1366px;">
		<oa-company-goal/>
		<oa-performance-ranking class="g-m-tb-20"/>
		<oa-product-cost/>
		<oa-refund class="g-m-tb-20"/>
		<oa-king class="g-m-b-20"/>
	</div>
</template>

<script>
import CompanyGoal from './part/company-goal';
import PerformanceRanking from './part/performance-ranking';
import ProductCost from './part/product-cost';
import Refund from './part/refund';
import King from './part/king';

export default { 
	name: 'oa-content',
	components: {
		'oa-company-goal': CompanyGoal,
		'oa-performance-ranking': PerformanceRanking,
		'oa-product-cost': ProductCost,
		'oa-refund': Refund,
		'oa-king': King
	}
};
</script>

<style lang="scss" scoped>
</style>