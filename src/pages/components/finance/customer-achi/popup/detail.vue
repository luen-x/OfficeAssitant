<template>
	<div>
		<i-drawer
			v-model="closable"
			:mask="false"
			:mask-closable="false"
			class="v-finance-detail"
			@on-close="$emit('close')"
		>
			<div slot="header" class="_detail-header">{{ contract_company_name }}</div>
			<div v-if="spin">
				<div style="padding: 0 16px 60px">
					<oa-title v-if="data.audit_info.status !== 0" class="g-m-t-30">
						<template slot="title">审核信息</template>
						<div slot="content" class="g-fw-w g-pd-t-25">
							<oa-detail-item 
								:content="data.audit_info.status_name" 
								label="审核状态">{{ data.audit_info.status_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.audit_info.audit_staff_name" 
								label="审核人">{{ data.audit_info.audit_staff_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.audit_info.audit_time" 
								class="g-m-t-15" 
								label="审核时间">{{ data.audit_info.audit_time }}</oa-detail-item>
							<oa-detail-item
								:content="data.audit_info.audit_remark"  
								:label="data.audit_info.status === 1 ? '通过说明' : '驳回原因' "
								class="g-m-t-15">{{ data.audit_info.audit_remark }}</oa-detail-item>
						</div>
					</oa-title>
					<oa-title class="g-m-t-30">
						<template slot="title">基本信息</template>
						<div slot="content" class="g-fw-w g-pd-t-25">
							<oa-detail-item 
								:content="data.base_info.customer_name" 
								label="客户姓名">{{ data.base_info.customer_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.base_info.phone" 
								label="客户手机号">{{ data.base_info.phone }}</oa-detail-item>
							<oa-detail-item 
								:content="data.base_info.our_company_name" 
								class="g-m-t-15" 
								label="我方公司合同">{{ data.base_info.our_company_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.base_info.invite_staff_name" 
								class="g-m-t-15" 
								label="邀约人">{{ data.base_info.invite_staff_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.base_info.staff_name" 
								class="g-m-t-15" 
								label="录入人">{{ data.base_info.staff_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.base_info.create_time" 
								class="g-m-t-15" 
								label="录入时间">{{ data.base_info.create_time }}</oa-detail-item>
							<oa-detail-item 
								:content="data.base_info.relation_customer" 
								class="g-m-t-15" 
								label="关联公司">
								<p v-for="item of data.base_info.relation_customer" :key="item.contract_company_id">
									{{ item.company_name }}
								</p>
							</oa-detail-item>
							<oa-detail-item :content="data.base_info.relation_prove" class="g-m-t-15" label="凭证">
								<vc-imgs-preview :data-source="data.base_info.relation_prove" />
							</oa-detail-item>
						</div>
					</oa-title>
					<oa-title class="g-m-t-30">
						<template slot="title">款项信息</template>
						<div slot="content" class="g-fw-w g-pd-t-25">
							<oa-detail-item 
								:content="data.payment_info.payment_amount" 
								label="实付金额">{{ data.payment_info.payment_amount }}</oa-detail-item>
							<oa-detail-item 
								:content="data.payment_info.received_amount" 
								label="到账金额">{{ data.payment_info.received_amount }}</oa-detail-item>
							<oa-detail-item 
								:content="data.payment_info.poundage" 
								class="g-m-t-15" 
								label="手续费">{{ data.payment_info.poundage }}</oa-detail-item>
							<oa-detail-item 
								v-for="item of data.payment_info.payment_type" 
								:key="item.category_id"
								:label="item.category_name"
								class="g-m-t-15" 
							>
								<i-poptip trigger="hover">
									<span class="g-operation">{{ item.payment_amount !== '' ? item.payment_amount : '--' }}</span>
									<div slot="content">
										<p v-for="(info, index) of item.payment_percent" :key="index">
											{{ info.staff_name }}： {{ info.percent_performance }}
										</p>
									</div>
								</i-poptip>								
							</oa-detail-item>
							<oa-detail-item 
								:content="data.payment_info.share_performance" 
								class="g-m-t-15" 
								label="分单业绩">{{ data.payment_info.share_performance }}</oa-detail-item>
							<oa-detail-item 
								:content="data.payment_info.deal_time" 
								class="g-m-t-15" 
								label="成交时间">{{ data.payment_info.deal_time }}</oa-detail-item>
							<oa-detail-item 
								:content="data.payment_info.received_company_name" 
								class="g-m-t-15" 
								label="收款公司">{{ data.payment_info.received_company_name }}</oa-detail-item>
							<oa-detail-item 
								:content="data.payment_info.remark" 
								class="g-m-t-15" 
								label="备注">{{ data.payment_info.remark }}</oa-detail-item>
						</div>
					</oa-title>
					<oa-title class="g-m-t-30">
						<template slot="title">缴款方式</template>
						<div slot="content">
							<div v-for="(item, index) of data.payment_info.payment_method" :key="index">
								<p class="g-m-tb-30 g-c-black2">
									{{ item.method_name }}
									<span v-if="item.item_name">--{{ item.item_name }}</span>
								</p>
								<div class="g-fw-w">
									<oa-detail-item :content="item.payment_time" label="付款时间">{{ item.payment_time }}</oa-detail-item>
									<oa-detail-item :content="item.payment_amount" label="付款金额">{{ item.payment_amount }}</oa-detail-item>
									<oa-detail-item :content="item.image_url" class="g-m-t-15" label="凭证">
										<vc-imgs-preview :data-source="item.image_url" />
									</oa-detail-item>
									<oa-detail-item 
										:content="item.poundage" 
										class="g-m-t-15" 
										label="手续费">{{ item.poundage }}</oa-detail-item>
								</div>
							</div>
						</div>
					</oa-title>
					<div v-if="data.audit_info.status === 0" class="_drawer-footer g-flex g-flex-ac">
						<i-button v-if="$auth['93']" style="margin-right: 8px;height:32px" type="primary" @click="handleOpenAudit('1')">通过</i-button>
						<i-button v-if="$auth['94']" style="margin-right: 8px;height:32px" @click="handleOpenAudit('2')">驳回</i-button>
						<i-button v-if="$auth['105']" style="height:32px" @click="handleOpenEdit">修改缴款信息</i-button>
					</div>
				</div>
			</div>
			<oa-loading v-else />
		</i-drawer>
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Spin, Poptip } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import lodash from 'lodash';
import API_ROOT from '@stores/apis/root';
import { DetailItem, Title } from '@components/finance/_common';
import Loading from '@components/_common/loading/loading';
import { AchiAuditModal } from './audit';
import { EditModal } from './edit';

export default {
	name: 'finance-customer-detail-drawer',
	components: {
		'i-drawer': Drawer,
		'oa-title': Title,
		'i-button': Button,
		'oa-detail-item': DetailItem,
		'oa-loading': Loading,
		'vc-imgs-preview': ImgsPreview,
		'i-poptip': Poptip
	},
	props: {
		type: String,
		payment_id: Number,
		contract_company_name: String,
	},
	data() {
		return {
			closable: false,
			data: {
				audit_info: {},
				base_info: {
					relation_customer: {}
				},
				payment_info: {
					payment_method: [],
					payment_type: []
				}
			},
			spin: true
		};
	},
	computed: {
	},
	mounted() {
		this.closable = true;
	},
	created() {
		this.loadData();
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		handleAuditRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_AUDIT_POST,
				type: 'POST',
				param: {
					...res.data,
				},
			}).then(suc => {
				setTimeout(() => {
					this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_RESET', { type: this.$route.query.type || '1' });
					this.$Message.success(suc.msg);
					res.cb();
					this.$emit('destory');
				}, 1000);

			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleEditRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_MODIFY_PAYMENT_POST,
				type: 'POST',
				param: res.data,
			}).then(suc => {
				this.$Message.success(suc.msg);
				res.cb();
				this.$emit('sure');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenAudit(name) {
			AchiAuditModal.popup({
				name,
				payment_id: this.payment_id,
				requestFn: (res) => this.handleAuditRequest({
					...res,
					data: {
						...res.data,
						type: name,
						payment_id: this.payment_id
					}
				}) 
			}).then(res => {
			});
		},
		handleOpenEdit() {
			const { payment_info } = this.data;
			EditModal.popup({
				payment_info: {
					...lodash.cloneDeep(payment_info),
					payment_id: this.payment_id,
				},
				requestFn: this.handleEditRequest
			}).then(res => {
				
			});
		},
		loadData() {
			this.spin = false;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_DETAIL_GET,
				type: 'GET',
				param: {
					payment_id: this.payment_id
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				this.spin = true;
			}).catch(err => {
				this.$Message.error(err.msg);
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
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
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


