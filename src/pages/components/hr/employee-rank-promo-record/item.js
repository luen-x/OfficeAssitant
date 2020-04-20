import { Poptip } from 'iview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					title: "姓名",
					key: "id",
					fixed: "left",
					width: 170,
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 33px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_status } = params.row;
						return params.row.content ? h(
							Poptip,
							{
								props: {
									trigger: 'hover',
									placement: 'right',
									wordWrap: true,
									width: '150',
									transfer: true,
									content: params.row.content
								}
							},
							[
								h('div', { class: 'g-flex-ac' }, [
									(staff_status && staff_status === 4) ? h('div', {
										class: 'g-m-r-5 g-remark',
									}, '离') : h('div', {
										class: 'g-m-r-5 g-remark',
										style: 'opacity: 0'
									}, '离'),
									h('span', {
										class: 'g-c-blue-mid g-pointer',
										style: { display: 'block', width: '100%' },
										on: { click: () => { this.handleLinkTo(params); } }
									}, params.row.staff_name)
								])
							]
						) : h('div', { class: 'g-flex-ac' }, [
							(staff_status && staff_status === 4) ? h('div', {
								class: 'g-m-r-5 g-remark',
							}, '离') : h('div', {
								class: 'g-m-r-5 g-remark',
								style: 'opacity: 0'
							}, '离'),
							h('span', {
								class: 'g-c-blue-mid g-pointer',
								style: { display: 'block', width: '100%' },
								on: { click: () => { this.handleLinkTo(params); } }
							}, params.row.staff_name)
						]);
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
					title: "操作类型",
					key: "is_up",
					width: 120
				},
				{
					title: "操作前级称",
					key: "before_rank_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.before_rank_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "操作后级称",
					key: "after_rank_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={params.row.after_rank_name}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "操作时间",
					key: "create_time",
					minWidth: 160
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_RANK_PROMO_RECORD_LIST_RESET', { type: this.type });
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

