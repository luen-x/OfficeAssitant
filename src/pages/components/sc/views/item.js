import { CreatePortal, ImgsPreview } from "wya-vc";
import { EditProblemModal } from "./modal/edit-problem.vue";
import { NoEditProblemModal } from "./modal/no-edit.problem.vue";

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
						return h('div', {
							class: "g-pointer",
							style: {
								color: "#2397F9"
							},
							on: {
								click: () => {
									if (Number(params.row.is_edit) === 1 && Number(this.type) === 1) {
										EditProblemModal.popup({
											issue_id: Number(params.row.issue_id)
										}).then(res => {
											res && this.$store.commit('SC_VIEWS_LIST_RESET', { type: this.type });
										});
									} else {
										NoEditProblemModal.popup({
											issue_id: Number(params.row.issue_id),
											flag: 1,
											type: Number(this.type)
										}).then();
									}
								}
							}
						}, "查看");
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_VIEWS_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_VIEWS_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

