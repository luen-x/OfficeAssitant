import { getParseUrl, getHashUrl } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Copy } from "wya-vc";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2'),
				'3': this.getColumns('3'),
			}
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_RELATION_TRY_LIST_INIT');
		},
		handleLinkTo(params) {
			return getHashUrl('/hr/employee/summary/details', {
				staff_id: params.row.staff_id,
				staff_name: params.row.staff_name,
				staff_status: params.row.status,
				...this.$route.query,
				list_type: this.type === '1' ? 8 : (this.type === '2' ? 9 : 10),
				type: '',
				// staff_type: 'try' 	// 跳转详情需要隐藏tab的标志字段
			});
		},
		handleAction(name, params, type) {
			if (name === 'invoice' || name === 'watch') { // eslint-disable-line
				// 跳转单据页面
				this.$router.push({
					path: '/hr/employee/relation/try/invoice',
					query: {
						staff_id: params.row.staff_id,
						is_apply: params.row.is_apply,
						is_interview: params.row.is_interview,
						template_id: params.row.template_id,
						interview_template_id: params.row.interview_template_id,
						regular_fail_id: type ? params.row.regular_fail_id : null
					}
				});
			} else if (name === 'fail') {
				PModal.popup({
					info: params.row,
					type: 'fail'
				}).then(res => {
				}).catch(err => {});
			} else if (name === 'confirm') {
				PModal.popup({
					info: params.row,
					type: 'confirm'
				}).then(res => {
				}).catch(err => {});
			}
		},
		getColumns(type) {
			let columns = [
				// {
				// 	type: 'selection',
				// 	width: 60,
				// 	fixed: "left"
				// },
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					minWidth: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_name, status } = params.row;
						return <div class="g-flex-ac">
							{ status === 4 && <div class="g-m-r-5 g-remark">离</div>}
							{ status !== 4 && <div class="g-m-r-5 g-remark" style="opacity: 0">离</div>}
							<router-link
								class="g-c-blue-mid g-pointer"
								style={{ display: 'block', width: '100%' }}
								to={this.handleLinkTo(params)}
							>
								{staff_name}
							</router-link>
						</div>;
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					width: 120
				},
				{
					title: "工号",
					key: "staff_number",
					minWidth: 150
				},
				{
					title: "性别",
					key: "sex",
					width: 80
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150,
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
					minWidth: 150
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
					title: "面谈人",
					key: "interview_name",
					width: 120
				},
				{
					title: "申请单",
					key: "apply_invoice",
					render: (h, params) => {
						return h("span", {}, params.row.has_apply ? (params.row.is_apply ? '已填' : '未填') : '--');
					},
					width: 100
				},
				{
					title: "面谈单",
					key: "interview_invoice",
					render: (h, params) => {
						return h("span", {}, params.row.has_interview ? (params.row.is_interview ? '已填' : '未填') : '--');
					},
					width: 100
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 100,
					align: 'center',
					render: (h, params) => {
						const date = params.row.regular_time.split('-');

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
											params.row.has_apply && this.$auth[216] ? h(
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
																	+ `${Number(date[2])}日转正，请及时填写转正申请单进行转正。电脑端链接：`
																	+ `${params.row.pc_apply_url}`
																	+ ` 手机端链接：${params.row.mobile_apply_url}`
														},
														on: {
															'after': () => {
																this.$Message.success('链接复制成功，请发送给对应员工');
															}
														}
													},
													"复制转正申请单链接")
												]
											) : null,
											params.row.has_interview && this.$auth[217] ? h(
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
																	+ `${Number(date[2])}日转正，请及时进行面谈并填写转正面谈单，点击下方链接进行转正`
																	+ ` 电脑端链接：${params.row.pc_interview_url}`
																	+ ` 手机端链接：${params.row.mobile_interview_url}`
														},
														on: {
															'after': () => {
																this.$Message.success('链接复制成功，请发送给对应员工');
															}
														}
													},
													"复制转正面谈单链接")
												]
											) : null,
											(params.row.has_apply || params.row.has_interview) && this.$auth[218] ? h(
												DropdownItem,
												{
													props: {
														name: "invoice"
													}
												},
												"转正单据"
											) : null,
											h(
												DropdownItem,
												{
													props: {
														name: "fail"
													}
												},
												"转正未通过"
											),
											this.$auth[219] ? h(
												DropdownItem,
												{
													props: {
														name: "confirm"
													}
												},
												"转正确认"
											) : null
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
											this.handleAction('watch', params, type);
										}
									}
								},
								"查看"
							);
					}
				}
			];

			switch (type) {
				case "1":
					columns.splice(7, 1,
						{
							title: "预计转正日期",
							key: "regular_time",
							minWidth: 160
						});
					return columns;
				case "2":
					return columns;
				case "3":
					columns.splice(7, 1,
						{
							title: "原转正日期",
							key: "regular_time",
							minWidth: 160
						},
						{
							title: "下次转正日期",
							key: "next_regular_time",
							minWidth: 160
						});
					return columns;
				default:
					return columns;
			}
		}
	}
};

