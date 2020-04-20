<template>
	<div v-show="showItem" class="c-academy-statistic-study-detail-tab-self">
		<div v-if="spin">
			<i-table
				:columns="courses"
				:data="list"
				width="100%" 
				stripe
				style="margin: 0 20px 0 20px"
			/>
			<div class="_btn-box">
				<i-page 
					:total="totalCount"
					:current="currentPage"
					:page-size="pageSize"
					show-total 
					show-elevator 
					show-sizer
					class="__page g-fr"
					@on-change="handleChange"
					@on-page-size-change="handlePageSizeChange"
				/>
			</div>
		</div>
		<oa-loading v-else />
	</div>
</template>

<script>
import { Drawer, Button, Table, Page, Tooltip } from "iview";
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

export default {
	name: "c-academy-statistic-study-detail-tab-train",
	components: {
		'oa-loading': Loading,
		'i-page': Page,
		'i-table': Table
	},
	props: {
		staff: Number,
		showItem: Boolean,
		applicant: Number,
	},
	data() {
		return {
			isfetching: 0,
			spin: true,
			show: false,
			courses: [
				{
					title: '课程名称',
					key: 'course_name',
					fixed: 'left',
					width: 200,
					render: (h, params) => {
						const course = params.row.course_name;
						return (
							<span class="g-c-blue-mid">
								{course.length <= 10 && course}
								{course.length > 10 && (
									<Tooltip 
										transfer
										content={course}
										maxWidth={250}
									>
										{course.substr(0, 10) + '...'}
									</Tooltip>
								)
								}
							</span>
						);
					}
				},
				{
					title: '学习时间',
					key: 'create_time',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '学习状态',
					key: 'status_name',
					minWidth: 120,
					tooltip: true,
				},
				{
					title: '学分',
					key: 'credit',
					minWidth: 90,
					tooltip: true,
				},
				{
					title: '课程来源',
					key: 'user_source_name',
					minWidth: 120,
					tooltip: true,
				}
			],
			loading: false,
			pageSize: 10,
			totalCount: 0,
			currentPage: 1,
			list: [],
		};
	},
	computed: {

	},
	watch: {
		showItem(val, old) {
			val && this.isfetching === 0 && this.loadData();
		}
	},
	created() {
		this.showItem && this.loadData();
	},
	mounted() {
	},
	methods: {
		loadData(initPage) {
			this.spin = false;
			this.isfetching = 1;
			this.loading = true;
			this.totalCount = 0;
			this.currentPage = 1;
			this.list = [];
			this.$request({
				url: API_ROOT._HR_ACADEMY_STATISTIC_STUDY_DETAIL_SELF_STUDY_GET,
				type: 'GET',
				loading: false,
				param: {
					staff_id: this.staff,
					applicant_id: this.applicant,
					...initPage,
					pageSize: this.pageSize
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.list = res.data.list;
				this.totalCount = res.data.totalCount;
				this.currentPage = res.data.currentPage;
				this.spin = true;
			}).catch(error => {
				this.$Message.error(error.msg);
				this.spin = true;
			});
		},
		handleChange(page) {
			this.loadData({ page });
		},
		handlePageSizeChange(size) {
			this.pageSize = size;
			this.loadData({ page: 1 });
		},
	}
};
</script>
<style lang="scss" >
.c-academy-statistic-study-detail-tab-self {
	._btn-box {
		width: 100%;
		height: 70px;
		position: fixed;
		background-color: #fff;
		bottom: 0;
		padding: 0 16px;
		// border-top: 1px solid #e8e8e8;
		// -webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		// box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		.__page {
			margin-top: -5px;
			padding: 0px 0px;
			float:right
		}
	}
}
</style>
