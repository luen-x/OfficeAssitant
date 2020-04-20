<template>
	<div class="v-train-detail-exam-7-reading">
		<div class="_alert g-fs-12">
			<i class="icon iconfont icon-attention g-c-red-dark"/>
			<span class="g-c-red-mid">考试的最终结果，请以阅卷情况以及最后考试截至时间所得的结果为准！</span>
		</div>  
		<div class="g-c-black1 g-lh-32 g-m-t-10">
			<span>关联事项：{{ relationLabel || '关联事项' }}</span>
		</div>
		<div class="g-c-black1 g-lh-32">
			<span style="padding-right: 40px">首次考试时间：
				{{ headerData.start_time ? headerData.start_time + ' 至 ' + headerData.end_time : '--' }}
			</span>
			<span>最后一次补考时间：
				{{ lastStartTime ? lastStartTime + ' 至 ' + lastEndTime : '--' }}
			</span>
			<span
				class="g-red-btn-line g-fr"
				style="margin-top: -25px"
				@click="handleExport">
				导出成绩单
			</span>
		</div>

		<div class="_info">
			<div class="__statistic">
				<div class="__left">
					<div class="__desc">通过率</div>
					<div class="__num">{{ typeof headerData.pass_rate === 'number' ? headerData.pass_rate : '--' }}%</div>
				</div>
				<div class="__line" />
				<div class="__center">
					<div class="__desc">通过人数</div>
					<div class="__num">{{ typeof headerData.pass_num === 'number' ? headerData.pass_num : '--' }}</div>
				</div>
				<div class="__line" />
				<div class="__right">
					<div class="__desc">考试人数</div>
					<div class="__num">{{ typeof headerData.total_num === 'number' ? headerData.total_num : '--' }}</div>
				</div>
			</div>
			<div class="__statistic">
				<div class="__left">
					<div class="__desc">平均分</div>
					<div class="__num">{{ typeof headerData.average_score === 'number' ? headerData.average_score : '--' }}</div>
				</div>
				<div class="__line" />
				<div class="__center">
					<div class="__desc">最高分</div>
					<div class="__num">{{ typeof headerData.max_score === 'number' ? headerData.max_score : '--' }}</div>
				</div>
				<div class="__line" />
				<div class="__right">
					<div class="__desc">最低分</div>
					<div class="__num">{{ typeof headerData.min_score === 'number' ? headerData.min_score : '--' }}</div>
				</div>
			</div>
		</div>
		

	</div>    
</template>
<script>
import API_ROOT from '@stores/apis/root';
import { getHashUrl, getItem } from '@utils/utils';
import { debounce } from 'lodash';

export default {
	name: 'v-train-detail-exam-7-reading-header',
	props: {
		examInfo: Object
	},
	data() {
		return {
			headerData: {},
			relationLabel: '',
			lastStartTime: '',
			lastEndTime: '',
		};
	},
	created() {
		this.loadHeaderData();
	},
	methods: {
		async loadHeaderData() {
			const { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_PAPER_RESULT_HEADER_GET,
				type: "GET",
				param: {
					exam_id: this.$route.query.exam_id
				}
			});
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_RESULT_TABS_GET_SUCCESS', Number(data.exam_times));
			this.headerData = {
				...data
			};
			this.relationLabel = data.relation_id.map(v => v.course_name).join('、');
			const lastExamInfo = data.exam_again.length ? data.exam_again[data.exam_again.length - 1] : {};
			this.lastStartTime = lastExamInfo.start_time;
			this.lastEndTime = lastExamInfo.end_time;
		},
		handleExport: debounce(function exportGrade() {
			window.open(getHashUrl(API_ROOT._HR_ACADEMY_TRAIN_EXAM_RESULT_EXPORT_GET, {
				...this.$route.query,
				is_export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}, 300)
	},
};
</script>

<style lang="scss" scoped>
.v-train-detail-exam-7-reading {
    ._alert {
			margin-top: -15px;
			height: 32px;
			line-height: 32px;
			background:rgba(231,72,84, 0.05);
		.icon {
			vertical-align: middle;
			padding: 0 10px;
			}
	}
	._info {
		display: flex;
		.__line {
			width:1px;
			height:90px;
			margin-top: 20px;
			background-color: rgba(212,215,219, 0.5);
		}
		.__statistic {
			flex: 1;
			background:rgba(245,245,246,1);
			margin-top: 12px;
			width: 100%;
			height: 130px;
			display: flex;
			.__left,
			.__center,
			.__right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;
			}
			.__desc {
				color: #818794;
				font-size: 14px
			}
			.__num {
				font-size: 24px;
				color: #333;
			}
			&:first-child {
				margin-right: 20px
			}
		}
	}
}
</style>


