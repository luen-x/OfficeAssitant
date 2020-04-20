<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="600"
		:mask-closable="false"
		:loading="true"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>查看详情</div>
		<div class="v-finance-collage-detail-performance-modal">

			<div class="g-m-l-15">
				<div v-if="type==2">
					<h3>{{ performanceData.contract_company_name }}</h3>
					<i-row
						v-for="(item,index) in performanceData.subject"
						:key="index"
					>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课程主题：</span>
							<span class="g-m-l-10">{{ item.subject_name }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">讲课时间：</span>
							<span class="g-m-l-10">{{ item.lecture_time }}</span>
						</i-col>
					</i-row>
					<i-row>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课程类型：</span>
							<span class="g-m-l-10">{{ performanceData.name }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">业绩金额：</span>
							<span class="g-m-l-10">{{ performanceData.performance }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">讲课时长：</span>
							<span class="g-m-l-10">{{ performanceData.total_duration }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课时费：</span>
							<span class="g-m-l-10">{{ performanceData.class_hour_salary }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">补贴金额：</span>
							<i-tooltip
								v-if="performanceData.allowance.length"
								placement="top"
							>
								<span class="g-m-l-10">{{ performanceData.allowance_salary }}</span>
								<div slot="content">
									<div
										v-for="(item,index) in performanceData.allowance"
										:key="index"
									>
										<div>
											<span>{{ item.type_name }}</span> <span class="g-m-l-10">{{ item.amount }}</span>
										</div>
									</div>
								</div>
							</i-tooltip>
							<span
								v-else
								class="g-m-l-10"
							>{{ performanceData.allowance_salary }}</span>
						</i-col>
					</i-row>
				</div>

				<!-- 第二段 -->
				<div v-else-if="type==1">
					<h3>{{ performanceData.contract_company_name }}</h3>
					<i-row
						v-for="(item,index) in performanceData.subject"
						:key="index"
					>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课程主题：</span>
							<span class="g-m-l-10">{{ item.subject_name }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">讲课时间：</span>
							<span class="g-m-l-10">{{ item.lecture_time }}</span>
						</i-col>
					</i-row>
					<i-row>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">套系名称：</span>
							<span class="g-m-l-10">{{ performanceData.name }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课时数：</span>
							<span class="g-m-l-10">{{ performanceData.class_hours_times }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课时费：</span>
							<span class="g-m-l-10">{{ performanceData.class_hour_salary }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">补贴金额：</span>
							<i-tooltip
								v-if="performanceData.allowance.length"
								placement="top"
							>
								<span class="g-m-l-10">{{ performanceData.allowance_salary }}</span>
								<div slot="content">
									<div
										v-for="(item,index) in performanceData.allowance"
										:key="index"
									>
										<div>
											<span>{{ item.type_name }}</span> <span class="g-m-l-10">{{ item.amount }}</span>
										</div>
									</div>
								</div>
							</i-tooltip>
							<span
								v-else
								class="g-m-l-10"
							>{{ performanceData.allowance_salary }}</span>
						</i-col>
					</i-row>

				</div>
				<!-- 第三段 -->
				<div v-else>
					<h3>{{ performanceData.lesson_name }}</h3>
					<i-row>
						<i-col
							v-if="performanceData.field_key.indexOf(1) !=-1"
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">活动类型：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.activity_type }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(2) !=-1"
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">担任角色：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.role_type_name }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(3) !=-1"
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">活动名称：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.lesson_name }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(4) !=-1"
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">参与日期：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.join_time }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(5) !=-1"
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">参与天数：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.join_day }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(6) !=-1"
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">讲课时长：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.lecturer_hour }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(7) !=-1"
							span="24"
							class="g-m-t-10"
						>
							<span class="_left">课程主题：</span>
							<span class="g-m-l-10">{{ performanceData.record_field.lesson_subject }}</span>
						</i-col>
						<i-col
							v-if="performanceData.field_key.indexOf(10) !=-1"
							span="24"
							class="g-m-t-10"
						>
							<span class="_left">备注：</span>
							<span class="g-m-l-10">
								<i-tooltip
									transfer
									placement="bottom-start"
									style="maxWidth:250px"
								>
									<span>
										{{ performanceData.record_field.remark.length>15
											?performanceData.record_field.remark.substr(0, 15) + "..." 
											:performanceData.record_field.remark
										}}	
									</span>
									<div slot="content">
										<p style="whiteSpace: normal">
											{{ performanceData.record_field.remark }}
										</p>
									</div>
								</i-tooltip>
							</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">课时费：</span>
							<span class="g-m-l-10">{{ performanceData.class_hour_salary }}</span>
						</i-col>
						<i-col
							span="12"
							class="g-m-t-10"
						>
							<span class="_left">补贴金额：</span>
							<i-tooltip
								v-if="performanceData.allowance.length"
								placement="top"
							>
								<span class="g-m-l-10">{{ performanceData.allowance_salary }}</span>
								<div slot="content">
									<div
										v-for="(item,index) in performanceData.allowance"
										:key="index"
									>
										<div>
											<span>{{ item.type_name }}</span> <span class="g-m-l-10">{{ item.amount }}</span>
										</div>
									</div>
								</div>
							</i-tooltip>
							<span
								v-else
								class="g-m-l-10"
							>{{ performanceData.allowance_salary }}</span>
						</i-col>
						
					</i-row>
				</div>
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
import { CreatePortal } from "wya-vc";
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
		type: String | Number,
		record_id: Number
	},
	data() {
		return {
			visible: false,
			performanceData: {
				field_key: [],
				subject: [], // 付款时间
				payment_label: "", // 款项标签
				audit_staff_name: "",
				allowance: []
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
			this.$request({
				url: API_ROOT._FINANCE_LECTURE_DETAIL_GET,
				type: "GET",
				param: {
					record_id: this.record_id,
					type: this.type
				},
				loading: false
			}).then(res => {
				this.performanceData = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const PrelectionModal = CreatePortal(
	{ store: app.$store },
	module.exports.default
);
</script>

<style lang="scss">
.v-finance-collage-detail-performance-modal {
  padding: 14px 20px 20px 20px;
  .v-auto-tooltip {
    width: 72%;
  }
  ._left {
    width: 60px;
    text-align: right;
    display: inline-block;
  }
}
</style>


