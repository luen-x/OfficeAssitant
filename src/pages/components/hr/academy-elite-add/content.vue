<template>
	<div class="v-hr-academy-elite-add">
		<i-form
			ref="form"
			:model="formData"
			:rules="ruleValidate"
			:label-width="115"
			class="_form"
			position="left"
		>
			<i-form-item label="人才梯队名称：" prop="echelon_name">
				<i-input
					v-model="formData.echelon_name"
					:maxlength="10"
					style="width: 300px"
					placeholder="请输入人才梯队名称，10字以内，如：雄鹰计划"
				/>
			</i-form-item>

			<i-form-item label="人才梯队排序：" prop="sort">
				<i-input
					v-model="formData.sort"
					:number="true"
					style="width: 300px"
					placeholder="请输入序号"
				/>
			</i-form-item>

			<i-form-item label="人才梯队类型：" prop="echelon_id" style="margin-top: -10px">
				<i-radio-group v-model="formData.echelon_id" style="width:300px;">
					<i-radio 
						v-for="(echelon) in echelons"
						:key="echelon.echelon_id"
						:value="+echelon.echelon_id"
						:label="Number(echelon.echelon_id)" 
						style="margin-right: 40px">{{ echelon.echelon_name }}</i-radio>
				</i-radio-group>
			</i-form-item>
		

			<div 
				v-for="(stage, stage_index) in stages" 
				:key="stage_index" 
				class="_stage">
				<div class="__top g-pointer" @click="handleToggle(stage_index)">
					<oa-input-text v-model="stage.stage_name" @delete="handleDelete(stage_index)"/>
					<i 
						:class="stage.expand ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-fr"
						style="transform: scale(.8); margin-right: 5px; color: #666"
					/>
				</div>
				<vc-expand
					:ref="'expand' + stage_index"
					v-model="stage.expand"
				>
					<div style="padding: 20px 20px 5px 10px">
						<div class="_content">
							<div class="__class">
								<div class="__name g-relative" >
									<i-form-item 
										:label-width="95" 
										label="分类条件："
										style="margin-top: -5px"
										class="g-fs-14 g-c-black3 __star"/>
									<span class="g-c-black5 __tip">(满足其中条 件之一即可)</span>
								</div>
								<div class="__condition">
									<div v-if="stage.condition.length">
										<div 
											v-for="(condition, condition_index) in stage.condition"
											:key="condition_index"
											class="__title"
											style="margin-bottom: 5px">
											<span class="g-fs-14 g-c-black4 g-pd-r-20 g-dp-ib g-m-b-10">条件{{ ENUM[condition_index] }}</span>
											<i 
												class="icon iconfont icon-bianji g-fs-16 g-pointer"
												style="color: #999; vertical-align: center"
												@click.stop="handleEditCondition(stage_index, condition_index)"
											/>
											<i 
												class="icon iconfont icon-vertical-line g-fs-12 g-c-balck5"
											/>
											<i 
												class="icon iconfont icon-delete1 g-fs-16 g-m-r-20 g-pointer"
												style="color: #999; vertical-align: center"
												@click.stop="handleDeleteCondition(stage_index, condition_index)"/>
											<div 
												v-for="(extend, extend_index) in condition.extend" 
												:key="extend_index"
											>
												<div 
													v-for="(desc, desc_index) in afterCondition[extend.type - 1].desc" 
													:key="desc_index"
													class="g-dp-ib">
													{{ desc }}
													<oa-condition-form 
														v-if="desc_index < (afterCondition[extend.type - 1].desc.length - 1)"
														ref="conditionForm"
														v-model="extend.value[desc_index]" 
														:type="afterCondition[extend.type - 1].config[desc_index].type"
														:placeholder="afterCondition[extend.type - 1].config[desc_index].placeholder"
														:option="afterCondition[extend.type - 1].config[desc_index].option"
														:depart-id="afterCondition[extend.type - 1].config[desc_index].type === 2 ? depart_id : ''"
														class="g-dp-ib g-m-lr-10"/>
												</div>
											</div>
										</div>
									</div>
									<div 
										v-else 
										class="g-tc g-m-t-30 g-c-blue-mid"
										style="margin-top: 30px">这里空空如也， 快去添加条件吧~</div>
								</div>
								<div class="__btn g-m-b-20">
									<i-button type="primary" @click="handleAddCondition(stage_index)">添加条件</i-button>
								</div>
							</div>
							<div class="__line"/>
							<div class="__subject">
								<div class="__name">
									<i-form-item 
										:label-width="70" 
										label="课题："
										class="g-fs-14 g-c-black3 __star"/>
								</div>
								<div class="__condition">
									<div v-if="stage.subject.length">
										<div 
											v-for="(subject, subject_index) in stage.subject" 
											:key="subject_index"
											:style="{ marginTop: subject_index ? '-8px' : '-3px' }">
											<span style="color: #818794" class="g-fs-14">课题{{ ENUM[subject_index] }}</span>
											<oa-input-text 
												v-model="subject.subject_name" 
												:maxlength="30"
												class="g-fs-12"
												width="400px"
												@delete="handleDeleteSubject(stage_index, subject_index)"/>
										</div>
									</div>
									<div 
										v-else 
										class="g-tc g-m-t-20 g-c-blue-mid">这里空空如也， 快去添加课题吧~</div>
								</div>
								<div class="__btn"><i-button type="primary" @click="handleAddCourse(stage_index)">添加课题</i-button></div>
							</div>
						</div>
					</div>
				</vc-expand>
			</div>
			<i-button 
				class="" 
				type="primary"
				@click="handleAddNewStage">新增阶段</i-button>

		</i-form>
		<div class="_footer">
			<i-button 
				@click="handleCancel"
			>取消</i-button>
			<i-button 
				type="primary" 
				style="margin: 0 150px 0 5px"
				@click="handleSubmit"
			>保存</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, RadioGroup, Radio, Button, Modal } from 'iview';
