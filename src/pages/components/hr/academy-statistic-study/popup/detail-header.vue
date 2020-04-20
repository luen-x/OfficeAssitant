<template>
	<div class="c-academy-statistic-study-detail-header">
		<div v-if="data.echelon_name" class="_header g-m-20 g-c-red-mid g-pointer" @click="handleToEchelon">
			{{ data.echelon_name }}
		</div>
		<div v-else class="_header g-m-20">--</div>
		<div class="_content g-flex">
			<div class="__left-wrapper">
				<img 
					v-if="data.head_img" 
					:src="data.head_img" 
					alt="" 
					class="__avatar g-flex-cc g-m-l-20"
				>
				<!-- <div class="__avatar g-flex-cc g-m-l-20">{{ data.head_img }}</div> -->
				<div class="__name g-inline-block g-m-l-20">
					<div class="__name-text">
						<div>
							<span v-if="data.staff_name" class="g-fs-16 g-c-black1">{{ data.staff_name }}</span>
							<span v-else class="g-fs-16 g-c-black1">--</span>
							<span v-if="data.position_name" class="g-m-l-5">{{ data.position_name }}</span>
							<span v-else class="g-m-l-5">--</span>
						</div>
						<span v-if="data.depart_name" class="g-m-r-5">{{ data.depart_name }}</span>
						<span v-else class="g-m-r-5">--</span>
						<span>{{ data.mobile }}</span>
						<div class="g-m-t-10">
							<span class="g-c-black4">已参加培训总课程：</span>
							<span v-if="data.course" class="g-c-black2">{{ data.course.total_num }}个</span>
						</div>
					</div>
				</div>
			</div>
			<div class="__right-wrapper">
				<!-- <div class="__item">
					<span class="g-c-black4">已参加培训总课程：</span>
					<span v-if="data.course" class="g-c-black2">{{ data.course.total_num }}个</span>
				</div> -->
				<div class="__item">
					<span class="g-c-black4">未完成必修课程：</span>
					<span v-if="data.course" class="g-c-black2">{{ data.course.not_complete_compulsory_num }}个</span>
				</div>
				<div class="__item">
					<span class="g-c-black4">已完成选修课程：</span>
					<span v-if="data.course" class="g-c-black2">{{ data.course.complete_elective_num }}个</span>
				</div>
				<div class="__item">
					<span class="g-c-black4">已完成必修课程：</span>
					<span v-if="data.course" class="g-c-black2">{{ data.course.complete_compulsory_num }}个</span>
				</div>
				<div class="__item">
					<span class="g-c-black4">已参加项目：</span>
					<span class="g-c-black2">{{ data.project_num }}个</span>
				</div>
				<div class="__item">
					<span class="g-c-black4">已完成内训课程：</span>
					<span v-if="data.course" class="g-c-black2">{{ data.course.complete_internal_num }}个</span>
				</div>
				<div class="__item">
					<span class="g-c-black4">目前所得总学分：</span>
					<span class="g-c-black2">{{ data.total_credit }}分</span>
				</div>
			</div>
		</div>
		<div class="_bottom">
			<div class="__progress">
				<i-progress :percent="data.schedule" :stroke-width="4" hide-info style="width: 400px;"/>
				<span class="g-c-black4 g-m-t-5 g-m-l-20">规定课程完成进度（{{ data.schedule }}%）</span>
			</div>
		</div>
	</div>
</template>

<script>
import { Drawer, Button, Tabs, TabPane, Progress } from "iview";
import { CreatePortal, ImgsPicker, Fragment, ImgsPreview } from "wya-vc";
import { debounce } from 'lodash';
import Loading from '@components/_common/loading/loading';
import { getHashUrl } from '@utils/utils';

export default {
	name: "c-academy-statistic-study-detail-header",
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-loading': Loading,
		'i-button': Button,
		'i-progress': Progress
	},
	props: {
		data: Object
	},
	data() {
		return {

		};
	},
	created() {

	},
	methods: {
		handleToEchelon() {
			this.$auth[1079] ? this.$router.push(getHashUrl(
				'/hr/academy/statistic/study/detail', 
				{ 
					staff_id: this.data.staff_id,
					echelon_id: this.data.echelon_id,
					applicant_id: this.data.applicant_id,
				}
			)) : '';
		}
	}
};
</script>
<style lang="scss" >
.c-academy-statistic-study-detail-header {
    height: 170px;
	width: 940px;
    ._header {
        font-size: 16px;
        font-weight:bold;
    }
    ._content {
        .__left-wrapper {
            width: 27%;
            .__avatar {
				width: 60px;
				height: 60px;
                border-radius: 30px;
				color: white;
				background: #e84854;
				font-size: 18px;
				font-weight: 500;
				font-family: "sans-serif";
				overflow: hidden;
            }
            .__name {
                position: relative;
                .__name-text {
                    position: absolute;
                    top: -76px;
					left: 82px;
					width: 150px;
                }
            }
        }
        .__right-wrapper {
			width: 50%;
			.__item {
				display: inline-block;
				width: 140px;
				margin: 0 25px 7px 25px;
			}
        }
	}
	._bottom {
		padding-bottom: 30px;
		margin-left: 100px;
		margin-top: 10px;
		.__progress {
			width: 700px;
			.ivu-progress-bg {
				background-color: #E84C57;
			}
		}
	}
}
</style>
