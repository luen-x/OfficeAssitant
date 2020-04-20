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
			淘汰
		</div>

		<div>
			<i-form
				ref="passForm"
				:model="passForm"
				:rules="passRule"
				:label-width="90">

				<i-form-item label="淘汰类型：" prop="pass_type">
					<i-radio-group v-model="passForm.pass_type">
						<i-radio :label="1">主动淘汰</i-radio>
						<i-radio :label="2">被动淘汰</i-radio>
					</i-radio-group>
					<!-- <i-select
						v-model="passForm.pass_type"
						placeholder="请选择淘汰类型"
						clearable
						transfer
						style="width: 220px">
						{{ passList }}
						<i-option
							v-for="item in passList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select> -->
				</i-form-item>
				<i-form-item label="淘汰原因:" prop="pass_remarks_type">
					<i-select
						v-model="passForm.pass_remarks_type"
						style="width: 220px"
						clearable
						transfer
						placeholder="请选择淘汰原因"
					>
						<i-option
							v-for="(item, index) in passTypes"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="淘汰备注" >
					<!-- <i-select
						v-model="passForm.pass.pass_remarks_type"
						placeholder="请选择淘汰原因"
						clearable
						transfer
						style="width: 220px"
						class="g-m-b-20">
						<i-option
							v-for="item in passDeparture"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select> -->
					<oa-limit-words
						v-model="passForm.pass.pass_remarks"
						:max="200"
						placeholder="请输入淘汰备注"
						style="width: 220px" />
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import { services, passList } from '@stores/services/hr';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Modal, Select, Option, Form, FormItem, RadioGroup, Radio } from "iview";

export default {
	name: "hr-recruit-school-summary-pass",
	components: {
		"i-modal": Modal,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"vc-copy": Copy,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
	},
	mixins: [
		services.passTypes(),
		passList
	],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			passTypes: [],
			passForm: {
				pass_remarks_type: '',
				pass: {
					// pass_remarks_type: '',
					pass_remarks: ''
				}
			},
			passRule: {
				pass_type: [{ required: true, message: "请选择淘汰类型", pattern: /.+/, trigger: "change" }],
				pass_remarks_type: [
					{
						required: true,
						type: "number",
						message: "请选择淘汰原因",
						trigger: "change"
					}
				],
				pass: {
					type: 'object',
					required: true,
					trigger: 'change',
					position_id: '',
					fields: {
						// pass_remarks_type: [{ required: true, message: "请选择淘汰原因", pattern: /.+/, trigger: "change" }],
						pass_remarks: [{ required: true, message: "请输入淘汰备注", trigger: "blur" }],
					}
				}
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
			this.$refs['passForm'].validate(valid => {
				if (valid) {
					app.$store
						.dispatch("request", {
							url: "HR_RECRUIT_SCHOOL_PASS_POST",
							type: "POST",
							param: {
								applicant_id: this.data.info.applicant_id,
								pass_type: this.passForm.pass_type,
								pass_remarks_type: this.passForm.pass_remarks_type,
								...this.passForm.pass
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
export const passPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
</style>
