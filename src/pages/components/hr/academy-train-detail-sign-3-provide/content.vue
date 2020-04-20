<template>
	<div class="v-hr-academy-train-detial-sign-provide g-m-l-20">
		<oa-provide-qcrode 
			v-if="!showNextStep && url" 
			:url="url" 
			:relation_id="relation_id"
			:activity_type="1"
			:activity_id="$route.query.sign_id"
			class="g-m-t-30"/>
		<oa-title class="g-m-b-20 g-m-t-5">
			<template slot="title">
				发放设置
			</template>
		</oa-title>
		<i-form 
			ref="form"
			:model="formData" 
			:rules="formRule"
			:label-width="115"
		>
			<div class="g-m-l-10 g-m-b-20">
				<i-form-item 
					label="开场签到："
					prop="in_time"
					class="g-pd-b-10">
					<i-date-picker
						v-model="formData.in_time"
						:options="options"
						type="datetimerange"
						format="yyyy-MM-dd HH:mm"
						split-panels
						separator=" 至 "
						clearable
						transfer
						placeholder="选择签到时间"
						style="width: 220px;"
						class="g-m-r-5"
					/>
				</i-form-item>
				<i-form-item 
					label="离场签退："
					prop="back_time">
					<i-date-picker
						v-model="formData.back_time"
						:options="options"
						type="datetimerange"
						format="yyyy-MM-dd HH:mm"
						split-panels
						separator=" 至 "
						clearable
						transfer
						placeholder="选择签退时间"
						style="width: 220px;"
						class="g-m-r-5"
					/>
				</i-form-item>
				<i-form-item 
					label="人员名单信息："
					prop="enrollTime">
					名单中已有<span class="g-c-red-light">{{ participator_num }}</span>位学员，你还可以去
					人员名单中<span class="g-pointer g-c-blue-light" @click="handleToAdd">继续添加</span>
				</i-form-item>
				<i-form-item 
					label="限定人员签到："
					prop="sign_limit">
					<i-radio-group v-model="formData.sign_limit">
						<i-radio :label="2" >限"参与人员"进行签到</i-radio>
						<i-radio :label="3">限"公司内部人员"进行签到</i-radio>
						<i-radio :label="1" style="margin-left: 20px;">允许任何人进行签到</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item 
					label="验证签到信息："
				>
					<i-checkbox-group v-model="formData.verify_items">
						<i-checkbox :label="1" disabled class="g-m-r-20">
							姓名
						</i-checkbox>
						<i-checkbox :label="2" disabled class="g-m-r-20">
							手机号码
						</i-checkbox>
						<!-- <i-checkbox :label="3" class="g-m-r-20">
							<span>部门</span>
						</i-checkbox> -->
						<i-checkbox :label="4" class="g-m-r-20">
							<span>性别</span>
						</i-checkbox>
						<!-- <i-checkbox :label="5">
							<span>师傅</span>
						</i-checkbox> -->
					</i-checkbox-group>
				</i-form-item>
			</div>
			<oa-title class="g-m-b-20">
				<template slot="title">
					提示信息
				</template>
			</oa-title>
			<div class="g-m-l-10 g-m-b-20">
				<i-form-item 
					ref="in_notice_tips"
					label="开场签到提示："
					prop="in_notice_tips">
					<i-checkbox-group v-model="formData.in_show_info" @on-change="handleInNotice">
						<i-checkbox :label="1" >提示信息（如：活动安排、课堂纪律等）</i-checkbox>
						<i-checkbox :label="2">学员签到的名次</i-checkbox>
					</i-checkbox-group>
					<oa-limit-words
						v-if="formData.in_show_info.includes(1)"
						v-model="formData.in_notice_tips"
						:max="50"
						style="width: 300px"
						placeholder="请输入开场签到提示"
					/>
				</i-form-item>
				<i-form-item 
					ref="back_notice_tips"
					label="离场签退提示："
					prop="back_notice_tips">
					<i-checkbox-group v-model="formData.back_show_info" @on-change="handleBackNotice">
						<i-checkbox :label="1">提示信息（如：通关考试提醒等）</i-checkbox>
					</i-checkbox-group>
					<oa-limit-words
						v-if="formData.back_show_info.includes(1)"
						v-model="formData.back_notice_tips"
						:max="50"
						style="width: 300px"
						placeholder="请输入离场签退提示"
					/>
				</i-form-item>
			</div>
			<oa-title class="g-m-b-20">
				<template slot="title">
					迟到设置
				</template>
			</oa-title>
			<div class="g-m-l-10 g-m-b-20">
				<i-form-item 
					label="开场签到结束："
					prop="late_time">
					<i-select
						v-model="formData.late_time"
						placeholder="请选择时间"
						clearable
						transfer
						style="width: 120px;"
					>
						<i-option 
							v-for="item of timeList"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
					内算迟到
				</i-form-item>
			</div>
		</i-form>
		<div class="_detail-footer">
			<i-button v-if="url" type="primary" @click="handleSave">保存</i-button>
			<i-button v-else type="primary" @click="handleSave">下一步</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, RadioGroup, 
	Radio, Select, Option, DatePicker, Message, CheckboxGroup, Checkbox, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { cloneDeep } from 'lodash';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';
