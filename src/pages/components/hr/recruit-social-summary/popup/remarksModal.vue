<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex v-hr-recruit-social-delete"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			备注
		</div>

		<div class="g-fs-14">
			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="90"
				class="g-m-lr-20 g-m-t-20">
				<i-form-item label="备注：" prop="msg">
					<oa-limit-words
						v-model="form.msg"
						:max="500"
						placeholder="请输入备注"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from "moment";
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Modal, Form, FormItem } from "iview";

export default {
	name: "hr-recruit-social-summary-delete",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
	},
	props: {
		id: Number
	},
	data() {
		return {
			visible: false,
			form: {},
			rule: {
				msg: [{ required: true, message: "请输入备注", trigger: "blur" }]
			}
		};
	},
	computed: {},
	created() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs['form'].validate(valid => {
				if (valid) {
					app.$store
						.dispatch("request", {
							url: "_HR_RECRUIT_ADD_REMARKS_POST",
							type: "POST",
							param: {
								applicant_id: this.id,
								remarks: this.form.msg
							},
							loading: false
						})
						.then(res => {
							this.$refs.modal.buttonLoading = false;
							this.visible = false;
							this.$emit("sure");
						})
						.catch(error => {
							this.$Message.error(error.msg);
							this.$refs.modal.buttonLoading = false;
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
export const remarksPModal = CreatePortal({}, module.exports.default);
</script>
