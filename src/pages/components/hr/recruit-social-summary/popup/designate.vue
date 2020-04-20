<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-designate-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				指派
			</div>

			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem
					prop="try_depart_id"
					label="指派到:"
				>
					<i-cascader
						v-model="formValidate.try_depart_id"
						:change-on-select="true"
						:data="departAll"
						style="width: 220px; display: inline-block"
						clearable
						transfer
						trigger="click"
						placeholder="请选择试岗部门"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Cascader } from 'iview';
import { CreatePortal } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/hr';

export default {
	name: 'hr-social-designate-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-cascader': Cascader
	},
	mixins: [services.departAll()],
	props: {
		applicantId: String | Number,
	},
	data() {
		return {
			visible: false,
			formValidate: {
			},
			ruleValidate: {
				try_depart_id: [
					{ required: true, type: 'array', message: '请选择试岗部门', trigger: 'change' }
				],
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
		handleChange(value, type) {
			this.formValidate[type] = value;
		},
		handleSave() {
			let length = this.formValidate.try_depart_id.length;
			app.$store.dispatch("request", {
				url: "HR_RECRUIT_SOCIAL_SUMMARY_DESIGNATE_POST", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_id: this.applicantId,
					try_depart_id: this.formValidate.try_depart_id[length - 1],
				}
			}).then((res) => {
				res.msg && this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const DesignateModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-designate-modal {
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
