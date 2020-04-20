export default {
	data() {
		return {
			columns: [
				{
					title: "姓名 ",
					key: "staff_name",
					minWidth: 150,
					tooltip: true
				},
				{
					title: "手机号",
					key: "mobile",
					minWidth: 150
				},
				{
					title: "部门",
					key: "abbreviation",
					minWidth: 150,
					tooltip: true
				},
				{
					title: "PK业绩",
					key: "pk_performance",
					minWidth: 150
				},
				{
					title: "提成业绩",
					key: "minus_performance",
					minWidth: 150
				},
				{
					title: "总提成",
					key: "total_commission",
					minWidth: 150
				},

				{
					title: "实发提成",
					key: "grant_commission",
					minWidth: 150
				},
				{
					title: "服务提成",
					key: "service_commission",
					minWidth: 150
				},
				{
					title: "应扣回提成",
					key: "deduction_commission",
					minWidth: 150
				},
				{
					title: "操作",
					key: "audit_time",
					minWidth: 100,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return (
							<div class="g-operation">
								<span onClick={() => this.handleContract(params.row.staff_id, params.row.staff_name)}>查看</span>
							</div>
						);
					}
				}
			]
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit("SALE_ACHIEVEMENT_LIST_INIT");
		},
		handleResetCur() {
			this.$store.commit("SALE_ACHIEVEMENT_LIST_RESET", { type: this.type });
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handleContract(v, i) {
			this.$router.push({ name: "sale-achievement-staff", query: { staff_id: v, name: i, month: this.$route.query.month } });
		}
	}
};
