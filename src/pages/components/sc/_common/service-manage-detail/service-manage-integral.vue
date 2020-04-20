<template>
	<div class="g-pd-lr-20 g-m-t-20 v-sc-manage-inspection-integral">
		<div v-if="spin">
			<div>
				<div class="_title g-c-black3 g-m-t-30 g-m-b-20">
					<span class="__label g-pd-l-15 g-fs-14 g-inline-block">客户回款信息</span>
				</div>
				<div class="_content">
					<i-table :columns="returnInfo" :data="return_info" stripe/>
				</div>
			</div>
			<div>
				<div class="_title g-m-tb-20">
					<span class="__label g-pd-l-15 g-fs-14 g-inline-block">客户满意度</span>
				</div>
				<div class="_content">
					<i-table :columns="satisfactionDegree" :data="satisfaction_degree" stripe/>
				</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Table, Tooltip } from "iview";
import API_ROOT from "@stores/apis/root";
import { RefundVoucherModal } from "./refund-vocher";
import { SatifactionVoucherModal } from "./satisfaction-vocher";

export default {
	name: "sc-manage-inspection-integral",
    
	components: {
		"i-table": Table
	},

	props: {
		contract_company_id: Number
	},

	data() {
		return {
			spin: false,
			return_info: [], // 客户回款信息
			satisfaction_degree: [], // 客户满意度
			returnInfo: [// 回款信息
				{
					title: "回款金额",
					key: "return_amount",
					minWidth: 120,
					tooltip: true,
					render: (h, params) => {
						if (params.row.return_amount) {
							return (
								<div>{params.row.return_amount}万</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: "代理人数",
					key: "agent_num",
					minWidth: 90,
					tooltip: true,
					render: (h, params) => {
						if (params.row.agent_num) {
							return (
								<div>{params.row.agent_num}人</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: "提交人",
					key: "staff_name",
					minWidth: 180,
					tooltip: true,
					render: (h, params) => {
						let str = params.row.staff_name + "(" + params.row.depart_name + ")";

						if (str.length === 2) {
							return <div>--</div>;
						} else if (str.length < 13) {
							return (
								<div>{str}</div>
							);
						} else {
							return (
								<Tooltip content={str} max-width="200">
									<div>{str.slice(0, 10)}...</div>
								</Tooltip>
							);
						}
					}
				},
				{
					title: "凭证",
					key: "fileImage",
					minWidth: 90,
					tooltip: true,
					render: (h, params) => {
						return h("span", {
							class: "g-c-blue-mid g-pointer",
							on: {
								"click": () => {
									RefundVoucherModal.popup({
										refundVoucher: params.row
									}).then(res => {
									});
								}
							}
						}, "查看");
					}
				},
				{
					title: "备注",
					key: "remarks",
					minWidth: 90,
					tooltip: true
				},
				{
					title: "提交时间",
					key: "create_time",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "审核结果",
					key: "service_status",
					minWidth: 90,
					tooltip: true,
					render: (h, params) => {
						return (
							<div>{["待审核", "审核通过", "审核驳回", "已评积分", "未评"][params.row.service_status * 1 - 1]}</div>
						);
					}
				},
				{
					title: "审核人",
					key: "service_staff_name",
					minWidth: 180,
					tooltip: true,
					render: (h, params) => {
						let str = params.row.service_staff_name + "(" + params.row.service_depart_name + ")";

						if (str.length === 2) {
							return <div>--</div>;
						} else if (str.length < 13) {
							return (
								<div>{str}</div>
							);
						} else {
							return (
								<Tooltip content={str} max-width="200">
									<div>{str.slice(0, 10)}...</div>
								</Tooltip>
							);
						}
					}
				},
				{
					title: "审核时间",
					key: "service_audit_time",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "审核备注",
					key: "service_audit_mark",
					minWidth: 120,
					tooltip: true
				}
			],
			satisfactionDegree: [// 客户满意度
				{
					title: "提交内容",
					key: "satis_type",
					minWidth: 110,
					tooltip: true,
					render: (h, params) => {
						let str = ["合作客户追加签单", "转介绍客户签单成交", "客户好评", "锦旗/授牌"][params.row.satis_type * 1 - 1];

						return (
							<div>{str}</div>
						);
					}
				},
				{
					title: "提交人",
					key: "staff_name",
					minWidth: 180,
					tooltip: true,
					render: (h, params) => {
						return (
							<div>{params.row.staff_name}({params.row.depart_name})</div>
						);
					}
				},
				{
					title: "凭证",
					key: "fileImage",
					minWidth: 90,
					tooltip: true,
					render: (h, params) => {
						return h("span", {
							class: "g-c-blue-mid g-pointer",
							on: {
								"click": () => {
									SatifactionVoucherModal.popup({
										satifactionVoucher: params.row
									}).then(res => {
									});
								}
							}
						}, "查看");
					}
				},
				{
					title: "备注",
					key: "remarks",
					minWidth: 160,
					tooltip: true
				},
				{
					title: "提交时间",
					key: "create_time",
					minWidth: 160,
					tooltip: true
				}
			]
		};
	},

	mounted() {
		this.loadData();
	},
    
	methods: {
		/**
		 * 初始化加载
		 */
		async loadData() {
			this.spin = false;
			
			// 客户回款信息
			await this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_INTERRAL_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contract_company_id
				}
			}).then(res => {
				this.return_info = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});

			// 客户满意度
			await this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_SATISFACTION_GET,
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contract_company_id
				}
			}).then(res => {
				this.satisfaction_degree = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});

			this.spin = true;
		},
	}
};
</script>

<style lang="scss">
.v-sc-manage-inspection-integral {
    padding-bottom: 100px;

	._title {
		.__label {
			border-left: 2px solid #e84854;
			height: 14px;
			line-height: 14px;
		}

		.__btn {
			color: #2397f9;
		}
	}

	._content {
		.__item {
			width: 100%;
			border-radius: 5px;
			border: 1px solid #e8e8e8;

			.__top{
				background-color: #f5f5f6;
			}

			.__img {
				img {
					width: 60px;
					height: 60px;
					border: 1px solid #d4d7db;
				}
			}

			.__tip {
				color: #818794;
			}

			.__audio {
				width: 100%;
				height: 30px;
				background-color: #f5f5f6;
				line-height: 30px;
			}

			.__target {
				max-width: 220px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	._detail-content {
		padding: 0 16px;
		height: 100%;
	}

	._more {
		width: 100px;
	}

	.ivu-table th {
		font-weight: normal;
	}

	.ivu-poptip-rel{
		display: inline;
	}

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
}
</style>