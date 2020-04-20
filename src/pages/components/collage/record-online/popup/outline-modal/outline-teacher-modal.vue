<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="录单审核"
		width="500px"
		class="v-collage-outline-teacher-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100"
				@submit.native.prevent>
				<div class="g-tc">
					{{ detailData.staff_name }}（{{ ROLE_ENUM[detailData.role_type] }}）
				</div>

				<i-form-item
					label="课程类型："
					style="margin: 15px 0 5px 0!important"
				>
					<span>{{ detailData.lecture_set_name }}</span>
				</i-form-item>

				<div 
					v-for="(item, i) in formValidate.subject"
					:key="i"
					class="g-relative">
					<i-form-item
						:prop="'subject.' + i + '.subject_name' "
						:rules="{ required: true, message: '请填写课程主题', trigger: 'blur' }"
						label="课程主题：">
						<i-input 
							v-model="formValidate.subject[i].subject_name"
							:maxlength="15"
							clearable
							style="width: 300px"
							placeholder="请填写课程主题"
						/>
					</i-form-item>

					<i-form-item
						:prop="'subject.' + i + '.lecture_time' "
						:rules="{ required: true, type: 'date', message: '请填写讲课时间', trigger: 'change', validator: validateCreatedTime }"
						label="讲课时间：">
						<i-data-picker
							v-model="formValidate.subject[i].lecture_time"
							:options="option"
							format="yyyy-MM-dd HH:mm"
							type="datetimerange" 
							clearable
							transfer
							style="width: 300px"
							separator=" 至 "
							placeholder="请填写讲课时间"
						/>
					</i-form-item>

					<oa-operate-item 
						:can-add="canAdd"
						:can-remove="canRemove"
						:handle-add="handleAddCourse"
						:handle-remove="() => handleRemoveCourse(i)"/>
				</div>

				<i-form-item
					label="讲课总时长："
					style="margin-top: -10px"
				>
					<span>{{ teacherTime }}</span>
				</i-form-item>

				<i-form-item 
					label="是否出差："
					style="margin: -20px 0"
					prop="is_business">
					<i-radio-group v-model="formValidate.is_business">
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-form-item>

				<i-form-item 
					v-if="formValidate.is_business"
					prop="business_day" 
					label="出差天数：" 
					style="margin: -10px 0"
				>
					<i-input-number
						v-model="formValidate.business_day" 
						:min="1"
						:precision="0"
						:max="9"
						clearable
						style="width: 300px"
						placeholder="请输入可参与抽奖的人数"
					/>
					<span 
						class="g-c-black2 g-absolute __tip">天</span>
				</i-form-item>


				<i-form-item 
					:style="{ marginTop: formValidate.is_business ? '0' : '-10px'}"
					label="备注："
					prop="remark">
					<oa-limit-words
						v-model="formValidate.remark" 
						:max="200" 
						width="300px"
						placeholder="请输入备注"
					/>
				</i-form-item>

				<i-form-item
					label="审核结果："
					prop="audit_status"
				>
					<i-select
						v-model="formValidate.audit_status"
						clearable
						transfer
						style="width: 300px"
						placeholder="请选择审核结果"
					>
						<i-option :value="1">通过</i-option>
						<i-option :value="2">驳回</i-option>
					</i-select>
				</i-form-item>

				<i-form-item 
					v-if="formValidate.audit_status === 2"
					label="驳回理由："
					class="g-pd-b-20"
					prop="audit_remark">
					<oa-limit-words
						v-model="formValidate.audit_remark" 
						:max="200" 
						width="300px"
						placeholder="请输入驳回理由"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Input, DatePicker,
	Select, Option, RadioGroup, Radio, InputNumber } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import OperateItem from '../../components/operate-item';
import { ROLE_ENUM } from "../../components/constants";


export default {
	name: "oa-hr-collage-online-teacher-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-data-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-operate-item': OperateItem
	},
	props: {
		detailData: {
			type: Object,
			required: true
		},
	},
	data() {
		this.option = {
			disabledDate(date) {
				return date && date.valueOf() < Date.now() - 86400000;
			}
		};

		this.validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
		return {
			ROLE_ENUM,
			visible: false,
			formValidate: {
				remark: '',
				is_business: +this.detailData.is_business,
				business_day: +this.detailData.business_day,
				audit_status: '',
				subject: [],
				audit_remark: ''
			},
			ruleValidate: {
				is_business: [{ required: true, type: 'number', message: '请输入是否出差', trigger: 'blur' }],
				business_day: [{ required: true, type: 'number', message: '请输入出差天数', trigger: 'blur' }],
				audit_remark: [{ required: true, message: '请输入驳回理由', trigger: 'blur' }],
				audit_status: [{ required: true, type: 'number', message: '请选择审核结果', trigger: 'change' }]	
			}
		};
	},
	computed: {
		canRemove() {
			return this.formValidate.subject.length > 1;
		},
		canAdd() {
			return this.formValidate.subject.length < 10;
		},
		teacherTime() {
			const teacherMinutes = this.formValidate.subject.reduce(
				(init, cur) => {
					const [startTime, endTime] = cur.lecture_time;
					const diffMinute = moment(endTime).diff(moment(startTime), 'minute') || 0;
					return init + diffMinute;
				},
				0
			);
			const hour = parseInt((teacherMinutes) / 60, 10);
			const minute = teacherMinutes % 60;
			return `${hour}时${minute}分`;
		}
	},
	created() {
		this.loadSubjectData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					this.$request({
						url: API_ROOT._COLLEAGE_RECORD_LESSON_RECORD_AUDIT_POST,
						type: "POST",
						param: {
							record_id: this.detailData.record_id,
							lesson_type: this.detailData.lesson_type,
							...this.formValidate,
							total_duration: this.handleTotalDuration(this.formValidate.subject),
							subject: this.handleParseTime(this.formValidate.subject),
							subject_num: this.formValidate.subject.length
						}
					}).then((res) => {
						this.$emit("sure");
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				} else {
					this.visible = true;
				}
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleAddCourse() {
			this.canAdd && this.formValidate.subject.push({
				subject_name: '',
				lecture_time: [null, null]
			});
		},
		handleRemoveCourse(i) {
			this.canRemove && this.formValidate.subject.splice(i, 1);
		},
		loadSubjectData() {
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_SUBJECT_GET,
				param: {
					record_id: this.detailData.record_id
				},
				type: "GET"
			}).then(({ data }) => {
				this.formValidate.subject = data.map(v => ({ ...v, lecture_time: JSON.parse(v.lecture_time) }));
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleParseTime(time) {
			return time.map(v => ({
				...v,
				lecture_time: JSON.stringify([
					moment(v.lecture_time[0]).format('YYYY-MM-DD HH:mm'),
					moment(v.lecture_time[1]).format('YYYY-MM-DD HH:mm')
				])
			}));
		},
		handleTotalDuration(subject) {
			return subject.reduce(
				(init, cur) => {
					const [startTime, endTime] = cur.lecture_time;
					const diffMinute = (moment(endTime).diff(moment(startTime), 'minute')) || 0;
					return init + diffMinute;
				},
				0
			);
		},
	}
};
export const OutlineTeacherModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-outline-teacher-modal {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
    .ivu-input-number-handler-wrap {
		display: none;
	}
    .__tip {
        top: 3px;
		left: 276px;
		width: 22px;
		height: 20px;
		background: #fff;
	}
}
</style>

