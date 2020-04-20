import API_ROOT from "@stores/apis/root";
import moment from 'moment';
import { Poptip } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			basicColumns: []
		};
	},
	created() {
		this.loadTitleArray();
	},
	mounted() {
		this.$vc.on('hr-salary-wage-monthly-title-change', async (res) => {
			await this.loadTitleArray();
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-salary-wage-monthly-title-change');
	},
	methods: {
		loadTitleArray() {
			this.loadTableTitle().then((res) => {
				this.basicColumns = this.getColumns(res.data);
				if (!this.depart_id.length) {
					this.basicColumns.splice(0, 1);
				}
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
		// 调整薪资名称
		handleAdjust(params) {
			const { query } = this.$route;
			let month = query.month ? query.month : moment();

			PModal.popup({
				data: {
					action: 'adjust',
					selected: params.row,
					month
				}
			}).then(res => {
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
						const { staff_name, remarks, staff_status } = params.row;

						return (
							<div class="g-flex-ac">
								{ remarks && remarks.length !== 0 && <Poptip
									placement="bottom-start"
									trigger="hover"
									transfer
								>
									<div class="g-m-r-5 g-remark">注</div>
									<div
										slot="content"
										style="max-width: 300px; white-space: normal;word-break: break-all">
										{ remarks[1] && <div>
											<div class="g-m-b-5">入职</div>
											<div>入职时间：{remarks[1].date}</div>
										</div>}
										{ remarks[2] && <div class={remarks[1] ? 'g-m-t-5' : ''}>
											<div class="g-m-b-5">转岗</div>
											{
												(remarks[2] && remarks[2].length)
													? remarks[2].map((item, index) => {
														return (
															<div class={index !== remarks[2].length ? 'g-m-b-5' : ''}>
																{/* <div class="g-m-b-5">转岗部门：{item.depart}</div>
																<div class="g-m-b-5">转岗职位：{item.position}</div> */}
																<div>转岗时间：{item.date}</div>
															</div>
														);
													}) : ''}
										</div>}
										{ remarks[3] && <div class={(remarks[1] || remarks[2]) ? 'g-m-t-5' : ''}>
											<div class="g-m-b-5">离职</div>
											<div>离职时间：{remarks[3].date}</div>
										</div>}
									</div>
								</Poptip>}
								{ (!remarks || remarks.length === 0) && <div class="g-m-r-5 g-remark" style="opacity: 0">注</div>}
								<span
									class="g-c-blue-mid g-pointer"
									style={{ display: 'block', width: '100%' }}
									onClick={() => this.handleLinkTo(params)}
								>
									<span>
										{ staff_name.length <= 7 ? staff_name
											: <AutoToolTip
												content={staff_name}
												labelClass=""
												width="105px"
												theme="dark"
											>
												{staff_name}
											</AutoToolTip>
										}
									</span>
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
					title: '工号',
					key: 'staff_number',
					minWidth: 120
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 150
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 150
				},
				// {
				// 	title: '工龄',
				// 	key: 'work_age',
				// 	minWidth: 120
				// },
				{
					title: '底薪制度',
					key: 'basic_salary_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.basic_salary_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '提成制度',
					key: 'rate_case_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.rate_case_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '团队提成',
					key: 't_rate_case_name',
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.t_rate_case_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '底薪',
					key: 'basic_salary',
					minWidth: 110
				},
				// {
				// 	title: '级称补贴',
				// 	key: 'rank_subsidy',
				// 	minWidth: 110
				// },
				{
					title: '工龄工资',
					key: 'work_age_salary',
					minWidth: 110
				},
				{
					title: '合计金额',
					key: 'total_salary',
					minWidth: 110
				},
				{
					title: '薪资月份',
					key: 'month',
					minWidth: 110,
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				return result;
			}).filter(Boolean);

			// if (this.$store.state.hrSalaryWageMonthly.depart_id.length) {
			columnsShow.splice(0, 0, {
				type: 'selection',
				width: 60,
				fixed: "left",
			});
			// }

			columnsShow.splice(columnsShow.length, 0, {
				title: '操作',
				key: 'action',
				fixed: "right",
				width: 100,
				align: 'center',
				render: (h, params) => {
					return this.$auth[248] ? h(
						"span",
						{
							class: "g-c-blue-mid g-pointer",
							on: {
								click: () => {
									this.handleAdjust(params);
								}
							}
						},
						'调整'
					) : null;
				}
			});
			return columnsShow;
		}
	}
};

