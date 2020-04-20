<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="400"
		:loading="true"
		:mask-closable="false"
		class="v-sc-customer-add-label-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			添加标签
		</div>

		<i-form
			ref="form"
			:label-width="110"
			:model="form"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item label="标签：" prop="type">
				<i-radiogroup v-model="form.type">
					<i-radio label="4">
						<i class="iconfont icon-qizhi g-fs-14" style="color:#ED8F4A;"/>
					</i-radio>
					<i-radio label="2">
						<i class="iconfont icon-qizhi g-fs-14" style="color:#E84C57;"/>
					</i-radio>
					<i-radio label="3">
						<i class="iconfont icon-qizhi g-fs-14" style="color:#4FC43D;"/>
					</i-radio>
					<i-radio label="1">
						<i class="iconfont icon-qizhi g-fs-14" style="color:#924CE8;"/>
					</i-radio>
				</i-radiogroup>
			</i-form-item>

			<i-form-item label="备注：" prop="remarks">
				<oa-limit-words
					v-model="form.remarks"
					:max="200"
					placeholder="请输入标签备注"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, RadioGroup, Radio } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-customer-add-label-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-radiogroup": RadioGroup,
		"i-radio": Radio
	},

	props: {
		flag: Number, // 1代表合作客户 2代表产品制作
		project_ids: Array,
		tab: String,
		v: [Object, String]
	},

	data() {
		return {
			visible: false,
			form: {
				remarks: "", // 备注 
				type: ""
			},
			rule: {
				type: [
					{
						required: true,
						message: "标签是必选的！",
						trigger: "change"
					}
				]
			}
		};
	},

	mounted() {
		if (this.v && this.v.tag && this.v.tag.type) {
			this.form.type = this.v.tag.type + '';
			this.form.remarks = this.v.tag.remarks;
		}
		
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;

					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSave() {
			let tab = "";

			if (this.flag === 1 && (this.tab === "1" || this.tab === "2" || this.tab === "5")) {
				tab = "1";
			} else {
				tab = "0";
			}

			this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_TAG_ADD_POST,
				type: "POST",
				param: {
					project_ids: this.project_ids,
					tab,
					...this.form,
					remarks: this.form.remarks.replace(/(^\s*)|(\s*$)/g, "")
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.visible = false;
			});
		}
	}
};

export const AddLabelModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-add-label-modal{
	.ivu-radio-wrapper{
		&:first-child{
			margin-right: 10px;
		}
	}
}
</style>