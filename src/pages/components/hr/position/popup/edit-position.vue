<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem
					prop="position_name"
					label="职位名称:"
				>
					<i-input
						v-model="formValidate.position_name"
						:maxlength="10"
						clearable
						style="width: 90%"
						placeholder="请输入职位名称，10字以内"
					/>
				</i-formitem>
				<i-formitem
					prop="is_applicant_use"
					label="是否用于招聘:"
				>
					<i-select
						v-model="formValidate.is_applicant_use"
						clearable
						placeholder="请选择是否用于招聘"
						style="width: 90%"
					>
						<i-option :value="1">是</i-option>
						<i-option :value="0">否</i-option>
					</i-select>
				</i-formitem>
				<i-formitem
					label="职位用途:"
				>
					<i-select
						v-model="formValidate.position_use"
						clearable
						placeholder="请选择职位用途"
						style="width: 90%"
					>
						<i-option
							v-for="item of useArr"
							:key="item.value"
							:value="item.value">{{ item.label }}</i-option>
					</i-select>
				</i-formitem>
				<i-formitem
					label="职位说明:"
				>
					<oa-limit-words
						v-model="formValidate.description"
						:max="30"
						:rows="4"
						style="width: 90%"
						placeholder="30字以内(选填)"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Message, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-position-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords
	},
	props: {
		title: String,
		type: String,
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			formValidate: {
				position_name: this.info.position_name || '',
				description: this.info.description || '',
				is_applicant_use: this.info.is_applicant_use,
				position_use: this.info.position_use
			},
			ruleValidate: {
				position_name: [
					{ required: true, message: '请输入职位名称' }
				],
				is_applicant_use: [
					{ required: true, type: 'number', message: '请选择是否用于招聘' }
				]
			},
			useArr: []
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
		this.loadUseArr();
	},
	methods: {
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
		loadUseArr() {
			this.$request({
				url: '_HR_SYSTEM_POSITION_USE_GET',
				type: 'GET',
				param: {
					depart_id: this.info.depart_id,
				}
			}).then(res => {
				this.useArr = res.data;
			}).catch(err => {

			});
		},
		handleSave() {
			app.$store.dispatch("request", {
				url: "HR_POSITION_ADD_POST", // eslint-disable-line
				type: 'POST',
				param: {
					depart_id: this.info.depart_id,
					position_id: this.info.position_id,
					position_name: this.formValidate.position_name,
					description: this.formValidate.description,
					is_applicant_use: this.formValidate.is_applicant_use,
					position_use: this.formValidate.position_use
				}
			}).then((res) => {
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
export const PositionModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
}
</style>