<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="课程主题"
		width="500px"
		class="v-collage-course-topic-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-12 g-c-black2">
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:label-width="100"
				class="g-m-t-15"
				@submit.native.prevent>
				<div 
					v-for="(item, i) in formValidate.list"
					:key="i"
					class="g-pd-b-5 g-relative">
					<i-form-item
						:prop="'list.' + i + '.subject_name' "
						:rules="{ required: true, message: '请填写课程主题', trigger: 'blur' }"
						label="课程主题：">
						<i-input 
							v-model="formValidate.list[i].subject_name"
							:maxlength="15"
							clearable
							style="width: 300px"
							placeholder="请填写课程主题"
						/>
					</i-form-item>

					<i-form-item
						v-if="online"
						:prop="'list.' + i + '.lecture_time' "
						:rules="{ required: true, type: 'date', message: '请填写讲课时间', trigger: 'change', }"
						label="讲课时间：">
						<i-data-picker
							:options="options"
							v-model="formValidate.list[i].lecture_time"
							format="yyyy-MM-dd HH:mm"
							type="datetime"
							clearable
							transfer
							separator=" 至 "
							style="width: 300px"
							placeholder="请填写讲课时间"
						/>
					</i-form-item>

					<i-form-item
						v-if="!online"
						:prop="'list.' + i + '.lecture_time' "
						:rules="{ required: true, type: 'array', message: '请填写讲课时间', trigger: 'change', validator: validateCreatedTime }"
						label="讲课时间：">
						<i-data-picker
							:options="options"
							v-model="formValidate.list[i].lecture_time"
							type="datetimerange" 
							format="yyyy-MM-dd HH:mm"
							clearable
							transfer
							style="width: 300px"
							placeholder="请填写讲课时间"
						/>
					</i-form-item>

					<span 
						class="__operate">
						<i 
							v-if="canAdd"
							:class="['g-c-blue-mid', 'g-fs-18', 'g-pointer']"
							class="icon iconfont iconfont icon-add1 g-c-blue-mid g-fs-18"
							@click="handleAddCourse"
						/>
						<i 
							v-if="canRemove"
							:class="['g-c-red-light', 'g-fs-18', 'g-pointer']"
							class="icon iconfont icon-remove-circle g-c-red-light"
							@click="handleRemoveCourse(i)"
						/>
					</span>
				</div>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Input, DatePicker } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';

export default {
	name: "oa-hr-train-elite-related-subject",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-data-picker': DatePicker,
	},
	props: {
		record_id: {
			type: Number | String,
			required: true
		},
		online: {
			type: Boolean,
			default: true // 默认是线上  线上时间点 线下时间段
		},
		subject: {
			required: true,
			type: Array
		}
	},
	data() {
		this.validateCreatedTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择对接时间');
			} else {
				callback();
			}
		};
		this.options = {
			disabledDate(date) {
				// return date && date.valueOf() > Date.now() - 86400000;
				return date && date.valueOf() > Date.now();
			}
		};
		return {
			visible: false,
			formValidate: {
				list: this.subject.length ? [...this.subject] : (
					this.online
						? [{ subject_name: '', lecture_time: '' }]
						: [{ subject_name: '', lecture_time: [[null, null]] }]
				)
			}
		};
	},
	computed: {
		canRemove() {
			return this.formValidate.list.length > 1;
		},
		canAdd() {
			return this.formValidate.list.length < 10;
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formValidate.validateAndScroll(valid => {
				if (valid) {
					this.$emit('sure', this.formValidate.list);
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
			this.canAdd && this.formValidate.list.push({
				name: '',
				lecture_time: this.online 
					? ''
					: [null, null]
			});
		},
		handleRemoveCourse(i) {
			this.canRemove && this.formValidate.list.splice(i, 1);
		}
	}
};
export const CourseTopicEditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-course-topic-modal {
    .ivu-modal-body {
        max-height: 300px;
        overflow: auto;
    }
    .__operate {
        position: absolute;
        top: 30px;
        left: 410px;
    }
}
</style>

