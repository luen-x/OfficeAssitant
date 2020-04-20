<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="g-flex"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			编辑
		</div>

		<div>
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="100">

				<i-form-item class="g-m-t-20" label="备注：" prop="remark">
					<oa-limit-words
						v-model="formData.remark"
						:max="500"
						width="220px" />
				</i-form-item>

			</i-form>
		</div>

	</i-modal>
</template>

<script>
import { CreatePortal, Copy } from "wya-vc";
import { Modal, Form, FormItem } from "iview";

export default {
	name: "hr-recruit-school-remark-edit",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-copy": Copy
	},
	props: {
		info: Object
	},
	data() {
		return {
			visible: false,
			formData: {
				remark: this.info.content
			},
			rule: {
				remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
			}
		};
	},
	created() {
		this.visible = true;
		// this.formData.remark = this.info.content;
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$request({
						url: "_HR_RECRUIT_SCHOOL_SUMMARY_ADD_MSG_POST",
						type: "POST",
						param: {
							applicant_id: this.$route.params.id,
							remarks: this.formData.remark,
							remark_id: this.info.remark_id,
							type: 1
						},
						loading: false
					})
						.then(res => {
							this.$Message.success('操作成功');
							this.$emit("sure");
						})
						.catch(error => {
							this.$Message.error(error.msg);
							this.$refs.modal.buttonLoading = false;
						});
				} else {
					this.$Message.warning('请按照提示完善表单信息');
			        this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const editPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
</style>
