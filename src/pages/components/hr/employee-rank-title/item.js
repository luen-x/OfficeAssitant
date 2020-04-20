import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: "姓名",
					key: "staff_name",
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
					title: "获得级称",
					key: "rank_name",
					minWidth: 150
				},
				{
					title: "考核周期",
					key: "cycle_date",
					minWidth: 180,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.cycle_date}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "评定时间",
					key: "month",
					minWidth: 160
				},
				{
					title: "生效时间",
					key: "start_time",
					minWidth: 160
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 100,
					align: 'center',
					render: (h, params) => {
						return (
							<div>
								{ this.$auth[238] && params.row.staff_status === 4 && <span>
									调整
								</span> }
								{ this.$auth[238] && params.row.staff_status !== 4 && <span
									class="g-c-blue-mid g-pointer"
									onClick={() => this.handleAdjust(params)}>
									调整
								</span> }
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_RANK_TITLE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_RANK_TITLE_LIST_RESET', { type: this.type });
		},
		// 调整
		handleAdjust(params) {
			PModal.popup({
				data: {
					action: 'adjust',
					info: params.row
				}
			}).then(res => {
				this.$Message.success('操作成功！');
				this.$store.commit('HR_EMPLOYEE_RANK_TITLE_LIST_INIT', this.rank_system_id);
			}).catch(() => {});
		},
		handleLinkTo(params) {
			// if (params.row.staff_status !== 4) {
			this.$router.push({
				path: '/hr/employee/summary/details',
				query: {
					staff_id: params.row.staff_id,
					staff_name: params.row.staff_name,
					type: params.row.staff_status !== 4 ? 6 : ''
				}
			});
			// }
		},
	}
};

