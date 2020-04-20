<template>
	<div class="v-finance-services-payback-info">
		<oa-loading v-if="spin" />
		<div v-else>
			<div v-if="list.length">
				<div
					v-for="(item, companyIndex) in list"
					:key="companyIndex"
					class="company_item">
					<oa-title :show-type="companyIndex === 0" type="expand" class="g-m-b-20">
						<span slot="title">{{ item.contract_company_name }}</span>
						<div slot="content" class="g-m-t-20">
							<i-row class="g-fs-14 g-c-black3 g-m-b-10">
								客户回款信息
							</i-row>
							<i-table v-if="item.return_info.length" :columns="returnInfo" :data="item.return_info" stripe/>
							<div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
								<img :src="OSS_NO_MESSAGE02">
								<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">暂时没有提交记录</div>
							</div>
							<i-row class="g-fs-14 g-c-black3 g-m-b-10 g-m-t-20">
								客户满意度
							</i-row>
							<i-table v-if="item.satisfaction_degree.length" :columns="satisfactionDegree" :data="item.satisfaction_degree" stripe/>
							<div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
								<img :src="OSS_NO_MESSAGE02">
								<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">暂时没有提交记录</div>
							</div>
						</div>
					</oa-title>
				</div>
			</div>
			<div v-else class="_blank">
				<img :src="OSS_NO_MESSAGE03" style="width: 301px;height: 232px;">
	
				<div class="g-m-t-30" style="width: 301px;text-align:center;">
					<span class="g-fs-14">暂无回款记录</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Table, Row, Col, Tooltip } from "iview";
import API_ROOT from "@stores/apis/root";
import { OSS_NO_MESSAGE02, OSS_NO_MESSAGE03 } from "@constants/constants";
import { RefundVoucherModal } from "@components/sc/_common/service-manage-detail/refund-vocher";
import { SatifactionVoucherModal } from "@components/sc/_common/service-manage-detail/satisfaction-vocher";
import Title from './title';

export default {
	name: 'finance-services-commission',
	components: {
		"i-table": Table,
		'i-row': Row,
		'i-col': Col,
		'oa-title': Title
	},
	props: {
		info: Object
	},
	data() {
		return {
			OSS_NO_MESSAGE02,
			OSS_NO_MESSAGE03,
			spin: true,
			list: [],
			returnInfo: [// 回款信息
				{
					title: "回款金额",
					key: "return_amount",
					minWidth: 120,
					tooltip: true,
					render: (h, params) => {
						if (params.row.return_amount) {
							return (
								<div>{params.row.return_amount}</div>
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
								<div>{params.row.agent_num}</div>
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
						let str = params.row.staff_name;

						if (str.length === 0) {
							return <div>--</div>;
						} else if (str.length < 13) {
							return (
								<div>{str}</div>
							);
						} else {
							return (
								<Tooltip content={str} max-width="200" transfer>
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
					key: "audit_staff_name",
					minWidth: 180,
					tooltip: true,
					render: (h, params) => {
						let str = params.row.audit_staff_name;

						if (str.length === 0) {
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
							<div>{params.row.staff_name}</div>
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
		loadData() {
			this.spin = true;

			// 客户回款信息
			this.$request({
				url: API_ROOT._FINANCE_DETAIL_FEEDBACK_LIST_GET,
				type: 'GET',
				loading: false,
				param: {
					staff_id: this.info.staff_id
				}
			}).then(res => {
				this.list = res.data;
				this.spin = false;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.v-finance-services-payback-info {
	min-height: 500px;
	position: relative;
	._empty{
		height: 156px;
		background: rgba(250,250,250,1);
		img {
			width: 100px;
			height: 100px;
		}
	}
	._blank{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-70%);
		-webkit-transform: translate(-50%,-70%);
	}
}
</style>

<style lang="scss">
.v-finance-services-payback-info {
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
