<template>
	<div class="g-flex g-jc-c">
		<i-form
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="180"
			class="_form"
			position="left"
		>
			<div class="__title">个人信息</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item label="应聘者姓名:" prop="applicant_name">
					<p style="width: 300px">
						{{ info.applicant_name }}
					</p>
				</i-form-item>
				<i-form-item label="应聘职位:">
					<p style="width: 300px">
						{{ info.position_name }}
					</p>
				</i-form-item>
				<i-form-item label="年龄:" prop="age">
					<i-input-number
						v-model="info.age"
						:min="0"
						:max="99"
						:precision="0"
						style="width: 300px"
						placeholder="请输入年龄"
					/>
				</i-form-item>
				<i-form-item label="婚否:" prop="is_married">
					<i-radio-group
						v-model="info.is_married"
						style="width: 300px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否有小孩:" prop="has_kids">
					<i-radio-group
						v-model="info.has_kids"
						style="width: 300px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否有对象:" prop="has_partner">
					<i-radio-group
						v-model="info.has_partner"
						style="width: 300px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="另一半所在公司地址:" prop="partner_company_address">
					<i-input
						v-model="info.partner_company_address"
						:maxlength="50"
						clearable
						style="width: 300px"
						placeholder="请输入地址信息"
					/>
				</i-form-item>
				<i-form-item label="另一半公司所属行业:" prop="partner_company_industry">
					<i-input
						v-model="info.partner_company_industry"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入行业信息"
					/>
				</i-form-item>
				<i-form-item label="家庭成员:" prop="family_member">
					<i-input
						v-model="info.family_member"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入家庭成员"
					/>
				</i-form-item>
				<i-form-item label="父母工作:" prop="family_job">
					<i-input
						v-model="info.family_job"
						:maxlength="50"
						clearable
						style="width: 300px"
						placeholder="请输入父母工作"
					/>
				</i-form-item>
				<i-form-item label="是否有车房:" prop="has_car_house">
					<i-select
						v-model="info.has_car_house"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择车房情况"
					>
						<i-option
							v-for="(item, index) in carAndHouse"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<!-- 工作经历 -->
			<div class="__title">工作经历</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item label="是否应届生:" prop="is_this_year_graduate">
					<i-radio-group
						v-model="info.is_this_year_graduate"
						style="width: 500px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="本岗位工作时间:" prop="this_job_time">
					<i-input
						v-model="info.this_job_time"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="原公司所属行业:" prop="last_company_industury">
					<i-input
						v-model="info.last_company_industury"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="团队内承担角色:" prop="role_in_team">
					<i-input
						v-model="info.role_in_team"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="是否有突出结果:" prop="has_excellent_result">
					<i-input
						v-model="info.has_excellent_result"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="职位知识及技巧掌握情况:" prop="technology">
					<i-input
						v-model="info.technology"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="上家公司离职原因:" prop="last_leave_reason">
					<i-input
						v-model="info.last_leave_reason"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="开始找工作至今时间:" prop="start_find_work_time">
					<i-input
						v-model="info.start_find_work_time"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="找不到合适工作原因:" prop="unable_to_find_work_reason">
					<i-input
						v-model="info.unable_to_find_work_reason"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="是否认真了解过本公司:" prop="is_know_company">
					<i-input
						v-model="info.is_know_company"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="选择本公司原因:" prop="choose_company_reason">
					<i-input
						v-model="info.choose_company_reason"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="遇到问题的钻研能力:" prop="study_skill">
					<i-input
						v-model="info.study_skill"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="有主见还是随遇而安:" prop="has_ideas">
					<i-input
						v-model="info.has_ideas"
						:maxlength="20"
						clearable
						style="width: 300px"
						placeholder="请输入内容"
					/>
				</i-form-item>
				<i-form-item label="对金钱欲望是否强烈:" prop="money_appetency">
					<i-radio-group
						v-model="info.money_appetency"
						style="width: 300px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否注重平台和学习机会:" prop="attention_platform">
					<i-radio-group
						v-model="info.attention_platform"
						style="width: 300px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="是否特别在意休息和吃喝玩乐:" prop="attention_relax">
					<i-radio-group
						v-model="info.attention_relax"
						style="width: 300px;"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>

			<!-- 综合评价 -->
			<div class="__title">综合评价</div>
			<div class="g-flex-ac g-jc-sb g-fw-w">
				<i-form-item label="应聘者优点:" prop="excellent">
					<i-checkbox-group
						v-model="info.excellent"
						style="max-width: 800px; min-width: 500px"
						class="g-flex g-fw-w"
					>
						<i-checkbox label="1">偏踏实、勤奋</i-checkbox>
						<i-checkbox label="2">脑袋灵活反应能力快</i-checkbox>
						<i-checkbox label="3">表达条理清晰知识面广</i-checkbox>
						<i-checkbox label="4">知识面一般但注重学习可培养</i-checkbox>
					</i-checkbox-group>
				</i-form-item>
				<i-form-item label="其他评价:" prop="else_valuate">
					<oa-limit-words
						v-model="info.else_valuate"
						:max="200"
						style="width: 300px"
						placeholder="请输入其他评价"
					/>
				</i-form-item>
				<i-form-item label="是否对薪资有基本底线:" prop="has_salary_line">
					<i-radio-group
						v-model="info.has_salary_line"
						style="width: 300px; margin-right: 100px"
					>
						<i-radio label="1">有底线</i-radio>
						<i-radio label="0">无底线</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item
					v-if="info.has_salary_line === '0'"
					label="无底线原因:"
					prop="has_no_line_reason">
					<oa-limit-words
						v-model="info.has_no_line_reason"
						:max="200"
						style="width: 300px; margin-right: 100px"
						placeholder="请输入无底线原因"
					/>
				</i-form-item>
				<i-form-item label="面试结果:" prop="interview_result">
					<i-radio-group
						v-model="info.interview_result"
						style="width: 300px; margin-right: 100px"
					>
						<i-radio label="1">通过</i-radio>
						<i-radio label="0" style="marginRight: 60px">待定</i-radio>
						<i-radio label="2">Pass</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="备注:" prop="remarks">
					<oa-limit-words
						v-model="info.remarks"
						:max="200"
						style="width: 300px"
						placeholder="请输入备注"
					/>
				</i-form-item>
			</div>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-interview :info="info"/>
			</vc-print>
		</div>

		<footer v-if="!is_person" class="g-flex-cc _footer">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handlePrint">打印</vc-debounce-click>
			<vc-debounce-click v-if="!isSaved" class="g-red-btn-small" @click="handleSave">提交</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio,
	Select, Option, CheckboxGroup, Checkbox
} from 'iview';
import { Print } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import PrintInterview from './print/interview';

