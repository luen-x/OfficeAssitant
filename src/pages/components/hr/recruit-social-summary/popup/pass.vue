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
				淘汰
			</div>
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem
					prop="pass_type"
					label="淘汰到:"
				>
					<i-select
						v-model="formValidate.pass_type"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择淘汰类型"
					>
						<i-option
							v-for="(item, index) in passType"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-formitem>
				<i-formitem
					v-if="formValidate.pass_type === 0"
					prop="is_tracking"
					label="是否再跟踪:"
				>
					<i-radio-group
						v-model="formValidate.is_tracking"
						style="width: 220px"
						placeholder="是否再跟踪"
					>
						<i-radio :label="1">是</i-radio>
						<i-radio :label="0">否</i-radio>
					</i-radio-group>
				</i-formitem>
				<i-formitem label="淘汰原因:" prop="pass_remarks_type">
					<i-select
						v-model="formValidate.pass_remarks_type"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择淘汰原因"
					>
						<i-option
							v-for="(item, index) in passTypes"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-formitem>
				<i-formitem
					label="淘汰备注:"
				>
					<oa-limit-words
						v-model="formValidate.pass_remarks"
						:max="200"
						style="width: 220px"
						placeholder="请输入淘汰备注"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, Message, RadioGroup, Radio } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/hr';

export default {
	name: 'hr-position-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	mixins: [
		services.passDeparture(),
		services.passTypes()
	],
	props: {
		info: Object,
	},
	data() {
		return {
			visible: false,
			passType: [],
			list1: [{ label: '未面试淘汰', value: 0 }],
			list2: [{ label: '面试淘汰', value: 1 }],
			list3: [{ label: '未接受offer', value: 2 }],
			list4: [{ label: '试岗淘汰', value: 3 }, { label: '试岗完成淘汰', value: 4 }],
			list5: [{ label: '试岗完成淘汰', value: 4 }],
			list6: [{ label: '卷pass', value: 5 }, { label: '未面试淘汰', value: 0 }],			
			formValidate: {
				pass_type: null,
				pass_remarks_type: '',
				pass_remarks: ''
			},
			ruleValidate: {
				pass_type: [
					{ required: true, type: 'number', message: '请选择淘汰类型', trigger: 'change' }
				],
				pass_remarks_type: [
					{
						required: true,
						type: "number",
						message: "请选择淘汰原因",
						trigger: "change"
					}
				],
				pass_remarks: [
					{ required: true, message: '请输入淘汰备注', trigger: 'change' }
				],
				is_tracking: [
					{ required: true, type: 'number', message: '是否再跟踪', trigger: 'change' }
				]
			},
			data: this.info
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
		switch (this.info.status) {
			case 0:
				this.passType = this.list1;
				this.formValidate.pass_type = 0;
				break;
			case 13:
				this.passType = this.list2;
				this.formValidate.pass_type = 1;
				break;
			case 14: 
				this.passType = this.list6;
				this.formValidate.pass_type = 5;
				break;
			case 2:
				this.passType = this.list3;
				this.formValidate.pass_type = 2;
				break;
			case 3:
				this.passType = this.list4;
				this.formValidate.pass_type = 3;
				break;
			case 4:
				this.passType = this.list5;
				this.formValidate.pass_type = 4;
				break;
			default:
				break;
		}
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
		handleSave() {
			app.$store.dispatch("request", {
				url: "HR_RECRUIT_SOCIAL_SUMMARY_BATCH_DISUSE_POST", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_ids: Array.isArray(this.info.applicant_id) ? this.info.applicant_id : [this.info.applicant_id],
					pass_type: this.formValidate.pass_type,
					...this.formValidate,
				}
			}).then((res) => {
				res.msg && this.$Message.success(res.msg);
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
export const PassModal = CreatePortal({}, module.exports.default);
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
		padding: 0 !important;
	}
	.ivu-modal-footer {
		padding: 0 20px 20px 20px !important;
	}
}
</style>
