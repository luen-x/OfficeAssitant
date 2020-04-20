import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Tooltip } from "iview";
import { OnlineOfflineDetailDrawer } from "./popup/online-offline-detail/online-offline-detail";
import { DetailDrawer } from "./popup/customer-detail/detail";

export default {
	data() {
		return {
			online: [
				{
					title: "讲师姓名",
					key: "staff_name",
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.staff_name}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass="g-c-blue-mid g-pointer"
							/>
						);
					}
				},
				{
					title: "所属部门",
					key: "depart_name",
					minWidth: 120
				},
				{
					title: "职位",
					key: "position_name",
					minWidth: 120
				},
				{
					title: "套系评分",
					key: "lesson_info",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						if (this.type == 1) {
							params.row.lesson_info && params.row.lesson_info.length && params.row.lesson_info.forEach(item => {
								arr.push(`${item.project.product_name}：${item.lecture_set_name}（${item.whole_score}）分`);
							});
						} else {
							params.row.lesson_info && params.row.lesson_info.length && params.row.lesson_info.forEach(item => {
								arr.push(`${item.lecture_set_name}（${item.whole_score}）分`);
							});
						}

						let str = arr.join("、").length > 20 ? arr.join("、").slice(0, 17) + "..." : arr.join("、");

						return (
							<Tooltip transfer>
								<div>{str}</div>
								<div slot="content">
									{
										arr.map((item, index) => {
											return (
												<div class="g-m-b-10">
													{item}
												</div>
											);
										})
									}
								</div>
							</Tooltip>
						);
					}
				},
				{
					title: "讲师评分占比",
					key: "lecture_score_static",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						params.row.lecture_score_static && params.row.lecture_score_static.length && params.row.lecture_score_static.forEach(item => {
							// eslint-disable-next-line max-len
							arr.push(`${["10分总数", "9≤x＜10分总数", "8≤x＜9分总数", "7≤x＜8分总数", "小于7分总数"][item.score_step - 1]}（${item.num}套/占比${item.point}%）`);
						});

						let str = arr.join("、").length > 20 ? arr.join("、").slice(0, 17) + "..." : arr.join("、");

						return (
							<Tooltip transfer>
								<div>{str}</div>
								<div slot="content">
									{
										arr.map((item, index) => {
											return (
												<div class="g-m-b-10">
													{item}
												</div>
											);
										})
									}
								</div>
							</Tooltip>
						);
					}
				}
			],
			lecturer: [
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.contract_company_name}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass="g-c-blue-mid g-pointer"
							/>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 120
				},
				{
					title: "合作产品",
					key: "project_items",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						params.row.project_items && params.row.project_items.length && params.row.project_items.forEach(item => {
							arr.push(item.product_name);
						});

						return (
							<AutoToolTip 
								content={arr.join("、")}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "套系评分",
					key: "lesson_items",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						params.row.lesson_items && params.row.lesson_items.length && params.row.lesson_items.forEach(item => {
							if (item.lesson_type == 1) {
								arr.push(`${item.project.product_name}：${item.lecture_set_name}(${item.whole_score})`);
							} else if (item.lesson_type == 2) {
								arr.push(`${item.lecture_set_name}(${item.whole_score})`);
							}
						}); 

						let str = arr.join("、").length > 20 ? arr.join("、").slice(0, 17) + "..." : arr.join("、");

						return (
							<Tooltip transfer>
								<div>{str}</div>
								<div slot="content">
									{
										arr.map((item, index) => {
											return (
												<div class="g-m-b-10">
													{item}
												</div>
											);
										})
									}
								</div>
							</Tooltip>
						);
					}
				},
				{
					title: "已质检套系数",
					key: "has_quality_count",
					minWidth: 100
				},
				{
					title: "未质检套系数",
					key: "need_quality_lesson",
					minWidth: 100
				},
				{
					title: "质检最高分",
					key: "max_whole_score",
					minWidth: 100
				},
				{
					title: "质检最低分",
					key: "min_whole_score",
					minWidth: 100
				},
				{
					title: "最近质检时间",
					key: "quality_date",
					minWidth: 160
				}
			]
		};
	},
	computed: {
		getColumns() {
			let columns = [];

			if (this.type == 1) {
				columns = [...this.online, {
					title: "流程对接评分占比",
					key: "process_score_static",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						params.row.process_score_static && params.row.process_score_static.length && params.row.process_score_static.forEach(item => {
							// eslint-disable-next-line max-len
							arr.push(`${["10分总数", "9≤x＜10分总数", "8≤x＜9分总数", "7≤x＜8分总数", "小于7分总数"][item.score_step - 1]}（${item.num}套/占比${item.point}%）`);
						});

						let str = arr.join("、").length > 20 ? arr.join("、").slice(0, 17) + "..." : arr.join("、");

						return (
							<Tooltip transfer>
								<div>{str}</div>
								<div slot="content">
									{
										arr.map((item, index) => {
											return (
												<div class="g-m-b-10">
													{item}
												</div>
											);
										})
									}
								</div>
							</Tooltip>
						);
					}
				}];
			} else if (this.type == 2) {
				columns = [...this.online, {
					title: "主持人评分占比",
					key: "host_score_static",
					minWidth: 220,
					render: (h, params) => {
						let arr = [];

						params.row.host_score_static && params.row.host_score_static.length && params.row.host_score_static.forEach(item => {
							// eslint-disable-next-line max-len
							arr.push(`${["10分总数", "9≤x＜10分总数", "8≤x＜9分总数", "7≤x＜8分总数", "小于7分总数"][item.score_step - 1]}（${item.num}套/占比${item.point}%）`);
						});

						let str = arr.join("、").length > 20 ? arr.join("、").slice(0, 17) + "..." : arr.join("、");

						return (
							<Tooltip transfer>
								<div>{str}</div>
								<div slot="content">
									{
										arr.map((item, index) => {
											return (
												<div class="g-m-b-10">
													{item}
												</div>
											);
										})
									}
								</div>
							</Tooltip>
						);
					}
				}];
			} else {
				columns = this.lecturer;
			}

			return columns;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('COLLAGE_CHECK_STATISTIC_CHECK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_CHECK_STATISTIC_CHECK_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			if (this.type != 3) {
				OnlineOfflineDetailDrawer.popup({
					staff_name: row.staff_name,
					staff_id: Number(row.staff_id)
				}).then(res => {
					this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
				}).catch(err => {
					this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
				});
			} else {
				DetailDrawer.popup({
					contract_company_name: row.contract_company_name,
					contract_company_id: Number(row.contract_company_id)
				}).then(res => {
					this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
				}).catch(err => {
					this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
				});
			}
		},
	}
};