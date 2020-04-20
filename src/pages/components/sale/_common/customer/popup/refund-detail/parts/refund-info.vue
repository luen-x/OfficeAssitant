<template>
	<div class="v-sale-customer-refund-info g-relative" style="min-height:260px;" >
		<oa-loading v-if="!noLoading && loading"/>
		<template>
			<!-- 换产品退款 -->
			<oa-across-table :data="audit_schedule">
				<div 
					slot-scope="{item:data}" 
					class="g-flex g-flex-cc g-fd-c"
				>
					<div class="g-m-t-10">{{ data.title }}</div>
					<div 
						v-if="data.status != 4" 
						class="g-c-black5"
					>
						{{ data.create_time }}
					</div>
					<!-- <div 
						v-else 
						class="g-c-orange-mid g-pointer"
						@click="handleRemind"
					>
						催一下
					</div> -->
				</div>
			</oa-across-table>
			<oa-info-block v-for="(item,index ) in auditList" :title="item.audit_depart_name|| '未设置'" :data="item" :key="index">
				<oa-info-item :content="item.audit_staff_name" tooltip label="审核人" />
				<oa-info-item :content="item.audit_time" label="审核时间" />
				<oa-info-item v-if="item.status==2 || item.status==3" :content="item.audit_remark" :label="auditRemarkName[item.status]" tooltip />
			</oa-info-block>
		</template>
		<!-- <oa-info-block v-else-if="auditList[0]" :data="auditList[0]" title="审核信息" >
			<oa-info-item :content="auditList[0].audit_staff_name" label="审核人" />
			<oa-info-item :content="auditList[0].audit_time" label="审核时间" />
			<oa-info-item 
				v-if="auditList[0].status==2 || auditList[0].status==3" 
				:content="auditList[0].audit_remark" 
				:label="auditRemarkName[auditList[0].status]" 
				tooltip
			/>
		</oa-info-block> -->
		<!-- 1 产品退款 ， 2 换产品退款 ， 3 余额退款 -->
		<oa-info-block :title="'退款信息'" >
			<oa-info-item :content="refund_info.real_refund_amount" label="退款金额" >
				<oa-money-tooltip v-if="refundType==3" :total="refund_info.real_refund_amount" :data="refund_info.real_refund_amount_detail" />
				<i-poptip
					v-else-if="status==2"
					:width="150"
					content=""
					word-wrap
					trigger="hover"
					placement="top"
					transfer
				>
					<span class="g-operation">{{ refund_info.real_refund_amount }}</span>
					<div slot="content">
						<!-- eslint-disable-next-line -->
						<div v-for="(item,index) in refund_info.real_refund_amount_detail" :key="index" class="g-lh-16">{{ item.product_name }}<br>{{ item.refund_amount }}</div>
					</div>
				</i-poptip>
			</oa-info-item>
			<oa-info-item v-if="refundType==3" :content="refund_info.refund_mode_name" label="退款种类" />
			<oa-info-item v-else :label="refundType==1?'退款产品':'被换产品'" >
				<i-poptip v-if="refund_info.refund_project_name.length ==projectNameLength+1" transfer trigger="hover">
					<span class="g-c-black2">{{ refund_info.refund_project_name }}</span>
					<div slot="content">
						<div v-for="(pro,index) in refund_info.refund_project" :key="index">
							{{ pro.product_name }}
						</div>
					</div>
				</i-poptip>
				<span v-else class="g-c-black2">{{ refund_info.refund_project_name }}</span>
			</oa-info-item>
			<oa-info-item 
				v-if="refund_info.refund_reason_str" 
				:content="refund_info.refund_reason_str" 
				label="退款原因" 
				tooltip
				label-class="g-operation" 
			/>
			<oa-info-item :content="refund_info.remark" label="备注说明" tooltip label-class="g-operation" />
			<oa-info-item v-if="refund_info.refund_explain_num" :content="refund_info.remark" label="补充说明" tooltip>
				<i-poptip
					:width="150"
					content=""
					word-wrap
					trigger="hover"
					placement="top"
					transfer
				>
					<span class="g-operation">{{ refund_info.refund_explain_num }}条</span>
					<div slot="content">
						<!-- eslint-disable-next-line -->
						<div v-for="(item,index) in refund_info.refund_explain" :key="index" class="g-lh-16">{{ item.explain }}</div>
					</div>
				</i-poptip>
			</oa-info-item>
			<oa-info-item :content="refund_info.staff_name" label="申请人" />
			<oa-info-item :content="refund_info.create_time" label="申请时间" />
			<oa-info-item v-if="refundType==2" :content="refund_info.after_product" label="换后产品" >
				<i-poptip v-if="refund_info.after_product_name.length ==projectNameLength+1" transfer trigger="hover">
					<span class="g-c-black2">{{ refund_info.after_product_name }}</span>
					<div slot="content">
						<div v-for="(pro,index) in refund_info.after_product" :key="index">
							{{ pro.product_name }}
						</div>
					</div>
				</i-poptip> 
				<span v-else class="g-c-black2" >{{ refund_info.after_product_name }}</span>
			</oa-info-item>

			<!-- 审核通过后的额外显示内容 -->
			<oa-info-item v-if="refundType==3 && status==2" :content="refund_info.minus_month" label="业绩扣除月份" />
			<template v-if="(refundType == 1 || refundType == 2) && status==2">
				<oa-info-item :content="refund_info.return_cost_amount" label="退还成本" >
					<i-poptip
						:width="150"
						content=""
						word-wrap
						trigger="hover"
						placement="top"
						transfer
					>
						<span class="g-operation">{{ refund_info.return_cost_amount }}</span>
						<div slot="content">
							<!-- eslint-disable-next-line -->
						<div v-for="(item,index) in refund_info.return_cost_amount_detail" :key="index" class="g-lh-16">{{ item.product_name }}<br>{{ item.refund_amount }}</div>
						</div>
					</i-poptip>
				</oa-info-item>
				<oa-info-item :content="refund_info.minus_month" label="退款月份" />
				
			</template>
		</oa-info-block>
	</div>
