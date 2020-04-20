import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Tooltip } from "iview";
import { DetailDrawer } from "./popup/detail.vue";
import Poptip from "../_common/poptip/poptip.vue";
import Dropdown from './drop-down';

export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': []
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('sc-product-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('sc-product-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleResetFirst() {
			this.$store.commit('SC_PRODUCT_LIST_INIT');
		},

		handleResetCur() {
			this.$store.commit('SC_PRODUCT_LIST_RESET', {
				type: this.type
			});
		},

		handleLinkTo() {
			this.$router.push('/');
		},

		handleSkip(params, e) {
			e && e.stopPropagation();

			DetailDrawer.popup({
				type: this.type,
				contract_id: Number(params.row.contract_id),
				project_id: Number(params.row.project_id),
				product_id: Number(params.row.product_id),
				contract_company_id: Number(params.row.contract_company_id),
				product: params.row.product,
				contract_num: params.row.contract_num,
				contract_type: Number(params.row.contract_type),
				tab: "productProgress"
			}).then(res => {
				res && this.$store.commit("SC_PRODUCT_LIST_RESET", { type: "" });
			});
		},

		handleOpenDrawer(row) {
			this.$auth[324] && DetailDrawer.popup({
				type: this.type,
				contract_id: Number(row.contract_id),
				project_id: Number(row.project_id),
				product_id: Number(row.product_id),
				contract_company_id: Number(row.contract_company_id),
				product: row.product,
				contract_type: Number(row.contract_type),
				tab: "projectRequirement"
			}).then(res => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			}).catch(err => {
				this.$refs.tableTarget[this.type - 1].$refs.tableTarget.clearCurrentRow();
			});
		},

		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [{
				title: "公司名称",
				key: "company",
				minWidth: 220,
				fixed: "left",
				render: (h, params) => {
					// is_renew  是否续费 0否 1是
					// refund_type 退款类型 1 合同退款 2 换合同退款 3 余额退款 4 产品退款
					// is_change_project 是否更换产品

					let arr = [];

					+params.row.is_renew === 1 && arr.push("续费");
					+params.row.is_discount === 1 && arr.push("打折");

					if (type != 3) {
						if (+params.row.refund_type === 1) {
							arr.push("合同退款");
						} else if (+params.row.refund_type === 2) {
							arr.push("换合同退款");
						} else if (+params.row.refund_type === 4) {
							arr.push("产品退款");
						} else if (+params.row.refund_type === 5) {
							arr.push("换产品退款");
						}
					}

					return (
						<div class="g-flex-ac">
							<AutoToolTip 
								content={params.row.company}
								width="160px"
								theme="dark"
								placement="bottom" 
								labelClass={this.$auth[324] ? "g-c-blue-mid g-pointer" : ""}
							/>
							{arr.length != 0 ? <Poptip tag={arr}/> : ""}
						</div>
					);
				}
			},
			{
				title: "合同编号",
				key: "contract_num",
				minWidth: 160
			},
			{
				title: "下单产品",
				key: "product",
				minWidth: 160,
				render: (h, params) => {
					return (
						<AutoToolTip 
							content={params.row.product}
							width="120px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: "下单时间",
				key: "single_time",
				minWidth: 160
			},
			{
				title: "客户姓名",
				key: "customer",
				minWidth: 100
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
						<div>{params.row.contract_type_name}</div>
					);
				}
			},
			{
				title: "邀约人",
				key: "invite_person",
				minWidth: 100
			},
			{
				title: "部门",
				key: "department",
				minWidth: 100
			},
			{
				title: "下单人",
				key: "single_person",
				minWidth: 100
			}, 
			{
				title: "主负责人",
				key: "main_person",
				minWidth: 100
			},
			{
				title: "负责人",
				key: "person",
				minWidth: 120,
				render: (h, params) => {
					return (
						<AutoToolTip 
							content={params.row.person}
							width="80px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			},
			{
				title: "进度",
				key: "progress",
				minWidth: 80,
				render: (h, params) => {
					if (this.$auth[324]) {
						return (
							<div class="g-operation g-oneline" onClick={(e) => { this.handleSkip(params, e); }}>
								<Dropdown progress={params.row.progress} complete_names={params.row.complete_names}/>
							</div>
						);
					} else {
						return (
							<div style="color: '#000000'">
								<Dropdown progress={params.row.progress} complete_names={params.row.complete_names}/>
							</div>
						);
					}
				}
			}, 
			{
				title: "最近完成步骤",
				key: "last_complete_name",
				minWidth: 150
			},
			{
				title: "分配时间",
				key: "distribute_time",
				minWidth: 160
			}, 
			{
				title: "产品制作部门",
				key: "make_product_dept",
				minWidth: 150
			},
			{
				title: "失效原因",
				key: "expire_reason",
				minWidth: 100
			}, {
				title: "是否上传合同",
				key: "electronic",
				minWidth: 160,
				render: (h, params) => {
					let status = "";

					if (Number(params.row.electronic.status) === 1) {
						status = "是（待审核）";
					} else if (Number(params.row.electronic.status) === 2) {
						status = "是（已通过）";
					} else if (Number(params.row.electronic.status) === 3) {
						status = "是（已驳回）";
					} else {
						status = "否";
					}

					return (
						<div>{ status }</div>
					);
				}
			}, {
				title: "合同金额",
				key: "contract_amount",
				minWidth: 120
			}, {
				title: "部门简称",
				key: "depart_easy_name",
				minWidth: 100
			}, {
				title: "品牌名称",
				key: "brand_name",
				minWidth: 120
			}];

			if (type == 1) {
				columns.push({
					title: "最近更新时间",
					key: "last_time",
					minWidth: 160
				});
			} else if (type == 2) {
				columns.push({
					title: "完成时间",
					key: "last_time",
					minWidth: 160
				});
			} else if (type == 3) {
				columns.push({
					title: "失效时间",
					key: "last_time",
					minWidth: 160
				});
			}

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			columnsShow.unshift({
				type: 'selection',
				fixed: 'left',
				width: 30,
			}, {
				title: " ",
				key: " ",
				fixed: 'left',
				width: 20,
				render: (h, params) => {
					// 旗子的颜色
					let flag_color = params.row.tag && params.row.tag.type
						? ["#924CE8", "#E84C57", "#4FC43D", "#ED8F4A"][params.row.tag.type * 1 - 1] 
						: "";

					if (params.row.tag && params.row.tag.remarks && params.row.tag.remarks.length > 0) {
						return (
							<div>
								<Tooltip 
									content={params.row.tag.remarks}
									maxWidth="250"
									transfer={true}
									placement="bottom"
								>
									<span class="iconfont icon-qizhi g-fs-12" style={{ marginRight: "5px", color: flag_color }}/>
								</Tooltip>
							</div>
						);
					} else if (params.row.tag && params.row.tag.type && params.row.tag.remarks.length === 0) {
						return (
							<span class="iconfont icon-qizhi g-fs-12" style={{ marginRight: "5px", color: flag_color }}/>
						);
					} else if (params.row.tag && !params.row.tag.type) {
						return (
							<span style={{ marginRight: "17px" }}/>
						);
					}
				}
			});

			return columnsShow;
		}
	}
};