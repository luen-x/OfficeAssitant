<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<div style="padding: 0 16px 60px">
				<oa-title class="g-m-t-10">
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
							v-if="data.audit_info.status !== 0"
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
							label="客户姓名">
							<span style="color: #E74854">
								{{ data.base_info.customer_name }}
							</span>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.base_info.phone" 
							label="客户手机号">
							<span style="color: #E74854">
								{{ data.base_info.phone }}
							</span>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.base_info.our_company_name" 
							class="g-m-t-15" 
							label="我方公司合同">
							<span style="color: #E74854">
								{{ data.base_info.our_company_name }}
							</span>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.base_info.invite_staff_name" 
							class="g-m-t-15" 
							label="邀约人">
							<span style="color: #E74854">
								{{ data.base_info.invite_staff_name }}
							</span>	
						</oa-detail-item>
						<oa-detail-item 
							:content="data.base_info.staff_name" 
							class="g-m-t-15" 
							label="录入人">{{ data.base_info.staff_name }}</oa-detail-item>
						<oa-detail-item 
							:content="data.base_info.create_time" 
							class="g-m-t-15" 
							label="录入时间">{{ data.base_info.create_time }}</oa-detail-item>
					</div>
				</oa-title>
				<oa-title class="g-m-t-30">
					<template slot="title">款项信息</template>
					<div slot="content" class="g-fw-w g-pd-t-25">
						<oa-detail-item 
							:content="data.payment_info.payment_amount" 
							label="实付金额">
							<span style="color: #E74854">
								{{ data.payment_info.payment_amount }}
							</span>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.payment_info.received_amount" 
							label="到账金额">
							<span style="color: #E74854">
								{{ data.payment_info.received_amount }}
							</span>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.payment_info.poundage" 
							class="g-m-t-15" 
							label="手续费">
							<span style="color: #E74854">
								{{ data.payment_info.poundage }}
							</span>	
						</oa-detail-item>
						<oa-detail-item 
							:content="data.payment_info.after_share_performance" 
							class="g-m-t-15" 
							label="分单后业绩">
							<span style="color: #E74854">
								{{ data.payment_info.after_share_performance }}
							</span>	
						</oa-detail-item>
						<oa-detail-item 
							label="分单金额"
							class="g-m-t-15" >
							<i-poptip v-if="showShareTooltip" trigger="hover">
								<span class="g-operation">
									{{ data.payment_info.share_performance !== '' ? data.payment_info.share_performance : '--' }}
								</span>
								<div slot="content">
									<p 
										v-for="(mess) of data.payment_info.staff_share.filter(item => item.is_invite_staff !== 1)" 
										:key="mess.staff_id + '1'"
									>
										<span >{{ mess.staff_name }}： {{ mess.convert || mess.performance }}</span>
									</p>
									<p v-for="(mess) of data.payment_info.depart_share" :key="mess.depart_id + '2'">
										{{ mess.depart_name }}： {{ mess.performance }}
									</p>
									<p v-for="(mess, index) of data.payment_info.cooperation_share" :key="index + '3'">
										外部合作：{{ mess.performance }}
									</p>
								</div>
							</i-poptip>	
							<span v-else class="g-operation">
								{{ data.payment_info.share_performance !== '' ? data.payment_info.share_performance : '--' }}
							</span>
						</oa-detail-item> 
						<oa-detail-item 
							v-if="data.payment_info.refund_amount !== '0.00'"
							:content="data.payment_info.refund_amount" 
							class="g-m-t-15" 
							label="退款金额">{{ data.payment_info.refund_amount }}</oa-detail-item>
						<oa-detail-item 
							:content="data.payment_info.payment_label" 
							class="g-m-t-15" 
							label="款项标签">
							<span 
								v-for="(item, index) of data.payment_info.payment_label" 
								:key="item.label_id">
								<span v-if="index">、</span>
								{{ item.label_name }}
							</span>
						</oa-detail-item>
						<oa-detail-item 
							:content="data.payment_info.original_time" 
							class="g-m-t-15" 
							label="原始时间">{{ data.payment_info.original_time }}</oa-detail-item>
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
					<template slot="title">
						缴款方式
						<span v-if="$auth['105'] && type === '1'" class="g-operation g-m-l-10" @click="handleOpenEdit">修改缴款方式</span>
					</template>
					<div slot="content">
						<div v-for="(item, index) of data.payment_info.payment_method" :key="index">
							<p class="g-m-tb-30 g-c-black2">
								{{ item.method_name }}
								<template v-if="item.item_name">-- {{ item.item_name }}</template>
							</p>
							<div class="g-fw-w">
								<oa-detail-item :content="item.payment_time" label="付款时间">{{ item.payment_time }}</oa-detail-item>
								<oa-detail-item :content="item.payment_amount" label="付款金额">{{ item.payment_amount }}</oa-detail-item>
								<oa-detail-item :content="item.image_url" class="g-m-t-15" label="凭证">
									<oa-upload 
										v-if="spin"
										:data-source="item.image_url.map(item => ({ type: '.png', url: item }))"
										:show-title="false"
										disabled 
									/>
								</oa-detail-item>
								<oa-detail-item 
									:content="item.poundage" 
									class="g-m-t-15" 
									label="手续费">{{ item.poundage }}</oa-detail-item>
							</div>
						</div>
					</div>
				</oa-title>
				<oa-title 
					v-if="data.make_product_info.product && data.make_product_info.product.length"
					class="g-m-t-30">
					<div slot="title">产品信息</div>
					<div slot="content" class="g-m-t-30">
						<span 
							v-for="item of data.make_product_info.product" 
							:key="item.product_id"
							class="_red-btn g-m-r-5">{{ item.product_name }}</span>
					</div>
				</oa-title>
				<oa-title 
					v-if="type === '2' && useInfo.length" 
					class="g-m-t-30"
				>
					<div slot="title">使用情况</div>
					<!-- 等李元昊 -->
					<div slot="content" class="g-m-t-30">
						<oa-steps 
							v-if="spin"
							:type="1"
							:data-source="useInfo"
							:render-title="renderTitle"
							:render-content="renderContent"
						/>
					</div>
				</oa-title>
			</div>
		</div>
		<oa-loading v-else />
	</div>
