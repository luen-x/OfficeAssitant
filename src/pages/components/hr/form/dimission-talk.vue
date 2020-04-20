<template>
	<div class="g-flex-ac g-fd-c v-hr-form-dimission-talk">
		<i-form
			ref="formValidate"
			:model="info"
			:rules="ruleValidate"
			:label-width="140"
			class="_form"
			label-position="right"
		>
			<div class="__title">基本信息</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="离职员工姓名:" prop="staff_name">
					<p style="width: 300px">
						{{ info.staff_name }}
					</p>
				</i-form-item>
				<i-form-item label="部门:" prop="depart_id">
					<i-cascader
						v-model="info.depart_id"
						:data="departAll"
						:disabled="true"
						style="width: 300px; display: inline-block"
						clearable
						transfer
						change-on-select
						trigger="hover"
						placeholder="请选择试岗部门"
						@on-change="handleDepartChange"
					/>
				</i-form-item>
				<i-form-item label="职位:" prop="position_id">
					<i-select
						v-model="info.position_id"
						:disabled="true"
						placeholder="请选择职位"
						style="width: 300px"
						clearable
						transfer>
						<i-option
							v-for="item in positionList"
							:key="item.position_id"
							:value="item.position_id">
							{{ item.position_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="离职日期:" prop="leave_time">
					<i-date-picker
						:value="info.leave_time"
						type="date"
						style="width: 300px;"
						placeholder="请选离职日期"
						@on-change="handleChange($event, 'leave_time')"
					/>
				</i-form-item>
				<i-form-item label="离职类别:" prop="leave_type">
					<i-select
						v-model="info.leave_type"
						style="width: 300px"
						clearable
						transfer
						placeholder="请选择离职类别"
					>
						<i-option
							v-for="(item, index) in leaveType"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
			</div>

			<!-- 面谈信息 -->
			<div class="__title">面谈信息</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="离职原因:" prop="leave_reason_name">
					<oa-limit-words
						v-model="info.leave_reason_name"
						:max="1000"
						style="width: 300px"
						placeholder="请输入离职原因"
					/>
				</i-form-item>
				<!-- 其他部门 -->
				<template v-if="info.depart_type == 1">
					<i-form-item label="个人基本问题:" prop="person_reason">
						<i-checkbox-group
							v-model="info.person_reason"
							style="max-width: 820px; min-width: 300px;"
							class="g-flex g-fw-w g-jc-sb"
						>
							<i-checkbox label="1" style="width: 300px">沉不住，思维没有得到提高</i-checkbox>
							<i-checkbox label="2" style="width: 300px">学不会，底子弱</i-checkbox>
							<i-checkbox label="3" style="width: 300px">自身（韧性）不够</i-checkbox>
						</i-checkbox-group>
					</i-form-item>
					<i-form-item label="公司管理问题:" prop="company_reason">
						<i-checkbox-group
							v-model="info.company_reason"
							style="max-width: 820px; min-width: 300px;"
							class="g-flex g-fw-w g-jc-sb"
						>
							<i-checkbox label="1" style="width: 300px">部门问题</i-checkbox>
							<i-checkbox label="2" style="width: 300px">管理风格</i-checkbox>
							<i-checkbox label="3" style="width: 300px">出不了业绩，失去信心</i-checkbox>
							<i-checkbox label="4" style="width: 300px">支持问题</i-checkbox>
							<i-checkbox label="5" style="width: 300px">三立学府</i-checkbox>
							<i-checkbox label="6" style="width: 300px">要求不严格，没有落到实处</i-checkbox>
						</i-checkbox-group>
					</i-form-item>
					<i-form-item label="其他原因:" prop="other_reason">
						<oa-limit-words
							v-model="info.other_reason"
							:max="1000"
							style="width: 300px"
							placeholder="请输入其他原因"
						/>
					</i-form-item>
				</template>
				<!-- 技术部门 -->
				<template v-if="info.depart_type == 2">
					<i-form-item label="个人基本问题:" prop="person_reason">
						<i-checkbox-group
							v-model="info.person_reason"
							style="max-width: 820px; min-width: 300px;"
							class="g-flex g-fw-w g-jc-sb"
						>
							<i-checkbox label="1" style="width: 300px">不适应加班</i-checkbox>
							<i-checkbox label="2" style="width: 300px">对未来焦虑</i-checkbox>
							<i-checkbox label="3" style="width: 300px">压力大</i-checkbox>
							<i-checkbox label="4" style="width: 300px">学不到技术，无法精进</i-checkbox>
							<i-checkbox label="5" style="width: 300px">无法认清自己</i-checkbox>
							<i-checkbox label="6" style="width: 300px">自身（韧性）不够</i-checkbox>
							<i-checkbox label="7" style="width: 300px">想换个环境，没发展空间</i-checkbox>
							<div>
								<i-checkbox label="8" style="width: 300px">
									其他
								</i-checkbox>
								<oa-limit-words
									v-if="(info.person_reason || []).indexOf('8') > -1"
									v-model="info.other_person_reason"
									:max="1000"
									style="width: 300px"
									placeholder="请输入其他原因"
								/>
							</div>
						</i-checkbox-group>
					</i-form-item>
					<i-form-item label="公司管理问题:" prop="company_reason">
						<i-checkbox-group
							v-model="info.company_reason"
							style="max-width: 820px; min-width: 300px;"
							class="g-flex g-fw-w g-jc-sb"
						>
							<i-checkbox label="1" style="width: 300px">部门氛围不好</i-checkbox>
							<i-checkbox label="2" style="width: 300px">管理风格不适应</i-checkbox>
							<div>
								<i-checkbox label="3" style="width: 300px">
									其他
								</i-checkbox>
								<oa-limit-words
									v-if="(info.company_reason || []).indexOf('3') > -1"
									v-model="info.other_company_reason"
									:max="1000"
									style="width: 300px"
									placeholder="请输入其他原因"
								/>
							</div>
						</i-checkbox-group>
					</i-form-item>
					<i-form-item label="其他原因:" prop="other_reason">
						<i-checkbox-group
							v-model="info.other_reason"
							style="max-width: 820px; min-width: 300px;"
							class="g-flex g-fw-w g-jc-sb"
						>
							<i-checkbox label="1" style="width: 300px">距离太远</i-checkbox>
							<i-checkbox label="2" style="width: 300px">薪资福利不够好</i-checkbox>
							<i-checkbox label="3" style="width: 300px">家庭因素</i-checkbox>
							<i-checkbox label="4" style="width: 300px">身体原因</i-checkbox>
							<div>
								<i-checkbox label="5" style="width: 300px">
									其他
								</i-checkbox>
								<oa-limit-words
									v-if="(info.other_reason || []).indexOf('5') > -1"
									v-model="info.other_other_reason"
									:max="1000"
									style="width: 300px"
									placeholder="请输入其他原因"
								/>
							</div>
						</i-checkbox-group>
					</i-form-item>
				</template>
			</div>

			<!-- 对接结果 -->
			<div class="__title">对接结果</div>
			<div class="g-flex g-jc-sb g-fw-w">
				<i-form-item label="与招聘组反馈/对接:">
					<i-radio-group
						v-model="info.has_recruit"
						style="width: 300px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item label="与培训组反馈/对接:">
					<i-radio-group
						v-model="info.has_train"
						style="width: 300px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<!-- <i-form-item label="备注:" prop="remarks">
					<oa-limit-words
						v-if="true"
						v-model="info.remarks"
						:max="1000"
						style="width: 300px"
						placeholder="请输入面谈备注"
					/>
				</i-form-item> -->
			</div>
		</i-form>

		<!-- 打印内容 -->
		<div style="display: none">
			<vc-print ref="pageTarget">
				<oa-print-dimission-talk :info="info" />
			</vc-print>
		</div>

		<footer class="g-flex-cc">
			<vc-debounce-click class="g-gray-btn-small g-m-r-10" @click="handlePrint">打印</vc-debounce-click>
			<vc-debounce-click v-if="!isSaved" class="g-red-btn-small" @click="handleSave">提交</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber, RadioGroup, Radio, Cascader,
	Select, Option, CheckboxGroup, Checkbox, DatePicker, Poptip
} from 'iview';
import { Print, ImgsPicker } from 'wya-vc';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import LimitWords from '@components/_common/limit-words/limit-words';
import PrintDimissionTalk from './print/dimission-talk';

export default {
	name: 'hr-form-dimission-talk',
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
		'i-date-picker': DatePicker,
		'i-poptip': Poptip,
		'i-cascader': Cascader,
		'vc-print': Print,
		'vc-imgs-picker': ImgsPicker,
		'oa-limit-words': LimitWords,
		'oa-print-dimission-talk': PrintDimissionTalk,
	},
	mixins: [
		services.departAll(),
		services.departPosition(),
		services.leaveType()
	],
	data() {
		return {
			isSaved: false,
			positionList: [],
			info: {
				depart_type: this.$route.query.depart_type
			},
			ruleValidate: {
			}
		};
	},
	computed: {
		// position_id() {
		// 	if (this.info.depart_id && this.info.depart_id.length) {
		// 		return [this.info.depart_id[0], this.info.position_id];
		// 	}
		// }
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT['_HR_FORM_DIMISSION_TALK_GET'],
				type: "GET",
				param: {
					...this.$route.query,
					scenario: 5,
					entrance_type: 1
				},
				loading: false
			}).then((res) => {
				this.info = {
					...this.info,
					...res.data,
					arrival_time: [res.data.arrival_start_time, res.data.arrival_end_time]
				};

				this.isSaved = res.data.is_submit == 0;

				// 加载职位下拉数组
				if (this.info.depart_id && this.info.position_id) {
					this.$request({
						url: API_ROOT._HR_DEPART_POSITION_GET,
						type: 'GET',
						loading: false
					}).then((response) => {
						this.positionList = response.data.filter(item => item.depart_id === this.info.depart_id[0])[0].positions;
					}).catch((error) => {});
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChange(value, type) {
			this.info[type] = value;
		},
		// 选中部门发生变化时
		handleDepartChange(value) {
			if (value.length === 0) {
				this.info.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
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
					url: API_ROOT['_HR_FORM_DIMISSION_TALK_POST'],
					type: "POST",
					param: {
						scenario: 5,
						type: 1,
						...this.info,
						...this.$route.query
					}
				}).then(res => { // eslint-disable-line
					this.$Message.success('保存成功!');
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

<style lang="scss">
.v-hr-form-dimission-talk {
	padding: 20px 20px 60px 20px;
	._form {
		padding: 20px !important;
		max-width: 1000px !important;
		width: 100% !important;
		box-shadow: content-box;
		.__title {
			margin-left: 0 !important;
		}
	}
}
</style>
