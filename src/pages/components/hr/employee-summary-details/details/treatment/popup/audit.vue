<template>
	<div>
		<i-modal
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="680px"
			footer-hide
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<i-table :columns="formValidate.columns" :data="formValidate.data" height="300" border/>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Table } from "iview";
import { CreatePortal, Paging } from "wya-vc";
import API from '@stores/apis/root';

export default {
	name: "hr-employee-details-contract-company",
	components: {
		"i-modal": Modal,
		"i-table": Table,
	},
	props: {
		title: String,
		rate_case_id: Number,
		type: Number,
	},
	data() {
		return {
			visible: false,
			formValidate: {
				type: '',
				company_name: "",
				columns: [
					{
						title: '邀约业绩',
						key: 'performance_range',
						minWidth: 200
					},
					{
						title: '业绩',
						key: 'amount',
						minWidth: 150
					},
					{
						title: '提成比例（%）',
						key: 'rate',
						minWidth: 150
					},
					{
						title: '提成总额',
						key: 'total_amount',
						minWidth: 150
					},
					{
						title: '提成金额',
						key: 'total_amount_text',
						minWidth: 300
					}
				],
				data: [],
			},
			
		};
	},
	computed: {	},
	created() {
		this.fetchData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		fetchData() {
			let param = {};
			if (this.type === 1) {
				param.rate_case_id = this.rate_case_id;
				param.type = this.type;
			}
			if (this.type === 2) {
				param.t_rate_case_id = this.rate_case_id;
				param.type = this.type;
			}
			this.$request({
				url: API._HR_EMPLOYEE_SUMMARY_DETAILS_GET_RATE_NAME_GET,
				type: "GET",
				param,
				loading: false
			}).then(res => {
				this.formValidate.data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>


