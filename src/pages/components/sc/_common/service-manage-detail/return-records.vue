<template>
	<div class="g-m-t-30 g-m-l-20 v-sc-manage-inspection-returns g-relative">
		<div v-if="spin">
			<oa-title title="回访记录" class="g-m-b-20" style="margin-left: 12px;"/>

			<div v-if="tableData.length != 0">
				<i-table 
					:columns="getColumns" 
					:data="tableData" 
					stripe
					row-key
					@on-row-click="handleRowClick"
				/>
			</div>

			<div v-else class="g-tc _empty">
				<img :src="OSS_NO_MESSAGE02" style="width: 160px;height: 160px;">
				<div class="g-fs-14 g-tc">暂无回访记录</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Table } from "iview";
import { Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { OSS_NO_MESSAGE02 } from "@constants/constants";
import Record from "./record";
import { ReturnsModal } from "../../manage-inspection/modal/returns";

export default {
	name: "sc-manage-inspection-return-records",
    
	components: {
		"i-table": Table,
		"oa-title": Title
	},
    
	props: {
		contract_company_id: Number,
		name: String,
		type: String,
		option: {
			type: Boolean,
			default: true
		}
	},
    
	data() {
		return {
			current_id: "",
			OSS_NO_MESSAGE02,
			columns: [
				{
					type: "expand",
					maxWidth: 50,
					render: (h, params) => {
						if (this.current_id == params.row.quality_record_id) {
							this.current_id = params.row.quality_record_id;

							return h(Record, {
								props: {
									quality_record_id: Number(params.row.quality_record_id),
									refesh: this.loadData,
									key: Number(params.row.quality_record_id),
									name: this.name,
									option: this.option
								}
							});
						} else {
							this.current_id = params.row.quality_record_id;

							return h("div", {}, "");
						}
					}
				},
				{
					title: "服务人",
					key: "service_person_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "回访日期",
					key: "create_time",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "回访人",
					key: "quality_staff_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "接通情况",
					key: "call_status",
					minWidth: 80,
					render: (h, params) => {
						return (
							<span>
								{["正常接通", "未接", "无效", "雷区", "非雷", "1正常", "2非雷", "2雷区", 
									"不回访", "暂不回访", "到期", "已退", "未评", "完结"][params.row.call_status * 1 - 1]}
							</span>
						);
					}
				},
				{
					title: "回款金额",
					key: "return_money",
					minWidth: 120,
					tooltip: true,
					render: (h, params) => {
						return (
							<span>
								{params.row.return_money ? params.row.return_money + "万元" : "--"}
							</span>
						);
					}
				},
				{
					title: "代理人数",
					key: "agent_num",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "评分",
					key: "score",
					minWidth: 80,
					tooltip: true,
					render: (h, params) => {
						let score = params.row.score ? params.row.score : "--";

						return (
							<span>{score}</span>
						);
					}
				},
				{
					title: "状态",
					key: "is_follow",
					minWidth: 80,
					render: (h, params) => {
						if (params.row.is_follow === 0) {
							return h("div", {
								style: {
									color: "#4FC43D"
								}
							}, "");
						} else if (params.row.is_follow === 1) {
							return h("div", {
								style: {
									color: "#ED8F4A"
								}
							}, "需跟进");
						} else {
							return h("div", {}, "已解决"); 
						}
					}
				}
			],
			tableData: [],
			spin: false
		};
	},
	computed: {
		getColumns() {
			let columns = [...this.columns];
			this.option ? columns.splice(-1, 0, {
				title: "操作",
				key: "",
				minWidth: 120,
				render: (h, params) => {
					return (
						<div>
							<span 
								style="color: #2397f9;display: inline-block;padding: 2px 8px 2px 0px;cursor: pointer"
								onClick={(e) => { e.stopPropagation(); this.handleReturns(params); }}
							>
								编辑
							</span>
						</div>
					);
				}
			}) : '';
			return columns;
		}
	},

	created() {
		(this.name === "name" || this.name === "examine") && this.columns.splice(8, 2);
	},
    
	mounted() {
		this.loadData();
	},
	methods: {
		handleReturns(params) {
			ReturnsModal.popup({
				quality_record_id: Number(params.row.quality_record_id),
				contract_company_id: Number(this.contract_company_id),
				name: this.name,
				type: this.type,
				index: Number(params.index)
			}).then(res => {
				if (res) {
					this.loadData();
					let str = ""; 
					this.name == "manage" ? str = "SC_MANAGE_INSPECTION_LIST_RESET" 
						: str = "SC_SERVICE_INSPECTION_LIST_RESET";
					this.$store.commit(str, {});
				}
			});
		},
		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				res.data.forEach(item => {
					item._expanded = false;
				});

				this.tableData = res.data;
				this.spin = true;
			}).catch(error => {
				this.$Message.warning(error.msg);
				this.spin = true;
			});
		},

		// 单击某一行时触发
		handleRowClick(row, index) {
			row._expanded = !row._expanded;
			this.tableData.splice(index, 1, row);
	
			if (row._expanded) {
				this.tableData.forEach((item, item_index) => {
					if (+item_index === +index) {
						item._expanded = true;
					} else {
						item._expanded = false;
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
.v-sc-manage-inspection-returns{
    padding-bottom: 120px;
	min-height: 90%;

    .ivu-table-wrapper {
        border: none;
    }

    .ivu-table {
        th,td {
            border: none;
        }
    }

    .ivu-table:after {
        width: 0;
    }

    .ivu-table:before {
        height: 0;
    }

	.ivu-table-cell-with-expand{
		width: 20px;
	}

	.ivu-table-cell-expand {
		width: 20px;
		text-align: center;
		pointer-events: none;

		.ivu-icon-ios-arrow-forward{
			display: inline-block;
			pointer-events: none;
		}
	}

	td.ivu-table-expanded-cell{
		padding: 0px;
		background: #ffffff;
	}

	.ivu-icon-ios-arrow-forward::before {
		content: '\F341';
		font-size: 18px;
		pointer-events: none;
	}

	.ivu-table-stripe{
		.ivu-table-body{
			tr:nth-child(2n) {
				td{
					background: #ffffff;
				}
			}
		}
	}

	._empty{
		margin-top: 100px;
	}
}
</style>