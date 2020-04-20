<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		class="v-hr-employee-rank-up-store-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			新增规则
		</div>

		<div class="g-fs-14 g-m-t-15 g-m-l-15">
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="90"
				class="g-m-lr-15 g-m-t-20">
				<i-form-item label="规则名称：" prop="rule_name">
					<oa-limit-words
						v-model="formData.rule_name"
						:max="500"
						placeholder="请输入规则名称"
						width="220px"
						class="g-m-b-15" />
				</i-form-item>
				<i-form-item label="规则说明：" prop="description">
					<oa-limit-words
						v-model="formData.description"
						:max="500"
						placeholder="请输入规则说明"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Checkbox } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";

export default {
	name: "hr-employee-rank-up-store-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-checkbox": Checkbox,
		"vc-copy": Copy,
	},
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			formData: {
				rule_name: ''
			},
			rule: {
				rule_name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$request({
						url: '_HR_EMPLOYEE_UP_RULE_DATABASE_ADD_POST',
						type: "POST",
						param: {
							...this.data,
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$emit("sure");
						this.$Message.success("操作成功");
					}).catch(err => {
						this.$Message.warning(err.msg);
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
export const PModal = CreatePortal({}, module.exports.default);
</script>

