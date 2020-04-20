<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			width="400"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="g-flex g-flex-cc">
				<i-form
					ref="form"
					:model="formValidate"
					:label-width="100"
					style="width: 850px;marginTop:14px"
					position="left"
				>
					<i-form-item label="意向职位1:">
						<i-cascader
							v-model="formValidate.position_id1"
							:data="departPosition"
							change-on-select
							style="width:220px"
							clearable
							transfer
							trigger="hover"
							placeholder="请选择职位"
						/>
					</i-form-item>
					<i-form-item label="意向职位2:">
						<i-cascader
							v-model="formValidate.position_id2"
							:data="departPosition"
							change-on-select
							style="width:220px"
							clearable
							transfer
							trigger="hover"
							placeholder="请选择职位"
						/>
					</i-form-item>
				</i-form>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Select, Option, Button, Form, FormItem, Cascader } from "iview";
import { CreatePortal } from "wya-vc";
import { services } from "@stores/services/hr";
import Steps from "@components/_common/steps/steps";
import API_ROOT from "@stores/apis/root";

export default {
	name: "hr-employee-details-contract-company",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-button": Button,
		"i-cascader": Cascader,
		"oa-steps": Steps
	},
	mixins: [services.departPosition()],
	props: {
		title: String,
		staff_id: String
	},

	data() {
		return {
			visible: false,
			formValidate: {
				position_id1: [],
				position_id2: []
			}
		};
	},
	computed: {},
	created() {},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$request({
				url: API_ROOT._HR_EMPLOYEE_JOB_APPLY_POST,
				type: "POST",
				param: {
					staff_id: this.staff_id,
					...this.formValidate
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", "success");
			}).catch(err => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
		}
	}
};

export const AuditModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>