<template>
	<div class="g-m-l-20 g-pd-r-30 v-hr-employee-score-service-validation">
		<div class="g-m-t-20">
			<i-date-picker
				v-model="service_month_start"
				:options="{disabledDate:disableMonthStart}"
				type="month"
				clearable
				transfer
				placeholder="请选择开始服务月"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'start')"/>
			<i-date-picker
				v-model="service_month_end"
				:options="{disabledDate:disableMonthEnd}"
				type="month"
				clearable
				transfer
				placeholder="请选择结束服务月"
				style="width: 220px;"
				class="g-m-r-5"
				@on-change="handleDateChange($event, 'end')"/>
		</div>
		<oa-detail-table
			:confirmed-count="service_audit.length"
			:data-source="service_audit"
			:columns="serviceColumns"
			:show-number="name === 'evalute'"
			name="服务审核"
		/>
		<oa-detail-table
			:confirmed-count="basic_point_audit.service_records.length"
			:data-source="basic_point_audit.service_records"
			:columns="basicColumns"
			:show-number="name === 'evalute'"
			:show-select="within_system==1&&name === 'evalute'"
			name="基础服务"
			@select-evaluate="(rows)=>{handleEvaluate([], rows , 'basic_point_audit', true,'整体评定')}">
			<span slot="extra" class="g-c-blue-mid">
				<!-- <template v-if="within_system==1">
					员工：{{ basic_point_audit.point.total_point }}/{{ basic_point_audit.point.total_maximum }}分 |
					客户：{{ basic_point_audit.point.single_point }}/{{ basic_point_audit.point.single_maximum }}分
				</template> -->
				<template v-if="within_system==1">
					员工：{{ basic_point_audit.point.total_point }}分 |
					客户：{{ basic_point_audit.point.single_point }}分
				</template>
			</span>
		</oa-detail-table>
		<oa-detail-table
			:confirmed-count="consult_point_audit.service_records.length"
			:data-source="consult_point_audit.service_records"
			:columns="consultColumns"
			:show-number="name === 'evalute'"
			name="咨询服务">
			<span slot="extra" class="g-c-blue-mid">
				<!-- <template v-if="within_system==1">
					员工：{{ consult_point_audit.point.total_point }}/{{ consult_point_audit.point.total_maximum }}分 |
					客户：{{ consult_point_audit.point.single_point }}/{{ consult_point_audit.point.single_maximum }}分
				</template> -->
				<template v-if="within_system==1">
					员工：{{ consult_point_audit.point.total_point }}分 |
					客户：{{ consult_point_audit.point.single_point }}分
				</template>
			</span>
		</oa-detail-table>
		<oa-detail-table
			v-if="within_system==1"
			:confirmed-count="satisfaction_index.service_records.length"
			:data-source="satisfaction_index.service_records"
			:columns="satisfiedColumns"
			:show-number="name === 'evalute'"
			name="客户满意度">
			<span slot="extra" class="g-c-blue-mid">
				<!-- <template v-if="within_system==1">
					员工：{{ satisfaction_index.point.total_point }}/{{ satisfaction_index.point.total_maximum }}分 |
					客户：{{ satisfaction_index.point.single_point }}/{{ satisfaction_index.point.single_maximum }}分
				</template> -->
				<template v-if="within_system==1">
					员工：{{ satisfaction_index.point.total_point }}分 |
					客户：{{ satisfaction_index.point.single_point }}分
				</template>
			</span>
		</oa-detail-table>
		<oa-detail-table
			:confirmed-count="integral_index.service_records.length"
			:data-source="integral_index.service_records"
			:columns="integralColumns"
			:show-number="name === 'evalute'"
			name="客户回款">
			<span slot="extra" class="g-c-blue-mid">
				<!-- <template v-if="within_system==1">
					员工：{{ integral_index.point.total_point }}/{{ integral_index.point.total_maximum }}分 |
					客户：{{ integral_index.point.single_point }}/{{ integral_index.point.single_maximum }}分
				</template> -->
				<template v-if="within_system==1">
					员工：{{ integral_index.point.total_point }}分 |
					客户：{{ integral_index.point.single_point }}分
				</template>
			</span>
		</oa-detail-table>
	</div>
</template>

<script>
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { Table, Tooltip, DatePicker } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import moment from "moment";
import	detailTable from "../common/detail-table.vue";
import { EvaluteConfirmModal } from "./evaluate-confirm";


