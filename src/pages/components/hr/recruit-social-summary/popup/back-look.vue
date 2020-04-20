<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-social-pass-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				背景调查
			</div>
			<i-form
				ref="formValidate"
				:label-width="100"
				class="g-m-t-20"
			>
				<i-formitem
					label="是否背景调查:"
				>
					{{ info.is_background ? '是' : '否' }}
				</i-formitem>
				<i-formitem
					v-if="info.is_background"
					label="凭证:"
				>
					<vc-imgspreview
						v-if="info.background_url && info.background_url.length"
						:data-source="info.background_url" 
						:max="3"
					/>
					<span v-else>--</span>
				</i-formitem>
				<i-formitem
					label="备注:"
				>
					{{ info.background_remarks ? info.background_remarks : '--' }}
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, RadioGroup, Radio } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import LimitWords from '@components/_common/limit-words/limit-words';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-position-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'oa-limit-words': LimitWords,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'vc-imgspreview': ImgsPreview
	},
	props: {
		applicantId: String | Number,
	},
	data() {
		return {
			visible: false,		
			info: {}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
		this.loadInfo();
	},
	methods: {
		handleCancel() {
			this.$emit('close');
		},
		handleOk() {
			this.$emit('sure');
		},
		loadInfo() {
			this.$request({
				url: "_HR_RECRUIT_SOCIAL_SUMMARY_BACKGROUND_GET", // eslint-disable-line
				type: 'POST',
				param: {
					applicant_id: this.applicantId,
				}
			}).then((res) => {
				this.info = res.data;
			}).catch((error) => {
				Message.error(error.msg);
			});
		}
	}
};
export const BackLookModal = CreatePortal({}, module.exports.default);
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
