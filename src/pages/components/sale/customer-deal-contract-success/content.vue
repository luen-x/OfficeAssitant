<template>
	<div class="v-sale-cus-form g-flex g-jc-c v-customer-deal-contract-success">
		<oa-save-success 
			:audit-schedule="auditSchedule" 
			:data-source="dataSource"
			@remind="handleRemind"
		/>
		<div class="_footer">
			<i-button v-if="showEdit" @click="handleEdit">重新编辑</i-button>
			<i-button type="primary" @click="handleViewDeatil">
				查看详情
			</i-button>
			
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
import { saleDataStore } from '../_common/util';
import _s from '../_common/customer/cus-form/style'; 
import { SaveSuccess } from '../_common/save-success';


export default {
	name: 'oa-customer-deal-contract-success',
	components: {
		'i-button': Button,
		'oa-save-success': SaveSuccess
	},
	data() {
		return {
			query: this.$route.query,
			auditSchedule: [ // 1 待审核 ，2 通过  3 未通过（驳回） 4 进行中
				// {
				// 	status: 2,
				// 	title: '提交申请',
				// 	create_time: '2018-09-12 12:34:45'
				// },
				// {
				// 	status: 1,
				// 	title: '立客户中心/商学院',
				// 	create_time: ''
				// },
				// {
				// 	status: 1,
				// 	title: '财务中心',
				// 	create_time: ''
				// }
			],
			dataSource: [
				// {
				// 	label: '提成业绩',
				// 	value: '120000.00'
				// },
				// {
				// 	label: '实扣成本',
				// 	value: '50000.00'
				// },
				// {
				// 	label: '服务提成',
				// 	value: '5000.00'
				// }
			],
			showEdit: false
		};
	},
	created() {
		this.loadData();
		
	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_CONTRACT_AUDIT_INFO_GET",
				type: "GET",
				param: { contract_id: this.query.contract_id },
				loading: false,
			}).then(res => {
				this.auditSchedule = res.data.audit_schedule.map(it => ({ ...it, status: +it.status + 1 }));
				const per = res.data.invite_staff_performance;
				this.dataSource = [{
					label: '提成业绩',
					value: per.commission_performance
				},
				{
					label: '实扣成本',
					value: per.cost_amount
				},
				{
					label: '服务提成',
					value: per.service_amount
				}];
				this.contractInfo = res.data;
				if (res.data.audit_schedule[1].status > 0) {
					this.showEdit = false;

				} else {
					this.showEdit = true;
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleRemind() {
			this.$request({
				url: "_SALE_URGE_CONTRACT_POST",
				type: "POST",
				param: {
					relation_id: this.query.contract_id
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
			}).catch((res) => {
				
				this.$Message.error(res.msg);
				if (res.data.change_status == 1) {
					this.loadData();
				}
			});
		},
		handleEdit() {
			// 检查是否已审核
			this.$request({
				url: "_SALE_CONTRACT_CONTRACT_HAS_AUDIT",
				type: "GET",
				param: {
					contract_id: this.query.contract_id
				}
			}).then((res) => {
				this.$router.replace({ 
					path: '/sale/customer/deal/contract/order', 
					query: { 
						contract_id: this.query.contract_id,
						contract_company_id: this.query.contract_company_id,
						customer_id: this.query.customer_id,
						contract_type: this.query.contract_type,
						action: 'update'
					} 
				});
			}).catch(res => {
				this.$Message.error(res.msg);
			});
			
		},
		handleViewDeatil() {
			saleDataStore.contract_id = this.query.contract_id;
			let type = 1;
			const lastAudit = this.auditSchedule[this.auditSchedule.length - 1];
			if (lastAudit && (lastAudit.status == 2 || lastAudit.status == 3)) {
				type = lastAudit.status;
			}
			this.$router.push({
				path: '/sale/customer/deal/contract', 
				query: { 
					contract_num: this.contractInfo.contract_num,
					type
				} 
			});
		}

	},
};
</script>
<style lang="scss">
.v-customer-deal-contract-success {
	._footer {
		width: calc(100% - 160px);
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}

}

</style>
