import { CreatePortal, ImgsPreview } from "wya-vc";
import { NoEditProblemModal } from "../views/modal/no-edit.problem.vue";
import { ReplyModal } from "./modal/reply.vue";
import { ChangeModal } from "./modal/change.vue";

export default {
	data() {
		return {
			columns: [
				{
					title: "反馈人",
					key: "staff_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "手机号",
					key: "mobile",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "反馈板块",
					key: "menu_name",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "反馈标题",
					key: "title",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "反馈建议",
					key: "content",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "反馈时间",
					key: "create_time",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "回复人",
					key: "reply_staff_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "回复内容",
					key: "reply_msg",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "回复时间",
					key: "reply_time",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "忽略原因",
					key: "ignore_msg",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "操作",
					minWidth: 100,
					key: "link",
					fixed: "right",
					render: (h, params) => {
						if (this.type != 1) {
							let look = "none";
							let change = "none";
							this.$auth[267] ? look = "block" : "none";
							this.$auth[329] ? change = "block" : "none";
						
							return h("div", {
								class: "g-flex"
							}, [h("div", {
								class: "g-pointer g-m-r-5 g-pd-r-5",
								style: {
									color: "#2397F9",
									display: look,
									borderRight: "1px solid #2397F9",
									height: "12px",
									lineHeight: "12px"
								},
								on: {
									click: () => {
										NoEditProblemModal.popup({
											issue_id: Number(params.row.issue_id),
											flag: 2,
											type: Number(this.type)
										}).then();
									}
								}
							}, "查看"),		
							h("div", {
								class: "g-pointer",
								style: {
									color: "#2397F9",
									display: change,
									height: "12px",
									lineHeight: "12px"
								},
								on: {
									click: () => {
										ChangeModal.popup({
											issue_id: Number(params.row.issue_id),
											start_solve_time: params.row.start_solve_time,
											stop_solve_time: params.row.stop_solve_time,
											type: Number(this.type)
										}).then(res => {
											res && this.$store.commit('SC_REPLY_ANSWER_LIST_RESET', { type: this.type });
										});
									}
								}
							}, "变更")]);
						} else if (this.$auth[1244]) {
							return h("div", {
								class: "g-pointer",
								style: {
									color: "#2397F9"
								},
								on: {
									click: () => {
										ReplyModal.popup({
											issue_id: Number(params.row.issue_id)
										}).then(res => {
											res && this.$store.commit('SC_REPLY_ANSWER_LIST_RESET', { type: this.type });
										});
									}
								}
							}, "回复");
						}
					}
				}
			],
		};
	},

	computed: {
		getColumns() {
			let columns = this.columns;

			if (this.type == 5) {
				if (columns.length === 15) {
					return columns;
				} else {
					columns.splice(13, 2);
				}

				return columns;
			} else {
				columns.length === 13 && columns.splice(13, 0, {
					title: "开始解决时间",
					key: "start_solve_time",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "解决时间",
					key: "stop_solve_time",
					minWidth: 160,
					tooltip: true
				});

				return columns;
			}
		}
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('SC_REPLY_ANSWER_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_REPLY_ANSWER_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		}
	}
};