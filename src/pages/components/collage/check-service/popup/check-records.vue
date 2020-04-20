<template>
	<div class="v-collage-check-records g-m-t-30 g-pd-lr-20">
		<div v-if="spin">
			<oa-title v-if="flag === 2" title="质检记录" class="g-m-b-20"/>
			<i-table
				ref="table"
				:columns="columns"
				:data="data"
				:border="false"
				:loading="tableLoading"
				stripe
			/>
		</div>
    
		<oa-loading v-else />
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { Tooltip, Table, Message } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from '@common/confirm/confirm';
import Record from "../../_common/detail/quality-record/record";
import { RecordsModal } from "./check-records-modal.vue";
import { VoucherModal } from "./voucher-modal";

export default {
	name: "collage-check-service-check-records",
    
	components: {
		"oa-title": Title,
		"i-tooltip": Tooltip,
		"i-table": Table,
	},
	
	props: {
		contract_company_id: Number,
		flag: Number
	},
    
	data() {
		return {
			contract: [],
			spin: false,
			tableLoading: true,
			data: [],
			columns: [
				{
					type: "expand",
					minWidth: 50,
					render: (h, params) => {
						return (
							<Record datas={params.row.qualityRecordLesson} isRequest={false} labelFlag={false}/>
						);
					}
				},
				{
					title: "质检人",
					key: "staff_name",
					minWidth: 130
				},
				{
					title: "质检时间",
					key: "create_time",
					minWidth: 100,
					render: (h, params) => {
						let create_time = params.row.create_time;
						return (
							<AutoToolTip 
								content={create_time}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "质检方式",
					key: "quality_type",
					minWidth: 100,
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
				},
				{
					title: "质检套系",
					key: "qualityRecordLesson",
					minWidth: 110,
					render: (h, params) => {
						let qualityRecordLesson = params.row.qualityRecordLesson.map(v => v.lecture_set_name).join(',');
						return (
							<AutoToolTip 
								content={qualityRecordLesson}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "质检凭证",
					key: "fileImage",
					minWidth: 80,
					render: (h, params) => {
						return params.row.fileImage.length ? h("div", {
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
										fileImage: params.row.fileImage
									}).then(res => {
									});
								}
							}
						}, "查看凭证") : '--';
					}
				},
				{
					title: "总体评分",
					key: "month_quality",
					minWidth: 120,
					render: (h, params) => {
						let qualityRecordLesson = params.row.qualityRecordLesson.map(v => {
							let score = '';
							return v.whole_score == '-1.00' ? '--' : v.lecture_set_name + v.whole_score + '分';
						}).join(',');
						return (
							<AutoToolTip 
								content={qualityRecordLesson}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				}
			],
		};
	},

	watch: {
		contract_company_id() {
			this.loadData();
		}
	},

	mounted() {
		this.flag === 2 && this.columns.push({
			title: '操作',
			minWidth: 80,
			key: 'options',
			render: (h, params) => {
				let type = this.type;
				return (
					<span class="g-operation" onClick={(e) => {
						e.stopPropagation(); 
						this.handleEdit(params.row);
					}}>编辑</span>
							
				);
			}
		});

		this.loadData();
	},

	methods: {
		handleEdit(row) {
			RecordsModal.popup({
				quality_record_id: row.quality_record_id,
				edit: 1,
				datas: row.qualityRecordLesson,
				quality_id: row.quality_id
			}).then(res => {
				this.loadData();
			});
		},
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
				res.data.forEach((v, index) => {
					let fileImage = [];

					v.fileImage.forEach(element => {
						fileImage.push({
							url: element.img_url,
							title: element.img_url.substring(element.img_url.lastIndexOf("/") + 1, element.img_url.length),
							type: "." + element.img_url.substring(element.img_url.lastIndexOf(".") + 1, element.img_url.length),
							uid: element.img_url
						});
					});

					v.fileImage = fileImage;
					v.qualityRecordLesson.forEach((e, index1) => {
						e.type = index1 + 1 + '';
						e.lectureList = [];
						e.whole_score = +e.whole_score;
						e.good_staff_ids = [];
					});
				});
				this.data = res.data;

				this.spin = true;
				this.tableLoading = false;
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		},
	}
};
</script>

<style lang="scss">
.v-collage-check-records {
	padding-bottom: 160px;
	padding-left: 30px;
	width: 100%;
	min-height: 90%;
    position: relative;
	.ivu-table-wrapper {
        border: none;
    }
    .ivu-table {
		th,
		td {
			border: none;
		}
	}

	.ivu-table:after {
		width: 0;
	}

	.ivu-table:before {
		height: 0;
	}

	td.ivu-table-expanded-cell{
		padding: 0px;
	}
}
</style>