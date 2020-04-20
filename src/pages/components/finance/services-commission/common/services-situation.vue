<template>
	<div class="v-finance-services-situation">
		<oa-loading v-if="spin" />
		<div v-else>
			<div v-if="list.length">
				<div
					v-for="(company, companyIndex) in list"
					:key="companyIndex"
					class="company_item">
					<oa-title :show-type="companyIndex === 0" type="expand" class="g-m-b-20">
						<span slot="title">{{ company.contract_company_name }}</span>
						<div slot="content" class="g-m-t-20">
							<div v-if="company.service_info_list.length">
								<div v-for="(it, index) in company.service_info_list" :key="index">
									<div
										class="g-m-t-20 g-m-b-10 g-c-black g-fs-14"
										style="height:14px;line-height: 14px;"
									>
										{{ it.service_name }}（{{ it.num }}）
									</div>

									<i-table :columns="columns" :data="it.list" stripe/>
								</div>
							</div>

							<div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
								<img :src="OSS_NO_MESSAGE02">
								<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">该客户暂时还未上传任何服务项</div>
							</div>
						</div>
					</oa-title>
				</div>
			</div>
			<div v-else class="_blank">
				<img :src="OSS_NO_MESSAGE03" style="width: 301px;height: 232px;">
	
				<div class="g-m-t-30" style="width: 301px;text-align:center;">
					<span class="g-fs-14">暂无服务情况记录</span>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import { Table } from "iview";
import { OSS_NO_MESSAGE02, OSS_NO_MESSAGE03 } from "@constants/constants";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { VoucherModal } from "../../../sc/_common/service-manage-detail/voucher";
import Title from './title';

export default {
	name: 'finance-services-commission',
	components: {
		"i-table": Table,
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
			columns: [
				{
					title: "服务时间",
					key: "create_time",
					minWidth: 140,
					tooltip: true
				},
				{
					title: "提交人",
					key: "staff_name",
					minWidth: 80,
					tooltip: true
				},
				{
					title: "服务凭证",
					key: "fileImage",
					minWidth: 80,
					render: (h, params) => {
						return h("div", {
							style: {
								color: "#2397f9",
								display: "inline-block",
								padding: "2px 8px 2px 0px",
								cursor: "pointer"
							},
							on: {
								"click": (e) => {
									e.stopPropagation();
									VoucherModal.popup({
										fileImage: params.row.fileImage,
										service_name: params.row.service_name
									}).then(res => {
									});
								}
							}
						}, "查看凭证");
					}
				},
				{
					title: "服务备注",
					key: "remarks",
					minWidth: 100,
					ellipsis: true,
					render: (h, params) => {
						if (params.row.remarks) {
							return (
								<AutoToolTip
									content={params.row.remarks}
									labelClass=""
									theme="dark"
								/>
							);
						} else {
							return h("div", {}, "--");
						}
					}
				},
				{
					title: "审核结果",
					key: "status",
					minWidth: 80,
					render: (h, params) => {
						if (params.row.status) {
							return h("div", {}, ["待审核", "审核通过", "审核驳回", "已评积分", "未评"][params.row.status * 1]);
						} else {
							return h("div", {}, "--");
						}
					}
				},
				{
					title: "审核人",
					key: "audit_staff_name",
					minWidth: 80,
					ellipsis: true,
					render: (h, params) => {
						let audit_staff = params.row.audit_staff_name + "(" + params.row.audit_depart_name + ")";

						if (params.row.audit_staff_name) {
							return (
								<AutoToolTip
									content={audit_staff}
									labelClass=""
									theme="dark"
								/>
							);
						} else {
							return h("div", {}, "--");
						}
					}
				},
				{
					title: "审核时间",
					minWidth: 140,
					key: "audit_time",
					ellipsis: true,
					render: (h, params) => {
						if (params.row.audit_time) {
							return h("div", {}, params.row.audit_time);
						} else {
							return h("div", {}, "--");
						}
					}
				}
			],
			list: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_FINANCE_SERVICE_DETAIL_SERVICE_INFO_GET',
				param: { staff_id: this.info.staff_id },
				type: "GET"
			}).then((res) => {
				this.list = res.data;
				this.spin = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-finance-services-situation {
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
.v-finance-services-situation {
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

