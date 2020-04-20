<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="420px" 
		class="v-collage-service-record-audit"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>审核</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="120"
			@submit.native.prevent
		>
			<div class="g-fs-12 g-c-black3 g-tc g-m-b-20">
				{{ data.staff_name }}（{{ data.role_name }}）
			</div>
			<i-form-item 
				v-if="data.role_type === 2" 
				label="入职时间："
			>
				<span>{{ data.entry_date ||'--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="data.role_type === 1" 
				label="客户职位：" 
				prop="position"
			>
				<i-select
					v-model="formData.position"
					clearable
					transfer
					style="width:220px;height: 32px"
					placeholder="请选择客户职位"
				>
					<i-option :value="1">老板</i-option>
					<i-option :value="2">操盘手</i-option>
					<i-option :value="3">商学院院长</i-option>
					<i-option :value="4">董事长</i-option>
					<i-option :value="5">团队长</i-option>
					<i-option :value="6">市场总监</i-option>
					<i-option :value="7">创始人</i-option>
					<i-option :value="8">助理</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				v-if="lessonType === 2" 
				required
				label="课程类型："
			>
				<span>{{ lectureSetName || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="lessonType === 1" 
				required
				label="套系名称："
			>
				<span>{{ lectureSetName || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="data.role_type === 2" 
				label="累计学习数："
			>
				<span v-if="data.learning_times !== undefined" class="g-c-red-mid">
					{{ data.learning_times }}次
				</span>
				<span v-else>--</span>
			</i-form-item>
			<div v-if="data.role_type === 4">
				<div 
					v-for="(item, index) in formData.subject" 
					:key="index"
				>
					<i-form-item 
						:prop="'subject.'+index+'.subject_name'" 
						:rules="rules.subject_name" 
						label="课程主题："
						class="_icon-btn"
					>
						<i-input 
							v-model="item.subject_name"
							:maxlength="15"
							clearable
							style="height: 32px;width: 220px"
							placeholder="请输入主题"
						/>
						<i 
							v-if="formData.subject.length > 1 || index !== 0"
							class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleDelItem('subject', index)"
						/>
						<i 
							v-if="index === formData.subject.length - 1 && formData.subject.length < 10"
							class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleAddItem('subject')"
						/>
					</i-form-item>
					<i-form-item 
						:prop="'subject.'+index+'.lecture_time'" 
						:rules="rules.lecture_time" 
						label="讲课时间："
					>
						<i-date-picker
							v-model="item.lecture_time"
							:type="lessonType === 1 ? 'datetime' : 'datetimerange'"
							:split-panels="lessonType === 1 ? false : true"
							:editable="false"
							format="yyyy-MM-dd HH:mm"
							clearable
							transfer
							placeholder="请选择讲课时间"
							style="width:220px;height: 32px"
							@on-change="handleLectureTimeChange"
						/>
					</i-form-item>
				</div>
			</div>
			<i-form-item 
				v-if="data.role_type === 4 && lessonType === 1" 
				label="课时数："
			>
				<span v-if="formData.subject.length">{{ formData.subject.length }}节</span>
				<span v-else>--</span>
			</i-form-item>
			<i-form-item 
				v-if="data.role_type === 4 && lessonType === 2" 
				label="讲课总时长："
			>
				<span>{{ formData.total_duration }}分钟</span>
			</i-form-item>
			<i-form-item 
				v-if="data.role_type === 2" 
				label="本次是否计数：" 
				prop="is_count"
			>
				<i-radio-group v-model="formData.is_count">
					<i-radio label="1">是</i-radio>
					<i-radio label="0">否</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item 
				v-if="data.role_type === 2" 
				label="师傅："
			>
				<span>{{ data.master_name || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="[1, 2].includes(data.role_type)" 
				label="对接时间：" 
				prop="docking_time"
			>
				<i-date-picker
					v-model="formData.docking_time"
					format="yyyy-MM-dd"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择对接时间"
					style="width:220px;height: 32px"
				/>
			</i-form-item>
			<div v-if="lessonType === 2 && data.role_type === 3">
				<div 
					v-for="(host, h) in formData.hosting_time" 
					:key="h"
				>
					<i-form-item 
						:prop="'hosting_time.' + h + '.time'" 
						:rules="rules.hosting_time"
						label="主持时间："
						class="_icon-btn"
					>
						<i-date-picker
							v-model="host.time"
							format="yyyy-MM-dd"
							type="daterange"
							clearable
							transfer
							split-panels
							placeholder="请选择主持时间"
							style="width:220px;height: 32px"
							@on-change="handleHostingTimeChange"
						/>
						<i 
							v-if="formData.hosting_time.length > 1 || h !== 0"
							class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleDelItem('hosting_time', h)"
						/>
						<i 
							v-if="h === formData.hosting_time.length - 1"
							class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleAddItem('hosting_time')"
						/>
					</i-form-item>
				</div>
			</div>
			<i-form-item 
				v-if="lessonType === 2 && data.role_type === 3" 
				label="主持天数："
			>
				<span>{{ formData.hosting_day }}</span>
			</i-form-item>
			<i-form-item 
				v-if="lessonType === 2 && data.role_type === 3" 
				label="主持人数："
			>
				<span v-if="data.staff_num">{{ data.staff_num }}人</span>
				<span v-else>--</span>
			</i-form-item>
			<div v-if="lessonType === 2 && data.role_type === 5">
				<div 
					v-for="(sing, s) in formData.singing_time" 
					:key="s"
				>
					<i-form-item 
						:prop="'singing_time.' + s + '.time'" 
						:rules="rules.singing_time"
						label="唱单时间："
						class="_icon-btn"
					>
						<i-date-picker
							v-model="sing.time"
							format="yyyy-MM-dd"
							type="daterange"
							clearable
							transfer
							split-panels
							placeholder="请选择唱单时间"
							style="width:220px;height: 32px"
						/>
						<i 
							v-if="formData.singing_time.length > 1 || s !== 0"
							class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleDelItem('singing_time', s)"
						/>
						<i 
							v-if="s === formData.singing_time.length - 1"
							class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleAddItem('singing_time')"
						/>
					</i-form-item>
				</div>
			</div>
			<div v-if="lessonType === 2 && data.role_type === 6">
				<div 
					v-for="(voice, v) in formData.voice_time" 
					:key="v"
				>
					<i-form-item 
						:prop="'voice_time.' + v + '.time'" 
						:rules="rules.voice_time"
						label="音控时间："
						class="_icon-btn"
					>
						<i-date-picker
							v-model="voice.time"
							format="yyyy-MM-dd"
							type="daterange"
							clearable
							transfer
							split-panels
							placeholder="请选择音控时间"
							style="width:220px;height: 32px"
						/>
						<i 
							v-if="formData.voice_time.length > 1 || v !== 0"
							class="icon iconfont icon-remove-circle g-c-red-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleDelItem('voice_time', v)"
						/>
						<i 
							v-if="v === formData.voice_time.length - 1"
							class="icon iconfont icon-add1 g-c-blue-mid g-pointer g-fs-16 g-m-l-5"
							@click="handleAddItem('voice_time')"
						/>
					</i-form-item>
				</div>
			</div>
			<i-form-item 
				v-if="lessonType === 2" 
				label="是否出差：" 
				prop="is_business"
			>
				<i-radio-group v-model="formData.is_business">
					<i-radio label="1">是</i-radio>
					<i-radio label="0">否</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item 
				v-if="lessonType === 2 && formData.is_business === '1'" 
				label="出差天数：" 
				prop="business_day"
			>
				<i-input-number
					v-model="formData.business_day"
					:min="0"
					:max="99"
					:precision="0"
					clearable
					placeholder="请输入天数"
					style="width:80px;height: 32px"
				/>
				<span>天</span>
			</i-form-item>
			<i-form-item label="备注：">
				<oa-limit-words 
					v-model="formData.remark"
					placeholder="请输入备注"
					clearable
					style="width:220px"
				/>
			</i-form-item>
			<i-form-item label="审核结果：" prop="audit_status">
				<i-select
					v-model="formData.audit_status"
					clearable
					transfer
					style="width:220px;height: 32px"
					placeholder="请选择审核结果"
				>
					<i-option value="1">通过</i-option>
					<i-option value="2">驳回</i-option>
				</i-select>
			</i-form-item>
			<i-form-item 
				v-if="formData.audit_status === '2'" 
				label="驳回理由：" 
				prop="audit_remark"
			>
				<oa-limit-words 
					v-model="formData.audit_remark"
					placeholder="请输入驳回理由"
					clearable
					style="width:220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Input, InputNumber, RadioGroup, Radio, DatePicker, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-service-record-audit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		productName: String,
		lessonType: [String, Number],
		lectureSetName: String,
		customerPosition: [String, Number],
		data: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			visible: false,
			formData: {// 表单
				position: +this.data.field.position || +this.customerPosition || '',
				docking_time: (this.data.field.docking_time && JSON.parse(this.data.field.docking_time)) || [],
				hosting_time: ((this.data.field.hosting_time && JSON.parse(this.data.field.hosting_time)) || [[]]).map(it => ({ time: it })),
				singing_time: ((this.data.field.singing_time && JSON.parse(this.data.field.singing_time)) || [[]]).map(it => ({ time: it })),
				voice_time: ((this.data.field.voice_time && JSON.parse(this.data.field.voice_time)) || [[]]).map(it => ({ time: it })),
				hosting_day: +this.data.field.hosting_day || 0,
				is_count: this.data.field.is_count || '1',
				is_business: this.data.field.is_business || '1',
				business_day: +this.data.field.business_day || null,
				total_duration: +this.data.field.total_duration || 0,
				audit_status: '1',
				remark: this.data.remark || '',
				audit_remark: '',
				subject: (this.data.subject.length && this.data.subject.map(it => ({
					subject_name: it.subject_name,
					lecture_time: this.lessonType === 1 ? it.lecture_time : JSON.parse(it.lecture_time)
				}))) || [{ subject_name: '', lecture_time: this.lessonType === 1 ? '' : [] }]
			},
			rules: {// 表单验证
				position: [{ required: true, type: 'number', message: '请选择客户职位', trigger: "change" }],
				subject_name: [{ required: true, message: '请输入课程主题', trigger: "blur" }],
				docking_time: [{ required: true, validator: this.validateTime, message: '请选择对接时间', trigger: "change" }],
				hosting_time: [{ required: true, validator: this.validateTime, message: '请选择主持时间', trigger: "change" }],
				lecture_time: [{ required: true, validator: this.validateTime, message: '请选择讲课时间', trigger: "change" }],
				singing_time: [{ required: true, validator: this.validateTime, message: '请选择唱单时间', trigger: "change" }],
				voice_time: [{ required: true, validator: this.validateTime, message: '请选择音控时间', trigger: "change" }],
				is_count: [{ required: true, message: '请选择本次是否计数', trigger: "change" }],
				is_business: [{ required: true, message: '请选择是否出差', trigger: "change" }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: "change" }],
				audit_status: [{ required: true, message: '请选择审核结果', trigger: "change" }],
				audit_remark: [{ required: true, message: '请输入驳回理由', trigger: "blur" }],
			},
		};
	},
	watch: {
		'formData.subject': function (val) {
			this.handleLectureTimeChange(val);
		},
		'formData.hosting_time': function (val) {
			if (!val[val.length - 1].time[0] && !val[val.length - 1].time[1]) return;
			this.handleHostingTimeChange();
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					let param = {
						record_id: this.data.record_id,
						lesson_type: this.lessonType,
						remark: this.formData.remark,
						audit_status: this.formData.audit_status,
						...(this.formData.audit_status === '2' ? ({ audit_remark: this.formData.audit_remark }) : null)
					};

					const roleParam = {
						1: {
							position: this.formData.position,
							docking_time: this.formatDate(this.formData.docking_time, 'date')
						},
						2: {
							is_count: this.formData.is_count,
							docking_time: this.formatDate(this.formData.docking_time, 'date')
						},
						4: {
							subject: this.formData.subject.map(it => {
								return { 
									subject_name: it.subject_name, 
									lecture_time: this.formatDate(it.lecture_time, 'datetime')
								};
							}),
							subject_num: this.formData.subject.length
						}
					};

					if (this.lessonType === 1) {
						switch (this.data.role_type) {
							case 1: 
								param = {
									...param,
									...roleParam[1]
								};
								break;
							case 2:
								param = {
									...param,
									...roleParam[2]
								};
								break;
							case 4:
								param = {
									...param,
									...roleParam[4],
									class_hours_times: this.formData.subject.length
								};
								break;
							default:
								param = { ...param };
								break;
						}
					} else {
						let temp = {
							is_business: this.formData.is_business,
							business_day: this.formData.business_day
						};
						switch (this.data.role_type) {
							case 1:
								param = { 
									...param,
									...roleParam[1],
									...temp,
								};
								break;
							case 2:
								param = { 
									...param,
									...roleParam[2],
									...temp
								};
								break;
							case 3:
								param = {
									...param,
									...temp,
									hosting_day: this.formData.hosting_day,
									hosting_time: this.handleTimeparam('hosting_time')
								};
								break;
							case 4:
								param = {
									...param,
									...roleParam[4],
									...temp,
									total_duration: this.formData.total_duration
								};
								break;
							case 5:
								param = {
									...param,
									...temp,
									singing_time: this.handleTimeparam('singing_time')
								};
								break;
							case 6:
								param = {
									...param,
									...temp,
									voice_time: this.handleTimeparam('voice_time')
								};
								break;
							default:
								break;
						}
					}

					this.$request({
						url: '_COLLAGE_BUSINESS_RECORD_AUDIT_POST',
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		formatDate(date, str) {
			if (Array.isArray(date)) {
				if (str === 'date') {
					return JSON.stringify([moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')]);
				} else {
					return JSON.stringify([moment(date[0]).format('YYYY-MM-DD HH:mm'), moment(date[1]).format('YYYY-MM-DD HH:mm')]);
				}
			} else {
				return str === 'date' ? moment(date).format('YYYY-MM-DD') : moment(date).format('YYYY-MM-DD HH:mm');
			}
		},
		handleTimeparam(name) {
			let param;
			let list = JSON.parse(JSON.stringify(this.formData[name]));
			list.forEach(item => {
				item.time = JSON.parse(this.formatDate(item.time, 'date'));
			});
			param = JSON.stringify(list.map(it => it.time));
			return param;
		},
		handleLectureTimeChange(value) {
			if (Array.isArray(value)) {
				this.formData.total_duration = this.formData.subject.reduce((init, cur) => {
					const [startTime, endTime] = cur.lecture_time;
					const diffTime = (moment(endTime).diff(moment(startTime), 'minute') + 1) || 0;
					return init + diffTime;
				}, 0);
			}
		},
		handleHostingTimeChange() {
			this.formData.hosting_day = this.formData.hosting_time.reduce((init, cur) => {
				const [startTime, endTime] = cur.time;
				const diffDay = (moment(endTime).diff(moment(startTime), 'day') + 1) || 0;
				return init + diffDay;
			}, 0);
		},
		handleAddItem(name) {
			if (name === 'subject') {
				this.formData[name].push({
					subject_name: '',
					lecture_time: this.lessonType === 1 ? '' : []
				});
			} else {
				this.formData[name].push({
					time: []
				});
			}
		},
		handleDelItem(name, index) {
			this.formData[name].splice(index, 1);
		},
		validateTime(rule, value, callback) {
			if (Array.isArray(value)) {
				if (value[0] === '' && value[1] === '') {
					callback(new Error());
				} else {
					callback();
				}
			} else if (value === '') {
				callback(new Error());
			} else {
				callback();
			}
		},
	}
};

export const ServiceRecordAudit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-collage-service-record-audit {
	._icon-btn {
		.ivu-form-item-content {
			display: flex;
			align-items: center;
		}
	}
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-radio-group {
		margin-left: 10px;
	}
	.ivu-radio-wrapper:first-child {
		width: 100px;
		margin-right: 15px;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>

