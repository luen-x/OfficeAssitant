<template>
	<div 
		v-if="SHOW_WORK_TABLE"
		:style="{ margin: expand ? '0px 15px 20px 25px' : '0px 15px 0px 25px' }"
		class="c-out-work-table"
	>
		<div 
			v-if="detailData.length"
			:style="{ height: expand ? '168px' : '0', opacity: expand ? 1 : 0 }"
			class="c-work-table g-flex g-box-shadow">
			<div 
				class="__tabs g-flex g-fd-c">
				<div class="__tab-wrapper">
					<div 
						v-for="{ project_name, project_id, document_id } of projectList"
						:key="project_id"
						:class="{ '__active-item': nowDepartId === project_id }"
						class="__item"
						@click="handleDepartmentChange(project_id, document_id)"
					>
						<span v-if="project_name.length < 7">{{ project_name }}</span>
						<span v-else>{{ project_name.slice(0, 6) + '...' }}</span>
					</div>
				</div>
				<div class="__operate g-pointer" @click="handleCollapse">
					收起
					<i class="icon iconfont icon-up g-pointer"/>
				</div>
			</div>

			<div class="g-pd-lr-20" style="width: 450px">
				<div class="g-pd-t-20">
					<i-tooltip
						:transfer="true" 
						placement="right"
						content="可以看到今天的值班人" 
					>
						<i class="iconfont icon-question g-fs-16 g-c-light5"/>
					</i-tooltip>
					<span class="g-c-red-dark g-fs-14">
						今日值班：
						{{ nowDepartData.schedule.staff_name || '无' }} 
					</span>
					<span 
						class="g-fs-12 g-c-blue-mid g-pd-l-5 g-pointer"
						@click="handleLinkToPlanDuty">明细</span>
				</div>
				<div v-if="nowDepartData.notices.length">
					<i-tooltip
						:transfer="true" 
						placement="right"
						content="可以查看近期系统更新功能内容" 
					>
						<i class="iconfont icon-question g-fs-16 g-c-light5"/>
					</i-tooltip>
					<div 
						v-if="nowDepartData.notices[0].title.length > 15"
						:title="nowDepartData.notices[0].title"
						class="g-pd-t-20 g-c-black5 g-inline-block"
						style="padding-bottom: 3px">{{ nowDepartData.notices[0].title }}</div>
					<div 
						v-else
						class="g-pd-t-20 g-c-black5 g-inline-block"
						style="padding-bottom: 3px">{{ nowDepartData.notices[0].title }}</div>
					<div class="g-c-black3" style="word-break: break-all">
						{{ nowDepartData.notices[0].text }}
						<!-- <div style="transform: scale(.9)" class="g-dp-ib"> -->
						<span 
							class="g-c-blue-mid g-pointer"
							@click="handleNoticeDetail(nowDepartData.notices[0])">>>详情</span>
							<!-- </div> -->
					</div> 
				</div>
				<div v-else class="g-tc" style="padding-top: 40px">暂无通知</div>
			</div>
			<div class="__border-right "/>

			<div class="g-col g-pd-lr-10">
				<div class="g-pd-t-20 g-pd-b-10">
					<i-tooltip
						:transfer="true" 
						placement="right"
						content="可以查看系统使用教程、功能介绍及小贴士" 
					>
						<i class="iconfont icon-question g-fs-16 g-c-light5"/>
					</i-tooltip>
					<span class="g-fs-14 g-c-black2">
						功能解读
						<span 
							class="g-fs-12 g-c-blue-mid g-pd-l-5 g-pointer"
							@click="handleLinkToFunDetailMore()">查看更多</span>
					</span>
				</div>
				<div
					v-for="(func, index) in nowDepartData.functionReads.slice(0, 3)"
					:key="index"
					:style="{ background: index % 2 === 0 ? '#F8F8F8' : '' }"
					class="g-flex __hover-blue"
					style="line-height: 32px"
					@click="handleLinkToFunDetail(func)"
				>
					<div 
						:title="func.title"
						class="g-col g-pd-l-5 g-oneline g-pointer">{{ func.title }}</div>
					<div class="g-tr g-pd-lr-10" style="width: 100px">{{ func.update_time }}</div>
				</div>
				<div 
					v-if="!nowDepartData.functionReads.length"
					style="padding-top: 26px"
					class="g-tc">暂无数据</div>
			</div>

			<div class="__border-right"/>
			<div class="g-col g-pd-lr-10">
				<div class="g-pd-t-20 g-pd-b-10">
					<i-tooltip
						:transfer="true" 
						:max-width="300"
						placement="right"
						content="可以查看客户提出的需求完成进度和完成时间" 
					>
						<i class="iconfont icon-question g-fs-16 g-c-light5"/>
					</i-tooltip>
					<span class="g-fs-14 g-c-black2">
						需求进度
						<span 
							class="g-fs-12 g-c-blue-mid g-pd-l-5 g-pointer"
							@click="handleLinkToDemandDetail()">查看更多</span>
					</span>
				</div>
				<div
					v-for="(demand, index) in nowDepartData.needs.slice(0, 3)"
					:key="index"
					:style="{ background: index % 2 === 0 ? '#F8F8F8' : '' }"
					class="g-flex"
					style="line-height: 32px"
				>
					<div 
						:title="demand.need_name"
						class="g-col g-pd-l-5 g-oneline">{{ demand.need_name }}</div>
					<div class="g-tr g-pd-lr-10" style="width: 100px">{{ demand.update_time }}</div>
				</div>
				<div 
					v-if="!nowDepartData.needs.length"
					style="padding-top: 26px"
					class="g-tc">暂无数据</div>
			</div>
		</div>
		<div 
			v-if="detailData.length"
			:class="[!expand ? '__show' : '__hide']" 
			@click="expand = true">
			<div class="__on-line" style="box-shadow: 0px 1px 4px 1px rgba(231,72,84,0.47)">
				值班人:
				<span :title="nowDepartData.schedule.staff_name">
					{{ 
						nowDepartData.schedule.staff_name ? 
							nowDepartData.schedule.staff_name.length > 3 
								? nowDepartData.schedule.staff_name.slice(0, 3) + '...' 
								: nowDepartData.schedule.staff_name
							: '无'

					}}
				</span>
				<i class="icon iconfont icon-down" style="vertical-align: middle"/>
			</div> 
		</div>
	</div>
