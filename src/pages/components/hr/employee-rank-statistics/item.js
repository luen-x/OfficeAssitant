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
					render: (h, params) => {
						const { staff_status } = params.row;
						return (
							<span
								class={(staff_status && staff_status === 4) ? '' : 'g-c-blue-mid g-pointer'}
								style={{ display: 'block', width: '100%' }}
								onClick={() => this.handleLinkTo(params)}>
								{params.row.staff_name}
							</span>
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
					minWidth: 150,
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150
				},
				{
					title: "入职时间",
					key: "entry_time",
					minWidth: 160
				},
				{
					title: "员工工龄",
					key: "work_day",
					minWidth: 140
				},
				{
					title: "员工职位",
					key: "position_name",
					minWidth: 150
				},
				{
					title: "任职时间",
					key: "office_time",
					minWidth: 160
				},
				{
					title: "员工级称",
					key: "rank_name",
					minWidth: 150
				},
				{
					title: '操作',
					key: 'action',
					fixed: 'right',
					align: 'center',
					minWidth: 100,
					render: (h, params) => {
						return (
							<span>
								{ this.$auth[857]
									? <span class="g-c-blue-mid g-pointer" onClick={() => this.handleClick(params.row)}>
										调整职位
									</span> : null }
							</span>
						);
					}
				}
			],
		};
	},
	methods: {
		handleClick(info) {
			PModal.popup({
				info,
				id: this.stair_depart_id
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_RANK_STATISTICS_LIST_INIT', this.position_id);
			}).catch(err => {});
		},
		handleLinkTo(params) {
			if (this.$auth[856]) {
				this.$router.push({
					path: '/hr/employee/summary/details',
					query: {
						staff_id: params.row.staff_id,
						staff_name: params.row.staff_name,
						// type: 7
					}
				});
			}
		},
	}
};

