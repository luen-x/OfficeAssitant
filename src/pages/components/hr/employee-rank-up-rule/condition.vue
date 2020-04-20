<template>
	<div class="v-hr-employee-rank-up-condition">
		<div v-if="formData.list.length" class="_container">
			<i-form ref="form" :model="formData" :rules="rule">
				<div
					v-for="(item, index) in formData.list"
					:key="index">

					<div v-if="item.pro_rule_id === 1" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="g-flex g-fw-w g-ai-c">

							员工本人成为
							<i-select
								v-model="formData.list[index].need_position_id"
								:disabled="!isShow"
								transfer
								clearable
								class="g-m-lr-10 width-input"
								placeholder="选择职位">
								<i-option v-for="data in positionList" :key="data.position_id" :value="data.position_id">
									{{ data.position_name }}
								</i-option>
							</i-select>
							<span class="g-m-r-10">达到</span>
							<i-input-number
								v-model="formData.list[index].need_standing_month"
								:disabled="!isShow"
								:max="99"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">月。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 2" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="g-flex g-fw-w g-ai-c">

							考核结束日当天23:59:59
							<i-select
								v-model="formData.list[index].depart_standing_type"
								:disabled="!isShow"
								transfer
								clearable
								class="g-m-lr-10 width-input"
								placeholder="选择对象">
								<i-option v-for="data in departStandindTypes" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-r-10">工龄达到</span>
							<i-input-number
								v-model="formData.list[index].need_depart_standing_month"
								:disabled="!isShow"
								:max="9999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-lr-10">月的人数</span>
							<i-input-number
								v-model="formData.list[index].need_depart_count"
								:disabled="!isShow"
								:max="99"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">人。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 3" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="g-flex g-fw-w g-ai-c">

							在
							<i-select
								v-model="formData.list[index].stat_period"
								:disabled="!isShow"
								transfer
								clearable
								class="g-m-lr-10 width-input"
								placeholder="选择周期">
								<i-option v-for="data in statPeriods" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-r-10">积分体系内获得可用晋升积分</span>
							<i-input-number
								v-model="formData.list[index].need_pro_integral"
								:disabled="!isShow"
								:max="9999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">分。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 4" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="g-flex g-fw-w g-ai-c">

							在
							<i-select
								v-model="formData.list[index].stat_period"
								:disabled="!isShow"
								transfer
								clearable
								class="g-m-lr-10 width-input"
								placeholder="选择周期">
								<i-option v-for="data in statPeriods" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-r-10">学分体系内获得可用晋升学分</span>
							<i-input-number
								v-model="formData.list[index].need_pro_credit"
								:disabled="!isShow"
								:max="9999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">分。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 5" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="_special">

							<oa-input-number
								v-model="formData.list[index].accumulate_month"
								:disabled="!isShow"
								:max="12"
								:min="1"
								:width="128"
								name="月数"
								disabled-name="考核期间"
								disabled-value="考核期间" />
							<i-select
								v-model="formData.list[index].object"
								:disabled="!isShow"
								transfer
								clearable
								class="g-m-lr-10 width-input"
								placeholder="选择对象">
								<i-option v-for="data in objectList1" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-r-10">业绩金额达到</span>
							<i-input-number
								v-model="formData.list[index].total_performance"
								:disabled="!isShow"
								:max="99999999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">元。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 6" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="_special">

							<oa-input-number
								v-model="formData.list[index].accumulate_month"
								:disabled="!isShow"
								:max="12"
								:min="1"
								:width="128"
								name="月数"
								disabled-name="考核期间"
								disabled-value="考核期间" />
							<i-select
								v-model="formData.list[index].object"
								:disabled="!isShow"
								transfer
								clearable
								class="g-m-lr-10 width-input"
								placeholder="选择对象">
								<i-option v-for="data in objectList2" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-r-10">平均业绩金额达到</span>
							<i-input-number
								v-model="formData.list[index].average_performance"
								:disabled="!isShow"
								:max="9999999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">元。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 7" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="_special">

							<oa-input-number
								v-model="formData.list[index].accumulate_month"
								:disabled="!isShow"
								:max="12"
								:min="1"
								:width="128"
								name="月数"
								disabled-name="考核期间"
								disabled-value="考核期间"
								class="g-m-r-10" />
							<i-select
								v-model="formData.list[index].object"
								:disabled="!isShow"
								transfer
								clearable
								class="width-input"
								placeholder="选择对象">
								<i-option v-for="data in objectList3" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-lr-10">所属的</span>
							<i-select
								v-model="formData.list[index].ranking_type"
								:disabled="!isShow"
								transfer
								clearable
								class="width-input"
								placeholder="选择选择排名范围">
								<i-option v-for="data in departRanking" :key="data.value" :value="data.value">
									{{ data.label }}
								</i-option>
							</i-select>
							<span class="g-m-lr-10">内排名达到</span>
							<i-input-number
								v-model="formData.list[index].ranking_place"
								:disabled="!isShow"
								:max="9999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">名。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 8" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="g-flex g-fw-w g-ai-c">

							<span class="g-m-r-10">考核期间所处部门新增员工达到</span>
							<i-input-number
								v-model="formData.list[index].newly_increase_count"
								:disabled="!isShow"
								:max="99"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">人。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>

					<div v-if="item.pro_rule_id === 9" class="g-flex">
						<span style="min-width: 52px;line-height: 52px;">条件{{ index + 1 }}：</span>
						<i-form-item
							:prop="'list.' + index"
							:rules="rule[`rule${item.pro_rule_id}`]"
							class="g-flex g-fw-w g-ai-c">

							<span class="g-m-r-10">
								考核期间提供晋升用途素材中是主要分享者的素材有
							</span>
							<i-input-number
								v-model="formData.list[index].material_num"
								:disabled="!isShow"
								:max="999"
								:min="1"
								class="width-inputnumber" />
							<span class="g-m-l-10">个。</span>
							<i-checkbox v-model="formData.list[index].is_rigid" :disabled="!isShow" class="g-pd-r-15">硬性标准</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</i-form-item>
					</div>
					<div v-if="[1,2,3,4,5,6,7,8,9].indexOf(item.pro_rule_id) === -1 && item.rule_name" class="g-flex">
						<span style="min-width: 52px;line-height: 30px;">条件{{ index + 1 }}：</span>
						<div
							:prop="'list.' + index"
							:rules="rule.selfRules"
							style="line-height: 30px">
							{{ item.rule_name }}
							<i-checkbox
								v-model="formData.list[index].is_rigid"
								:disabled="!isShow"
								class="g-m-l-10 g-pd-r-15">
								硬性标准
							</i-checkbox>
							<span
								v-if="isShow"
								class="g-c-blue-mid g-pointer"
								@click="handleDelete(item)">删除</span>
						</div>
					</div>

				</div>
			</i-form>
		</div>
		<div v-else>暂无晋升条件，请先添加</div>
	</div>
