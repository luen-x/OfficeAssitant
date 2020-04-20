<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:width="400"
			:loading="true"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				标记解决
			</div>

			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="115"
				class="g-m-t-20"
			>
				<i-form-item label="解决备注：" prop="resolve_mark">
					<oa-limit-words
						v-model="form.resolve_mark"
						:max="500"
						placeholder="请输入备注"
						style="width: 220px"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, InputNumber } from "iview";
import { CreatePortal } from "wya-vc";
import { objRegex } from '@utils/utils';
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-manage-inspection-mark-solve-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem
	},

	props: {
		quality_record_id: Number
	},

	data() {
		return {
			visible: false,
			form: {
				resolve_mark: ""
			},
			rule: {
				resolve_mark: [
					{
						required: true,
						message: "请输入备注",
						trigger: "blur"
					}
				]
			}
		};
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_RESOLVE_POST,
				type: "POST",
				param: {
					quality_record_id: this.quality_record_id,
					...this.form
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.warning(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};

export const MarkSolveModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>