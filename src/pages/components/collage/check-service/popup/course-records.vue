<template>
	<div class="v-collage-course-records g-m-t-30">
		<div v-if="spin">
			<oa-title title="申诉质检" class="g-m-b-20"/>
			<i-table
				v-if="appealData.length"
				ref="table"
				:columns="checkColumns"
				:data="appealData"
				:border="false"
				:loading="tableLoading"
				stripe
			/>
			<div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
				<img :src="OSS_NO_MESSAGE02">
				<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">暂无申诉质检记录</div>
			</div>
			<div>
				<oa-title title="课程记录" class="g-m-b-20 g-m-t-40"/>
				<div v-for="(item, index) in lessonList" :key="index">
					<div class="_title">
						<i-checkbox v-model="item.checked" style="margin-left: 17px;" />
						<span class="g-m-l-5 g-c-black1 g-inline-block" style="width: 200px">
							<i-tooltip
								v-if="item.project.product_name.length > 12"
								:content="item.project.product_name"
								placement="bottom"
								max-width="200"
								transfer
							>
								{{ item.project.product_name.slice(0,12) + "...." }}
							</i-tooltip>
							<span v-else>{{ item.project.product_name }}</span>
						</span>
						<span class="g-c-black1" style="margin-left: 50px">{{ item.is_invalid ? '已失效' : '' }}</span>
						<span
							v-if="item.lesson_type == 1"
							class="g-c-black1" 
						>
							套系：{{ item.lecture_set_name }}
						</span>
						<span
							v-else
							class="g-c-black1" 
						>
							场次：{{ item.lecture_set_name }}
						</span>
						<span class="g-c-black1" style="margin-left: 50px">总分：{{ item.whole_score }}</span>
						<span v-if="item.whole_score" class="_label">已质检</span>
					</div>
					<i-table
						ref="table"
						:columns="columns"
						:data="item.record"
						:border="false"
						:loading="tableLoading"
						stripe
					/>
					<div style="margin-bottom: 40px;" />
				</div>
			</div>
		</div>
    
		<oa-loading v-else />
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import { OSS_NO_MESSAGE02 } from "@constants/constants";
import API_ROOT from "@stores/apis/root";
import { Tooltip, Table, Message, Checkbox } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from '@common/confirm/confirm';
import Record from "../../_common/detail/quality-record/record";
import { CourseDetailModal } from "./course-detail-modal";

export default {
	name: "collage-check-service-check-records",
    
	components: {
		"oa-title": Title,
		"i-tooltip": Tooltip,
		"i-table": Table,
		"i-checkbox": Checkbox
	},
	
	props: {
		contract_company_id: Number
	},
    
	data() {
		return {
			OSS_NO_MESSAGE02,
			lessonList: [],
			spin: false,
			tableLoading: true,
			data: [],
			appealData: [],
			checkColumns: [
				{
					title: "申诉人",
					key: "staff_name",
					minWidth: 130
				}, 
				{
					title: "申诉人角色",
					key: "role_type_name",
					minWidth: 130,
					render: (h, params) => {
						let role_type_name = params.row.role_type_name.join(',');
						return (
							<AutoToolTip 
								content={role_type_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				}, 
				{
					title: "申诉套系/产品",
					key: "lecture_set_name",
					minWidth: 140,
					render: (h, params) => {
						let lecture_set_name = params.row.lecture_set_name;
						return (
							<AutoToolTip 
								content={lecture_set_name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				}, 
				{
					title: "申诉时间",
					key: "create_time",
					minWidth: 130
				}, 
				{
					title: "申诉质检状态",
					key: "status",
					minWidth: 130,
					render: (h, params) => {
						let name = params.row.status == 1 ? '待质检' : '已质检';
						return (
							<AutoToolTip 
								content={name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				}
                
			],
			columns: [
				{
					title: "姓名",
					key: "staff_name",
					minWidth: 130
				},
				{
					title: "角色",
					key: "role_type_name",
					minWidth: 130
				},
				{
					title: "评分",
					key: "real_score",
					minWidth: 130,
					render: (h, params) => {
						let real_score = params.row.real_score == '-1.00' ? '--' : params.row.real_score;
						return (
							<AutoToolTip 
								content={real_score}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: "提交时间",
					key: "update_time",
					minWidth: 100,
					render: (h, params) => {
						let update_time = params.row.update_time;
						return (
							<AutoToolTip 
								content={update_time}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: ' ',
					minWidth: 130,
					key: 'options',
					render: (h, params) => {
						let type = this.type;
						return (
							
							params.row.subject.length ? this.$auth[1352] ? <span class="g-operation" onClick={(e) => {
								e.stopPropagation(); 
								this.handleDetail(params.row.subject);
							}}>查看课程信息</span> : '' : ''
							
						);
					}
				}
			],
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._COLLAGE_CHECK_SERVICE_COURSE_RECORD_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				res.data.forEach(v => {
					v.good_staff_ids = [];
					v.remark = '';
					v.improve_advice = '';
					v.good_feedback = '';
					v.lesson_score_items = [];
					v.lectureList = [];
					v.checked = !!v.need_quality;
					v.lesson_name = v.project.project_name;
				});
				this.lessonList = res.data;
				this.spin = true;
				this.tableLoading = false;
				this.loadAppealData();
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		},
		loadAppealData() {
			this.$request({
				url: API_ROOT._COLLAGE_CHECK_SERVICE_APPEAL_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.appealData = res.data;
				this.spin = true;
				this.tableLoading = false;
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		},
		handleDetail(row) {
			CourseDetailModal.popup({
				data: row
			}).then(res => {
				
			});
		}
	}
};
</script>

<style lang="scss">
.v-collage-course-records {
    padding-left: 32px;
    padding-bottom: 120px;
    padding-bottom: 160px;
	width: 100%;
	min-height: 90%;
    position: relative;
	._empty{
		height: 156px;
		background: rgba(250,250,250,1);
		img {
			width: 100px;
			height: 100px;
		}
	}
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
	._label {
		border-radius: 4px;
		background-color: #E84C57;
		color: #fff;
		padding: 2px 5px 2px 5px;
		margin-left: 60px;
	}
    ._title {
        height: 40px;
        line-height: 40px;
        background-color: #FAFAFA;
    }
}
</style>