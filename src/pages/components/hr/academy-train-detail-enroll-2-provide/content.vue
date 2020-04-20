<template>
	<div class="v-academy-train-detail-renroll-provide">
		<oa-provide-qcrode 
			v-if="!showNextStep && url" 
			:url="url" 
			:relation_id="relation_id"
			:activity_type="4"
			:activity_id="$route.query.apply_id"
		/>
		<i-form 
			ref="formValidate"
			:model="formValidate" 
			:rules="ruleValidate"
			:label-width="100"
		>
			<div class="_setting">
				<oa-title class="_title g-m-b-20">发放设置</oa-title>
				<i-form-item 
					label="报名时间段：" 
					prop="enrollTime"
					style="margin-top: 12px">
					<i-data-picker 
						v-model="formValidate.enrollTime"
						:options="enrollOptions"
						format="yyyy-MM-dd HH:mm"
						type="datetimerange"
						split-panels
						transfer
						separator=" 至 "
						style="width: 300px"
						placeholder="请选择报名时间"/>
				</i-form-item>

				<i-form-item label="验证报名信息：" prop="verify_items" style="margin-top: -10px">
					<i-checkbox-group v-model="formValidate.verify_items">
						<i-checkbox 
							v-for="(item, i) in verifyRule" 
							:label="i + 1"
							:key="i"
							:disabled="i < 2"
							class="__checkbox">{{ item }}
						</i-checkbox>
						<i-checkbox :label="4" class="__checkbox">
							性别
						</i-checkbox>
					</i-checkbox-group>
				</i-form-item>

				<oa-title class="g-m-b-20">报名限制</oa-title>
				<i-form-item 
					label="人数上限：" 
					prop="participator_limit"
					style="margin-top: 12px">
					<i-input-number 
						v-model="formValidate.participator_limit" 
						:min="1"
						:max="999"
						:precision="0"
						clearable
						style="width: 220px"
						placeholder="请填写限制人数"
					/><span class="g-c-black5">（留白表示不限人数）</span>
				</i-form-item>

				<i-form-item label="人员限制：" style="margin-top: -10px">
					<i-radio-group v-model="formValidate.apply_limit">
						<i-radio :label="1" >允许任何人进行报名</i-radio>
						<!-- <i-radio :label="2">仅限"参与人员"进行报名</i-radio> -->
						<i-radio :label="3" style="margin-left: 20px">仅限"公司内部人员"进行报名</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item label="学员可见信息：" prop="show_info" style="margin-top: -10px">
					<i-checkbox-group v-model="formValidate.show_info">
						<i-checkbox :label="1">报名后提示<span class="g-c-black5">（如：提醒学员准时参加）</span></i-checkbox>
						<i-checkbox :label="2" style="margin-left: 5">报名人数</i-checkbox>
						<i-checkbox :label="3" style="margin-left: 25px">报名名单</i-checkbox>
					</i-checkbox-group>
				</i-form-item>

				<i-form-item 
					v-if="formValidate.show_info.includes(1)" 
					label="提示信息：" 
					prop="notice_tips"
					style="margin-top: -10px">
					<oa-limit-words
						v-model="formValidate.notice_tips" 
						:max="50" 
						width="300px"
						placeholder="请输入提示"
					/>
				</i-form-item>

				<oa-title>报名审核</oa-title>
				<i-form-item label="开启报名审核：" style="margin-top: 12px">
					<i-radio-group v-model="formValidate.need_audit">
						<i-radio :label="0" >否</i-radio>
						<i-radio :label="1">是<span class="g-c-black5">（学员报名后，需要进行人工审核，通过审核后才能参加课程学习）</span></i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item 
					v-if="formValidate.need_audit"
					:label-width="110" 
					label="学员填写推荐人："
					style="margin: -15px 0 0 100px; padding: 0 0 0 10px; width: 380px;height: 36px; line-height: 36px"
					class="g-bg-gray-dark">
					<i-radio-group v-model="formValidate.need_referee">
						<i-radio :label="0" >否</i-radio>
						<i-radio :label="1">是</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>
			
		</i-form>

		<div class="_footer" style=" background-color: #fff">
			<i-button 
				type="primary"
				style="margin-right: 300px;" 
				@click="handleSubmit">{{ showNextStep ? '下一步' : '保存' }}</i-button>
		</div>
	</div>
</template>

<script>
import oaTitle from '@components/hr/academy-train-detail/_common/title';
import { Form, FormItem, DatePicker, RadioGroup, Radio, CheckboxGroup, Checkbox, Button, InputNumber } from 'iview';
import { Copy } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import moment from "moment";
import provideQcrode from '@components/hr/academy-train-detail/_common/provide-qcode';

export default {
	name: 'oa-tpl',
	components: {
		'oa-title': oaTitle,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-data-picker': DatePicker,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-button': Button,
		'i-input-number': InputNumber,
		'vc-copy': Copy,
		'oa-provide-qcrode': provideQcrode,
	},
	data() {
		const validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择报名时间');
			} else {
				callback();
			}
		};
		this.enrollOptions = {
			disabledDate(date) {
				return date && date.valueOf() < Date.now() - 86400000;
			}
		};
		this.verifyRule = ['姓名', '手机号码']; 
		return {
			url: '',
			relation_id: [],
			showNextStep: true,
			formValidate: {
				enrollTime: [],
				verify_items: [1, 2],
				participator_limit: null,
				apply_limit: 1,
				show_info: [2],
				need_audit: 1,
				need_referee: 1,
				notice_tips: ''
			},
			ruleValidate: {
				enrollTime: [{ validator: validateCreatedTime, trigger: 'change', required: true, }],
				notice_tips: [{ required: true, type: 'string', message: "请输入提示信息", trigger: 'blur' }]
			}
		};
	},
	created() {
		this.handleInit();
	},
	methods: {
		handleSubmit() {
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_ENROLL_PROVIDE_POST,
						param: {
							apply_id: this.$route.query.apply_id,
							...this.formValidate,
							start_time: moment(this.formValidate.enrollTime[0]).format("YYYY-MM-DD HH:mm"),
							end_time: moment(this.formValidate.enrollTime[1]).format("YYYY-MM-DD HH:mm")
						},
						type: 'POST',
						loding: false
					}).then(res => {
						this.handleInit();
						this.$Message.success('保存成功');
					}).catch(res => {
						this.$Message.error(res.msg);
					});
				}
			});
		},
		handleInit() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_ENROLL_2_ENROLL_DETAIL_GET,
				param: {
					apply_id: this.$route.query.apply_id,
				},
				loading: false,
				type: "GET"
			}).then(({ data }) => {
				// 已安排的直接显示第二步
				if (data.start_time) {
					this.formValidate = {
						...data,
						participator_limit: (+data.participator_limit) || null,
						enrollTime: [data.start_time, data.end_time],
						show_info: data.show_info.map(Number),
						verify_items: data.verify_items.map(Number)
					};
					this.showNextStep = false;
					this.url = data.url;
					this.relation_id = data.relation_id;
				}
			});
		}
	},
};
</script>

<style lang="scss">
.v-academy-train-detail-renroll-provide {
	.ivu-form-item-label {
		color: #4B4F57
	}
	padding: 20px 0 70px 30px;
	.__checkbox {
		margin-right: 40px
	}
	._footer {
		position: fixed;
		bottom: 0;
		height: 40px;
		line-height: 40px;
		text-align: center;
		margin-left: -30px;
		width: 100%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>