</template>
<script >
import { Poptip } from 'iview';
import AcrossTable from '@components/_common/across-table/across-table';
import Loading from '@components/_common/loading/loading';
import MoneyTooltip from '@components/sale/_common/customer/popup/components/money-tooltip';
import InfoBlock from '../../../../info-block';
import InfoItem from '../../../../info-item';
import { setData } from '../../../../util';

const auditRemarkName = {
	1: '待审核', 
	2: '通过说明',
	3: '驳回说明', 
	4: '已取消' 
};

export default {
	name: "oa-sale-refund-info",
	components: {
		'oa-across-table': AcrossTable,
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'oa-loading': Loading,
		'i-poptip': Poptip,
		'oa-money-tooltip': MoneyTooltip
	},
	props: {
		refundId: Number,
		refundType: Number, // 1 产品退款 ， 2 换产品退款 ， 3 余额退款
		noLoading: Boolean,
		status: [String, Number], // 1 待审核 ， 2 已通过  3 未通过
	},
	data() {
		return {
			loading: false,
			projectNameLength: 16,
			auditRemarkName,
			audit_schedule: [],
			refund_info: {// 退款信息
				refund_type: 2, // //退款类型   1 产品退款 2 换产品退款 3 余额退款
				"remark": "", // 退款理由
				"contract_num": "", // 合同编号 换产品和 合同退款对应的合同编号
				"create_time": "", // 退款申请时间
				"staff_name": "", // 申请人
				"refund_type_name": "", // 退款类型
				"real_refund_amount": "", // 退款金额,
				"refund_mode_name": "", // 退款种类
				"payment_id": 1, // 余额退款到账记录ID
				"minus_month": "", // 提成扣除月份
				"return_cost_amount": "", // 返还成本
				"pro": 11700, // 促单业绩
				pro_detail: [],

				"team_performance": 150, // 团队业绩
				team_performance_detail: [],
				"refund_project": [// 被退产品 、 被换产品
					{
						"refund_id": 0,
						"project_id": 0, // 项目ID
						"return_cost_amount": 0, // 返还金额
						"product_name": ""// 产品名称
					}
				],
				refund_project_name: '',
				after_product_name: '',
				"after_product": [// 换后产品
					{
						"product_id": 1,
						"product_name": ""
					},
					{
						"product_id": 2,
						"product_name": ""
					}
				],
				real_refund_amount_detail: [],
				return_cost_amount_detail: [],
				refund_reason_str: '',
				refund_explain_num: '',
				refund_explain: []
			},
			auditList: [],
		};
	},
	watch: {
		refundId() {
			this.loadData();
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loadRefundInfo();

		},
		handleRemind() {
			this.$request({
				url: "_SALE_URGE_CHANGE_PRODUCT_REFUND_POST",
				type: "GET",
				param: {
					relation_id: this.refundId
				},
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		loadRefundInfo() {
			this.loading = true;
			this.$request({
				url: "_SALE_REFUND_INFO_GET",
				type: "GET",
				param: { refund_id: this.refundId },
				loading: false,
			}).then(res => {
				const len = this.projectNameLength;
				this.audit_schedule = res.data.audit_schedule; // 流程
				const refund_info = res.data.refund_info;
				if (refund_info.refund_type != 3 || refund_info.refund_mode == 3) {
					const arr = [];
					refund_info.refund_reason.forEach(item => {
						item.reason_list.forEach(it => {
							arr.push(item.reason_category_name + '-' + it.reason_name);
						});
					});
					refund_info.refund_reason_str = arr.join('、');
				} else refund_info.refund_reason_str = '';
				setData(this.refund_info, refund_info);
				
				this.refund_info.refund_project_name = this.refund_info.refund_project.map(pro => pro.product_name).join("、");
				if (this.refund_info.refund_project_name.length > len) {
					this.refund_info.refund_project_name = this.refund_info.refund_project_name.substr(0, len - 2) + '...';
				}
				this.refund_info.after_product_name = this.refund_info.after_product.map(pro => pro.product_name).join("、");
				if (this.refund_info.after_product_name.length > len) {
					this.refund_info.after_product_name = this.refund_info.after_product_name.substr(0, len - 2) + '...';
				}

				this.auditList = res.data.audit_info;

				this.loading = false;
			}).catch((res) => {
				this.loading = false;
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
	}
};
</script>
<style lang="scss">
.v-sale-customer-refund-info {
	width:680px;
}
.v-sale-tabcontent-large.v-sale-customer-refund-info {
	width:900px;
	.v-sale-customer-info-item {
		width: 400px;
	}
}
</style>