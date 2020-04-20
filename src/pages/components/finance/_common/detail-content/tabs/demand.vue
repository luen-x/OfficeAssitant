<template>
	<div v-show="show" class="v-finance-tab">
		<div v-if="spin">
			<oa-title v-if="type === '4'" class="g-m-b-30 g-m-t-10">
				<template slot="title">
					<span class="g-fs-14">失效记录</span>
				</template>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item label="失效原因">{{ data.invalid_record.refund_type === 1 ? '合同退款' : '换产品退款' }}</oa-detail-item>
					<oa-detail-item 
						:content="data.invalid_record.refund_reason" 
						label="退款理由">{{ data.invalid_record.refund_reason }}</oa-detail-item>
					<oa-detail-item 
						:content="data.invalid_record.refund_amount" 
						class="g-m-t-15" 
						label="退款金额">{{ data.invalid_record.refund_amount }}</oa-detail-item>
					<oa-detail-item 
						:content="data.invalid_record.create_time" 
						class="g-m-t-15" 
						label="失效时间">{{ data.invalid_record.create_time }}</oa-detail-item>
				</div>
			</oa-title>
			<oa-title class="g-m-t-10">
				<div slot="title">
					<span>款项信息 </span>
					<template v-if="contractType!=1 && showSign && $auth[1771]">
						<span class="g-operation g-m-l-20" @click="handleSignRebuy">标记复购</span>
						<span v-if="tagData.is_repeat" class="g-operation g-m-l-10" @click="handleCancelRebuy">取消标记</span>
					</template>
				</div>
				<i-button v-if="contractType!=1 && $auth[1772]" slot="extra" type="primary" @click="handleRebuyRecord">标记记录</i-button>
				<div slot="content" class="g-fw-w g-pd-t-25">
					<oa-detail-item 
						:content="data.contract_info.contract_amount" 
						label="合同金额">{{ data.contract_info.contract_amount }}</oa-detail-item>
					<oa-detail-item 
						:content="data.contract_info.need_amount" 
						label="应付金额">{{ data.contract_info.need_amount }}</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="实付金额">
						<oa-money-tooltip
							:total="data.contract_info.payment_amount"
							:data="data.contract_info.payment_amount_detail"
						/>
					</oa-detail-item>
					<oa-detail-item 
						:content="data.contract_info.last_amount" 
						class="g-m-t-15" 
						label="剩余尾款">{{ data.contract_info.last_amount }}</oa-detail-item>
					<oa-detail-item 
						:content="data.contract_info.total_need_cost_amount" 
						class="g-m-t-15" 
						label="产品成本">{{ data.contract_info.total_need_cost_amount }}</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="实扣成本">
						<oa-money-tooltip
							:total="data.contract_info.total_cost_amount"
							:data="data.contract_info.total_cost_amount_detail"
							type="cost"
						/>
					</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="提成业绩">
						<oa-money-tooltip
							:total="data.contract_info.commission_performance"
							:data="data.contract_info.commission_performance_detail"
						/>
					</oa-detail-item>
					<oa-detail-item 
						class="g-m-t-15" 
						label="服务提成">
						<oa-money-tooltip
							:total="data.contract_info.service_amount"
							:data="data.contract_info.service_amount_detail"
						/>
					</oa-detail-item>
					<oa-detail-item 
						v-if="tagData.is_repeat"
						class="g-m-t-15" 
						label="复购金额">
						<!-- todo 对字段 -->
						{{ tagData.repeat_amount }}
					</oa-detail-item>
				</div>
			</oa-title>
			<oa-title class="g-m-t-30">
				<div slot="title">
					<span>产品信息</span>
					<template v-if="showSign && $auth[1773]">
						<span class="g-operation g-m-l-20" @click="handleSignRenew">标记续费</span>
						<span v-if="tagData.is_renew" class="g-operation g-m-l-10" @click="handleCancelRenew">取消标记</span>
					</template>
				</div>
				<i-button v-if="$auth[1774]" slot="extra" type="primary" @click="handleRenewRecord">标记记录</i-button>
				<div slot="content" class="g-pd-t-25">
					<template v-for="items of project_arr">
						<oa-title 
							v-for="item of data[items]"
							:key="item.project_id" 
							:show-type="true" 
							type="expand"
							class="g-m-b-10" 
						>
							<template slot="title" class="g-flex g-jc-sb">
								<span class="g-fs-14">
									{{ item.product_name }}
								</span>
								<span class="g-m-l-30">
									标准价： {{ item.need_amount }}
								</span>
								<span class="g-m-l-30">
									成本： {{ item.need_cost_amount }}
								</span>
								<span v-if="getRenewAmount(item.product_id)!=-1" class="g-m-l-30">
									续费金额： {{ getRenewAmount(item.product_id) }}
								</span>
							</template>
							<span v-if="type === '1' || type === '2'" slot="extra" class="g-operation">
								<span 
									v-if="name === 'contract'" 
									@click="() => handleEditModal(item)"
								>
									编辑成本
								</span>
								<!-- <i-divider type="vertical" />
								<span @click="handleRecordModal">编辑记录</span> -->
							</span>
							<div slot="content" class="g-fw-w g-pd-t-25 g-relative">
								<div class="_sign">
									<oa-product-label
										v-if="getRenewAmount(item.product_id)!=-1"
										:type="5"
										class="g-m-b-5"
									/>
									<oa-product-label 
										v-for="(info, index) of item.project_label"
										:key="index + '11'"
										:type="info.value"
										class="g-m-b-5"
									/>
								</div>
								<oa-detail-item 
									v-for="(info, index) of item.sku"
									:key="index + '2'"
									:content="info.specs_name" 
									:label="info.specs_label" 
									class="g-m-t-15">{{ info.specs_name }}</oa-detail-item>
								<oa-detail-item 
									:content="item.need_cost_amount" 
									label="产品成本">{{ item.need_cost_amount }}</oa-detail-item>
								<oa-detail-item
									:content="item.cost_amount"
									label="实扣成本"
								>
									<oa-money-tooltip
										:total="item.cost_amount"
										:data="item.cost_amount_detail"
										type="cost"
									/>
								</oa-detail-item>
								<oa-detail-item 
									v-for="(info, index) of item.project_request" 
									:key="index + '1'" 
									:label="info.component_label"
									:content="info.component_value"
									class="g-m-t-15" 
								>
									<span v-if="info.component_type === 8">
										<span v-for="(mess, index) of info.component_value" :key="index">
											{{ mess }} 
											<span v-if="index < info.component_value.length - 1">-</span>
										</span>
									</span>
									<span v-else-if="info.component_type === 6">
										<oa-upload 
											:data-source="info.component_value.map(item => ({ type: '.png', url: item }))"
											:show-title="false"
											disabled 
										/>
									</span>
									<span v-else>{{ info.component_value }}</span>
								</oa-detail-item>
							</div>
						</oa-title>
					</template>
					<template v-for="item of data.renew_project">
						<oa-title 
							v-for="info of item" 
							:key="info.project_id" 
							:show-type="true" 
							class="g-m-b-10" 
							type="expand">
							<template slot="title">
								<span class="g-fs-14">
									{{ info.product_name }}
									<span 
										class="g-fs-12 g-m-l-5"
										style="width: 32px; height: 18px; background: #d9444f; color: #fff; display: inline-block;
										text-align: center; border-radius: 2px">续费</span>
								</span>
							</template>
							<div slot="content" class="g-fw-w g-pd-t-25">
								<oa-detail-item 
									v-if="item.sku.sku_name" 
									:content="item.sku.sku_name" 
									:label="item.sku.sku_label" 
									class="g-m-t-15">{{ item.sku.sku_name }}</oa-detail-item>
								<oa-detail-item :content="item.need_amount" label="应付金额">{{ item.need_amount }}</oa-detail-item>
								<oa-detail-item :content="item.payment_amount" label="实付金额">{{ item.payment_amount }}</oa-detail-item>
								<oa-detail-item 
									:content="item.need_cost_amount" 
									class="g-m-t-15" 
									label="产品成本">{{ item.need_cost_amount }}</oa-detail-item>
								<oa-detail-item
									:content="item.cost_amount"
									class="g-m-t-15"
									label="实扣成本"
								>
									<oa-money-tooltip
										:total="item.cost_amount"
										:data="item.cost_amount_detail"
										type="cost"
									/>
								</oa-detail-item>
								<oa-detail-item 
									v-for="(info, index) of item.project_request" 
									:key="index" 
									:label="info.component_label"
									:content="info.component_value"
									class="g-m-t-15" 
								>
									<span v-if="info.component_type === 8">
										<span v-for="(mess, index) of info.component_value" :key="index">
											{{ mess }} 
											<span v-if="index < info.component_value.length - 1">-</span>
										</span>
									</span>
									<span v-else-if="info.component_type === 6">
										<oa-upload 
											v-if="spin"
											:data-source="info.component_value.map(item => ({ type: '.png', url: item }))"
											:show-title="false"
											disabled
										/>
									</span>
									<span v-else>{{ info.component_value }}</span>
								</oa-detail-item>
							</div>
						</oa-title>
					</template>
				</div>
			</oa-title>
			<oa-title v-if="showCostRecord" class="g-m-t-30">
				<template slot="title">成本修改记录</template>
				<div slot="content">
					<oa-title :show-type="true" type="expand">
						<template slot="title">
							<span class="g-fs-14">成本修改记录</span>
						</template>
						<div slot="content" class="g-flex g-fw-w g-pd-t-25">
							<div 
								v-for="(item, index) of data.cost_record.filter(item=>item.list.length > 1)" 
								:key="index" 
								class="g-m-b-30" 
								style="width: 50%;">
								<div class="g-m-b-25 g-c-black2">{{ item.product_name }}</div>
								<oa-steps 
									v-if="spin"
									:type="1"
									:data-source="item.list"
									:render-title="renderTitle"
									:render-content="renderContent"
								/>
							</div>
						</div>
					</oa-title>
				</div>
			</oa-title>
		</div>
		<oa-loading v-else fix />
	</div>
