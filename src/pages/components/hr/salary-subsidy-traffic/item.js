import API_ROOT from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { PModal } from './popup/modal.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: "left",
					width: 170,
					render: (h, params) => {
						const { staff_status } = params.row;
						return (
							<span
								class="g-c-blue-mid g-pointer"
								style={{ display: 'block', width: '100%' }}
								onClick={() => this.handleLinkTo(params)}>
								{params.row.staff_name}
							</span>
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
					minWidth: 150
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
					title: '入职日期',
					key: 'entry_date',
					minWidth: 150
				},
				{
					title: '生效月份',
					key: 'start_month',
					minWidth: 120
				},
				{
					title: '有效期',
					key: 'effect_month',
					minWidth: 120
				},
				{
					title: '毕业院校',
					key: 'college',
					minWidth: 170,
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
					title: '在杭住址',
					key: 'address',
					minWidth: 290,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.address}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: '补贴薪资',
					key: 'traffic_subsidy',
					minWidth: 100
				},
				{
					title: '操作',
					key: 'action',
					fixed: "right",
					width: 100,
					align: 'center',
					render: (h, params) => {
						return this.$auth[251] ? h(
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
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_LIST_RESET', { type: this.type });
		},
		handleLinkTo(params) {
			// if (params.row.staff_status !== 4) {
			this.$router.push({
				path: '/hr/employee/summary/details',
				query: {
					staff_id: params.row.staff_id,
					staff_name: params.row.staff_name,
					type: params.row.staff_status !== 4 ? 5 : ''
				}
			});
			// }
		},
		// 调整补贴
		handleAdjust(params) {
			PModal.popup({
				data: {
					action: 'adjust',
					selected: params.row
				}
			}).then(res => {
			}).catch(() => {});
		}
	}
};

