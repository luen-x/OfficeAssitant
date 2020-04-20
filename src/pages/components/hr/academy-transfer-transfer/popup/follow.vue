<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="心态跟踪"
		class="g-flex v-hr-academy-transfer-follow-modal"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div class="g-fs-14 _content">
			<oa-steps
				v-if="info.remarks_info && info.remarks_info.length"
				:type="1"
				:data-source="info.remarks_info"
				:render-title="renderTitle"
				:render-content="renderContent"
				class="g-m-t-30 _steps"/>

			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="90"
				class="g-m-lr-15 g-m-t-20">
				<i-form-item label="心态跟踪：" prop="remarks">
					<oa-limit-words
						v-model="formData.remarks"
						:max="500"
						placeholder="请输入心态跟踪"
						width="520px"/>
				</i-form-item>

				<!-- <i-form-item>
					<oa-input-number
						v-model="formData.rate"
						name="业绩"
						type="string"
						:disabled="false" />
				</i-form-item> -->
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import Steps from '@components/_common/steps/steps';
import LimitWords from "@common/limit-words/limit-words";
import InputNumber from '../../_common/input-number';

export default {
	name: "hr-academy-transfer-follow-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-date-picker': DatePicker,
		'oa-steps': Steps,
		'oa-limit-words': LimitWords,
		'oa-input-number': InputNumber
	},
	props: {
		info: Object,
		type: String
	},
	data() {
		return {
			visible: false,
			formData: {
				rate: '',
				number: 0
			},
			rule: {
				remarks: [{ required: true, message: "请输入心态跟踪", trigger: "blur" }],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		renderTitle(h, params = {}) {
			const { create_time, staff_name } = params.rows;
			return (
				<div class="g-flex g-ai-c">
					<div class="g-fs-14 g-m-l-10" style="color: #666;min-width: 70px">{staff_name}</div>
					<div class="g-c-black4 g-m-l-10 g-nobreak">{create_time}</div>
				</div>
			);
		},
		renderContent(h, params = {}) {
			const { content } = params.rows;
			return (
				<div class="g-fs-14 g-c-black2 _desc">{content}</div>
			);
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs.modal.buttonLoading = false;

			this.$refs['form'].validateAndScroll(valid => {
				if (valid) {
					this.$request({
						url: '_HR_RECRUIT_ADD_REMARKS_POST',
						type: "GET",
						param: {
							applicant_id: this.info.applicant_id,
							remarks: this.formData.remarks,
							type: 2
						},
						loading: false
					}).then(res => {
						this.$emit("sure");
						this.$Message.success("操作成功");
						this.$store.commit('HR_ACADEMY_TRANSFER_TRANSFER_LIST_INIT');
					}).catch(err => {
						this.$Message.warning(err.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示完善表单信息');
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const followPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-academy-transfer-follow-modal {
	._content {
		._steps {
			max-height: 356px;
			overflow-y: auto;
			margin-left: 44px;
			word-break: break-all;
			._desc {
				width: 520px;
				padding: 5px;
				padding-left: 10px;
				padding-right: 10px;
				margin-left: 45px;
				background: #FAFAFA;
			}
		}
	}
}
</style>
