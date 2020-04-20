import API_ROOT from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: []
		};
	},
	created() {
		this.loadTitleArray();
	},
	mounted() {
		this.$vc.on('hr-salary-wage-history-title-change', (res) => {
			this.loadTitleArray();
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-salary-wage-history-title-change');
	},
	methods: {
		loadTitleArray() {
			this.loadTableTitle().then((res) => {
				this.columns = this.getColumns(res.data);
			});
		},
		handleLinkTo(params) {
			// if (params.row.staff_status !== 4) {
			this.$router.push({
				path: '/hr/employee/summary/details',
				query: {
					staff_id: params.row.staff_id,
					staff_name: params.row.staff_name,
					staff_status: params.row.staff_status,
					type: params.row.staff_status !== 4 ? 5 : ''
				}
			});
			// }
		},
		// 撤销
		handleCancel(params) {
			PModal.popup({
				data: {}
			}).then(res => {
				this.$request({
					url: API_ROOT['_HR_SALARY_WAGE_HISTORY_CANCEL_GET'],
					type: 'GET',
					param: {
						change_id: params.row.change_id,
					},
					loading: false
				}).then((res1) => {
					this.$Message.success('操作成功');
					this.$store.commit('HR_SALARY_WAGE_HISTORY_LIST_INIT');
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			}).catch(() => {});
		},
		getColumns(data = { title_show: [], title_hide: [] }) {
			let columns = [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: "left",
					width: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_status } = params.row;
						return (
							<div class="g-flex-ac">
								{ staff_status && staff_status === 4 && <div class="g-m-r-5 g-remark">离</div>}
								{ staff_status !== 4 && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								<span
									class="g-c-blue-mid g-pointer"
									style={{ display: 'block', width: '100%' }}
									onClick={() => this.handleLinkTo(params)}>
									{params.row.staff_name}
								</span>
							</div>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					fixed: "left",
					width: 120
				},
				{
					title: '部门',
					key: 'depart_name',
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
					title: '职位',
					key: 'position_name',
					minWidth: 150
				},
				{
					title: '调整前底薪制度',
					key: 'before_basic_salary_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.before_basic_salary_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '调整后底薪制度',
					key: 'after_basic_salary_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.after_basic_salary_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '调整前提成制度',
					key: 'before_rate_case_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.before_rate_case_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '调整后提成制度',
					key: 'after_rate_case_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.after_rate_case_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '调整前团队提成',
					key: 'before_t_rate_case_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.before_t_rate_case_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '调整后团队提成',
					key: 'after_t_rate_case_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.after_t_rate_case_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '调整时间',
					key: 'create_time',
					minWidth: 160
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				return result;
			}).filter(Boolean);

			columnsShow.splice(columnsShow.length, 0, {
				title: '操作',
				key: 'action',
				fixed: "right",
				width: 100,
				align: 'center',
				render: (h, params) => {
					return params.row.staff_status === 4 ? h('span', {}, '撤销') : h(
						"span",
						{
							class: "g-c-blue-mid g-pointer",
							on: {
								click: () => {
									this.handleCancel(params);
								}
							}
						},
						'撤销'
					);
				}
			});
			return columnsShow;
		}
	}
};

