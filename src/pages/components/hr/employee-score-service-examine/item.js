import Explain from "@components/_common/explain/explain";
import { Tooltip } from 'iview';
import { DetailDrawer } from "./popup/detail.vue";
import Poptip from "../../sc/_common/poptip/poptip.vue";

export default {
	data() {
		const columns = [
			{
				title: "客户",
				key: "contract_company_name",
				fixed: "left",
				minWidth: 220,
				tooltip: true,
				render: (h, params) => {
					let arr = [];
					let className = "";

					params.row.is_complaint == 1 ? arr.push("投诉") : "";
					params.row.is_supply == 1 ? arr.push("补交") : "";

					this.$auth[888] ? className = "g-operation g-oneline g-col g-inline-block" : "g-oneline g-col g-inline-block";

					return (
						<div class="g-flex g-flex-ac">
							<span class={className}>
								{
									params.row.contract_company_name.length > 15
										? <Tooltip
											content={params.row.contract_company_name}
											transfer={true}
											maxWidth={250}
										>
											{params.row.contract_company_name.slice(0, 15) + '...'}
										</Tooltip>
										: params.row.contract_company_name
								}
							</span>
							{
								arr.length == 1
									? <span
										class="g-inline-block g-tc g-c-white"
										style="width: 40px;height: 24px; line-height: 24px; background: #E84C57;border-radius: 4px;"
									>
										{arr[0]}
									</span>
									: ""
							}
							{
								arr.length == 2 ? <Poptip tag={arr}/> : ""
							}
						</div>
					);
				}
			},
			{
				title: "服务人",
				key: "service_staff_name",
				minWidth: 100,
				tooltip: true
			},
			{
				title: "服务人部门",
				key: "service_depart_name",
				minWidth: 100,
				tooltip: true
			},
			{
				title: "质检评分",
				key: "score",
				minWidth: 100,
				tooltip: true,
				render: (h, params) => {
					let score = params.row.score && params.row.score.length > 0 ? params.row.score : "--";

					return (
						<div>{score}</div>
					);
				}
			},
			{
				title: "回款金额",
				key: "return_money",
				minWidth: 100,
				tooltip: true,
				render: (h, params) => {
					let return_money = params.row.return_money && params.row.return_money.length > 0 ? params.row.return_money : "-";
					return (
						<div>{return_money}</div>
					);
				}
			},
			{
				title: "审核人",
				key: "quality_staff_name",
				minWidth: 100,
				tooltip: true
			},
			{
				title: "待确认服务",
				key: "wait_confirm",
				sortable: "custom",
				minWidth: 120,
				tooltip: true
			},
			{
				title: "最近提交时间",
				key: "last_service_time",
				minWidth: 160,
				tooltip: true,
				sortable: "custom"
			},
			{
				title: "最近投诉时间",
				key: "last_complaint_time",
				sortable: "custom",
				minWidth: 160,
				tooltip: true
			}];
		this.setColumnSortType(columns);
		return {
			columns
		};
	},

	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_EXAMINE_LIST_RESET', { type: this.type });
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleOpenDrawer(row) {
			if (!this.$auth[888]) {
				return;
			}

			DetailDrawer.popup({
				contract_company_id: Number(row.contract_company_id),
				wait_confirm: Number(row.wait_confirm),
				within_system: Number(row.within_system)
			}).then(res => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			});
		}
	}
};