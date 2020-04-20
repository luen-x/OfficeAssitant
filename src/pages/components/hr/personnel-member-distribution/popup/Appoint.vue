<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="title"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
		>
			<i-form-item label="指派到：" prop="try_depart_id">
				<i-cascader
					v-model="formData.try_depart_id"
					:data="zone?departList:departMy"
					change-on-select
					placeholder="请选择试岗部门"
					clearable
					transfer
					style="width: 220px"
					class="g-m-r-5"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, Cascader } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { services } from '@stores/services/hr';
import { dataValidity, objRegex, initTreeData } from '@utils/utils';


export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'i-cascader': Cascader,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [services.departMy()],
	props: {
		data: Object, // customer_id
		title: {
			type: String,
			default: '指派'
		},
		zone: {
			type: Boolean,
			default: false
		},

		applicant_id: [Array, String],
		scenario: {
			type: [Number, String],
			scenario: 2
		},
		assign_type: [Number, String],
		type: [Number, String],
		try_depart_id: [Number, String],
	},
	data() {
		return {
			visible: false,
			departList: [],
			formData: {
				assign_type: this.assign_type,
				applicant_id: this.applicant_id,
				scenario: this.scenario,
				try_depart_id: this.try_depart_id ? [Number(this.try_depart_id)] : []
			},
			rules: {
				try_depart_id: [{ required: true, type: 'array', message: "请选择试岗部门", trigger: "change" }]
			},

		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.zone && this.loadMyDepart();
	},
	methods: {
		loadMyDepart() {
			this.$request({
				url: 'HR_EMPLOYEE_STAFF_TWO_DEPART_SELECT_BY_GET',
				type: 'get',
				loading: false,
				param: {
					staff_id: this.$global.staff.staff_id
				}
			}).then(res => {
				this.departList = initTreeData(res.data, "depart_id", "depart_name", "children");
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {

					this.$request({
						url: 'HR_RECRUIT_SCHOOL_SUMMARY_ASSIGN_POST',
						type: "POST",
						param: {
							...this.formData,
							type_status: this.type,
							try_depart_id: this.formData.try_depart_id[this.formData.try_depart_id.length - 1]
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const Appoint = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>