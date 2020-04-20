<template>
	<div class="v-sale-customer-project-request g-relative" style="min-height:260px;width:680px" >
		<oa-loading v-if="loading"/>
		<template v-if="invalidRecord.create_time && condition=='contract'">
			<div class="g-m-t-30" >
				<span class="_title-bar g-bg-red-mid" /> 
				<span class="g-fs-14 g-m-lr-5">失效记录</span>
			</div>
			<div class="g-flex g-fw-w g-relative g-pd-l-10" style="width:910px">
				<oa-info-item :content="invalidRecord.remark" label="失效原因" />
				<oa-info-item :content="invalidRecord.create_time" label="失效时间" />
			</div>
		</template>
		<div class="g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" /> 
			<span class="g-fs-14 g-m-lr-5">款项信息</span>
		</div>
		<div class="g-flex g-fw-w g-relative g-pd-l-10" style="width:910px">
			<oa-info-item :content="contractInfo.contract_amount" label="合同金额" />
			<oa-info-item :content="contractInfo.need_amount" label="应付金额" />
			<oa-info-item :content="contractInfo.payment_amount" label="实付金额">
				<oa-money-tooltip :total="contractInfo.payment_amount" :data="contractInfo.payment_amount_detail" />
			</oa-info-item>
			<oa-info-item :content="contractInfo.last_amount" label="剩余尾款" />
			<oa-info-item :content="contractInfo.total_need_cost_amount" label="产品成本" />
			<oa-info-item label="实扣成本" >
				<oa-money-tooltip :total="contractInfo.total_cost_amount" :data="contractInfo.total_cost_amount_detail" />
			</oa-info-item>
			<oa-info-item label="提成业绩" >
				<oa-money-tooltip :total="contractInfo.commission_performance" :data="contractInfo.commission_performance_detail" />
			</oa-info-item>
			<oa-info-item label="服务提成">
				<oa-money-tooltip :total="contractInfo.service_amount" :data="contractInfo.service_amount_detail" />
			</oa-info-item>
			<oa-info-item v-if="tagData.is_repeat" :content="tagData.repeat_amount" label="复购金额"/>
		</div>
		<div class="g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" /> 
			<span class="g-fs-14 g-m-lr-5">产品信息</span>
		</div>
		<oa-expand-panel v-for="(pro,index) in projects" :key="index" :border="false" class="g-relative">
			<span slot="header" class="g-m-lr-5">
				{{ pro.product_name }}
				<span class="g-m-l-20">标准价：{{ pro.need_amount }}元</span>
				<span class="g-m-l-20">成本：{{ pro.need_cost_amount }}元</span>
				<span v-if="getRenewAmount(pro.product_id)!=-1" class="g-m-l-20">续费金额：{{ getRenewAmount(pro.product_id) }}</span>
			</span>
			<div class="g-flex g-fw-w g-relative g-pd-l-10 g-pd-b-20" style="width:910px">
				<!-- <img v-if="showAudit(data.type, project.status)" :src="auditIcon[project.status]" class="_audit-img"> -->
				<oa-info-item 
					v-for="(sku,index) in pro.sku"
					:key="index+'sku'"
					:content="sku.specs_name" 
					:label="sku.specs_label" 
				/>
				<oa-info-item
					:content="pro.need_cost_amount" 
					label="产品成本" 
				/>
				<oa-info-item label="实扣成本">
					<oa-money-tooltip :total="pro.cost_amount" :data="pro.cost_amount_detail" type="cost" />
				</oa-info-item>
				<oa-info-item 
					v-for="(item,index) in pro.project_request"
					:key="index"
					:label="item.component_label"
					:content="item.component_value"
					:type="item.component_type"
					tooltip
					
				/>
			</div>
			<div class="_product-label">
				<oa-product-label
					v-if="getRenewAmount(pro.product_id)!=-1"
					:type="5"
					style="margin-bottom:10px" 
				/>
				<oa-product-label 
					v-for="(lab,index) in pro.project_label" 
					:type="lab.value" 
					:key="index" 
					style="margin-bottom:10px" 
				/>
			</div>
		</oa-expand-panel>
		<oa-expand-panel v-if="costRecord && condition=='contract' && costRecord.filter(item=>item.list.length>1).length>0">
			<span slot="header" class="g-fs-14 g-m-lr-5">成本修改记录</span>
			<div class="g-flex g-fw-w g-pd-b-20 g-pd-l-20" style="margin-right:-40px">
				<div v-for="(item,index) in costRecord.filter(it=>it.list.length>1)" :key="index">
					<div class="g-fs-14 g-m-l-10 g-m-tb-10 g-c-black1">{{ item.product_name }}</div>
					<oa-record :records="item.list" style="width:430px;margin-right:40px" >
						<div slot-scope="{data,index}">
							<div class="g-fs-12 g-c-black2">
								<span class="g-fs-12 g-c-black4">{{ data.create_time }}</span>
								<span v-if="index!==(item.list.length-1)" class="g-dp-i g-m-lr-20 g-c-black2">{{ data.staff_name }}</span>
								<br>
								产品成本：{{ data.need_cost_amount }} 
								<span class="g-m-l-10">实扣成本：{{ data.cost_amount }}</span>
							</div>
							<div v-if="data.type==1" class="g-c-black2 ">修改原因：{{ data.remark }}</div>
						</div>
					</oa-record>
				</div>
			</div>
		</oa-expand-panel>
	</div>