export default {
	name: "hr-employee-service-validation",

	components: {
		"vc-expand": Expand,
		"i-table": Table,
		"i-date-picker": DatePicker,
		'oa-detail-table': detailTable
	},

	props: {
		contract_company_id: Number,
		type: Number,
		within_system: [Number, String],
		name: String,
		contractLength: [Number, String],
	},
	data() {
		const columns = [
			{
				title: "服务名称",
				key: "service_name",
				minWidth: 120,
				render: (h, params) => {
					return (
						<div>

							{params.row.service_name.length > 6 ? <AutoToolTip
								content={params.row.service_name}
								theme="dark"
								width="100px"
								forceShow={true}
								placement="bottom"
								labelClass="g-pointer"
							/> : params.row.service_name}
							{
								!!params.row.is_supply && <span
									class="g-inline-block g-tc g-c-white g-m-l-5"
									style="width: 30px;height: 24px; line-height: 24px; background: #E84C57;border-radius: 4px;"
								>补交</span>
							}
						</div>
					);
				}
			},
			{
				title: "合同编号",
				minWidth: 100,
				key: "contract_names",
				render: (h, { row }) => {
					return row.contract_num_items.length > 1 && <AutoToolTip
						content={'合同编号：' + row.contract_num_items.join(',')}
						theme="dark"
						forceShow={true}
						placement="bottom"
						labelClass="g-pointer"
					/>;
				}
			},
			{
				title: "X次服务",
				key: "service_times",
				minWidth: 100,
				render: (h, { row }) => {
					return <div>{row.service_times}次服务</div>;
				}
			},
			{
				title: " ",
				key: " ",
				minWidth: 120,
				render: (h, params) => {
					return (
						<div>{params.row.material_month}服务</div>
					);
				}
			},
			{
				title: "提交时间",
				key: "create_time",
				minWidth: 120,
				tooltip: true,
				render: (h, params) => {
					return (
						<div>
							{
								params.row.create_time ? params.row.create_time + "提交" : "--"
							}
						</div>
					);
				}
			},
			{
				title: "过期时间",
				key: "expire_time",
				minWidth: 140,
				tooltip: true,
				render: (h, params) => {
					return (
						<div>
							{
								params.row.expire_time ? params.row.expire_time + "服务到期" : "--"
							}
						</div>
					);
				}
			}

		];

		return {
			columns,
			service: true,
			serviced: true,
			service_month_end: '',
			service_month_start: '',
			confirm: [],
			service_audit: [], // 服务审核
			basic_point_audit: {
				service_records: [],
				point: {}
			}, // 服务审核
			consult_point_audit: {
				service_records: [],
				point: {}
			}, // 咨询服务
			integral_index: {
				service_records: [],
				point: {}
			}, // 客户满意度
			satisfaction_index: {
				service_records: [],
				point: {}
			}, // 客户回款服务
			confirmed: [],
			confirmCount: "",
			serviceColumns: [
				...columns,
				{
					title: "操作",
					key: " ",
					minWidth: 60,
					tooltip: true,
					render: (h, params) => {
						// this.$auth["891"] &&
						return (<div
							class="g-pointer"
							style="color: #2397F9;"
							onClick={this.handleEvaluate.bind(this, this.service_audit, params, "service_audit", true, "评定")}
						>
							{this.name === "evaluted"
							 ? (params.row.service_status < 5) && this.$auth["892"]
									? '修改'
									: ''
								: this.$auth["891"] && "评定" }
						</div>
						);
					}
				}
			],
			basicColumns: [
				{
					type: "selection",
					width: 50,
				},
				...columns,
				{
					title: "操作",
					key: " ",
					minWidth: 80,
					tooltip: true,
					render: (h, params) => {
						// this.$auth["891"] &&
						return (<div
							class="g-pointer"
							style="color: #2397F9;"
							onClick={this.handleEvaluate.bind(this, this.basic_point_audit.service_records, params, "basic_point_audit", true, "评定")}
						>
							{this.name === "evaluted"
								? (params.row.service_status < 5)
									? params.row.is_group_head && params.row.group_first_record_id && this.$auth[1740]
										? "整评修改" : params.row.group_first_record_id > 0
											? ''
											: this.$auth["892"] && '修改'
									: ''
								: this.$auth["891"] && "评定" }
						</div>
						);
					}
				}
			],
			consultColumns: [
				...columns,
				{
					title: "操作",
					key: " ",
					minWidth: 60,
					tooltip: true,
					render: (h, params) => {
						// this.$auth["891"] &&
						return (<div
							class="g-pointer"
							style="color: #2397F9;"
							onClick={this.handleEvaluate.bind(this, this.consult_point_audit.service_records,
							 params, "consult_point_audit", true, "评定")}
						>
							{this.name === "evaluted"
								? (params.row.service_status < 5)
									? this.$auth["892"] && '修改'
									: ''
								: this.$auth["891"] && "评定" }
						</div>
						);
					}
				}
			],
			confirmedCount: "",

			satisfiedColumns: [
				{
					title: "服务名称",
					key: "satisfaction_name",
					minWidth: 360,
					tooltip: true,
				},
				{
					title: "时间",
					key: "create_time",
					minWidth: 360,
					tooltip: true,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.create_time ? row.create_time + "提交" : "--"
								}
							</div>
						);
					}
				},
				{
					title: "操作",
					key: " ",
					minWidth: 60,
					tooltip: true,
					render: (h, params) => {
						// this.$auth["891"] &&
						return (<div
							class="g-pointer"
							style="color: #2397F9;"
							onClick={this.handleEvaluate.bind(this,
							 this.satisfaction_index.service_records, params,
								"satisfaction_index", true, "评定")}
						>
							{this.name === "evaluted" ? (params.row.service_status < 5) ? this.$auth["892"] && '修改' : '' : this.$auth["891"] && "评定" }
						</div>
						);
					}
				}
			],
			integralColumns: [
				{
					title: "服务名称",
					key: "content",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "回款金额",
					key: "return_amount",
					minWidth: 90,
					tooltip: true,
					render: (h, params) => {
						if (params.row.return_amount) {
							return (
								<div>{params.row.return_amount}万</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: "代理人数",
					key: "agent_num",
					minWidth: 90,
					tooltip: true,
					render: (h, params) => {
						if (params.row.agent_num) {
							return (
								<div>{params.row.agent_num}人</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: "提交来源",
					key: "create_time",
					minWidth: 180,
					tooltip: true,
					render: (h, params) => {

						return (
							<div>
								{
									params.row.resource == 2 ? "立客户提交" : "销售提交"
								}
							</div>
						);
					}
				},
				{
					title: "提交时间",
					key: "create_time",
					minWidth: 180,
					tooltip: true,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.create_time ? row.create_time + "提交" : "--"
								}
							</div>
						);
					}
				},
				{
					title: "操作",
					key: " ",
					minWidth: 60,
					tooltip: true,
					render: (h, params) => {
						return (
							<div
								class="g-pointer"
								style="color: #2397F9;"
								onClick={this.handleEvaluate.bind(this, this.integral_index.service_records, params, "integral_index", true, "评定")}
							>
								{this.name === "evaluted" ? (params.row.service_status < 5)
									? this.$auth["892"] && '修改' : '' : this.$auth["891"] && "评定" }
							</div>
						);

					}
				}
			],
			confirmPage: 1,
			confirmFlag: false, // 判断请求的数组是否为空
			confirmedPage: 1,
			confirmedFlag: false,

		};
	},
	created() {
		if (!this.$auth[1739] || this.within_system != 1 || this.name == "evaluted") {
			this.basicColumns.shift();
		}
		if (this.contractLength <= 1) {
			this.serviceColumns = this.serviceColumns.filter(ele => ele.key != "contract_names");
			this.basicColumns = this.basicColumns.filter(ele => ele.key != "contract_names");
			this.consultColumns = this.consultColumns.filter(ele => ele.key != "contract_names");
		}
	},

	mounted() {
		this.handleChangeColumn();
		this.loadConfirmData();
		this.loadConfirmedData();
	},

	methods: {
		disableMonthStart(date) {
			if (this.service_month_end) {
				return moment(date) > moment(this.service_month_end);
			} else {
				return	false;
			}
		},
		disableMonthEnd(date) {
			if (this.service_month_start) {
				return moment(date) < moment(this.service_month_start);
			} else {
				return false;
			}
		},
		handleDateChange(month, val) {
			this['service_month_' + val] = month;
			this.loadConfirmData();
			this.loadConfirmedData();
		},
		loadConfirmData() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_SERVICE_LIST_GET',
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id,
					service_month_start: this.service_month_start,
					service_month_end: this.service_month_end,
					type: this.type,
					page: this.confirmPage
				},
				loading: false
			}).then(res => {
				this.confirmFlag = false;
				this.service_audit = [...res.data.service_audit];
				this.basic_point_audit = { ...res.data.basic_point_audit };
				this.consult_point_audit = { ...res.data.consult_point_audit };
				this.confirmCount = res.data.totalCount;
			}).catch(error => {
				console.error(error);
			});
		},
		loadConfirmedData() {
			this.$request({
				url: '_HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_INTEGRAL_LIST_GET',
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id,
					type: this.type,
					page: this.confirmedPage,
					service_month_start: this.service_month_start,
					service_month_end: this.service_month_end,
				},
				loading: false
			}).then(res => {
				this.confirmedFlag = false;
				this.integral_index = { ...res.data.integral_index };
				this.satisfaction_index = { ...res.data.satisfaction_index };
			}).catch(error => {
			});
		},

		handleToggle(value) {
			this.$refs[value].toggle();
		},
		handleRefresh(name) {
			this.loadConfirmData();
			this.loadConfirmedData();
			// if (name === "confirm") {
			// 	this.confirmPage = 1;
			// 	this.confirmFlag = false;
			// 	this.confirm = [];
			// 	this.confirmCount = 0;

			// 	this.$refs.confirmTable.$el.addEventListener(
			// 		"scroll",
			// 		this.confirmBottom
			// 	);
			// 	this.loadConfirmData();
			// } else {
			// 	this.confirmedPage = 1;
			// 	this.confirmedFlag = false;
			// 	this.confirmed = [];
			// 	this.confirmedCount = 0;

			// 	this.$refs.confirmedTable.$el.addEventListener(
			// 		"scroll",
			// 		this.confirmedBottom
			// 	);
			// 	this.loadConfirmedData();
			// }
		},

		handleEvaluate(arr, params, name, flag, title = '评定') {
			title = this.name === "evaluted"
			 ?	title == '整体评定'
					? "整体修改" : "修改" : title;
			EvaluteConfirmModal.popup({
				arr,
				params,
				rowName: name,
				flag,
				title,
				within_system: this.within_system,
				contract_company_id: this.contract_company_id,
				handleRefresh: this.handleRefresh,
				edit: this.name === "evaluted"
			}).then(res => {
				res && this.handleRefresh();
			}).catch(e => e && console.error(e));
		},

		confirmBottom(e) {
			if (this.confirmFlag) {
				return;
			}
			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.confirmFlag = true;
				this.confirmPage++;
				this.loadConfirmData(this.confirmPage);
			}
		},

		confirmedBottom(e) {
			if (this.confirmedFlag) {
				return;
			}

			if (e.target.scrollTop + e.target.clientHeight > e.target.scrollHeight - 10) {
				this.confirmedFlag = true;
				this.confirmedPage++;
				this.loadConfirmedData(this.confirmedPage);
			}
		},

		AddColumns(columns, name) {
			columns.splice(columns.length - 1, 0, {
				title: " ",
				key: "",
				minWidth: 80,
				tooltip: true,
				render: (h, params) => {
					const statusType = ['', '待审核', '通过', '驳回', '已评分', '未评定'];
					if (Number(params.row.service_status) != 5) {
						if (name == 'service') {
							return (
								<div>{params.row.service_status == 4 ? "通过" : statusType[+params.row.service_status]}
								</div>
							);
						} else {
							return (
								<div>
									{
										params.row.group_first_record_id
											? <div>
												{
													params.row.is_group_head
														? '整评' + (params.row.service_status == 4
													 ? params.row.point : statusType[+params.row.service_status])
														: '已评'
												}
											</div>
											: <div>

												{
													params.row.service_status == 4
														? <div>{params.row.point}</div>
														: <div>{statusType[+params.row.service_status]}</div>
												}
											</div>
									}
								</div>
							);


						}
					} else {
						return <div>{statusType[+params.row.service_status]}</div>;
					}
				}
			});
		},
		handleChangeColumn() {
			if (this.name === "evaluted") {
				this.AddColumns(this.serviceColumns, 'service');
				this.AddColumns(this.basicColumns);
				this.AddColumns(this.consultColumns);
				this.AddColumns(this.satisfiedColumns);
				this.AddColumns(this.integralColumns);
			}
		}
	}
};
</script>

<style lang="scss">
.v-hr-employee-score-service-validation{
	padding-bottom: 300px;

	.ivu-table-wrapper {
		border: none;
		max-height: 200px;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.ivu-table {
		th,
		td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}

	._contract{
		width: 16px;
		height: 16px;
		line-height: 16px;
		color: red;
		border-radius: 50%;
		border: 1px solid red;
	}
}
</style>