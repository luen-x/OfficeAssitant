<template>
	<div class="g-m-t-30 g-m-lr-20 v-collage-service-quality-record">
		<div v-if="tableData.length > 0">
			<i-table 
				:columns="columns" 
				:data="tableData"
				stripe
				@on-row-click="handleRowClick"
			/>
		</div>
		<div v-else class="g-tc" style="margin-top: 100px;">
			<img :src="OSS_SEARCH_EMPTY">
			<p class="g-m-t-10">暂未质检跟进记录~</p>
		</div>
	</div>
</template>

<script>
import { Table } from "iview";
import API_ROOT from "@stores/apis/root";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { OSS_SEARCH_EMPTY } from "@constants/constants";
import Record from "./record";
import { LookVoucher } from "./modal/look-voucher.vue";

export default {
	name: "v-collage-quality-records",
    
	components: {
		"i-table": Table
	},

	props: {
		contract_company_id: Number,
		type: String
	},

	data() {
		return {
			OSS_SEARCH_EMPTY,
			current_id: "",
			columns: [{
				type: "expand",
				maxWidth: 50,
				render: (h, params) => {	
					if (this.current_id == params.row.quality_record_id) {
						this.current_id = params.row.quality_record_id;

						return (
							<Record 
								datas={params.row.qualityRecordLesson}
								quality_record_id={Number(params.row.quality_record_id)}
								loadDatas={this.loadData}
								flag="1"
							/>
						);
					} else {
						this.current_id = params.row.quality_record_id;

						return h("div", {}, "");
					}
				}
			}, {
				title: "质检人",
				key: "staff_name",
				minWidth: 80
			}, {
				title: "质检时间",
				key: "create_time",
				minWidth: 120
			}, {
				title: "质检方式",
				key: "quality_type",
				minWidth: 120,
				render: (h, params) => {
					let status = '';
					let quality_type = params.row.quality_type 
						+ (status = params.row.call_status ? '/' + params.row.call_status : '');
					return (
						<AutoToolTip 
							content={quality_type}
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			}, {
				title: "质检套系",
				key: "",
				minWidth: 100,
				render: (h, params) => {
					let arr = [];

					params.row.qualityRecordLesson.forEach(item => {
						arr.push(item.lecture_set_name);
					});

					return (
						<AutoToolTip
							content={arr.join("、")}
							width="80px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			}, {
				title: "质检凭证",
				key: "fileImage",
				minWidth: 80,
				render: (h, params) => {
					if (params.row.fileImage && params.row.fileImage.length && params.row.fileImage.length > 0) {
						return (
							<div class="g-pointer g-c-blue-mid" onClick={(e) => { this.handleLookVoucher(e, params); }}>
							查看凭证
							</div>
						);
					} else {
						return (
							<div>--</div>
						);
					}
				}
			}, {
				title: "总体评分",
				key: "score",
				minWidth: 100,
				render: (h, params) => {
					let arr = [];

					params.row.qualityRecordLesson.forEach(item => {
						item.whole_score < 0 ? arr.push('--') : arr.push(item.lecture_set_name + item.whole_score + "分");
					});

					return (
						<AutoToolTip
							content={arr.join("、")}
							width="80px"
							theme="dark"
							placement="bottom" 
							labelClass=" "
						/>
					);
				}
			}],
			tableData: []
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._COLLAGE_CHECK_SERVICE_CHECK_RECORDS_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.spin = true;
				this.tableData = res.data;
				this.tableData.forEach(item => {
					item._expanded = false;
				});
			}).catch(error => {
				this.$Message.error(error.msg);
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
		},

		handleLookVoucher(e, v) {
			e.stopPropagation();

			LookVoucher.popup({
				fileImage: v.row.fileImage
			}).then();
		}
	}
};
</script>

<style lang="scss">
.v-collage-service-quality-record{
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
}
</style>