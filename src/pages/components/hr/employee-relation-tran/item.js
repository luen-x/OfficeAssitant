import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: {
				'1': this.getColumns('1'),
				'2': this.getColumns('2')
			}
		};
	},
	methods: {
		handleLinkTo(params) {
			// this.$router.push({
			// 	path: '/hr/employee/summary/details',
			// 	query: {
			// 		staff_id: params.row.staff_id,
			// 		staff_name: params.row.staff_name
			// 	}
			// });
			return getHashUrl('/hr/employee/summary/details', {
				staff_id: params.row.staff_id,
				staff_name: params.row.staff_name,
				staff_status: params.row.staff_status,
				...this.$route.query,
				list_type: this.type === '1' ? 4 : 5,
				type: ''
			});
		},
		handleAction(name, params) {
			if (name === "confirm") {
				PModal.popup({
					data: {
						action: 'confirm',
						info: params.row,
					}
				}).then(res => {
					this.$Message.success('操作成功');
					this.$store.commit("HR_EMPLOYEE_RELATION_TRAN_LIST_INIT");
				}).catch(err => {});
			} else if (name === 'delete') {
				PModal.popup({
					data: {
						action: 'delete',
						info: params.row
					}
				}).then(res => {
					this.$Message.success('操作成功');
					this.$store.commit("HR_EMPLOYEE_RELATION_TRAN_LIST_INIT");
				}).catch(err => {});
			} else if (name === "edit") {
				PModal.popup({
					data: {
						action: 'edit',
						info: params.row
					}
				}).then(res => {
					this.$Message.success('操作成功');
					this.$store.commit("HR_EMPLOYEE_RELATION_TRAN_LIST_INIT");
				}).catch(err => {});
			}
		},
		getColumns(type) {
			let columns = [];
			let basicColumns = [
				{
					title: "姓名",
					key: "staff_name",
					fixed: "left",
					width: 200,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_status, staff_name } = params.row;
						return <div class="g-flex-ac">
							{ staff_status === 4 && <div class="g-m-r-5 g-remark">离</div>}
							{ staff_status !== 4 && <div class="g-m-r-5 g-remark" style="opacity: 0">离</div>}
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
					width: 200
				},
				{
					title: "工号",
					key: "staff_number",
					minWidth: 150,
				},
				{
					title: "转岗前部门",
					key: "before_depart",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.before_depart}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "转岗前职位",
					key: "before_position",
					minWidth: 200
				},
				{
					title: "转岗后部门",
					key: "after_depart",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.after_depart}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "职位转岗",
					key: "after_position",
					minWidth: 200
				},
				{
					title: "保留数据",
					key: "is_save",
					minWidth: 100,
					render: (h, params) => {
						return h('span', {}, params.row.is_save === 0 ? '不保留' : '保留');
					}
				},
				{
					title: "预计转岗时间",
					key: "time_temp",
					minWidth: 160
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 100,
					align: 'center',
					render: (h, params) => {
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
											this.$auth[223] ? h(
												DropdownItem,
												{
													props: {
														name: "edit"
													}
												},
												"转岗编辑"
											) : null,
											this.$auth[223] ? h(
												DropdownItem,
												{
													props: {
														name: "confirm"
													}
												},
												"转岗确认"
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
							) : h('router-link',
								{
									class: "g-c-blue-mid g-pointer",
									props: {
										to: this.handleLinkTo(params)
									}
								},
								"查看");
					}
				}
			];

			switch (type) {
				case "1":
					columns = [...basicColumns];
					break;
				case "2":
					columns = [...basicColumns];

					columns.splice(8, 1,
						{
							title: "转岗时间",
							key: "time_temp",
							minWidth: 160,
							render: (h, params) => {
								return h("span", {}, params.row.time_temp || "--");
							}
						});
					break;
				default:
					break;
			}

			return columns;
		}
	}
};