</template>

<script >
import { Poptip } from 'iview';
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import ExpandPanel from '@components/_common/expand-panel/expand-panel';
import ProductLabel from '@common/product-label/product-label';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import { OSS_REJECT, OSS_PASS, OSS_WAIT_CONFIRM, OSS_ACTIVE } from "@constants/constants";
import { ApplyRefund } from '../../../apply-refund.vue';
import InfoBlock from '../../../../info-block';
import InfoItem from '../../../../info-item';
import Record from '../../../../record';
import { setData } from '../../../../util';

export default {
	components: {
		'i-poptip': Poptip,
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'oa-expand-panel': ExpandPanel,
		'oa-record': Record,
		'oa-loading': Loading,
		'oa-product-label': ProductLabel,
		'oa-money-tooltip': MoneyTooltip
	},
	props: {
		contractId: Number,
		projectId: Number,
		data: Object,
		condition: {
			type: String,
			default: 'contract',
			validator: (val) => {
				return ['contract', 'refund'].includes(val);

			}
		}
	},
	data() {
		return {
			loading: false,
			auditIcon: {
				1: OSS_WAIT_CONFIRM,
				2: OSS_PASS,
				3: OSS_PASS,
				4: OSS_PASS,
				5: OSS_REJECT,
				6: OSS_PASS
			},
			OSS_REJECT,
			OSS_ACTIVE,
			contractInfo: {
				contract_amount: '', // 合同金额
				need_amount: "", // 应付金额
				payment_amount: "", // 实付金额
				last_amount: "", // 剩余尾款
				total_need_cost_amount: "", // 产品成本
				total_cost_amount: "", // 实扣成本
				commission_performance: "", // 提成业绩
				service_amount: "", // 服务提成
				payment_amount_detail: {}, // 实付金额	
				service_amount_detail: {}, // 服务提成浮框     
				total_cost_amount_detail: {}, // 合同成本浮框
				commission_performance_detail: {}// 提成业绩浮框
				// 数据格式文档 https://wiki.ruishan666.com/web/#/39?page_id=2912
				
			},
			projects: {
				finance_audit: {},
				cost_record: [],
				parent_contract: [],
				project: [],
				other_project: []
			},
			costRecord: [],
			invalidRecord: {
				refund_type: '',
				refund_type_name: "", // 失效类型
				remark: "",
				real_refund_amount: "", // 退款金额
				create_time: ""
			},
			tagData: {
				"is_repeat": 0, // 1已经复购0未复购
				"repeat_amount": "-1", // 复购金额，-1表示没有设置
				"is_renew": 0, // 1已经续费0未续费
				"renew_amount": "0.00", // 续费金额，-1表示没有设置
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
	watch: {
		contractId() {
			this.loadData();
		},
		projectId() {
			// 传了就监听
			this.loadData();
		}
	},
	created() {
		this.loadData();

	},
	methods: {
		loadData: debounce(function () {
			this.loadProjects();
			this.loadTagData();
		}, 50),
		loadProjects() {
			if (!this.contractId) return;
			this.loading = true;
			this.$request({
				url: "_SALE_CONTRACT_PROJECT_GET",
				type: "GET",
				param: { 
					contract_id: this.contractId,
					project_id: this.projectId,
				  },
				loading: false,
			}).then((res) => {
				this.loading = false;
				this.contractInfo = res.data.contract_info;
				this.projects = res.data.project;
				this.costRecord = res.data.cost_record;
				this.invalidRecord = res.data.invalid_record;

			}).catch((res) => {
				this.loading = false;
				console.error(res);
				this.$Message.error(res.msg);

			});
		},
		loadTagData() {
			return this.$request({
				url: "_FINANCE_CUSTOMER_PROJECT_TAG_GET",
				type: "GET",
				param: {
					contract_id: this.contractId,
				},
				loading: false,
			}).then(res => {
				this.tagData = res.data;
				return res.data;
			}).catch((err) => {
				console.error(err);
			});
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
.v-sale-customer-project-request {
	._supply{
		height: 18px;
		width: 32px;
		background-color: #e84c57;
		color: white;
		padding: 1px 4px;
		border-radius: 2px;
		margin-right: 5px;
	}
	._audit-img {
		width: 80px;
		height: 80px;
		position: absolute;
		left: 566px;
		top: 5px;
	}
}
</style>