</template>

<script>
import { Tooltip } from 'iview';

const SHOW_WORK_TABLE = false;

export default {
	components: {
		'i-tooltip': Tooltip,
	},
	data() {
		return {
			SHOW_WORK_TABLE,
			expand: false,
			projectList: [],
			nowDepartId: '',
			nowDocumentId: '',
			detailData: [],
		};
	},
	computed: {
		nowDepartData() {
			return this.detailData.filter(v => v.project_id === this.nowDepartId)[0];
		}
	},
	async created() {
		if (!this.SHOW_WORK_TABLE) return;
		await this.loadProjectList();
		this.loadProjectDetail();
	},
	methods: {
		handleDepartmentChange(project_id, document_id) {
			this.nowDepartId = project_id;
			this.nowDocumentId = document_id;
		},

		handleCollapse() {
			this.expand = false;
		},

		async loadProjectList() {
			const { data } = await this.$request({
				url: '_TECH_PROJECT_PLAN_DUTY_PROJECT_LIST_GET',
				param: { is_page: 0 },
				type: "GET",
				loading: false
			});
			this.projectList = data.list;
			this.nowDepartId = this.projectList[0].project_id;
			this.nowDocumentId = this.projectList[0].document_id;
		},

		async loadProjectDetail() {
			const { data } = await this.$request({
				url: '_TECH_PROJECT_PLAN_WORK_TABLE_GET',
				type: "GET"
			});
			data.forEach(departData => {
				departData.notices.length && departData.notices.forEach(v => {
					// 去除富文本标签
					const str = v.text.replace(/<[^>]+>/g, "");
					v.text = str.length >= 96
						? str.slice(0, 96) + '...'
						: str;
				});
			});
			this.detailData = data;
		},

		handleLinkToPlanDuty() {
			this.$router.push({
				path: '/tech/share/duty',
				query: { project_id: this.nowDepartId }
			});
		},

		handleNoticeDetail({ notice_id, project_id }) {
			this.$router.push({
				path: '/tech/share/notice',
				query: {
					notice_id,
					project_id
				}
			});
		},

		handleLinkToFunDetail({ project_id, read_id, document_id }) {
			this.$router.push({
				path: '/tech/share/document',
				query: {
					project_id, read_id, document_id,
				}
			});
		},
		handleLinkToFunDetailMore() {
			this.$router.push({
				path: '/tech/share/document',
				query: {
					project_id: this.nowDepartId,
					document_id: this.nowDocumentId
				}
			});
		},

		handleLinkToDemandDetail() {
			this.$router.push({
				path: '/tech/share/progress',
				query: { 
					project_id: this.nowDepartId
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.c-out-work-table {
	margin: 0px 15px 20px 25px;
	transform: translate3d(0, 0, 1);
	.c-work-table {
		transition: all 0.3s ease;
		min-width: 1010px;
		overflow: hidden;
		.__border-right {
			height: 100px;
			background: #EBEEF1;
			width: 1px;;
			align-self: center;
		}
		.__tabs {
			width: 120px;
			height: 168px;
			background-color: #F8F8F8;
			position: relative;
			overflow-y: hidden;
			.__tab-wrapper {
				height: 148px;
				overflow-y: auto;
				.__item {
					height: 30px;
					line-height: 30px;
					text-align: center;
					cursor: pointer;
					color: #333;
					// overflow: auto;
				}
				.__active-item {
					background-color: #fff!important;
				}
			}
			.__operate {
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 20px;
				background-color: #e84854;
				text-align: center;
				font-size: 12px;
				color: #fff;
				line-height: 20px;
			}
		}
		.__hover-blue:hover {
			color: #2397f9
		}
	}
	.__show .__on-line {
		opacity: 1;
		z-index: 5;
	}
	.__hide .__on-line {
		opacity: 0;
		z-index: -1;
	}
	.__on-line {
		height: 32px;
		opacity: 1;
		transition: all .3s ease;
		line-height: 32px;
		background-color: #e84854;
		color: #fff;
		border-radius: 2px;
		width: 120px;
		position: absolute;
		text-align: center;
		top: 30px;
		cursor: pointer;
		&:before,
		&:after {
			content: ' ';
			height: 50px;
			width: 1px;
			top: -45px;
			background-color: #e84854;
			position: absolute;
			z-index: 5;
		}
		&:before {
			left: 42px;
			transform: rotate(35deg)
		}
		&:after {
			right: 42px;
			transform: rotate(145deg)
		}
	}
}
</style>