import provideQcrode from '@components/hr/academy-train-detail/_common/provide-qcode';
import Title from '@components/hr/academy-train-detail/_common/title';
import item from './item';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-radio-group': RadioGroup,
		'i-date-picker': DatePicker,
		'i-radio': Radio,
		'oa-title': Title,
		'oa-provide-qcrode': provideQcrode,
		'i-checkbox-group': CheckboxGroup,
		'i-checkbox': Checkbox,
		'i-button': Button
	},
	mixins: [item],
	data() {
		return {
			options: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
			participator_num: '',
			showNextStep: false,
			url: '',
			course_id: '',
			relation_id: []
		};
	},
	created() {
		this.loadData();
	},
	methods: {
		handleToAdd() {
			this.$router.push(`/hr/academy/train/detail/participate/0/roster?project_id=${this.$route.query.project_id}&course_id=${this.course_id}`);
		},
		handleInNotice(e) {
			if (this.$refs.in_notice_tips && !this.formData.in_show_info.includes(1)) {
				this.$refs.form.validateField("in_notice_tips");
			}
		},
		// 手动触发离场签到提示验证
		handleBackNotice() {
			if (this.$refs.back_notice_tips && !this.formData.back_show_info.includes(1)) {
				this.$refs.form.validateField("back_notice_tips");
			}
		},
		loadData() {
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_SIGN_SEND_DETAIL_GET,
				type: "GET",
				param: {
					project_id: this.$route.query.project_id,
					sign_id: this.$route.query.sign_id
				},
				loading: false,
			}).then(res => {
				this.formData.in_time = [res.data.in_start_time, res.data.in_end_time];
				this.formData.back_time = [res.data.back_start_time, res.data.back_end_time];
				this.formData.verify_items = res.data.verify_items;
				this.formData.verify_items.includes(1) ? '' : this.formData.verify_items.push(1);
				this.formData.verify_items.includes(2) ? '' : this.formData.verify_items.push(2);
				this.formData.sign_limit = res.data.sign_limit || this.formData.sign_limit;
				this.formData.in_show_info = res.data.in_show_info;
				this.formData.in_notice_tips = res.data.in_notice_tips;
				this.formData.back_show_info = res.data.back_show_info;
				this.formData.back_notice_tips = res.data.back_notice_tips;
				this.formData.late_time = res.data.late_time ? res.data.late_time + '' : this.formData.late_time;
				this.url = res.data.url;
				this.participator_num = res.data.participator_num;
				this.relation_id = res.data.sign.relation_id;
				let sign_list = res.data.sign.relation_id.map(v => v.relation_type == 2);
				if (sign_list.length == 1 && sign_list[0]) {
					this.course_id = res.data.sign.relation_id[0].course_id;
				}
			}).catch((res) => {
				// this.$Message.error(res.msg);
			});
		},
		handleSave() {
			this.$refs.form.validateAndScroll((valid) => {
				let obj = {
					sign_id: this.$route.query.sign_id,
					sign_limit: this.formData.sign_limit,
					verify_items: this.formData.verify_items,
					in_show_info: this.formData.in_show_info,
					in_notice_tips: this.formData.in_notice_tips,
					back_show_info: this.formData.back_show_info,
					back_notice_tips: this.formData.back_notice_tips,
					late_time: this.formData.late_time,
					project_id: this.$route.query.project_id,
					in_start_time: moment(this.formData.in_time[0]).format("YYYY-MM-DD HH:mm"),
					in_end_time: moment(this.formData.in_time[1]).format("YYYY-MM-DD HH:mm"),
					back_start_time: moment(this.formData.back_time[0]).format("YYYY-MM-DD HH:mm"),
					back_end_time: moment(this.formData.back_time[1]).format("YYYY-MM-DD HH:mm"),
				};
				if (valid) {
					try {
						this.$request({
							url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_SIGN_SEND_POST, 
							type: "POST",
							param: obj
						}).then((res) => {
							this.$Message.success('保存成功');
							this.loadData();
						}).catch((error) => {
							this.$Message.error(error.msg);
						});
					} catch (error) {
						console.error(error);
					}
				}
			});
		},
	},
};
</script>

<style lang="scss">
.v-hr-academy-train-detial-sign-provide {
	padding-bottom: 100px;
	.ivu-form-item {
		margin-bottom: 10px !important;
	}
	.ivu-checkbox-wrapper {
		margin-right: 40px;
	}
	._detail-footer {
		background-color: #fff;
		position: fixed;
		bottom: 0;
		height: 45px;
		line-height: 45px;
		text-align: center;
		margin-left: -20px;
		width: 85%;
		box-shadow:0px -2px 10px 0px rgba(0, 0, 0, 0.08);
	}
}
</style>