</template>

<script>
import { services } from '@stores/services/hr';
import { Checkbox, Form, FormItem, Select, Option, Input, InputNumber } from 'iview';
import OaInputNumber from '../_common/input-number';

export default {
	components: {
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-checkbox": Checkbox,
		"oa-input-number": OaInputNumber
	},
	mixins: [
		services.departStandindTypes(),
		services.departRanking(),
		services.statPeriods()
	],
	props: {
		list: Array,
		isShow: Boolean
	},
	data() {
		let validateCheckDate = (rule, value, callback) => {
			if (!value) {
				callback(new Error("时间不能为空"));
			} else if (value === '考核期间') {
				callback();
			} else if (/^[\d]$/.test(value)) {
				callback();
			} else {
				callback(new Error("请输入正确的时间"));
			}
		};

		return {
			positionList: [],
			objectList1: [],
			objectList2: [],
			objectList3: [],
			formData: {
				list: []
			},
			oldList: [],
			rule: {
				selfRules: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						is_rigid: [{ required: true, message: "硬性标准不能为空", type: 'boolean', trigger: "change" }],
					}
				},
				rule1: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						need_position_id: [{ required: true, message: "职位不能为空", pattern: /.+/, trigger: "change" }],
						need_standing_month: [{ required: true, message: "工龄时间不能为空", pattern: /.+/, trigger: "blur" }]
					}
				},
				rule2: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						depart_standing_type: [{ required: true, message: "对象不能为空", pattern: /.+/, trigger: "change" }],
						need_depart_standing_month: [{ required: true, message: "月份不能为空", pattern: /.+/, trigger: "change" }],
						need_depart_count: [{ required: true, message: "人数不能为空", pattern: /.+/, trigger: "blur" }]
					}
				},
				rule3: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						stat_period: [{ required: true, message: "周期不能为空", pattern: /.+/, trigger: "change" }],
						need_pro_integral: [{ required: true, message: "积分不能为空", pattern: /.+/, trigger: "blur" }],
					}
				},
				rule4: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						stat_period: [{ required: true, message: "周期不能为空", pattern: /.+/, trigger: "change" }],
						need_pro_credit: [{ required: true, message: "学分不能为空", pattern: /.+/, trigger: "blur" }],
					}
				},
				rule5: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						accumulate_month: [{ validator: validateCheckDate }],
						object: [{ required: true, message: "对象不能为空", pattern: /.+/, trigger: "change" }],
						total_performance: [{ required: true, message: "业绩不能为空", pattern: /.+/, trigger: "blur" }],
					}
				},
				rule6: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						accumulate_month: [{ validator: validateCheckDate }],
						object: [{ required: true, message: "对象不能为空", pattern: /.+/, trigger: "change" }],
						average_performance: [{ required: true, message: "平均业绩不能为空", pattern: /.+/, trigger: "blur" }],
					}
				},
				rule7: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						accumulate_month: [{ validator: validateCheckDate }],
						object: [{ required: true, message: "对象不能为空", pattern: /.+/, trigger: "change" }],
						ranking_type: [{ required: true, message: "排名范围不能为空", pattern: /.+/, trigger: "change" }],
						ranking_place: [{ required: true, message: "排名不能为空", pattern: /.+/, trigger: "blur" }],
					}
				},
				rule8: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						newly_increase_count: [{ required: true, message: "新增员工数量不能为空", pattern: /.+/, trigger: "blur" }],
					}
				},
				rule9: {
					type: 'object',
					trigger: 'change',
					required: true,
					fields: {
						material_num: [{ required: true, message: "素材个数不能为空", pattern: /.+/, trigger: "blur" }],
					}
				}
			}
		};
	},
	watch: {
		'list': {
			handler(newV, oldV) {
				this.formData.list = [];
				newV.forEach((item, index) => {
					this.$set(this.formData.list, index, { ...item });
				});

				this.initDefault(this.formData.list);
			},
			deep: true
		}
	},
	mounted() {
		this.loadPosition();
		this.loadObjectList(2).then(res => {
			this.objectList1 = res.data;
		}).catch(err => {});
		this.loadObjectList(3).then(res => {
			this.objectList2 = res.data;
		}).catch(err => {});
		this.loadObjectList(4).then(res => {
			this.objectList3 = res.data;
		}).catch(err => {});
		// 拷贝一份list
		this.list.forEach((item, index) => {
			this.$set(this.formData.list, index, { ...item });
		});
	},
	methods: {
		// 获取对象下拉数组
		loadObjectList(type) {
			return this.$request({
				url: '_HR_EMPLOYEE_UP_OBJECT_GET',
				type: 'GET',
				param: {
					object_type: type
				},
				loading: false
			});
		},
		// 职位下拉数组
		loadPosition() {
			const { query } = this.$route;
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_RESUME_POSITION_GET',
				type: 'GET',
				param: {
					depart_id: query.depart_id
				},
				loading: false
			}).then(res => {
				this.positionList = res.data;
			}).catch(() => {});
		},
		// 删除条件
		handleDelete(sed) {
			let index = this.formData.list.findIndex(item => item === sed);
			if (index !== -1) {
				this.formData.list.splice(index, 1);
			}
			this.$emit('delete', sed.pro_rule_id);
		},
		// 初始化各项默认值
		initDefault(list) {
			list.forEach((item, index) => {
				list[index].is_rigid = !!item.is_rigid;

				if (item.pro_rule_id === 1) {
					list[index].need_standing_month ? '' : list[index].need_standing_month = null;
				} else if (item.pro_rule_id === 2) {
					list[index].need_depart_standing_month ? '' : list[index].need_depart_standing_month = null;
					list[index].need_depart_count ? '' : list[index].need_depart_count = null;
				} else if (item.pro_rule_id === 3) {
					list[index].need_pro_integral = +item.need_pro_integral;
					list[index].need_pro_integral ? '' : list[index].need_pro_integral = null;
				} else if (item.pro_rule_id === 4) {
					list[index].need_pro_credit = +item.need_pro_credit;
					list[index].need_pro_credit ? '' : list[index].need_pro_credit = null;
				} else if (item.pro_rule_id === 5) {
					// 考核期间
					if (item.accumulate_month) {
						list[index].accumulate_month = item.accumulate_month;
					} else {
						list[index].accumulate_month = 1;
					}
					list[index].total_performance
						? list[index].total_performance = +item.total_performance : list[index].total_performance = null;
				} else if (item.pro_rule_id === 6) {
					// 考核期间
					if (item.accumulate_month) {
						list[index].accumulate_month = item.accumulate_month;
					} else {
						list[index].accumulate_month = 1;
					}
					list[index].average_performance
						? list[index].average_performance = +item.average_performance : list[index].average_performance = null;
				} else if (item.pro_rule_id === 7) {
					// 考核期间
					if (item.accumulate_month) {
						list[index].accumulate_month = item.accumulate_month;
					} else {
						list[index].accumulate_month = 1;
					}
					list[index].ranking_place
						? list[index].ranking_place = +item.ranking_place : list[index].ranking_place = null;
				} else if (item.pro_rule_id === 8) {
					list[index].newly_increase_count ? '' : list[index].newly_increase_count = null;
				} else if (item.pro_rule_id === 9) {
					list[index].material_num ? '' : list[index].material_num = null;
				}
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up-condition {
	.width-input {
		width: 220px;
	}
	.width-inputnumber {
		width: 100px;
	}
}
</style>

<style lang="scss">
.v-hr-employee-rank-up-condition {
	._container {
		.ivu-form-item {
			margin-bottom: 0px !important;
		}
		.ivu-form-item-content {
			line-height: 52px !important;
		}
		.ivu-form-item-error-tip {
			top: 90%;
		}
	}
	._input-number {
		width: 220px;
		display: inline-block;
	}
	._special {
		.ivu-form-item-content {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			line-height: 52px !important;
		}
	}
}
</style>
