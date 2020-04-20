import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Tooltip } from "iview";
import { DetailDrawer } from "./popup/detail.vue";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': []
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('collage-service-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('collage-service-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_SERVICE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('COLLAGE_SERVICE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(row) {
			if (!this.$auth[1294]) {
				return;
			}

			DetailDrawer.popup({
				product_name: row.product_name,
				type: this.type,
				contract_id: Number(row.contract_id),
				contract_company_id: Number(row.contract_company_id),
				project_id: Number(row.project_id),
				lesson_type: Number(row.lesson_type),
				contract_type: Number(row.contract_type)
			}).then(res => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs[`table${this.type}`][0].$refs.tableTarget.clearCurrentRow();
			});
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [
				{
					title: "公司名称",
					key: "contract_company_name",
					minWidth: 250,
					fixed: "left",
					render: (h, params) => {
						if (typeof params.row.contract_company_name === "string") {
							return (
								<div class="g-flex g-flex-ac">
									<AutoToolTip
										content={params.row.contract_company_name}
										width="160px"
										theme="dark"
										placement="bottom" 
										labelClass="g-c-blue-mid g-pointer g-m-t-5"
									/> 
									{
										+params.row.is_invalid === 1
											? <div
												class="g-c-white g-tc"
												style="width: 60px;height: 32px;line-height: 32px;background: #e84c57;border-radius: 4px;"
											>
												已失效
											</div>
											: null
									}
								</div>
							);
						} else {
							return null;
						}
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 120
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 120
				},
				{
					title: "合同类型",
					key: "contract_type",
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>
								{
									["新建合同", "补充协议", "更换产品", "续费合同"][params.row.contract_type]
								}
							</div>
						);
					}
				},
				{
					title: "合同编号",
					key: "contract_num",
					minWidth: 150
				},
				{
					title: "下单产品",
					key: "product_name",
					minWidth: 160
				},
				{
					title: "下单时间",
					key: "create_time",
					sortable: "custom",
					minWidth: 160
				},
				{
					title: "流程对接人",
					key: "main_staff_name",
					minWidth: 120
				},
				{
					title: "讲师",
					key: "lecture_staff_name",
					minWidth: 120,
					render: (h, params) => {
						let str = params.row.lecture_staff_name.length > 4 
							? params.row.lecture_staff_name.slice(0, 4) + "..." : params.row.lecture_staff_name;

						return (
							<Tooltip transfer maxWidth={500}>
								<div>{str}</div>
								<div slot="content">
									{
										params.row.assign.map(item => {
											return (
												<div>
													{item.lecture_set_name + '：' + item.staff_name.join("、")}
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
					title: "分配时间",
					key: "assign_time",
					sortable: "custom",
					minWidth: 160
				},
				{
					title: "分配人",
					key: "assign_staff_name",
					minWidth: 120
				},
				{
					title: "最近更新时间",
					key: "last_time",
					sortable: "custom",
					minWidth: 160
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 120
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 120
				},
				{
					title: "下单人",
					key: "staff_name",
					minWidth: 120
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			columnsShow.unshift({
				type: "selection",
				fixed: "left",
				minWidth: 50
			});

			return columnsShow;
		}
	}
};