export default {
	name: 'hr-form-interview',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'vc-print': Print,
		'oa-limit-words': LimitWords,
		'oa-print-interview': PrintInterview,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			isSaved: false,
			is_person: !!query.from,
			carAndHouse: [
				{ label: '有车有房', value: 0 },
				{ label: '有车没房', value: 1 },
				{ label: '没车有房', value: 2 },
				{ label: '没车没房', value: 3 }
			],
			info: {
				age: null
			},
			ruleValidate: {
				interview_result: [{ required: true, message: '请选择面试结果' }]
			}
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_INTERVIEW_GET'],
				type: "GET",
				param: {
					...this.$route.query
				},
				loading: false
			}).then(res => {
				this.info = {
					...this.info,
					...res.data,
					age: Number(res.data.age) || null
				};

				this.isSaved = res.data.is_submit == 0;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleOk() {

		},
		async handlePrint() {
			if (this.isSaved) {
				this.$refs.pageTarget.print();
			} else {
				let success = await this.handleSave();
				if (success) {
					this.$refs.pageTarget.print();
				}
			}
		},
		handleSave() {
			return new Promise((resolve, reject) => {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						resolve();
					}
				});
			}).then((res) => {
				return this.$request({
					url: API_ROOT['_HR_FORM_INTERVIEW_POST'],
					type: "POST",
					param: {
						...this.info,
						...this.$route.query
					},
					loading: false
				}).then(res => { // eslint-disable-line
					this.$Message.success('保存成功!');
					this.loadData();
					return true;
				}).catch(error => {
					this.$Message.error(error.msg);
					return null;
				});
			});
		}
	},
};
</script>

<style lang="scss" scoped>
._footer {
	._disabled:hover {
		color: #333 !important;
		border: 1px solid #d4d7d8;
		cursor: not-allowed;
	}
}
</style>
