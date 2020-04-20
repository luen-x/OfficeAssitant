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
			{{ name === 'assign' ? '指派试岗部门' : '修改试岗部门' }}
		</div>

		<div>
			<i-form
				ref="form"
				:model="form"
				:rules="rule"
				:label-width="100"
			>
				<i-form-item label="指派到：" prop="try_depart_id">
					<i-cascader
						:data="selfDepart"
						v-model="form.try_depart_id"
						:change-on-select="true"
						clearable
						transfer
						placeholder="请选择试岗部门"
						trigger="click"
					/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { services } from "@stores/services/hr";
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { Cascader, Modal, Input, Select, Option, Form, FormItem } from "iview";

export default {
	name: "hr-recruit-school-tryassign",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-select": Select,
		"i-option": Option,
		"i-form-item": FormItem,
		"vc-copy": Copy,
		"i-cascader": Cascader,
	},
	mixins: [services.selfDepart()],
	props: {
		name: String,
		selected: Object || Array,
	},
	data() {
		return {
			visible: false,
			status: false,
			tryDepartData: [],
			form: {
				try_depart_id: []
			},
			rule: {
				try_depart_id: [
					{ required: true, message: "试岗部门不能为空", trigger: "change", type: 'array' }
				],
			}
		};
	},
	computed: {},
	created() {
		this.visible = true;
		if (this.name === 'adjust') {
			this.form.try_depart_id = this.selected.try_depart_array;
		}
	},
	methods: {
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */

			// 获取被选元素applicant_id数组
			let id = '';
			let assign_id = '';
			if (this.name === 'adjust') {
				id = this.selected.applicant_id;
				assign_id = this.selected.assign_id;
			} else if (Array.isArray(this.selected)) {
				id = this.selected.map(item => item.applicant_id).join(',');
				assign_id = this.selected.map(item => item.assign_id).join(',');
			} else {
				id = this.selected.applicant_id;
				assign_id = this.selected.assign_id;
			}
			
			this.$refs['form'].validate(valid => {
				if (valid) {
					if (this.form.try_depart_id !== this.selected.try_depart_array) {
						app.$store
							.dispatch("request", {
								url: "HR_RECRUIT_SCHOOL_SUMMARY_ASSIGN_POST",
								type: "POST",
								param: {
									applicant_id: id,
									try_depart_id: this.form.try_depart_id[this.form.try_depart_id.length - 1],
									scenario: 2,
									assign_id
								},
								loading: false
							})
							.then(res => {
								this.$emit("sure");
							})
							.catch(error => {
								this.$Message.error(error.msg);
								this.$refs.modal.buttonLoading = false;
							});
					} else {
						this.$emit("sure");
					}
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
export const assignPModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" >
</style>
