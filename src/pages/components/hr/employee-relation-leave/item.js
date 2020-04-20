import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { Copy } from "wya-vc";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: [
				// {
				// 	type: 'selection',
				// 	width: 60,
				// 	fixed: "left"
				// },
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					minWidth: 200,
					render: (h, params) => {
						return h(
							"span",
							{
								class: "g-c-blue-mid g-pointer",
								style: {
									display: 'block',
									width: '100%'
								},
								on: {
									click: () => {
										this.handleLinkTo(params);
									}
								}
							},
							params.row.staff_name
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					minWidth: 160,
				},
				{
					title: "工号",
					key: "staff_number",
					minWidth: 160
				},
				{
					title: "性别",
					key: "sex",
					minWidth: 80,
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 200,
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
					title: "职位",
					key: "position_name",
					minWidth: 200
				},
				{
					title: "入职日期",
					key: "entry_date",
					minWidth: 160
				},
				{
					title: "转正日期",
					key: "regular_time",
					minWidth: 160
				},
				{
					title: "离职日期",
					key: "leave_time",
					minWidth: 160,
					renderHeader: (h, params) => {
						return <span>{this.type === '1' ? '预计离职日期' : '离职日期'}</span>;
					}
				},
				{
					title: "申请单",
					key: "apply_invoice",
					render: (h, params) => {
						return h("span", {}, params.row.has_apply ? (params.row.is_apply ? '已填' : '未填') : '--');
					},
					minWidth: 100,
				},
				{
					title: "面谈单",
					key: "interview_invoice",
					render: (h, params) => {
						return h("span", {}, params.row.has_interview ? (params.row.is_interview ? '已填' : '未填') : '--');
					},
					minWidth: 100,
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 100,
					render: (h, params) => {

						const date = params.row.leave_time.split('-');

						return this.type === "1"
							? h(
								Dropdown,
								{
									props: {
										transfer: true,
										placement: "left-start"
									},
									on: {
										"on-click": name => {
											this.handleAction(name, params);
										}
									}
								},
								[
									h("i", { class: "iconfont icon-point g-fs-20 g-pointer" }),
									h(
										DropdownMenu,
										{
											slot: "list"
										},
										[
											params.row.has_apply && this.$auth[225] ? h(
												DropdownItem,
												{
													props: {
														name: "apply-link"
													}
												},
												[
													h(Copy, {
														props: {
															value: `您好，您将在${Number(date[1])}月`
																	+ `${Number(date[2])}日离职，请及时填写离职申请单进行离职。电脑端链接：`
																	+ `${params.row.pc_apply_url}`
																	// 手机端链接：${params.row.mobile_apply_url}
														},
														on: {
															'after': () => {
																this.$Message.success('链接复制成功，请发送给对应员工');
															}
														}
													},
													"复制离职申请单链接")
												]
											) : null,
											params.row.has_interview && this.$auth[226] ? h(
												DropdownItem,
												{
													props: {
														name: "talk-link"
													}
												},
												[
													h(Copy, {
														props: {
															value: `您好，员工${params.row.staff_name}将在${Number(date[1])}月`
																	+ `${Number(date[2])}日离职，请及时进行面谈并填写离职面谈单，点击下方链接进行离职`
																	+ ` 电脑端链接：${params.row.pc_interview_url}`
																	// 手机端链接：${params.row.mobile_interview_url}
														},
														on: {
															'after': () => {
																this.$Message.success('链接复制成功，请发送给对应员工');
															}
														}
													},
													"复制离职面谈单链接")
												]
											) : null,
											(params.row.has_apply || params.row.has_interview) && this.$auth[227] ? h(
												DropdownItem,
												{
													props: {
														name: "invoice"
													}
												},
												"离职单据"
											) : null,
											this.$auth[228] ? h(
												DropdownItem,
												{
													props: {
														name: "confirm"
													}
												},
												"确认离职"
											) : null,
											h(
												DropdownItem,
												{
													props: {
														name: "delete"
													}
												},
												"删除"
											)
										]
									)
								]
							)
							: h(
								"span",
								{
									class: "g-c-blue-mid g-pointer",
									on: {
										click: () => {
											this.handleAction('watch', params);
										}
									}
								},
								"查看"
							);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_RELATION_LEAVE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_RELATION_LEAVE_LIST_RESET', { type: this.type });
		},
		handleLinkTo(params) {
			// 跳转到个人信息页
			this.$router.push({
				path: '/hr/employee/summary/details',
				query: {
					staff_id: params.row.staff_id,
					staff_name: params.row.staff_name,
					staff_status: params.row.staff_status,
					...this.$route.query,
					list_type: this.type === '1' ? 6 : 7,
					type: ''
				}
			});
		},
		handleAction(name, params) {
			if (name === "invoice" || name === "watch") {
                // eslint-disable-line
				// 跳转申请单页面
				this.$router.push({
					path: '/hr/employee/relation/leave/invoice',
					query: {
						leave_id: params.row.leave_id,
						staff_id: params.row.staff_id,
						is_apply: params.row.is_apply,
						template_id: params.row.template_id,
						interview_template_id: params.row.interview_template_id,
						is_interview: params.row.is_interview
					}
				});
			} else if (name === "confirm") {
				PModal.popup({
					data: {
						action: 'confirm',
						info: params.row
					}
				}).then(res => {
					this.$Message.success("离职成功");
					this.$store.commit('HR_EMPLOYEE_RELATION_LEAVE_LIST_INIT');
				}).catch(() => {});
			} else if (name === 'delete') {
				PModal.popup({
					data: {
						action: 'delete',
						info: params.row
					}
				}).then(res => {
					this.$Message.success('操作成功');
					this.$store.commit("HR_EMPLOYEE_RELATION_LEAVE_LIST_INIT");
				}).catch(err => {});
			}
		}
	}
};

