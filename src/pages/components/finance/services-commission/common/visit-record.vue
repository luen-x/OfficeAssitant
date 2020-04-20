<template>
	<div class="v-finance-services-visit-record">
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
							<div v-if="company.quality_record_list.length">
								<i-table
									:columns="columns"
									:data="company.quality_record_list"
									row-key
									@on-row-click="(row, index) => handleRowClick(row, index, companyIndex)"
								/>
							</div>

							<div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
								<img :src="OSS_NO_MESSAGE02">
								<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">该客户无任何回访记录</div>
							</div>
						</div>
					</oa-title>
				</div>
			</div>
			<div v-else class="_blank">
				<img :src="OSS_NO_MESSAGE03" style="width: 301px;height: 232px;">
	
				<div class="g-m-t-30" style="width: 301px;text-align:center;">
					<span class="g-fs-14">暂无回访记录</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Table } from "iview";
import { OSS_NO_MESSAGE02, OSS_NO_MESSAGE03 } from "@constants/constants";
import Title from './title';
import Record from './record';

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
					type: "expand",
					maxWidth: 80,
					render: (h, { row }) => {
						return <Record key={ row.quality_record_id } detail={ row }/>;
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
						const STATUS = [
							"正常接通", "未接", "无效",
							"雷区", "非雷", "1正常", "2非雷", 
							"2雷区", "不回访", "暂不回访"
						];
						return (
							<span>
								{
									STATUS[params.row.call_status - 1]
								}
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
						let score = params.row.score && params.row.score > 0 ? params.row.score : "--";

						return (
							<span>{score}</span>
						);
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
			this.spin = true;
			this.$request({
				url: '_FINANCE_SERVICE_DETAIL_QUALITY_RECORD_GET',
				param: { staff_id: this.info.staff_id },
				type: "GET"
			}).then(res => {
				res.data.forEach(v => {
					v.quality_record_list.forEach(e => {
						e._expanded = false;
					});
				});
				this.list = res.data;
				this.spin = false;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},

		// 单击某一行时触发
		handleRowClick(row, index, companyIndex) {
			row._expanded = !row._expanded;
			this.list[companyIndex].quality_record_list.splice(index, 1, row);
			if (row._expanded) {
				this.list[companyIndex].quality_record_list.forEach((item, item_index) => {
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

<style lang="scss" scoped>
.v-finance-services-visit-record {
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
.v-finance-services-visit-record {
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

	.ivu-table-cell-with-expand {
		width: 20px;
	}

	.ivu-table-cell-expand {
		width: 20px;
		text-align: center;
		pointer-events: none;

		.ivu-icon-ios-arrow-forward {
			display: inline-block;
			pointer-events: none;
		}
	}

	td.ivu-table-expanded-cell {
		padding: 0px;
		background: #ffffff;
	}

	.ivu-icon-ios-arrow-forward::before {
		content: '\F341';
		font-size: 18px;
		pointer-events: none;
	}

	// .ivu-table-stripe{
	// 	.ivu-table-body{
	// 		tr:nth-child(2n) {
	// 			td{
	// 				background: #ffffff;
	// 			}
	// 		}
	// 	}
	// }
}
</style>

