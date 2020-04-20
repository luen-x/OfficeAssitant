<template>
	<div 
		:style="!dataSource.length ? 'height:100%;' : 'height:auto;'"
		class="v-sale-train-employee-brain g-relative"
	>
		<oa-loading v-if="loading"/>
		<div 
			v-if="!dataSource.length" 
			class="g-flex g-jc-c g-ai-c"
			style="height:100%"
		>
			<div style="width:416px">
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无数据</div>
			</div>
		</div>
		<oa-train-employee-item 
			v-else 
			:data-source="dataSource" 
			type="brain"
		/>
	</div>
</template>

<script>
import API_ROOT from "@stores/apis/root";
import Loading from '@components/_common/loading/loading';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { TrainEmployeeItem } from './item';

export default {
	name: "oa-train-employee-brain",
	components: {
		'oa-loading': Loading,
		'oa-train-employee-item': TrainEmployeeItem
	},
	props: {
		staffId: [String, Number],
		applicantId: [String, Number],
	},
	data() {
		return {
			loading: false,
			dataSource: [], // 数据源
			OSS_SEARCH_EMPTY
		};
	},
	watch: {
		staffId() {
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			const { query = {} } = this.$route;
			this.dataSource = [];
			this.loading = true;
			this.$request({
				url: API_ROOT._SALE_TRAIN_EMPLOYEE_TRAIN_ECHELON_GET,
				type: 'GET',
				loading: false,
				param: {
					staff_id: this.staffId || query.staff_id,
					applicant_id: this.applicantId || query.applicant_id
				},
				autoTip: false
			}).then(res => {
				this.dataSource = res.data;
				this.loading = false;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
	}
};

export const TrainEmployeeBrain = module.exports.default;
</script>
<style lang="scss">

</style>
