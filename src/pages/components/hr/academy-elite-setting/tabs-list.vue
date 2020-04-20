<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		style="margin-top: 20px"
		class="v-academy-elite-setting-content"
		@on-click="handleChange"
	>
		<div v-if="tabs.length">
			<i-tab-pane 
				v-for="(depart, depart_index) in tabs"
				:key="depart.depart_id" 
				:label="depart.depart_name"
				:name="depart_index + ''"
			>
				<oa-input-text v-model="pursose" :depart_id="depart.depart_id"/>
				<div class="g-m-t-20">
					<vc-debounce-click 
						v-if="$auth[1095]"
						class="g-red-btn-line g-fr g-m-l-10"
						@click="hanldeManageCourse">课题管理</vc-debounce-click>
					<vc-debounce-click 
						v-if="$auth[1094]"
						class="g-red-btn-line g-fr g-m-l-10"
						@click="handleNewCourse(depart.depart_id, depart.depart_name)">新增计划</vc-debounce-click>
				</div>
				<div class="_team-list">
					<div 
						v-for="(echelon, echelon_index) in echelons"
						:key="echelon_index"
					>
						<oa-title class="g-m-b-10">{{ echelon.echelon_name }}</oa-title>
						<div v-for="(plan, plan_index) in echelon.child" :key="plan.echelon_id" class="__team-item">
							<div class="__top" @click="handleToggle(plan.echelon_id)">
								<span class="g-fs-14 g-pd-l-20">{{ plan.echelon_name }}&nbsp;</span>
								<span class="g-fr">
									<i
										v-if="$auth[1092] && plan.can_delete"
										class="icon iconfont icon-bianji g-fs-16 g-c-black-dark"
										style="color: #999; vertical-align: middle"
										@click.stop="handleEditPlan(echelon_index, plan_index)"
									/>
									<i 
										v-if="plan.can_delete"
										class="icon iconfont icon-vertical-line g-fs-12 g-c-balck5"
									/>
									<i 
										v-if="$auth[1093] && plan.can_delete"
										class="icon iconfont icon-delete1 g-fs-16 g-m-r-20"
										style="color: #999; vertical-align: middle"
										@click.stop="handleDeletePlan(echelon_index, plan_index)"/>
									<i 
										:class="plan.expand ? 'icon-triangle-up' : 'icon-triangle-down'" 
										class="iconfont g-fs-12"
										style="transform: scale(.8); margin-right: 5px; color: #666"
									/>
								</span>
							</div>
							<vc-expand
								:ref="'expand' + plan.echelon_id"
								v-model="plan.expand"
							>
								<div v-if="planDetail[plan.echelon_id] && planDetail[plan.echelon_id].length">
									<div 
										v-for="(stage, stage_index) in planDetail[plan.echelon_id]"
										:key="stage.stage_id"
										class="__stage">
										<div 
											v-if="planDetail[plan.echelon_id].length > 1"
											:style="{marginTop: stage_index === 0 ? '12px' : '-5px' }"
											class="__stage-name g-c-red-mid g-fs-14">{{ stage.stage_name }}</div>
										<div style="padding: 15px 20px 5px 20px">
											<div v-if="!plan.can_delete">
												<div 
													class="g-m-b-10">条件：<span class="g-pd-l-10">试岗新人</span>
												</div>
											</div>
											<div 
												v-else
												style="max-height: 100px; overflow: auto" 
												class="g-m-b-10">
												<div 
													v-for="(condition, condition_index) in stage.condition"
													:key="condition_index"
													class="__condition"
												>
													<div 
														class="__name">条件{{ ENUM[condition_index] }}：
													</div>
													<div class="__extend">
														<div 
															v-for="(extend, extend_index) in condition.extend"
															:key="extend.extend_id"
															class="__extend-item">
															<span v-if="extend_index !== 0">且</span>
															<span 
																v-for="(desc, desc_index) in afterCondition[extend.type - 1].showText"
																:key="desc_index"
															>
																{{ desc }}
																<span>{{ extend[afterCondition[extend.type - 1].key[desc_index]] }}</span>
															</span>
														</div>
													</div>
												</div>
											</div>
											<div class="__subject">
												<div class="__name">课题：</div>
												<div class="__list">
													<div
														v-for="(subject, subject_index) in stage.subject"
														:key="subject.subject_id"
														class="__item"
														@mouseenter="subject.show = true"
														@mouseleave="subject.show = false"
													>
														<div class="__top2 g-c-black3">
															<oa-custom-tooltip 
																:options="{ content: subject.subject_name, theme: 'light', maxWidth: '110px' }"/>
														</div>
														<div 
															:class="{ 'g-c-black5': !(+subject.course) }"
															class="__bottom2"
															@click="subject.course && handleSubjectDetail(subject.subject_id)"
														>课程：{{ subject.course }}个</div>
														<i 
															v-show="subject.show"
															class="icon iconfont icon-close2 g-absolute g-pointer g-fs-20"
															style="top: -15px; right: -10px; color: #DCDCDC"
															@click="handleDeleteCourse(stage.subject, subject_index)"/>
													</div>
													<div 
														v-if="$auth[1091] && stage.subject.length < 30"
														class="__item __add g-pointer" 
														@click="handleAddCourse(plan.echelon_id, stage.stage_id, stage.subject.length)">
														<i class="icon iconfont icon-add2 g-fs-20"/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div v-else class="g-tc g-lh-40">这里空空如也奥~</div>
							</vc-expand>
						</div>

					</div>
				</div>
			</i-tab-pane>
		</div>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Input } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import oaTitle from '@components/hr/academy-train-detail/_common/title';
