<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-pass-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				填写培训信息
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem
					prop="is_join_train"
					label="是否参加培训:"
				>
					<i-radio-group
						v-model="formValidate.is_join_train"
						style="width: 220px"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-formitem>
				<i-formitem
					label="通知培训进度:"
				>
					<oa-limit-words
						v-model="formValidate.inform_train_progress"
						:max="50"
						style="width: 220px"
						placeholder="请输入通知培训进度"
					/>
				</i-formitem>
				<div>
					<i-formitem
						:required="!!formValidate.is_join_train"
						prop="try_train_start_time"
						label="试岗培训时间:"
					>
						<i-datepicker
							v-model="formValidate.try_train_start_time"
							:options="options1"
							transfer
							placeholder="请选择试岗培训时间"
							type="date"
							style="width: 220px;"
						/>
					</i-formitem>
				</div>
				<!-- <div v-else>
					<i-formitem
						:rules="{}"
						label="试岗培训时间:"
					>
						<i-datepicker
							v-model="formValidate.try_train_start_time"
							:options="options1"
							placeholder="请选择试岗培训时间"
							type="date"
							style="width: 220px;"
							transfer
						/>
					</i-formitem>
				</div> -->
				<i-formitem
					label="试岗培训跟踪:"
				>
					<oa-limit-words
						v-model="formValidate.try_train_tracking"
						:max="200"
						style="width: 220px"
						placeholder="请输入试岗培训跟踪"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, DatePicker, Message, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import moment from 'moment';

export default {
	name: 'hr-position-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-datepicker': DatePicker,
		'oa-limit-words': LimitWords,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	props: {
		applicantId: String | Number,
		info: Object
	},
	data() {
		return {
			visible: false,
			formValidate: {
				...this.info,
				try_train_start_time: this.info.try_train_start_time.replace('/', '-'),
				is_join_train: this.info.is_join_train === -1 ? undefined : this.info.is_join_train
			},
			ruleValidate: {
				try_train_start_time: [
					{ 
						validator: this.handleValidator,
						type: 'date',
						message: '请选择试岗培训时间',
						trigger: 'change'
					}
				],
				is_join_train: [
					{ required: true, type: 'number', message: '请选择是否参加培训', trigger: 'change' }
				]
			},
			options1: {
				disabledDate: (date) => {
					return date && date.valueOf() < new Date(this.info.try_start_time.replace('/', '-')).getTime();
				}
			},
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleValidator(rule, value, callback) {
			if (this.formValidate.is_join_train === 1) {
				if (value == '') {
					callback('请选择试岗培训时间');
				}
				callback();
			} else {
				callback();
			}
		},
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSave() {
			const time = this.formValidate.try_train_start_time;
			this.$request({
				url: "HR_RECRUIT_SOCIAL_SUMMARY_TRAIN_WRITE_POST", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_id: this.applicantId,
					...this.formValidate,
					try_train_start_time: time && moment(time).format('YYYY-MM-DD'),
				}
			}).then((res) => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const TrainModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-pass-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 0 20px !important;
	}
	.ivu-modal-footer {
		padding: 0 20px 20px 20px !important;
	}
}
</style>
