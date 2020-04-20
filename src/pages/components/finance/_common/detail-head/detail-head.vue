<template>
	<div style="width: 100%">
		<div class="_detail-header">
			{{ data.contract_company_name }}
			<span v-if="data.contract_num">（合同编号：{{ data.contract_num }}）</span>
		</div>
		<div v-if="name !== 'payment'">		
			<div v-if="spin" class="g-m-t-20 g-flex g-fw-w">
				<div v-for="(item, index) of getItems" :key="index" style="width: 25%" class="g-m-b-12">
					<span class="g-c-black4">{{ item.label }}</span>
					<oa-explain 
						v-if="item.explain"
						:title="item.title"
						:content="item.content"
						class="g-relative"
						style="transform: translateY(2px);top:-1px"
					/>
					:
					<span class="g-c-black2">{{ data[item.value] === '' ? '--' : data[item.value] }}</span>
				</div>
			</div>
			<div v-else class="v-finance-spin">
				<oa-loading fix />
			</div>
		</div>
	</div>
</template>

<script>
import { Spin } from 'iview';
import Loading from '@components/_common/loading/loading';
import Explain from '@components/_common/explain/explain';
import Item from './item';


export default {
	name: 'finance-detail-drawer-header',
	components: {
		'oa-loading': Loading,
		'oa-explain': Explain
	},
	mixins: [Item],
	props: {
		name: String,
		type: String,
		refundType: Number,
		datas: Object
	},
	data() {
		return {
			data: this.datas,
			spin: true
		};
	},
	watch: {
		datas(val) {	
			if (val) {
				this.data = val;
			}
		}
	},
};
</script>

<style lang="scss">
.v-finance-spin {
	position: relative;
	height: 120px;
}
</style>