import { Expand } from 'wya-vc';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import CustomTooltip from '@components/hr/academy-train-detail/_common/custom-tooltip';
import { AddCourse } from '@components/hr/academy-train-detail/_common/popup/add-course';
import API_ROOT from '@stores/apis/root';
import InputText from './input-text';
import { RelatedModal } from "../academy-elite-talent/popup/related-subject";
import { afterCondition } from '../academy-elite-add/add-condition/condition';
import clearService from "../academy-train-detail/_common/mixin/clear-service";

const ENUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', 
	'十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
	'二一', '二二', '二三', '二四', '二五', '二六', '二七', '二八', '二九', '三十'];

export default {
	name: 'oa-table',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-input': Input,
		'oa-input-text': InputText,
		'oa-title': oaTitle,
		'vc-expand': Expand,
		'oa-custom-tooltip': CustomTooltip
	},
	mixins: [clearService([
		'subjectTree', 'stageTree', 'planTree', 'echelon',
		'planCaTree', 'planCaTreeAll', 'stageCaTreeAll', 'departAllTree'
	])],
	data() {
		const { query } = this.$route;

		return {
			ENUM,
			afterCondition,
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			pursose: '',
			tabs: [],
			positionList: [],
			echelons: [], // 人才计划树形结构  页面框架
			planDetail: { }, // 阶段数据详情
		};
	},
	async created() {
		try {
			await this.loadTabsData();
			// this.loadData();
			this.loadTabPurposeData();
			this.loadEchelonData();
		} catch (err) {
			console.error(err);
		}
		this.handlePositionList();
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			this.request({
				url: 'HR_ACADEMY_ELITE_SETTING_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		async loadTabsData() {
			const { data } = await this.$request({
				url: API_ROOT.HR_STAIR_DEPART_GET,
				type: "GET",
				loading: false,
			});
			this.tabs = data;
			this.$store.commit('HR_ACADEMY_ELITE_SETTING_TABS_GET', data);
		},
		async loadTabPurposeData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_TALENT_SETTING_PURPOSE_GET,
				param: {
					depart_id: this.tabs[+this.type].depart_id
				},
				type: "GET",
				loading: false,
			}).then(({ data }) => {
				this.pursose = data.purpose;
			});
		},
		loadEchelonData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_SETTING_ECHELON_LIST_GET,
				type: "GET",
				loading: false,
				param: {
					depart_id: this.tabs[+this.type].depart_id
				}
			}).then(({ data }) => {
				if (!Array.isArray(data)) {
					this.$Message.warning('该分类下暂无计划');
				}
				this.echelons = data;
			});
		},
		async loadPlanDetail(echelon_id) {
			let { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_SETTING_PLAN_DETAIL_GET,
				type: "GET",
				param: {
					echelon_id
				}
			});
			if (!Array.isArray(data)) { data = []; }
			this.handleInitPlanDetail(data);
			this.planDetail = {
				...this.planDetail,
				[echelon_id + '']: data
			};
		},
		async handleInitPlanDetail(data) {
			data.forEach(stage => {
				stage.subject.forEach(subject => {
					subject.show = false;
				});
				if (stage.condition && stage.condition.length) {
					stage.condition.forEach(condition => {
						if (condition.extend && condition.extend.length) {
							condition.extend.forEach(extend => {
								const type = extend.type - 1;
								let position_ids;
								let selectPositions;
								switch (type) {
									case 0: 
										return;
									case 1: 
										position_ids = extend.position_ids.map(Number);
										selectPositions = this.positionList.reduce((init, cur) => {
											position_ids.includes(Number(cur.position_id)) && init.push(cur.position_name);
											return init;
										}, []);
										extend.positions = selectPositions.join('、');
										break;
									case 2: 
									case 3: 
									case 4: 
									case 5: 
										if (extend.cumulative_months == 0) {
											extend.cumulative_months = '不限月数';
										} else {
											extend.cumulative_months += "个月";
										}
										break;
									case 6: 
										break;
									default: 
										break;
								}
							});
						}
					});
				}
			});
		},
		handlePositionList() {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then(({ data }) => {
				this.positionList = data
					.filter(v => v.depart_id == this.tabs[+this.type].depart_id)[0].positions
					.map(v => {
						Number(v.position_id);
						return v;
					});
			}).catch((error) => {});
		},
		handleChange(type) {
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/academy/elite/setting', { ...query }));
			this.handlePositionList();
			this.loadTabPurposeData();
			this.loadEchelonData();
		},
		handleChangePageSize() {
			this.$store.commit('HR_ACADEMY_ELITE_SETTING_LIST_INIT');
		},
		async handleToggle(echelon_id) {
			if (!this.planDetail[echelon_id]) {
				await this.loadPlanDetail(echelon_id);
			}
			this.$refs['expand' + echelon_id][this.type].toggle();
		},
		handleEditPlan(echelon_index, plan_index) {
			this.$router.push({
				path: '/hr/academy/elite/add',
				query: {
					depart_id: this.tabs[+this.type].depart_id,
					plan_id: this.echelons[echelon_index].child[plan_index].echelon_id,
					echelon_id: this.echelons[echelon_index].echelon_id,
					plan_name: this.echelons[echelon_index].child[plan_index].echelon_name,
					depart_name: this.tabs[+this.type].depart_name
				}
			});
		},
		handleDeletePlan(echelon_index, plan_index) {
			ModalTip.popup({
				content: '删除后，其所有的设置条件和课题及其关联课程将会被全部删除，确定要删除该计划吗？'
			}).then(() => {
				const plan = this.echelons[echelon_index].child[plan_index];
				this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_SETTING_DELETE_PLAN_POST,
					param: { echelon_id: plan.echelon_id },
					type: "POST"
				}).then(res => {
					this.echelons[echelon_index].child.splice(plan_index, 1);
					this.$Message.success(res.msg);
				}).catch(err => this.$Message.error(err.msg));
			});
		},
		handleSubjectDetail(subject_id) {
			RelatedModal.popup({
				subject_id
			});
		},
		handleNewCourse(depart_id, depart_name) {
			this.$router.push({
				path: '/hr/academy/elite/add',
				query: {
					depart_id,
					depart_name
				}
			});
		},
		hanldeManageCourse() {
			this.$router.push({
				path: '/hr/academy/elite/manage',
				query: {
					depart_id: this.tabs[+this.type].depart_id
				}
			});
		},
		handleDeleteCourse(subjects, subject_index) {
			ModalTip.popup({
				content: '移出后该课题和其关联课程将不在此人才计划内哦~ 确定要移除吗？'
			}).then(() => {
				this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_TALENT_SETTING_DELETE_SUBJECT_POST,
					param: { subject_id: subjects[subject_index].subject_id },
					type: "POST"
				}).then(res => {
					subjects.splice(subject_index, 1);
					this.clearService();
					this.$Message.success(res.msg);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			});
		},
		handleAddCourse(echelon_id, stage_id, nowLength) {
			AddCourse.popup({ nowLength }).then((res) => {
				const subjects = res.reduce((init, cur) => init.concat(cur.title), []);
				return this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_TALENT_SETTING_ADD_SUBJECT_POST,
					param: { 
						subjects,
						echelon_id,
						stage_id
					 },
					type: "POST"
				});
			}).then(res => {
				this.$Message.success(res.msg);
				this.loadPlanDetail(echelon_id);
				this.clearService();
			});
		}
	}
};

