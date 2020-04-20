import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import Explain from '@components/_common/explain/explain';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from "./popup/detail.vue";
import { AuditModal } from "./popup/audit.vue";
import { ModifyCostModal } from "./popup/modify-cost.vue";
import { DistributionModal } from "../_common/detail/distribution/distribution";
import Poptip from "../../sc/_common/poptip/poptip";

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': [],
				'6': []
			},
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('collage-customer-cooperate-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('collage-customer-cooperate-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleResetFirst() {
			this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
				type: this.type
			});
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleOperate(name, params) {
			if (name === "1" || name === "2") {
				AuditModal.popup({
					name,
					contract_id: params.row.contract_id,
					project_id: params.row.project_id
				}).then(res => {
					res && this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
						type: ""
					});
				});
			} else {
				ModifyCostModal.popup({
					contract_id: params.row.contract_id,
					project_id: params.row.project_id,
					need_cost_amount: Number(params.row.need_cost_amount),
					cost_amount: Number(params.row.cost_amount),
					is_cost_instalment: Number(params.row.is_cost_instalment)
				}).then(res => {
					res && this.$store.commit('COLLAGE_CUSTOMER_COOPERATE_LIST_RESET', {
						type: ""
					});
				});
			}
		},

		handleDistribute(e, params) {
			e.stopPropagation();

			DistributionModal.popup({
				project_id: Number(params.row.project_id)
			}).then(res => {
			});
		},

		handleOpenDrawer(row) {
			if (!this.$auth[1292]) {
				return;
			}

			DetailDrawer.popup({
				type: this.type,
				project_id: Number(row.project_id),
				contract_id: Number(row.contract_id),
				contract_company_id: Number(row.contract_company_id),
				lesson_type: Number(row.lesson_type),
				is_cost_instalment: Number(row.is_cost_instalment),
				contract_type: Number(row.contract_type)
			}).then(res => {
				res && this.$store.commit("COLLAGE_CUSTOMER_COOPERATE_LIST_RESET", {
					type: this.type
				});

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
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						let arr = [];

						+params.row.tags.renew === 1 && arr.push("续费");
						+params.row.tags.discount === 1 && arr.push("折扣");
						+params.row.tags.repeat === 1 && arr.push("复购");

						return (
							<div class="g-flex g-flex-ac">
								<AutoToolTip 
									content={params.row.contract_company_name}
									width="160px"
									theme="dark"
									placement="bottom" 
									labelClass="g-c-blue-mid g-pointer g-m-t-5"
								/>
								{arr.length != 0 ? <Poptip tag={arr}/> : ""}
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
					minWidth: 160,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.product_name}
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100
				},
				{
					title: "客户手机号",
					key: "phone",
					minWidth: 120
				},
				{
					title: "商学院金额",
					key: "cost_amount",
					minWidth: 100
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
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 150
				},
				{
					title: "部门",
					key: "invite_depart_name",
					minWidth: 150
				},
				{
					title: "下单人",
					key: "staff_name",
					minWidth: 150
				},
				{
					title: "下单时间",
					key: "create_time",
					minWidth: 160
				},
				{
					title: "审核人",
					key: "audit_staff_name",
					minWidth: 150
				},
				{
					title: "分配人",
					key: "assign_staff_name",
					minWidth: 160
				},
				{
					title: "分配时间",
					key: "assign_time",
					minWidth: 160
				},
				{
					title: "负责人",
					key: "charge_name",
					minWidth: 160,
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.charge_name}
								width="100px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
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

			if (type == 1) {
				columnsShow.push({
					title: "操作",
					key: "title",
					fixed: "right",
					align: 'center',
					minWidth: 100,
					render: (h, params) => {
						let pass = this.$auth[118] ? "block" : "none";
						let reject = this.$auth[119] ? "block" : "none";
						let change_cost = this.$auth[120] ? "block" : "none";

						return (
							<Dropdown 
								style="cursor: pointer; width: 100%; height: 100%; text-align: center;"
								transfer={true}
								placement="left-start"
								onOn-click={(name) => { this.handleOperate(name, params); }}
							>
								<i 
									class="iconfont icon-point"
									style="font-size: 20px; display: block"
									onClick={(e) => { e.stopPropagation(); }}
								/>

								<DropdownMenu slot="list">
									<DropdownItem name="1" style={{ display: pass }}>
										通过申请
									</DropdownItem>
									<DropdownItem name="2" style={{ display: reject }}>
										驳回申请
									</DropdownItem>
									<DropdownItem name="3" style={{ display: change_cost }}>
										修改成本
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						);
					}
				});
			} else if (type == 3) {
				if (this.$auth[121]) {
					columnsShow.push({
						title: "操作",
						key: "title",
						fixed: "right",
						minWidth: 100,
						render: (h, params) => {
							if (this.$auth[121]) {
								return (
									<div 
										class="g-operation"
										style="width: 100%"
										onClick={(e) => { this.handleDistribute(e, params); }}
									>
										分配
									</div>
								);
							} else {
								return null;
							}
						}
					});
				}
			} else if (type == 4) {
				if (this.$auth[121]) {
					columnsShow.push({
						title: "操作",
						key: "title",
						fixed: "right",
						minWidth: 100,
						render: (h, params) => {
							if (this.$auth[122]) {
								return (
									<div 
										class="g-operation"
										style="width: 100%"
										onClick={(e) => { this.handleDistribute(e, params); }}
									>
										重新分配
									</div>
								);
							} else {
								return null;
							}
						}
					});
				}
			}

			return columnsShow;
		}
	}
};