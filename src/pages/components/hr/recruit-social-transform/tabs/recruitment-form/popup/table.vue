<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="680"
			class="v-hr-add-modal g-tabs-card"
			footer-hide
		>
			<div
				slot="header"
				class="g-tc"
			>查看</div>
			<i-tab
				v-model="type"
				:animated="false"
				type="card"
				@on-click="handleChange">
				<i-tab-pane label="分配人数" name="1">
					<i-table
						:columns="columns1"
						:data="tableData1"
						height="500"
					/>
				</i-tab-pane>
				<i-tab-pane label="招聘人数" name="2">
					<i-table
						:columns="columns2"
						:data="tableData2"
						height="500"
					/>
				</i-tab-pane>
			</i-tab>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Table, Divider, Tabs, TabPane } from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import { services } from "@stores/services/hr";
import { dataValidity } from "@utils/utils";
import API from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { AuditModal } from "./audit";

export default {
	name: "hr-add-modal",
	components: {
		"i-modal": Modal,
		"i-table": Table,
		"i-tab": Tabs,
		"i-tab-pane": TabPane
	},
	props: {
		position_id: Number,
		month: String
	},
	data() {
		return {
			visible: false,
			type: '1',
			columns1: [
				{
					title: "部门",
					key: "depart_name",
					minWidth: 110
				},
				{
					title: "在职人数",
					key: "inservice_num",
					width: 85
				},
				{
					title: "需求人数",
					key: "need_number",
					width: 85
				},
				{
					title: "三立学府分配",
					key: "assign_count",
					width: 110
				},
				{
					title: "试岗流失人数",
					key: "try_pass_count",
					width: 110
				},
				{
					title: "入职流失人数",
					key: "leave_count",
					width: 110
				},
				{
					title: "待分配人数",
					key: "await_count",
					width: 100
				},
				{
					title: "状态",
					key: "status_name",
					width: 80
				},
				{
					title: "人员要求",
					key: "staff_standard",
					minWidth: 190,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.staff_standard}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "操作",
					key: "age",
					width: 110,
					fixed: "right",
					render: (h, params) => {
						let {
							status_name,
							need_id,
							need_number,
							staff_standard
						} = params.row;
						return (
							<div class="g-operation">
								{
									<div>
										{status_name === "暂停" ? (
											<span onClick={() => this.handleStatus(1, need_id)}>
												恢复
											</span>
										) : (
											<div>
												{
													<span onClick={() => this.handleStatus(0, need_id)}>
														暂停
													</span>
												}
												{
													<Divider
														type="vertical"
														class="g-m-lr-10"
													/>
												}
												{
													<span
														onClick={() => this.handleEditModal(params.row)
														}
													>
														编辑
													</span>
												}
											</div>
										)}
									</div>
								}
							</div>
						);
					}
				}
			],
			columns2: [
				{
					title: "部门",
					key: "depart_name",
					minWidth: 110,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.depart_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "薪资范围",
					key: "salary_range",
					width: 110,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.salary_range + ''}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "负责人",
					key: "responsible_name",
					minWidth: 110,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.responsible_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "需求人数",
					key: "need_number",
					width: 85
				},
				{
					title: "实际面试人数",
					key: "actual_interview_count",
					width: 110
				},
				{
					title: "面试通过人数",
					key: "pass_interview_count",
					width: 110
				},
				{
					title: "试岗人数",
					key: "try_count",
					width: 110
				},
				{
					title: "试岗流失人数",
					key: "try_lose_count",
					width: 110
				},
				{
					title: "入职人数",
					key: "entry_count",
					width: 100
				}
			],
			tableData1: [],
			tableData2: [],
		};
	},
	computed: {},
	created() {
		this.type === '1' ? this.loadNeedData() : this.loadRecruitData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadNeedData() {
			// 分配人数
			this.$request({
				url: API._HR_RECRUIT_SCHOOL_NEED_DETAIL_GET,
				type: "GET",
				param: {
					position_id: this.position_id,
					month: this.month
				}
			})
				.then(res => {
					this.tableData1 = res.data;
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		// 招聘人数
		loadRecruitData() {
			this.$request({
				url: API._HR_RECRUIT_SCHOOL_RECRUIT_DETAIL_GET,
				type: "GET",
				param: {
					position_id: this.position_id,
					month: this.month
				}
			})
				.then(res => {
					this.tableData2 = res.data;
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		handleChange(type) {
			this.type === '1' ? this.loadNeedData() : this.loadRecruitData();
		},
		handleStatus(status, need_id) {
			this.$request({
				url: API._HR_RECRUIT_SCHOOL_NEED_POSITION_OPERATE_GET,
				type: "GET",
				param: {
					need_id,
					status
				}
			})
				.then(res => {
					this.handleChange();
				})
				.catch(error => {
					this.$Message.error(error.msg);
				});
		},
		handleEditModal(info) {
			AuditModal.popup({
				title: "编辑",
				type: 2,
				info
			}).then(res => {
				this.handleChange();
			});
		},
		handleOk() {
			this.visible = false;
			// this.$request({
			// 	url: API._HR_RECRUIT_SCHOOL_NEED_POSITION_ADD_POST,
			// 	type: "POST",
			// 	param: {
			// 		...this.tableData
			// 	},
			// 	loading: false
			// })
			// 	.then(res => {
			// 		this.$Message.success(res.msg);
			// 		this.$emit("sure", true);
			// 	})
			// 	.catch(error => {
			// 		this.$Message.error(error.msg);
			// 		this.$refs.modal.buttonLoading = false;
			// 	});
		},
		handleCancel() {
			this.visible = false;
			// this.$emit("close");
		}
	}
};

export const TableModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-add-modal {
	.ivu-modal-content {
		.ivu-modal-body {
			margin: 10px !important;
		}

	}
}
</style>