</script>

<style lang="scss">
.v-academy-elite-setting-content {
	._team-list {
        padding: 30px 0 0 0px;
		margin-top: -10px;
        .__team-item {
            width: 100%;
            border-radius: 4px;
			overflow: hidden;
            margin-bottom: 20px;
            border:1px solid rgba(217, 220, 224, 1);
            .__top {
                position: relative;
                cursor: pointer;
                height: 42px;
                line-height: 40px;
				background:rgba(248,248,248,1);
            }
			.__stage {
				.__stage-name {
					padding-left: 20px;
					margin-bottom: -5px;;
				}
				.__subject {
						display: flex;
						.__name {
							min-width: 40px;
							max-width: 40px;
						}
						.__list {
							display: flex;
							flex-wrap: wrap;
							.__item {
								position: relative;
								display: flex;
								flex-direction: column;
								width: 170px;
								height: 90px;
								border: 1px solid rgba(212, 215, 219, 1);
								border-radius :4px;
								padding: 0 25px;
								justify-content: center;
								align-items: center;
								margin: 0 15px 15px 0;
								display: flex;
								&:hover {
									border: none;
									background :rgba(242, 242, 242, 1)
								}
								.__top2 {
									display: flex;
									flex: 2;
									text-align: center;
									align-items: center;
								}
								.__bottom2 {
									color: #4FC43D;
									flex: 1;
									align-items: flex-end;
									cursor: pointer;
								}
							}
							.__item.__add:hover {
									border: 1px solid rgba(212, 215, 219, 1);
									background: none
								}
						}
					}
				.__condition {
					overflow: auto;
					display: flex;
					.__name {
						min-width: 52px;
						max-width: 60px;
					}
					.__extend {
						flex: 1;

						.__extend-item {
							display: inline;
						}
					}
				}
			}
        }
    }
}
</style>
