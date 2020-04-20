import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { Dropdown, DropdownMenu, DropdownItem, Poptip } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { assignPModal } from './popup/assign.vue';

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-recruit-school-tryassign-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-recruit-school-tryassign-title-change');
	},
	methods: {
		loadTableTitle(type) {
			return this.$request({
				url: "_HR_RECRUIT_CONFIG_GET",
				type: "GET",
				param: {
					type: type || "1",
					scenario: 2
				},
				loading: false
			}).then(res => {
				this.$store.commit("HR_RECRUIT_SCHOOL_TRYASSIGN_TITLE_CHANGE", {
					...res.data,
					type: type || "1"
				});
				return res;
			}).catch(res => {
				this.$Message.error(res.msg);
			});
		},
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		// 跳转到详情页
		handleLinkTo(params) {
			let baseUrl = `/hr/recruit/school/tryassign/${params.row.applicant_id}`;
			return getHashUrl(baseUrl, { tabType: this.type, type: 'no-edit', list_type: 'hr-index' });
		},
		handleAction(name, params) {
			assignPModal.popup({
				name,
				selected: params.row,
				type: this.type + ''
			}).then(res => {
			}).catch(() => {});
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: "姓名",
					key: "applicant_name",
					fixed: "left",
					minWidth: 170,
					render: (h, params) => {
						const { applicant_name, content } = params.row;
						return (
							<div class="g-flex-ac">
								{ content && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<div class="g-m-r-5 g-remark">注</div>
									<div slot="content" style="max-width: 300px; white-space: normal;word-break: break-all">
										{ content }
									</div>
								</Poptip>}
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
												>
													{applicant_name}
												</AutoToolTip>
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
											>
												{applicant_name}
											</AutoToolTip>
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
					minWidth: 150
				},
				{
					title: "到杭车次",
					key: "ticket_info",
					minWidth: 120,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.ticket_info}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "到杭时间",
					key: "ticket_arrive_time",
					sortable: "custom",
					minWidth: 170
				},
				{
					title: "试岗部门",
					key: "try_depart_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.try_depart_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "指派类型",
					key: "scenario_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.scenario_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "试岗分配时间",
					key: "assign_time",
					sortable: "custom",
					minWidth: 170
				},
				{
					title: '回复报到时间',
					key: 'reply_time',
					sortable: "custom",
					minWidth: 170,
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
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			columnsShow.push({
				title: "操作",
				key: 'action',
				minWidth: 100,
				align: 'center',
				fixed: "right",
				render: (h, params) => {
					return (
						<div>
							{
								params.row.try_depart_id === 0
									? <span>
										{
											this.type == 1 && this.$auth[704] 
												? <span 
													class="g-c-blue-mid g-pointer" 
													onClick={() => this.handleAction('assign', params)}
												>
													指派
												</span>
												: null
										}
									</span>
									: <span>
										{
											this.type == 2 && this.$auth[1737] 
												? (params.row.status !== 6 && params.row.status !== 7 && params.row.status !== 11)
													? <span 
														class="g-c-blue-mid g-pointer" 
														onClick={() => this.handleAction('adjust', params)}
													>
													重新指派
													</span>
													: <span 
														class="g-c-black4"
													>
													重新指派
													</span> 
												: null
										}
										{
											this.type == 3 && this.$auth[705] 
												? (params.row.status !== 6 && params.row.status !== 7 && params.row.status !== 11)
													? <span 
														class="g-c-blue-mid g-pointer" 
														onClick={() => this.handleAction('adjust', params)}
													>
													重新指派
													</span>
													: <span 
														class="g-c-black4"
													>
													重新指派
													</span> 
												: null
										}
									</span>
							}
						</div>
					);
					// return params.row.try_depart_id === 0 
					// 	? h('span', {}, [
					// 		(this.type == 1 && this.$auth[704]) 
					// 			? h(
					// 				"span",
					// 				{
					// 					class: "g-c-blue-mid g-pointer",
					// 					on: {
					// 						click: () => {
					// 							this.handleAction('assign', params);
					// 						}
					// 					}
					// 				},
					// 				"指派"
					// 			) 
					// 			: null]) 
					// 	: h('span', {}, [
					// 		(params.row.status !== 6 && params.row.status !== 7 && params.row.status !== 11 && this.$auth[705])
					// 			? h(
					// 				"span",
					// 				{
					// 					class: "g-c-blue-mid g-pointer",
					// 					on: {
					// 						click: () => {
					// 							this.handleAction('adjust', params);
					// 						}
					// 					}
					// 				},
					// 				"重新指派"
					// 			) 
					// 			: h(
					// 				"span",
					// 				{
					// 					class: "g-c-black4",
					// 				},
					// 				"重新指派"
					// 			)
					// 	]);
				}
			});

			if (type == 1) {
				columnsShow.unshift({
					type: 'selection',
					width: 60,
					fixed: "left"
				});
			}

			return columnsShow;
		},

		gColumns(type) {
			let columns = [];

			switch (type) {
				case '2':
				case '3':
					return columns;
				case '1':
					columns.splice(0, 0, {
						type: 'selection',
						width: 60,
						fixed: "left"
					});
					columns.splice(columns.length - 3, 2);
					return columns;
				default:
					return columns;
			}
		}
	}
};

