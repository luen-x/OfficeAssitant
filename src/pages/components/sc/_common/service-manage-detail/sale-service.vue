<template>
	<div class="g-m-t-20 v-sc-inspection-sale-service">
		<div v-if="spin">
			<div v-if="service_data.length">
				<div v-for="(item,index) in service_data" :key="index">
					<div 
						class="g-m-t-20 g-m-b-10 g-c-black g-fs-14" 
						style="height:14px;line-height: 14px;"
					>
						{{ item.service_name }}
					</div>

					<i-table 
						:columns="columns" 
						:data="item.list" 
						stripe
					/>
				</div>
			</div>

			<div v-else class="g-tc _empty">
				<img :src="OSS_NO_MESSAGE07">
				<p class="g-fs-14">销售暂时还未上传任何服务项</p>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Table, Tooltip } from "iview";
import { OSS_NO_MESSAGE07 } from "@constants/constants";
import { VoucherModal } from "./voucher";

export default {
	name: "sc-manage-inspection-sitution",
    
	components: {
		"i-table": Table
	},

	props: {
		contract_company_id: Number
	},
    
	data() {
		return {
			OSS_NO_MESSAGE07,
			service_data: [],
			columns: [
				{
					title: "提交时间",
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
					title: "服务素材月份",
					key: "material_month",
					minWidth: 90,
					tooltip: true
				},
				{
					title: "服务备注",
					key: "remarks",
					minWidth: 100,
					ellipsis: true,
					render: (h, params) => {
						if (params.row.remarks) {
							return h("div", {}, [
								params.row.remarks.length > 8 ? h(Tooltip, {
									props: {
										content: params.row.remarks,
										transfer: true,
										maxWidth: 250
									}
								}, params.row.remarks.slice(0, 8) + '...')
									: params.row.remarks
							]);
						} else {
							return h("div", {}, "--");
						}
					}
				}
			],
			spin: false
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: "_SC_MANAGE_INSPECTION_QUALITY_SERVICE_INFO_GET",
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.service_data = res.data;
				this.spin = true;
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-sc-inspection-sale-service{
    padding-bottom: 160px;
	width: 100%;
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

    table{
        width: 880px !important;
    }

	._empty{
		height: 200px;
        margin-top: 100px;

		img{
			width: 200px;
			height: 200px;
		}
	}
}
</style>