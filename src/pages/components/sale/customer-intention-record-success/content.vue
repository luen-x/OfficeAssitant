<template>
	<div class="v-customer-intention-record-success v-sale-customer-form">
		<div class="g-flex g-jc-c ">
			<oa-save-success 
				:audit-schedule="auditSchedule" 
				:data-source="dataSource"
				@remind="handleRemind"
			>
				<div class="g-m-t-20 g-c-black5 g-fs-12 g-tc">
					此处仅为录入到账，并非客户下单，如需核算提成，请审批通过后前往成交客户进行下单操作。
				</div>
			</oa-save-success>
			<div class="_footer">
				<i-button v-if="showEdit" @click="handleEdit">重新编辑</i-button>
				<i-button type="primary" @click="handleDetail">查看详情</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import { Button } from 'iview';
import { saleDataStore } from '@components/sale/_common/util';
import _s from "../_common/customer/cus-form/style";
import { SaveSuccess } from '../_common/save-success';

export default {
	name: 'oa-customer-intention-record-success',
	components: {
		'oa-save-success': SaveSuccess, 
		'i-button': Button
	},
	data() {
		return {
			paymentId: this.$route.query.payment_id,
			companyName: this.$route.query.company_name,
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
			return this.$request({
				url: '_SALE_PAYMENT_DETAIL_GET',
				loading: false,
				type: "GET",
				param: {
					payment_id: this.$route.query.payment_id
				}
			}).then(res => {
				this.auditSchedule = [
					{
						status: 2,
						title: '提交申请',
						create_time: res.data.base_info.create_time
					},
					{
						status: res.data.audit_info.status + 1,
						title: res.data.audit_info.audit_staff_name,
						create_time: res.data.audit_info.audit_time
					}
				];
				this.dataSource = [
					{ label: '实付金额', value: res.data.payment_info.payment_amount },
					{ label: '分单后业绩', value: res.data.payment_info.after_share_performance },
					{ label: '分单金额', value: res.data.payment_info.share_performance }
				];
				this.paymentInfo = res.data;
				if (res.data.audit_info.status > 0) this.showEdit = false; 
				else this.showEdit = true;

				return res;
			}).catch((res) => {
				this.$Message.error(res.msg);
				return res;
			});
		},
		handleEdit() {
			this.loadData().then(res => {
				if (res.data.audit_info) {
					if (res.data.audit_info.status == 0) {
						this.$router.push({
							path: '/sale/customer/deal/arrive/record',
							query: {
								payment_id: this.paymentId,
								staff_id: this.paymentInfo.base_info.invite_staff_id,
								deal_status: this.paymentInfo.base_info.deal_status,
								contract_company_id: this.paymentInfo.base_info.contract_company_id,
								action: 'update'
							}
						});
					} else {
						this.$Message.error('到账已经被审核不能再编辑了哦');
					}

				}
			}); 
			
		},
		handleDetail() {
			saleDataStore.payment_id = this.paymentId;
			this.$router.push({ 
				path: '/sale/customer/deal/arrive', 
				query: { 
					search: this.paymentInfo.base_info.phone,
					type: this.auditSchedule[1].status

					 }
			});
		},
		handleRemind() {
			this.$request({
				url: "_SALE_URGE_PAYMENT_POST",
				type: "POST",
				param: {
					relation_id: this.paymentId
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
			
		}
	},
};
</script>
<style lang="scss">
.v-customer-intention-record-success {
	.c-across-table{
		._item{
			width: 300px;
		}
		._line {
			left: 175px;
			width: 250px
		}
	}
}
</style>

