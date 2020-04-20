<template>
	<i-modal 
		ref="modal" 
		v-model="visible" 
		:width="600" 
		:mask-closable="false" 
		:loading="true" 
		@on-ok="handleOk" 
		@on-cancel="handleCancel">
		<div slot="header" class="g-tc">查看详情</div>
		<div class="v-finance-collage-detail-performance-modal">
			<h3>{{ performanceData.contract_company_name }}</h3>
			<div v-if="is_show">
				<i-row>
					<i-col span="12" class="g-m-t-10">
						<span class="_left">实付金额：</span><span class="g-m-l-20">{{ performanceData.payment_amount }}</span>
					</i-col>
					<i-col span="12" class="g-m-t-10">
						<span class="_left">到账金额：</span><span class="g-m-l-20">{{ performanceData.received_amount }}</span>
					</i-col>
					<i-col span="12" class="g-m-t-10">
						<span class="_left">促单业绩：</span><span class="g-m-l-20">{{ performanceData.minus_performance }}</span>
					</i-col>
					<i-col span="12" class="g-m-t-10">
						<span class="_left">款项标签：</span><span class="g-m-l-20">{{ performanceData.payment_label }}</span>
					</i-col>
					<i-col span="12" class="g-m-t-10">
						<span class="_left">原始时间：</span><span class="g-m-l-20">{{ performanceData.original_time }}</span>
					</i-col>
					<i-col span="12" class="g-m-t-10">
						<div class="g-flex">
							<span class="_left">付款时间：</span>
							<i-tooltip v-if="performanceData.payment_time.length>=2" max-width="200" placement="top">
								<span class="g-m-l-20">{{ performanceData.payment_time[performanceData.payment_time.length-1] }}</span>
								<div slot="content">
									<div v-for="(item,index) in performanceData.payment_time" :key="index">
										{{ item }}
									</div>
								</div>
							</i-tooltip>
							<span v-else class="g-m-l-20">{{ performanceData.payment_time[0] }}</span>
						</div>
					</i-col>
					<i-col span="12" class="g-m-t-10">
						<span class="_left">审核时间：</span><span class="g-m-l-20">{{ performanceData.audit_time }}</span>
					</i-col>
					<i-col span="12" class="g-m-t-10 g-flex">
						<div class="g-flex">
							<span class="_left">备注：</span>
							<oa-auto-tooltip 
								:content="performanceData.audit_remarks" 
								width="200px" 
								class="g-m-l-20" 
								theme="dark" 
								placement="bottom" 
								label-class="g-c-000" />
						</div>
					</i-col>
				</i-row>
			</div>
			<div v-else class="g-flex g-flex-ac g-flex-cc g-m-t-20">
				记录不存在或没有通过审核
			</div>
		</div>
	</i-modal>
</template>

<script>
import {
	Divider,
	Modal,
	Checkbox,
	CheckboxGroup,
	Row,
	Col,
	Tooltip
} from "iview";
import {
	CreatePortal
} from "wya-vc";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from "@stores/apis/root";

export default {
	name: "v-finance-collage-detail-performance-modal",
	components: {
		"i-modal": Modal,
		"i-checkbox": Checkbox,
		"i-checkbox-group": CheckboxGroup,
		"i-row": Row,
		"i-col": Col,
		"i-tooltip": Tooltip,
		"oa-auto-tooltip": AutoToolTip
	},
	props: {
		record_id: Number,
		month: String,
		type: String
	},
	data() {
		return {
			visible: false,
			is_show: true,
			performanceData: {
				minus_performance: 0, // 促单业绩
				month: "", // 月份
				audit_time: "", // 审核时间
				audit_remarks: "", // 审核备注
				update_time: "", // 修改时间
				contract_company_name: "", // 公司名称
				received_amount: 0, // 到账金额
				payment_amount: 0, // 付款金额
				original_time: "", // 原始时间
				payment_time: [""], // 付款时间
				payment_label: "", // 款项标签
				audit_staff_name: ""
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.$emit("sure");
		},
		handleCancel() {
			this.$emit("close");
		},
		loadData() {
			let url = this.type == 1 ? API_ROOT._FINANCE_COUNT_STAFF_LECTURER_PERFORMANCE_GET : API_ROOT._FINANCE_BS_MANAGE_PERFORMANCE_DETAIL_GET;
			this.$request({
				url,
				type: "GET",
				param: {
					record_id: this.record_id,
					month: this.month
				},
				loading: false
			}).then(res => {
				this.performanceData = res.data;
			}).catch(err => {
				this.is_show = false;
				// this.$Message.error(err.msg);
			});
		}
	}
};
export const PerformanceModal = CreatePortal({
	store: app.$store
},
module.exports.default);
</script>

<style lang="scss">
.v-finance-collage-detail-performance-modal {
	padding: 14px 20px 20px 20px;
	._left {
		min-width: 70px;
		width: 70px;
	}
}
</style>
