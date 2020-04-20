<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-link-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>

			<i-form 
				ref="formValidate" 
				:label-width="120" 
				class="g-m-t-20"
			>
				<i-formitem
					v-for="(item, index) in links"
					:key="index"
					:label="item.label"
				>
					<p style="word-break: break-all">{{ item.link }}</p>
					<vc-copy 
						:value="item.link" 
						tag="span" 
						class="g-operation g-m-l-10"
					>
						复制
					</vc-copy>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Cascader } from 'iview';
import { CreatePortal, Copy } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';
import { services } from '@stores/services/hr';

export default {
	name: 'hr-social-link-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-cascader': Cascader,
		'vc-copy': Copy
	},
	mixins: [services.departAll()],
	props: {
		title: String,
		links: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			formValidate: {
			},
			ruleValidate: {
				
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
export const LinkModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-social-link-modal {
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