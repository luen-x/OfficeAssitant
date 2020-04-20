<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-recruit-school-tip-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<i-form 
				v-if="name == '5'" 
				ref="formdata" 
				:model="formdata" 
				:rules="formdataRule" 
				:label-width="100"
				class="g-m-t-20 g-pd-l-30">
				<i-form-item label="招聘会时间：" prop="time">
					<i-datepicker
						v-model="formdata.time"
						transfer
						format="yyyy-MM-dd HH:mm"
						type="datetimerange"
						style="width: 220px"
						placeholder="请输入招聘会时间"
						separator=" 至 "
					/>
				</i-form-item>
			</i-form>
			<div v-if="content" class="_content">
				{{ content }}
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Message, DatePicker } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';

export default {
	name: 'hr-recruit-school-tip-modal',
	components: {
		'i-modal': Modal,
		'i-datepicker': DatePicker,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-date-picker': DatePicker,
	},
	props: {
		meeting_id: Number,
		title: String,
		content: String,
		name: String,
		wait: {
			type: Boolean,
			default: false
		},
		mettingTime: {
			type: Array
		}
	},
	data() {
		const validateTime = (rule, value, callback) => {
			if (!value[0] && !value[1]) {
				callback('请选择开始时间');
			} else {
				callback();
			}
		};
		return {
			visible: false,
			formdata: {
				time: this.mettingTime
			},
			formdataRule: {
				time: [{
					type: 'array',
					required: true,
					validator: validateTime,
					trigger: 'change'
				}]
			}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			if (this.name !== '6') {
				let status = 0;
				if (this.name == '3') {
					status = 0;
				} else if (this.name == '2') {
					status = 1;
				} else if (this.name == '5') {
					status = 2;
				} else if (this.name == '4') {
					status = 3;
				}
				let obj = {};
				obj.meeting_id = this.meeting_id;
				obj.status = status;
				if (this.mettingTime) {
					obj.meeting_time = this.formdata.time;
				}
				this.$refs.modal.buttonLoading = false;
				if (this.$refs.formdata) {
					this.$refs.formdata.validate(valid => {
						if (valid) {
							this.handleSave(obj);
						} else {
							this.visible = true;
						}
					});
				} else {
					this.handleSave(obj);
				}
			} else {
				this.$request({
					url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_DELETE_POST'], // eslint-disable-line
					type: "POST",
					param: {
						meeting_id: this.meeting_id
					}
				}).then((res) => {
					Message.success('删除成功');
					this.visible = false;
					this.$emit('sure');
					app.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT', { type: '' });
				}).catch((error) => {
					Message.error(error.msg);
					this.$refs.modal.buttonLoading = false;
				});
			}
		},
		handleSave(obj) {
			this.$request({
					url: API_ROOT['_HR_RECRUIT_SCHOOL_JOBFAIR_STATUS_POST'], // eslint-disable-line
				type: "POST",
				param: obj
			}).then((res) => {
				Message.success('变更成功');
				this.visible = false;
				this.$emit('sure');
				app.$store.commit('HR_RECRUIT_SCHOOL_JOBFAIR_LIST_INIT', { type: '' });
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const TipConfirmModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-recruit-school-tip-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		height: 100px;
		padding: 40px;
		color: #333333;
		font-size: 14px;
	}
}
</style>