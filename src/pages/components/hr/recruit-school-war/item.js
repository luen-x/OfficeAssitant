import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { assignPModal } from './popup/assign.vue';

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
		// 跳转到详情页
		handleLinkTo(params) {
			let baseUrl = `/hr/recruit/school/war/${params.row.applicant_id}`;
			return getHashUrl(baseUrl, { tabType: this.type, type: 'no-edit', list_type: 'big-depart-detail-index' });
		},
		handleAction(name, params) {
			assignPModal.popup({
				name,
				selected: params.row
			}).then(res => {
			}).catch(() => {});
		},
		getColumns(type) {
			let columns = [
				{
					title: "姓名",
					key: "applicant_name",
					fixed: "left",
					minWidth: 150,
					render: (h, params) => {
						const { applicant_name, content } = params.row;
						return (
							<div class="g-flex-ac">
								{/* { content && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<div class="g-m-r-5 g-remark">注</div>
									<div slot="content" style="max-width: 300px; white-space: normal;word-break: break-all">
										{ content }
									</div>
								</Poptip>} */}
								{ this.$auth[152]
									? <router-link
										class="g-c-blue-mid g-pointer"
										style={{ display: 'block', width: '100%' }}
										to={this.handleLinkTo(params)}
									>
										<span>
											{ applicant_name.length <= 7 ? applicant_name
												: <AutoToolTip
													content={applicant_name}
													labelClass=""
													width="105px"
													theme="dark"
												>{applicant_name}</AutoToolTip>
											}
										</span>
									</router-link>
									: <span>
										{ applicant_name.length <= 7 ? applicant_name
											: <AutoToolTip
												content={applicant_name}
												labelClass=""
												width="105px"
												theme="dark"
											>{applicant_name}</AutoToolTip>
										}
									</span>
								}
							</div>
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					fixed: "left",
					minWidth: 120
				},
				{
					title: "性别",
					key: "sex_name",
					minWidth: 80,
					render: (h, params) => {
						return h('span', {}, params.row.sex === 0 ? '男' : '女');
					}
				},
				{
					title: "应聘职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "毕业学校",
					key: "college",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.college}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "专业",
					key: "profession",
					minWidth: 120
				},
				{
					title: "学历",
					key: "education_name",
					minWidth: 100
				},
				{
					title: "邮箱",
					key: "email",
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.email}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "微信号",
					key: "wechat",
					minWidth: 150
				},
				{
					title: '回复报到时间',
					key: 'reply_time',
					minWidth: 160,
				},
				{
					title: '车票信息',
					key: 'ticket_info_all',
					minWidth: 200,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.ticket_info_all}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '试岗组织/部门',
					key: 'try_depart_name',
					minWidth: 150
				},
				{
					title: '试岗分配时间',
					key: 'assign_time',
					minWidth: 200
				},
				{
					title: "操作",
					key: 'action',
					minWidth: 120,
					align: 'center',
					fixed: "right",
					render: (h, params) => {
						return type === '1' ? h(
							"span", [
								(params.row.status !== 6 && params.row.status !== 7 && params.row.status !== 11 && this.$auth[706]) ? h(
									"span",
									{
										class: "g-c-blue-mid g-pointer",
										on: {
											click: () => {
												this.handleAction('assign', params);
											}
										}
									},
									"指派试岗部门"
								) : null
							]
						) : h("span", {}, [
							(params.row.status !== 6 && params.row.status !== 7 && params.row.status !== 11 && this.$auth[707]) ? h(
								"span",
								{
									class: "g-c-blue-mid g-pointer",
									on: {
										click: () => {
											this.handleAction('adjust', params);
										}
									}
								},
								"修改试岗部门"
							) : null
						]);
					}
				}
			];

			switch (type) {
				case '1':
					columns.splice(0, 0, {
						type: 'selection',
						width: 60,
						fixed: "left"
					});
					columns.splice(columns.length - 2, 1);
					return columns;
				case '2':
					return columns;
				default:
					return columns;
			}
		}
	}
};