import { dataValidity } from "@utils/utils";
import { Expand } from 'wya-vc';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import { AddCourse } from '@components/hr/academy-train-detail/_common/popup/add-course';
import API_ROOT from '@stores/apis/root';
import ConditionForm from './add-condition/condition-form';
import { AddCondition } from './popup/select-modal';
import { afterCondition } from './add-condition/condition';
import InputText from './input-text';

const ENUM = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', 
	'十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
	'二一', '二二', '二三', '二四', '二五', '二六', '二七', '二八', '二九', '三十'];


export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'vc-expand': Expand,
		'oa-condition-form': ConditionForm,
		'i-button': Button,
		'oa-input-text': InputText
	},
	data() {
		const { query = {} } = this.$route;
		const validateEchelonName = (rule, value, callback) => {
			if (value && value != this.$route.query.plan_name) {
				this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_ADD_VALIDATE_NAME_GET,
					param: {
						echelon_name: value
					},
					type: "GET",
					loading: false
				}).then(res => {
					callback();
				}).catch(err => {
					callback(err.msg);
				});
			} else {
				callback();
			}
		};
		const validateEchelonSort = (rule, value, cb) => {
			if (typeof value === 'number' && value != this.sort) {
				this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_ADD_VALIDATE_SORT_GET,
					type: "GET",
					param: {
						sort: value,
						echelon_id: this.echelon_id || 0
					},
					loading: false
				}).then(res => {
					cb();
				}).catch(err => {
					cb(err.msg);
				});
			} else if (!value && value !== 0) {
				cb('请输入数字');
			} else {
				cb();
			}
		};
		this.depart_id = query.depart_id;
		this.echelon_id = query.echelon_id;
		this.plan_id = query.plan_id;
		return {
			ENUM,
			afterCondition,
			echelons: [],
			stages: [],
			formData: {
				echelon_name: '',
				echelon_id: +this.echelon_id || '',
				sort: ''
			},
			ruleValidate: {
				echelon_name: [
					{ required: true, message: '请输入人才梯队名称', trigger: 'blur' },
					// { type: 'validCompellation', message: '请用中英文', validator: dataValidity, trigger: "blur" },
					{ validator: validateEchelonName, trigger: 'blur' }
				],
				echelon_id: [
					{ required: true, type: 'number', message: '请选择梯队类型', trigger: 'change' }
				],
				sort: [
					{ required: true, type: 'integer', message: '请输入数字', trigger: 'change' },
					{ validator: validateEchelonSort, trigger: 'blur' }
				]
			}
		};
	},
	async created() {
		try {
			await this.handleGetEchelons();
			this.handleInitData();
		} catch (err) {
			console.error(err);
		}
	},
	methods: {
		handleInitData() {
			if (this.echelon_id) {
				this.handleInitEditData();
			} else {
				this.handleInitAddData();
			}
		},
		handleInitAddData() {
			this.stages = [{
				stage_id: 0,
				echelon_id: 0,
				stage_name: `第${this.ENUM[this.stages.length]}阶段`,
				condition: [
					// {
					// stage_id: 0,
					// condition_id: 0,
					// extend: []
					// }
				],
				subject: [],
				expand: true
			}];
		},
		handleInitEditData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_ADD_LIST_GET,
				type: "GET",
				param: {
					depart_id: this.depart_id,
					echelon_id: this.plan_id
				}
			}).then(({ data }) => {
				data.stage.forEach(v => v.expand = true);
				this.stages = data.stage;
				this.formData.echelon_name = data.echelon_name;
				this.formData.sort = data.sort;
				this.sort = data.sort; // 用做保存初始值  以作对比
				this.handleFormdataConditionData("GET");
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		async handleGetEchelons() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_ECHELON_LIST_GET,
				param: { depart_id: this.depart_id },
				type: "GET"
			}).then(({ data }) => {
				this.echelons = data;
			});
		},
		async handleSubmit() {
			const valid = await this.handleCheckValid();
			if (valid) {
				this.handleFormdataConditionData("POST");
				this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_ADD_CREATE_POST,
					type: "POST",
					param: {
						echelon_name: this.formData.echelon_name,
						parent_id: this.formData.echelon_id,
						sort: this.formData.sort,
						echelon_id: this.plan_id || 0,
						depart_id: this.depart_id,
						stage: this.stages
					}
				}).then(res => {
					ModalTip.popup({
						content: `保存成功！
						梯队人员可能需要延迟几分钟之后才能更新，
						请注意刷新后查看！`,
						noCancel: true
					}).finally(() => {
						this.$router.push('/hr/academy/elite/setting');
					});
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}
		},
		async handleCheckValid() {
			let allValid = true;
			allValid = await this.$refs.form.validate();
			if (!this.$refs.conditionForm) {
				allValid = false;
				this.$Message.error('请添加条件');
				return allValid;
			} else {
				const validPromise = this.$refs.conditionForm.map(field => field.$refs.form.validate());
				const validArr = await Promise.all(validPromise);
				allValid = validArr.every(Boolean);
			}
			this.stages.forEach(stage => {
				if (!stage.subject.length) {
					allValid = false;
					this.$Message.error('课题不能为空');
				}
			});
			return allValid;
		},
		handleCancel() {
			this.$router.back();
		},
		handleToggle(i) {
			this.$refs['expand' + i][0].toggle();
		},
		handleAddCondition(stage_index) {
			const { stages } = this;
			AddCondition.popup({}).then(res => {
				const conditionItem = {
					// stage_id: stages[stage_index].stage_id,
					stage_id: 0,
					condition_id: 0,
					extend: []
				};
				res.forEach(v => {
					const extend = conditionItem.extend;
					switch (v) {
						case 0:
						case 3:
						case 4:
						case 5:
							extend.push({
								type: v + 1,
								extend_id: 0,
								value: [null, null],
							});
							break;
						case 1:
							extend.push({
								type: v + 1,
								extend_id: 0,
								value: [[]],
							});
							break;
						case 2:
							extend.push({
								type: v + 1,
								extend_id: 0,
								value: [null, null, null],
							});
							break;
						case 6:
							extend.push({
								type: v + 1,
								extend_id: 0,
								value: [null],
							});
							break;
						default: 
							throw new Error('不存在的条件');
					}
				});
				stages[stage_index].condition.push(conditionItem);
			});
		},
		handleFormdataConditionData(type) {
			// type: "GET" 请求数据时候的格式化数据
			// type: "POST" 发送数据时候的格式化数据
			this.stages.forEach(stage => {
				stage.condition.forEach(condition => {
					condition.extend.forEach(extend => {
						// 这里的type是传给后端的type = value + 1
						switch (extend.type) {
							case 1:
								if (type === "POST") {
									extend.work_year_min = extend.value[0];
									extend.work_year_max = extend.value[1];
								} else {
									extend.value = [+extend.work_year_min, +extend.work_year_max];
								}
								break;
							case 2:
								if (type === "POST") {
									extend.position_ids = extend.value[0];
								} else {
									extend.value = [extend.position_ids.map(Number)];
								}
								break;
							case 3:
								if (type === "POST") {
									extend.cumulative_months = extend.value[0];
									extend.achievement_min = extend.value[1];
									extend.achievement_max = extend.value[2];
								} else {
									extend.value = [
										+extend.cumulative_months, +extend.achievement_min, +extend.achievement_max
									];
								}
								break;
							case 4:
								if (type === "POST") {
									extend.cumulative_months = extend.value[0];
									extend.achievement_min = extend.value[1];
								} else {
									extend.value = [+extend.cumulative_months, +extend.achievement_min];
								}
								break;
							case 5:
								if (type === "POST") {
									extend.cumulative_months = extend.value[0];
									extend.achievement_avg = extend.value[1];
								} else {
									extend.value = [+extend.cumulative_months, +extend.achievement_avg];
								}
								break;
							case 6:
								if (type === "POST") {
									extend.cumulative_months = extend.value[0];
									extend.achievement_avg_month = extend.value[1];
								} else {
									extend.value = [
										+extend.cumulative_months, +extend.achievement_avg_month
									];
								}
								break;
							case 7:
								if (type === "POST") {
									extend.work_year_min = extend.value[0];
								} else {
									extend.value = [+extend.work_year_min];
								}
								break;
							default: 
								break;
						}
					});
				});
			});
		},
		handleEditCondition(stage_index, condition_index) {
			let extendArr = this.stages[stage_index].condition[condition_index].extend;
			const selectIds = extendArr.reduce((init, cur) => {
				init.push(cur.type - 1);
				return init;
			}, []);
			AddCondition.popup({ default: selectIds }).then(res => {
				if (!res.length) {
					this.stages[stage_index].condition.splice(condition_index, 1);
					return;
				}
				let oldTypes = new Set(selectIds);
				let newTypes = new Set(res);
				let intersect = new Set([...oldTypes].filter(x => newTypes.has(x)));
				const common = [...intersect];
				this.stages[stage_index].condition[condition_index].extend = extendArr.filter(v => common.includes(v.type - 1));
				const newExtendArr = this.stages[stage_index].condition[condition_index].extend;
				const newSelectIds = newExtendArr.reduce((init, cur) => {
					init.push(cur.type - 1);
					return init;
				}, []);
				res.forEach(v => {
					if (!newSelectIds.includes(v)) {
						switch (v) {
							case 0:
							case 3:
							case 4:
							case 5:
								newExtendArr.push({
									type: v + 1,
									extend_id: 0,
									value: [null, null],
								});
								break;
							case 1:
								newExtendArr.push({
									type: v + 1,
									extend_id: 0,
									value: [[]],
								});
								break;
							case 2:
								newExtendArr.push({
									type: v + 1,
									extend_id: 0,
									value: [null, null, null],
								});
								break;
							case 6:
								newExtendArr.push({
									type: v + 1,
									extend_id: 0,
									value: [null],
								});
								break;
							default: 
								throw new Error('不存在的条件');
						}
					}
				});
			});
		},
		handleDeleteCondition(stage_index, condition_index) {
			ModalTip.popup({
				content: '删除该条件后，将无法恢复，确定删除该条件吗？'
			}).then(res => {
				this.stages[stage_index].condition.splice(condition_index, 1);
			});
		},
		handleDelete(stage_index) {
			ModalTip.popup({
				content: '删除该课题后，将无法恢复，确定删除该课题吗？'
			}).then(res => {
				if (this.stages.length === 1) {
					this.$Message.error('至少保留一个奥');
				} else {
					this.stages.splice(stage_index, 1);
				}
			});
		},
		handleAddCourse(stage_index) {
			const stage = this.stages[stage_index];
			if (stage.subject.length >= 30) {
				this.$Message.error('最多添加30个课题奥~');
				return;
			}
			AddCourse.popup({
				nowLength: stage.subject.length
			}).then(res => {
				res.forEach(v => {
					stage.subject.push({
						subject_id: 0,
						stage_id: stage.stage_id,
						subject_name: v.title
					});
				});
			});
		},
		handleDeleteSubject(stage_index, subject_index) {
			ModalTip.popup({
				content: '删除该课题后，将无法恢复，确定删除该课题吗？'
			}).then(() => {
				this.stages[stage_index].subject.splice(subject_index, 1);
			});
		},
		handleAddNewStage() {
			this.stages.push({
				stage_id: 0,
				echelon_id: 0,
				stage_name: `第${this.ENUM[this.stages.length]}阶段`,
				condition: [
					// {
					// stage_id: 0,
					// condition_id: 0,
					// extend: []
					// }
				],
				subject: []
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-academy-elite-add {
	padding: 20px;
	padding-bottom: 100px;
	._stage {
		border: 1px solid rgba(232, 232, 232, 1);
		border-radius: 4px;
		overflow: hidden;
		min-width: 1060px;
		margin: 0 0 20px 0;
		.__top {
			height: 40px;
			border-radius: 4px;
			background: rgba(248, 248, 248, 1);
			line-height: 40px;
			color: #4B4F57;
		}
	}
	._content {
		.__class {
			display: flex;
			min-height:  100px;
			.__name {
				width: 120px;
				display: flex;
				text-align: center;
				.__tip {
					position: absolute;
					top: 20px;
					width: 77px;
					right: 35px;
				}
			}
			.__condition {
				flex: 1;
				display: flex;
				flex-direction: column;
			}
			.__btn {
				width: 100px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.__line {
			height: 1px;
			background: rgba(235, 238, 241, 1);
		}
		.__subject {
			display: flex;
			padding: 10px 0 0 0;
			.__name {
				width: 120px;
				display: flex;
				text-align: center;
			}
			.__condition {
				flex: 1;
				display: flex;
				flex-direction: column;
				.__value {
					font-size: 12px!important;
					color: #4B4F57;
				}
			}
			.__btn {
				width: 100px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.__star {
		.ivu-form-item-label:before  {
			content: '*';
			display: inline-block;
			margin-right: 4px;
			line-height: 1;
			font-family: SimSun;
			font-size: 12px;
			color: #ed4014;
		}
	};
	._footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #fff;
		height: 45;
		line-height: 45px;
		box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.08);
		margin-left: -20px;
		text-align: center;
	}
}
</style>
