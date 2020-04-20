import { Divider, Tooltip } from "iview";
import { Copy } from "wya-vc";
import { AuditModal } from "../_common/application/audit";
import { StatusModal } from "../_common/application/status";
import { FeedbackModal } from "../_common/application/feedback";
import { TipModal } from "../_common/application/tip";
import { ApplyModal } from "../_common/application/apply.vue";


export default {
	data() {
		return {
			columns: {
				'0': this.getColumns('0'),
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
				'4': this.getColumns('4'),
				'5': this.getColumns('5'),
				
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ADMINISTRATION_APPLICATION_WAIT_LIST_INIT');
		},
		handleAction(params, type) {
			AuditModal.popup({ title: "编辑申请", statusInfo: false, eventId: params.row.event_id }).then(res => {
				this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
			});
		},
		handleApply(params) {
			const { query = {} } = this.$route;
			let title = '';
			let statusInfo = "";
			if (query.type == 0 || query.type == undefined) {
				title = '审核申请';
				statusInfo = true;
			} else {
				title = '查看申请';
				statusInfo = false;
			}
			ApplyModal.popup({ title, eventId: params.row.event_id, statusInfo }).then(res => {
				this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
			});
		},
		handleDel(params) {
			TipModal.popup({ title: "撤回确认", eventId: params.row.event_id }).then(res => {
				this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
			});
		},
		handleFeedback(params) {
			FeedbackModal.popup({ title: "评价反馈", eventId: params.row.event_id }).then(res => {
				this.$store.commit("ADMINISTRATION_APPLICATION_WAIT_LIST_INIT");
			});
		},
		handleStatus(params) {
			StatusModal.popup({ title: "完成进度", eventId: params.row.event_id }).then(res => {});
		},
		getColumns(type) {
			let columns = [
				{
					title: "申请人",
					key: "staff_name",
					fixed: "left",
					width: 170,
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					width: 120
				},
				{
					title: '事项主题',
					key: 'event_theme',
					width: 300,
					render: (h, params) => {
						const { event_theme } = params.row;
						return <div
						>{event_theme.length > 15
								? <Tooltip 
									transfer 
									placement="bottom-start"
									style="display: block;maxWidth:200px"
								>
									<div>
										{ event_theme.substr(0, 15) + '...' }
									</div>
									<div slot="content">
										<p style="whiteSpace: normal">
											{event_theme}
										</p>
								
									</div>
								</Tooltip>
								: event_theme}
						</div>;
					}
				},
				{
					title: "申请性质",
					key: "apply_nature_name",
					width: 100
				},
				{
					title: "申请部门",
					key: "apply_depart_name",
					minWidth: 150,
					
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 150,
					
				},
				{
					title: "事项类型",
					key: "event_type_name",
					minWidth: 160
				},
				{
					title: "期待完成日期",
					key: "expected_completion_time",
					minWidth: 160
				},
				{
					title: "申请时间",
					key: "create_time",
					width: 120,
					
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 160,
					align: 'center',
					render: (h, params) => {
						return h('span', {}, [
							this.type == 1 && this.$auth[786] ? h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: () => {
										this.handleAction(params);
									}
								}
							}, '重新编辑') : null,
							this.type == 1 && this.$auth[786] && this.$auth[787] ? h('span', {
								style: {
									paddingLeft: '3px',
									paddingRight: '3px'
								}
							}, [
								h(Divider, {
									props: {
										type: 'vertical'
									}
								}, '')
							]) : null,
							this.type == 1 && this.$auth[787] ? h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: () => {
										// this.handleDegrade(params);
										this.handleDel(params);
									}
								}
							}, '撤回') : null,
							(this.type == 2 || this.type == 3 || this.type == 4 || this.type == 5) && this.$auth[788] ? h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: () => {
										this.handleApply(params);
									}
								}
							}, '查看') : null,
							// this.type == 3 ? h('span', {
							// 	class: "g-c-blue-mid g-pointer",
							// 	on: {
							// 		click: () => {
							// 			this.handleFeedback(params);
							// 		}
							// 	}
							// }, '评价') : null,
							this.type == 0 && this.$auth[785] ? h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: () => {
										this.handleApply(params);
									}
								}
							}, '审核') : null
						]);
					}
				}
			];

			switch (type) {
				case "2":
					columns.splice(6, 0,
						{
							title: "完成进度",
							key: "completion_rate",
							minWidth: 160,
							render: (h, params) => {
								return h('span', {}, [
									h('span', {
										class: "g-c-blue-mid g-pointer",
										on: {
											click: () => {
												this.handleStatus(params);
											}
										}
									}, params.row.completion_rate)
								]);
							}
						});
					return columns;
				case "3":
				case "4":
					columns.splice(6, 0,
						{
							title: "完成进度",
							key: "completion_rate",
							minWidth: 160,
							render: (h, params) => {
								return h('span', {}, [
									h('span', {
										class: "g-c-blue-mid g-pointer",
										on: {
											click: () => {
												this.handleStatus(params);
											}
										}
									}, params.row.completion_rate)
								]);
							}
						});
					columns.splice(columns.length - 2, 0,
						{
							title: "实际完成时间",
							key: "actual_finish_time",
							minWidth: 160
						});
					return columns;
				case "5":
					columns.splice(columns.length - 2, 0,
						{
							title: "实际完成时间",
							key: "actual_finish_time",
							minWidth: 160
						});
					return columns;
				default:
					return columns;
			}
		}
	}
};