</template>

<script>
import { Drawer, Row, Col, Button, Spin, Poptip } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import lodash from 'lodash';
import API_ROOT from '@stores/apis/root';
import Loading from '@components/_common/loading/loading';
import { AchiAuditModal } from '@components/finance/customer-achi/popup/audit';
import { EditModal } from '@components/finance/customer-achi/popup/edit';
import Steps from '@components/_common/steps/steps';
import Upload from '@components/_common/upload/upload';
import DetailItem from '../../detail-item';
import Title from '../../title';

export default {
	name: 'finance-drawer-tab-achi-detail',
	components: {
		'i-drawer': Drawer,
		'oa-title': Title,
		'i-button': Button,
		'oa-detail-item': DetailItem,
		'oa-loading': Loading,
		'vc-imgs-preview': ImgsPreview,
		'i-poptip': Poptip,
		'oa-upload': Upload,
		'oa-steps': Steps
	},
	props: {
		type: String,
		paymentId: Number,
		show: Boolean
	},
	data() {
		return {
			closable: false,
			data: {
				audit_info: {},
				base_info: {},
				payment_info: {
					payment_method: [],
					payment_type: [],
					staff_share: [],
					depart_share: [],
					cooperation_share: []



				},
				make_product_info: {
					product: []
				}
			},
			useInfo: [],
			spin: true,
			isfetching: 0
		};
	},
	computed: {
		showShareTooltip() {
			const { staff_share, depart_share, cooperation_share } = this.data.payment_info;
			return staff_share.filter(i => !i.is_invite_staff).length || depart_share.length || cooperation_share.length;
		}

	},
	watch: {
		show(val, old) {
			if (val && this.isfetching === 0) {
				 this.loadData();
				 this.loadUseData();
			}
		},
		paymentId() {
			this.loadData();
			this.loadUseData();
		}
	},
	created() {
		this.show && this.loadData();
		this.show && this.loadUseData();
	},
	methods: {
		handleEditRequest(res) {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_MODIFY_PAYMENT_POST,
				type: 'POST',
				param: res.data,
			}).then(suc => {
				this.$Message.success(suc.msg);
				res.cb();
				this.loadData();
				this.$store.commit('FINANCE_CUSTOMER_ACHI_LIST_INIT');
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOpenEdit() {
			const { payment_info } = this.data;
			EditModal.popup({
				payment_info: {
					...lodash.cloneDeep(payment_info),
					payment_id: this.paymentId,
				},
				requestFn: this.handleEditRequest
			}).then(res => {
				
			});
		},
		renderTitle(h, param = {}) {
			const { time, type, index } = param.rows;
			return (
				<p class="g-fs-14 g-c-black2 g-m-l-10 g-nobreak">
					<span>{ time }</span>
					<span class="g-m-l-20" style="color: #4B4F57">{ type }</span>
				</p>
			);
		},
		renderContent(h, param = {}) {
			const { amount, rest_amount } = param.rows;
			return (
				<p 
					class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak"
				>
					变动金额：{ amount }；剩余金额：{ rest_amount }
				</p>
			);
		},
		loadUseData() {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_PAYMENT_USE_GET,
				type: 'GET',
				param: {
					payment_id: this.paymentId
				},
				loading: false
			}).then(res => {
				this.useInfo = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_ACHI_DETAIL_GET,
				type: 'GET',
				param: {
					payment_id: this.paymentId
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
</script>

<style lang="scss" scoped>
.v-finance-tab {

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
	._red-btn {
		display: inline-block;
		height: 30px;
		line-height: 30px;
		padding: 0 15px;
		background-color: #e84c57;
		border-radius: 4px;
		border: 1px solid #e84c57;
		color: #fff;
	}
}
</style>