</template>

<script>
import { Spin, Timeline, TimelineItem, Divider, Poptip, Button } from 'iview';
import { ImgsPreview } from 'wya-vc';
import Loading from '@components/_common/loading/loading';
import Steps from '@components/_common/steps/steps';
import Upload from '@components/_common/upload/upload';
import { Confirm } from '@components/_common/confirm/confirm';
import ProductLabel from '@components/_common/product-label/product-label';
import API_ROOT from '@stores/apis/root';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import Title from '../../title';
import DetailItem from '../../detail-item';
import { EditModal } from '../../../customer-contract/popup/edit';
import { RecordModal } from '../../../customer-contract/popup/record';
import { RebuySign } from '../../popup/rebuy-sign';
import { RebuySignRecord } from '../../popup/rebuy-sign-record';
import { RenewSign } from '../../popup/renew-sign';
import { RenewSignRecord } from '../../popup/renew-sign-record';

export default {
	name: 'finance-detail-tabs-demand',
	components: {
		'oa-title': Title,
		'oa-detail-item': DetailItem,
		'oa-loading': Loading,
		'i-timeline': Timeline,
		'i-timeline-item': TimelineItem,
		'i-button': Button,
		'oa-steps': Steps,
		'oa-imgs-preview': ImgsPreview,
		'oa-money-tooltip': MoneyTooltip,
		'oa-product-label': ProductLabel,
		'i-divider': Divider,
		'i-poptip': Poptip,
		'oa-upload': Upload
	},
	props: {
		type: String,
		contractId: Number,
		show: Boolean,
		label: String,
		dataInfo: Object,
		name: String,
		supplyId: Number,
		contractType: Number
	},
	data() {
		return {
			data: {
				invalid_record: {},
				finance_audit: {},
				contract_info: {},
				project: [],
				cost_record: [],
			},
			project_arr: ['project', 'supply_project', 'other_project'],
			spin: true,
			isfetching: 0,
			info: this.dataInfo,
			tagData: { 
				"is_repeat": 0, // 1已经复购0未复购
				"repeat_amount": "-1", // 复购金额，-1表示没有设置
				"is_renew": 1, // 1已经续费0未续费
				"renew_amount": "3000.00", // 续费金额，-1表示没有设置
				"renew_record": [// 续费记录
					// {
					// 	"product_id": 565,
					// 	"product_name": "线上内训", // 续费产品
					// 	"is_renew": 1, // 是否标记续费
					// 	"renew_amount": "100.00", // 标记续费金额
					// 	"is_config_renew": 1, // 是否配置为可续费
					// 	"config_renew_amount": "123.00", // 配置的续费金额
					// }
				]
			 }
		};
	},
	computed: {
		showCostRecord() {
			return this.data.cost_record.some(record => record.list.length > 1);
		},
		path() {
			return this.$route.path;
		},
		showSign() {
			console.log(this.path);
			return this.path == "/finance/customer/contract";
		}

	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
			this.loadData();
		},
		dataInfo(val) {
			this.info = val || {};
		}
	},
	created() {
		this.show && this.loadData();
	},
	mounted() {
		this.$vc.on('remain-refresh', (res) => {
			this.loadData();
		});
	},
	beforeDestroy() {
		this.$vc.off('remain-refresh');
	},
	methods: {
		handleRecordModal(item) {
			RecordModal.popup({

			}).then(res => {

			}).catch(err => {

			});
		},
		handleEditModal(item) {
			const { contract_id, contract_company_id, project_id, need_cost_amount } = item;
			EditModal.popup({
				supply_id: this.supplyId,
				contract_id,
				contract_company_id,
				project_id,
				need_cost_amount,
			}).then(res => {
				this.loadData();
			}).catch(err => {

			});
		},
		renderTitle(h, param = {}) {
			const { create_time, need_cost_amount, cost_amount, staff_name, index, data } = param.rows;
			return (
				<p class="g-fs-14 g-c-black2 g-m-l-10 g-nobreak">
					<div>
						<span>产品成本：{ need_cost_amount }</span>
						<span class="g-m-l-10">实扣成本：{ cost_amount }</span>
					</div>
					{ index !== data.length - 1 && <span>{ staff_name }</span> }
					<span class="g-m-l-10">{ create_time }</span>
				</p>
			);
		},
		renderContent(h, param = {}) {
			const { remark, type } = param.rows;
			return (
				remark !== '' && <p 
					class="g-c-black4 g-pd-t-5 g-pd-b-20 g-m-l-10 g-nobreak"
				>
					修改原因：{ remark }
				</p>
			);
		},
		async loadData() {
			this.spin = false;
			this.isfetching = 1;

			await Promise.all([
				this.loadProjectData(),
				this.loadTagData()
			]);
			this.spin = true;
			this.isfetching = 0;
		},
		loadProjectData() {
			return this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_PROJECT_GET,
				type: 'GET',
				param: {
					contract_id: this.label === '原项目需求' ? this.info.parent_contract_id : this.contractId,
					project_id: this.label === '原项目需求' ? this.info.parent_project_id : ""
				},
				loading: false
			}).then(res => {
				this.data = res.data;
				return res.data;
			}).catch(err => {
				console.error(err);
					
			});

		},
		loadTagData() {
			return this.$request({
				url: "_FINANCE_CUSTOMER_PROJECT_TAG_GET",
				type: "GET",
				param: {
					contract_id: this.label === '原项目需求' ? this.info.parent_contract_id : this.contractId,
				},
				loading: false,
			}).then(res => {
				this.tagData = res.data;
				return res.data;
				
			}).catch((err) => {
				console.error(err);
			});
		},
		handleSignRebuy() {
			RebuySign.popup({
				repeatAmount: this.tagData.repeat_amount == -1 ? this.data.contract_info.payment_amount : this.tagData.repeat_amount,
				contractId: this.contractId
			}).then(() => {
				this.loadTagData();
			}).catch(err => err && console.error(err));
		},
		handleCancelRebuy() {
			Confirm.popup({
				title: '取消复购标记',
				msg: "确认取消复购标记吗？"
			}).then(() => {
				this.$request({
					url: "_FINANCE_CUSTOMER_REBUY_SIGN_CANCEL_POST",
					type: "GET",
					param: {
						contract_id: this.contractId
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadTagData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(err => err && console.error(err));
		},
		handleRebuyRecord() {
			RebuySignRecord.popup({
				contractId: this.contractId,
			}).catch(err => err && console.error(err));

		},
		handleSignRenew() {
			RenewSign.popup({
				contractId: this.contractId,
				productList: this.data.project.map(it => ({ product_id: it.product_id, product_name: it.product_name })),
				renewProducts: this.tagData.renew_record
			}).then(() => this.loadTagData()).catch(err => err && console.error(err));

		},
		handleCancelRenew() {
			Confirm.popup({
				title: '取消续费标记',
				msg: "取消后，所有续费产品的续费标签将全部删除，是否确认取消？"
			}).then(() => {
				this.$request({
					url: "_FINANCE_CUSTOMER_RENEW_SIGN_CANCEL_POST",
					type: "GET",
					param: {
						contract_id: this.contractId
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadTagData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(err => err && console.error(err));
		},
		handleRenewRecord() {
			RenewSignRecord.popup({
				contractId: this.contractId
			}).catch(err => err && console.error(err));
		},
		getRenewAmount(productId) {
			const exist = (this.tagData.renew_record || []).find(it => it.product_id == productId);
			if (exist && exist.is_renew) {
				return exist.renew_amount;
			} else {
				return -1;
			}
		}
	}
};
</script>

<style lang="scss">
.v-finance-tab {
	min-height: 400px;
	position: relative;
	padding-bottom: 60px;

	._sign {
		position: absolute;
		right: 0;
		top: 20px;
	}
}
</style>


