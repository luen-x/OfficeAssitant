<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="编辑目标"
		class="v-hr-archives-employee-target-edit-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div class="g-fs-14 _content">
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="100"
				class="g-m-lr-15 g-m-t-20">
				<i-form-item v-if="type === '1'" label="目标类型：" prop="target_type">
					<i-select
						v-model="formData.target_type"
						transfer
						placeholder="请选择目标类型"
						style="width: 220px"
						@on-change="handleTypeChange">
						<i-option
							v-for="item in targetList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="formData.target_type === 2 && time" label="半年度时间：" prop="time">
					<i-input
						v-model="time"
						disabled
						style="width: 220px" />
				</i-form-item>
				<i-form-item v-if="formData.target_type === 1 && time" label="季度时间：" prop="time">
					<i-input
						v-model="time"
						disabled
						style="width: 220px" />
				</i-form-item>
				<i-form-item label="保底目标：" prop="min_target">
					<i-input-number
						v-model="formData.min_target"
						:max="9999.99"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="请输入保底目标"
						style="width: 220px;"/>
					<span class="g-absolute" style="left: 180px;top: 2px">万</span>
				</i-form-item>
				<i-form-item label="平衡目标：" prop="target">
					<i-input-number
						v-model="formData.target"
						:max="9999.99"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="请输入平衡目标"
						style="width: 220px;"/>
					<span class="g-absolute" style="left: 180px;top: 2px">万</span>
				</i-form-item>
				<i-form-item label="冲刺目标：" prop="max_target">
					<i-input-number
						v-model="formData.max_target"
						:max="9999.99"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="请输入冲刺目标"
						style="width: 220px;"/>
					<span class="g-absolute" style="left: 180px;top: 2px">万</span>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import { Modal, Select, Option, Form, FormItem, Input,
	InputNumber, Radio, RadioGroup } from "iview";

export default {
	name: "hr-archives-employee-target-edit-modal",
	components: {
		"i-modal": Modal,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input-number": InputNumber,
		"i-radio": Radio,
		"i-radio-group": RadioGroup,
	},
	props: {
		info: Object,
		type: String
	},
	data() {
		return {
			visible: false,
			time: '',
			formData: {
				target_type: '',
				min_target: null,
				target: null,
				max_target: null
			},
			rule: {
				target_type: [{ required: true, message: "请选择评定开始月", pattern: /.+/, trigger: "change" }],
				min_target: [
					{ required: true, message: "请输入保底目标", pattern: /.+/, trigger: "change" }
					// { validator: 'validateMin', trigger: 'blur' }
				],
				target: [{ required: true, message: "请输入平衡目标", pattern: /.+/, trigger: "change" }],
				max_target: [{ required: true, message: "请输入冲刺目标", pattern: /.+/, trigger: "change" }]
			},
			targetList: [
				{ label: '月度目标', value: 0 },
				{ label: '季度目标', value: 1 },
				{ label: '半年度目标', value: 2 }
			]
		};
	},
	mounted() {
		this.visible = true;
		this.formData.target_type = 0;
		this.loadDefaultTime(0);

	},
	methods: {
		handleTypeChange(val) {
			this.loadDefaultTime(val);
		},
		loadDefaultTime(val) {
			this.$request({
				url: 'HR_ARCHIVES_EMPLOYEE_TARGET_TIME_GET',
				type: "GET",
				param: {
					type: val,
					staff_id: this.info.staff_id
				},
				loading: false
			}).then(res => {
				this.time = res.data.time_range;
				this.formData.min_target = +res.data.min_target;
				this.formData.target = +res.data.target;
				this.formData.max_target = +res.data.max_target;
			}).catch(err => {
				this.time = '';
				this.$Message.error('暂未配置时间，不能编辑目标');
			});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs.modal.buttonLoading = false;
			if (this.formData.target_type === 1 || this.formData.target_type === 2) {
				if (!this.time) {
					this.$Message.error('暂未配置时间，不能编辑目标');
					return;
				}
			}

			let month = this.$route.query.month || formatMoment(moment(), 'YYYY-MM');
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$refs.modal.buttonLoading = false;
					if (this.formData.min_target >= this.formData.target) {
						this.$Message.error('平衡目标需大于保底目标！');
						return;
					} else if (this.formData.min_target >= this.formData.max_target) {
						this.$Message.error('冲刺目标需大于保底目标！');
						return;
					} else if (this.formData.target >= this.formData.max_target) {
						this.$Message.error('冲刺目标需大于平衡目标！');
						return;
					}

					this.$request({ 	// 编辑目标
						url: 'HR_ARCHIVES_EMPLOYEE_TARGET_EDIT_POST',
						type: "POST",
						param: {
							...this.formData,
							staff_id: this.info.staff_id,
							month
						},
						loading: false
					}).then(res => {
						this.$Message.success("操作成功");
						this.$emit("sure");
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
export const editPModal = CreatePortal({}, module.exports.default);
</script>
