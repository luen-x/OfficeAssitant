<template>
	<div class="v-sale-train-employee-self-study g-pd-tb-20">
		<i-table
			:loading="loading"
			:columns="courses"
			:data="list"
			:height="tableHeight"
			width="100%"
			stripe
		/>
		<div class="_btn-box">
			<i-page
				:total="totalCount"
				:current="currentPage"
				:page-size="pageSize"
				show-total
				show-elevator
				show-sizer
				class="__page"
				@on-change="handleChange"
				@on-page-size-change="handlePageSizeChange"
			/>
		</div>
	</div>
</template>

<script>
import { Table, Page, Tooltip } from 'iview';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/tableHeight';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	name: "oa-train-employee-self-study",
	components: {
		'i-table': Table,
		'i-page': Page
	},
	mixins: [
		tableHeight({
			containerClass: 'v-sale-train-employee-self-study',
			expand: false,
			extra: 30
		})
	],
	props: {
		staffId: [String, Number],
		applicantId: [String, Number],
	},
	data() {
		return {
			loading: false,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
			list: [],
			courses: [
				{
					title: '课程名称',
					key: 'course_name',
					fixed: 'left',
					minWidth: 200,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip
									content={row.course_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '学习时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '学习状态',
					key: 'exam_status_name',
					minWidth: 120
				},
				{
					title: '学分',
					key: 'credit',
					minWidth: 90
				},
				{
					title: '课程来源',
					key: 'user_source_name',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip
									content={row.user_source_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				}
			]
		};
	},
	watch: {
		staffId() {
			this.loadData({ page: 1 });
		}
	},
	mounted() {
		this.loadData({ page: 1 });
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(initPage) {
			const { query = {} } = this.$route;
			this.loading = true;
			this.totalCount = 0;
			this.currentPage = 1;
			this.list = [];
			this.$request({
				url: API_ROOT._SALE_TRAIN_EMPLOYEE_SELF_STUDY_GET,
				type: 'GET',
				loading: false,
				param: {
					staff_id: this.staffId || query.staff_id,
					applicant_id: this.applicantId || query.applicant_id,
					...initPage,
					pageSize: this.pageSize
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				this.list = res.data.list;
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 监听页码的变化
		 */
		handleChange(page) {
			this.loadData({ page });
		},
		/**
		 * 监听每页显示条数的变化
		 */
		handlePageSizeChange(size) {
			this.pageSize = size;
			this.loadData({ page: 1 });
		},
	}
};

export const TrainEmployeeSelfStudy = module.exports.default;
</script>
<style lang="scss">
.v-sale-train-employee-self-study {
	// 人事用到此处，要是样式需通知人事模块_张森棋
	min-height: 530px;
	padding-right: 20px;
	._btn-box {
		width: 100%;
		height: 60px;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		.__page {
			margin-top: 15px;
			padding: 0 20px;
			float:right
		}
	}
}
</style>
