import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip, Tooltip } from 'iview';
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
			let baseUrl = `/hr/recruit/school/summary/${params.row.applicant_id}`;
			return getHashUrl(baseUrl, { tabType: this.type });
		},
		handleAction(name, params) {
			assignPModal.popup({
				name,
				selected: params.row
			}).then(res => {
				this.$Message.success('操作成功');
				this.isAll = false;
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
								<router-link
									class="g-c-blue-mid g-pointer"
									style={{ display: 'block', width: '100%' }}
									to={this.handleLinkTo(params)}
								>
									<span>
										{ applicant_name.length <= 7 ? applicant_name
											: <Tooltip transfer maxWidth="200">
												<span>{applicant_name.slice(0, 7) + '...'}</span>
												<div slot="content">{applicant_name}</div>
											</Tooltip>
										}
									</span>
								</router-link>
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
					minWidth: 150,
				},
				{
					title: "毕业学校",
					key: "college",
					minWidth: 150,
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
				},
				{
					title: "微信号",
					key: "wechat",
					minWidth: 120,
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
				},
				{
					title: '试岗部门',
					key: 'try_depart_name',
					minWidth: 120,
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
						return this.$route.query.type == 1 ? h(
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
						) : [3, 4, 9, 10].includes(params.row.status) ? h(
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
						) : '';
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
					columns.splice(columns.length - 3, 2);
					columns.splice(columns.length - 1, 0, {
						title: '试岗组织',
						key: 'try_depart_name',
						minWidth: 120,
					});
					return columns;
				case '2':
					return columns;
				default:
					return columns;
			}
		}
	}
};

