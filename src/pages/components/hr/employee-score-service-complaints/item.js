import { ServiceAppealModal } from "./popup/service-appeal.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: "公司名称",
					key: "contract_company_name",
					fixed: "left",
					minWidth: 220,
					tooltip: true
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100,
					tooltip: true
				},
				// { // 2019-12-2 陈方圆需求
				// 	title: "客户手机号",
				// 	key: "phone",
				// 	minWidth: 120,
				// 	tooltip: true
				// },
				{
					title: "申请人",
					key: "apply_staff_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "申请时间",
					key: "create_time",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "申请理由",
					key: "reason",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "审核进度",
					key: "audit_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "操作",
					key: "title",
					minWidth: 100,
					render: (h, params) => {
						if (this.type === "1" && this.$auth[900]) {
							return h("div", {
								class: "g-pointer",
								style: {
									marginRight: '5px',
									color: "#2397F9"
								},
								on: {
									"click": () => {
										ServiceAppealModal.popup({
											apply_id: Number(params.row.apply_id),
											flag: true
										}).then(res => {
											res && this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_RESET', { type: this.type });
										});
									}
								}
							}, "审核");
						} else if ((this.type === "2" || this.type === "3") && this.$auth[901]) {
							return h("div", {
								class: "g-pointer",
								style: {
									color: "#2397F9"
								},
								on: {
									"click": () => {
										ServiceAppealModal.popup({
											apply_id: Number(params.row.apply_id),
											flag: false
										}).then(res => {});
									}
								}
							}, "查看");
						} else {
							return null;
						}
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		}
	}
};

