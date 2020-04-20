<template>
	<div class="v-hr-academy-train-detail-plan-activity g-m-l-20">
		<div v-if="data.length">
			<div 
				v-for="(item, index) in data"
				:key="index"
			>
				<div v-if="item.all_activity.length" class="_item g-m-t-20 g-pd-20">
					<div class="__item-left g-flex-cc">
						<div>
							<div class="g-m-b-15">{{ item.year_month_day }}</div>
							<div>{{ item.week }}</div>
						</div>
					</div>
					<div class="__item-mid">
						<div
							v-for="(e, i) in item.all_activity"
							:key="i"
							class="__item-content g-m-b-20"
						>
							<div class="__item-title">
								<span :class="e.icon" class="__label">{{ e.activity_name }}</span>
								<span v-if="e.activity_type == 1 || e.activity_type == 6">
									<span v-if="e.topic.length == 1 || e.activity_type == 6">{{ e.topic[0].course_name }}</span>
									<i-tooltip v-else :transfer="true" theme="light" placement="bottom-start">
										<span>{{ e.topic[0].course_name }}</span>
										<div slot="content">
											<p 
												v-for="(v, index1) in e.topic" 
												:key="index1"
											>
												{{ v.course_name }}
											</p>
										</div>
									</i-tooltip>
								</span>
								<span v-else>{{ e.topic }}</span>
							</div>
							<div class="__item-time g-tr" style="color: #818794;">{{ e.start_time }} 至 {{ e.end_time }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div 
			v-else
			class="g-flex g-jc-c g-ai-c"
			style="height:100%"
		>
			<div style="width:416px;margin-top: 60px;">
				<img :src="OSS_SEARCH_EMPTY" >
				<div class="g-tc">暂无数据</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Row, Col, Message, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { OSS_SEARCH_EMPTY } from '@constants/constants';

export default {
	name: 'oa-tpl',
	components: {
		'i-row': Row,
		'i-col': Col,
		'i-tooltip': Tooltip,
	},
	data() {
		return {
			data: [],
			OSS_SEARCH_EMPTY
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			const obj = {
				project_id: +this.$route.query.project_id
			};
			this.$request({
				url: API_ROOT['_HR_TRAIN_PLAN_LIST_GET'], // eslint-disable-line
				type: "GET",
				param: obj
			}).then((res) => {
				this.data = res.data;
				const icon = ['__sign', '__exam', '__vote', '__enroll', '__draw', '__draw'];
				this.data.forEach(v => {
					v.all_activity.forEach(e => {
						e.icon = icon[e.activity_type - 1];
					});
				});
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.v-hr-academy-train-detail-plan-activity {
	._item {
		display: flex;
		width:80%;
		box-shadow:0px 0px 7px 0px rgba(0, 0, 0, 0.15);
		.__item-left {
			flex: 1;
			min-width: 130px;
			max-width: 130px;
			text-align: center;
			font-size: 16px;
			font-weight: 400;
			padding-right: 25px;
		}
		.__item-mid {
			padding-left: 35px;
			border-left: 1px solid #EBEEF1;
			width: 800px;
			.__item-content {
				display: flex;
				.__item-title {
					.__label {
						margin-right: 10px;
						width: 30px;
						height: 20px;
						line-height: 20px;
						padding: 2px 10px 2px 10px;
						border-radius: 2px;
					}
					.__enroll {
						background-color: #f9dcdc;
						color: #E74854;
					}
					.__sign {
						background-color: #d2ebfd;
						color: #2397F9;
					}
					.__vote {
						background-color: #f9dcdc;
						color: #E74854;
					}
					.__exam {
						background-color: #dcf4d7;
						color: #4FC43D;
					}
					.__draw {
						background-color: #eedef8;
						color: #A852E5;
					}
				}
				.__item-time {
					flex: 1;
					min-width: 300px;
				}
			}
		}
	}
}
</style>
