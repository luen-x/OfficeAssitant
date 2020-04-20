<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-finance-detail"
			@on-close="$emit('close')"
		>
			
			<div v-if="spin" slot="header" class="_detail-header">{{ data.invoice_title }}</div>
			<div v-if="spin" style="padding: 0 16px 60px">
				<oa-title class="g-m-t-30">
					<template slot="title">
						基本信息
						<span v-if="type !== '4'">
							<span v-if="!isEdit" class="g-operation g-m-l-5" @click="handleEdit">编辑</span>
							<template v-else>
								<span class="g-operation g-m-l-5" @click="handleSave">保存</span>
								<span class="g-operation g-m-l-5" @click="handleEdit">取消</span>
							</template>
						</span>
					</template>
					<div v-if="!isEdit" slot="content" class="g-fw-w g-pd-t-25">
						<oa-detail-item :content="data.customer_name" label="客户姓名" >{{ data.customer_name }}</oa-detail-item>
						<oa-detail-item :content="data.ratepayer_number" label="纳税人识别号">{{ data.ratepayer_number }}</oa-detail-item>
						<oa-detail-item :content="data.customer_phone" class="g-m-t-15" label="客户电话">{{ data.customer_phone }}</oa-detail-item>
						<oa-detail-item :content="data.open_bank" class="g-m-t-15" label="开户行">{{ data.open_bank }}</oa-detail-item>
						<oa-detail-item :content="data.customer_address" class="g-m-t-15" label="客户地址">{{ data.customer_address }}</oa-detail-item>
						<oa-detail-item :content="data.public_account" class="g-m-t-15" label="对公账号">{{ data.public_account }}</oa-detail-item>
						<oa-detail-item :content="data.project" class="g-m-t-15" label="合作项目">{{ data.project }}</oa-detail-item>
						<oa-detail-item :content="data.invoice_money" class="g-m-t-15" label="发票金额">{{ data.invoice_money }}</oa-detail-item>
						<oa-detail-item :content="data.invoice_type_name" class="g-m-t-15" label="发票类型">{{ data.invoice_type_name }}</oa-detail-item>
						<oa-detail-item 
							:content="data.payment_type_amount_name" 
							class="g-m-t-15" 
							label="汇款方式">{{ data.payment_type_amount_name }}</oa-detail-item>
						<oa-detail-item :content="data.invoice_title" class="g-m-t-15" label="发票抬头">{{ data.invoice_title }}</oa-detail-item>
						<oa-detail-item :content="data.contract_num" class="g-m-t-15" label="合同编号">{{ data.contract_num }}</oa-detail-item>
						<oa-detail-item :content="data.our_company_name" class="g-m-t-15" label="我方合同公司">{{ data.our_company_name }}</oa-detail-item>
						<oa-detail-item :content="data.invoice_list" class="g-m-t-15" label="开票资料">
							<vc-imgs-preview :data-source="data.invoice_list || []" style="width: 270px"/>
						</oa-detail-item>
						<oa-detail-item :content="data.voucher_list" class="g-m-t-15" label="打款凭证">
							<vc-imgs-preview :data-source="data.voucher_list || []" style="width: 270px"/>
						</oa-detail-item>
						<oa-detail-item :content="data.contract_list" class="g-m-t-15" label="电子合同">
							<vc-imgs-preview :data-source="data.contract_list || []" style="width: 270px"/>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.entrusted_payment_list" 
							class="g-m-t-15" 
							label="委托付款三方协议">
							<vc-imgs-preview :data-source="data.entrusted_payment_list || []" style="width: 270px"/>
						</oa-detail-item>
					</div>
					<oa-form
						v-else 
						ref="form"
						slot="content" 
						:info="data" 
						class="g-fw-w g-pd-t-25" />
				</oa-title>
				<oa-title v-if="type !== '1'" class="g-m-t-30">
					<template slot="title">
						审核处理
						<span>
							<span v-if="type == '2'" class="g-operation g-m-l-5" @click="handleEditAudit">编辑</span>
						</span>
					</template>
					<div slot="content" class="g-fw-w g-pd-t-25">
						<oa-detail-item
							:content="data.audit_remark"
							:label="type === '4' ? '驳回原因' : '通过说明'">{{ data.audit_remark }}</oa-detail-item>
						<oa-detail-item :content="data.audit_staff_name" label="审核人">{{ data.audit_staff_name }}</oa-detail-item>
						<oa-detail-item :content="data.audit_time" class="g-m-t-15" label="操作时间">{{ data.audit_time }}</oa-detail-item>
					</div>
				</oa-title>
				<oa-title v-if="data.open_holder && (type === '3' || type === '5')" class="g-m-t-30">
					<template slot="title">
						开票处理
						<span 
							v-if="!isDeal"
							class="g-operation g-m-l-5" 
							@click="handleAuditEdit">编辑</span>
					</template>
					<div slot="content" class="g-fw-w g-pd-t-25">
						<oa-detail-item 
							:content="data.invoice_time" 
							label="开票时间">{{ data.invoice_time }}</oa-detail-item>
						<oa-detail-item 
							:content="data.invoice_code" 
							label="发票代码">{{ data.invoice_code }}</oa-detail-item>
						<oa-detail-item 
							:content="data.invoice_num" 
							class="g-m-t-15"
							label="发票号码">{{ data.invoice_num }}</oa-detail-item>
						<oa-detail-item 
							:content="data.amount" 
							class="g-m-t-15"
							label="金额">{{ data.amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.tax_amount" 
							class="g-m-t-15"
							label="税额">{{ data.tax_amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.total_amount" 
							class="g-m-t-15"
							label="总金额">{{ data.total_amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.open_holder_name" 
							class="g-m-t-15"
							label="开票人">{{ data.open_holder_name }}</oa-detail-item>
						<oa-detail-item
							:content="data.invoice_operate_time"
							class="g-m-t-15"
							label="开票操作时间">{{ data.invoice_operate_time }}</oa-detail-item>
					</div>
				</oa-title>
				<oa-title v-if="data.receive_holder" class="g-m-t-30">
					<template slot="title">领票处理</template>
					<div slot="content" class="g-fw-w g-pd-t-25">
						<oa-detail-item :content="data.invoice_number" label="开票份数">{{ data.invoice_number }}</oa-detail-item>
						<oa-detail-item :content="data.receive_holder" label="领票人">{{ data.receive_holder }}</oa-detail-item>
						<oa-detail-item
							:content="data.invoice_amount_sheets"
							class="g-m-t-15"
							label="开票张数">{{ data.invoice_amount_sheets }}</oa-detail-item>
						<oa-detail-item
							:content="data.receive_time"
							class="g-m-t-15"
							label="领票时间">{{ data.receive_time }}</oa-detail-item>
					</div>
				</oa-title>
				<oa-title v-if="data.open_holder && type === '5'" class="g-m-t-30">
					<template slot="title">
						退票处理
						<span 
							v-if="!isDeal"
							class="g-operation g-m-l-5" 
							@click="handleRejectEdit">编辑</span>
					</template>
					<div slot="content" class="g-fw-w g-pd-t-25">
						<oa-detail-item 
							:content="data.return_time" 
							label="退票时间">{{ data.return_time }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_remark" 
							label="退票备注">{{ data.return_remark }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_invoice_code" 
							label="红字发票代码">{{ data.return_invoice_code }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_invoice_num" 
							class="g-m-t-15"
							label="红字发票号码">{{ data.return_invoice_num }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_amount" 
							class="g-m-t-15"
							label="金额">{{ data.return_amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_tax_amount" 
							class="g-m-t-15"
							label="税额">{{ data.return_tax_amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_total_amount" 
							class="g-m-t-15"
							label="总金额">{{ data.return_total_amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.return_open_holder_name" 
							class="g-m-t-15"
							label="退票人">{{ data.return_open_holder_name }}</oa-detail-item>
						<oa-detail-item
							:content="data.return_operate_time"
							class="g-m-t-15"
							label="退票操作时间">{{ data.return_operate_time }}</oa-detail-item>
					</div>
				</oa-title>
				<div v-if="type !== '4' && !isDeal" class="_fixed-height"/>
				<div v-if="type !== '4' && !isDeal" class="_drawer-footer g-flex g-flex-ac">
					<i-button
						v-if="type === '1' && $auth['108']"
						style="margin-right: 8px"
						type="primary"
						@click="handleOpenModal('2')">通过申请</i-button>
					<i-button v-if="type === '1' && $auth['108']" style="margin-right: 8px" @click="handleOpenModal('4')">驳回申请</i-button>
					<i-button v-if="type === '2' && $auth['109']" style="margin-right: 8px" type="primary" @click="handleKaiModal">标记开票</i-button>
					<i-button
						v-if="type === '3' && $auth['110'] && !isDeal && !data.receive_holder"
						style="margin-right: 8px"
						type="primary"
						@click="handleLingModal">领票</i-button>
					<i-button
						v-if="type === '3' && !isDeal && $auth[1542]"
						style="margin-right: 8px"
						@click="handleReject">标记退票</i-button>
				</div>
			</div>
			<oa-loading v-else />
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Input, DatePicker, Spin } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { DetailItem, Title } from '@components/finance/_common';
import Loading from '@components/_common/loading/loading';
import { AuditModal } from './audit';
import { AuditEditModal } from './audit-edit-modal';
import { KaiModal } from './kai';
import { LingModal } from './ling';
import { RejectModal } from './reject';
import Form from './form';

export default {
	name: 'finance-customer-ballot-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'oa-title': Title,
		'i-button': Button,
		'oa-loading': Loading,
		'oa-detail-item': DetailItem,
		'vc-imgs-preview': ImgsPreview,
		'oa-form': Form
	},
	props: {
		type: String,
		invoice_id: Number,
		isDeal: Boolean
	},
	data() {
		return {
			closable: false,
			spin: true,
			data: {},
			isEdit: false,
		};
	},
	mounted() {
		this.closable = true;
		this.loadData();
	},
	methods: {
		handleEditAudit() {
			let datas = {
				invoice_id: this.invoice_id,
				status: this.type,
				audit_remark: this.data.audit_remark
			};
			AuditEditModal.popup({
				datas
			}).then(res => {
				this.loadData();
				this.$store.commit('FINANCE_BALLOT_LIST_INIT');
			});
		},
		handleSave() {
			this.$refs['form'].$refs['form'].validate(item => {
				if (item) {
					const data = this.$refs['form'].form;
					this.$request({
						url: API_ROOT._FINANCE_INVOICE_BALLOT_EDIT_POST,
						type: 'POST',
						param: data
					}).then(suc => {
						this.$Message.success(suc.msg);
						this.loadData();
						this.$store.commit('FINANCE_BALLOT_LIST_INIT');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleEdit() {
			this.isEdit = !this.isEdit;
		},
		handleAuditEdit() {
			KaiModal.popup({
				invoice_id: this.invoice_id,
				info: this.data
			}).then(res => {
				this.loadData();
			});
		},
		handleRejectEdit() {
			RejectModal.popup({
				invoice_id: this.invoice_id,
				info: this.data
			}).then(res => {
				this.loadData();
			});
		},
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		handleBallotRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_BALLOT_AUDIT_POST,
				type: 'POST',
				param: res.data
			}).then(suc => {
				res.cb && res.cb();
				this.handleClose();
				this.$store.commit('FINANCE_BALLOT_LIST_INIT');
				this.$Message.success(suc.msg);
				this.loadData();
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenModal(name) {
			AuditModal.popup({
				name,
				requestFn: (res) => this.handleBallotRequest({
					...res,
					data: {
						...res.data,
						invoice_id: this.invoice_id,
						status: name
					}
				})
			}).then(res => {
			});
		},
		handleClose() {
			this.$emit('close');
		},
		handleKaiModal() {
			KaiModal.popup({
				invoice_id: this.invoice_id,
			}).then(res => {
				this.handleClose();
			});
		},
		handleLingModal() {
			LingModal.popup({
				invoice_id: this.invoice_id,
				onHide: this.handleClose
			}).then(res => {});
		},
		handleReject() {
			RejectModal.popup({
				invoice_id: this.invoice_id,
			}).then(res => {

			});
		},
		loadData() {
			this.spin = false;
			this.$request({
				url: API_ROOT._FINANCE_BALLOT_DETAIL_GET,
				type: 'GET',
				param: {
					invoice_id: this.invoice_id
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
				this.isEdit = false;
			}).catch(err => {
				this.spin = true;
			});
		}
	}
};
export const DetailDrawer = CreatePortal({ store: app.$store, alive: true }, module.exports.default);
</script>

<style lang="scss">
.v-finance-detail {

	._detail-header {
		color: #000;
		font-size: 16px;
		height: 31px;
		line-height: 31px;
	}
	._drawer-footer {
		width: 940px;
		height: 61px;
		position: fixed;
		bottom: 0;
		right: 0;
		border-top: 1px solid #e8e8e8;
		padding: 10px 16px;
		text-align: left;
		background: #fff;
		box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
	}
	._fixed-height {
		height: 81px;
	}
	.ivu-tabs-tabpane {
		padding: 0 12px;
	}
	.vc-imgs-preview img {
		height: 72px;
		width: 72px;
		border: 1px solid #e5e6e7;
	}
}
</style>


