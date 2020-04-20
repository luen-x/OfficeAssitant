<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="修改人员需求"
		class="v-hr-academy-transfer-statistic-modify-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div class="_content">
			<i-form
				ref="form"
				:model="formData"
				:rules="rule"
				:label-width="110"
				class="g-m-lr-15 g-m-t-20">
				<i-form-item label="用人部门：">
					<span>{{ info.depart_name }}</span>
				</i-form-item>
				<i-form-item label="部门急需人数：" prop="depart_need">
					<i-input
						v-model="formData.depart_need"
						disabled
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item
					label="职位名称："
					prop="position_id">
					<i-select
						v-model="formData.position_id"
						placeholder="请选择职位"
						style="width: 220px"
						clearable
						transfer
						@on-change="handleChange">
						<i-option
							v-for="item in positionList"
							:key="item.position_id"
							:value="item.position_id">
							{{ item.position_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="急需人数：" prop="need_number">
					<i-input-number
						v-model="formData.need_number"
						:max="99"
						:min="formData.depart_need !== 0 ? 0 : 1"
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item label="人员标准：" prop="staff_standard">
					<oa-limit-words
						v-model="formData.staff_standard"
						:max="500"
						placeholder="请输入人员标准"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Input, InputNumber, Select, Option } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { formatMoment } from "@utils/utils";
import { services } from '@stores/services/hr';

export default {
	name: "hr-academy-transfer-statistic-modify-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-input": Input,
		"i-form": Form,
		"i-form-item": FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		"i-input-number": InputNumber
	},
	mixins: [
		// services.allPosition()
	],
	props: {
		info: Object,
		type: String
	},
	data() {
		return {
			visible: false,
			need_id: '',
			positionList: [],
			formData: {
				depart_need: 0,
				need_number: 1
			},
			rule: {
				depart_need: [{ required: true, message: "请输入部门急需人数", pattern: /.+/, trigger: "blur" }],
				need_number: [{ required: true, message: "请输入急需人数", pattern: /.+/, trigger: "blur" }],
				position_id: [{ required: true, message: "请选择职位", pattern: /.+/, trigger: "change" }],
			}
		};
	},
	computed: {},
	mounted() {
		this.visible = true;
		this.formData.depart_need = this.info.need_number;

		// 获取一级部门
		this.$request({
			url: '_HR_DEPART_ARRAY_BY_DEPART_GET',
			type: "GET",
			param: {
				depart_id: this.info.depart_id,
			},
			loading: false
		}).then(res => {
			let first_depart_id = res.data[0];
			// 获取对应职位
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_RESUME_POSITION_GET',
				type: "GET",
				param: {
					depart_id: first_depart_id,
				},
				loading: false
			}).then(res1 => {
				this.positionList = res1.data;
			}).catch(err => {
			});
		}).catch(err => {
		});
	},
	methods: {
		handleChange(sed) {

			this.$request({
				url: 'HR_ACADEMY_TRANSFER_DEMAND_BY_POSITION_GET',
				type: "GET",
				param: {
					depart_id: this.info.depart_id,
					position_id: this.formData.position_id,
				},
				loading: false
			}).then(res => {
				this.formData.depart_need = res.data.need_number;
				this.need_id = res.data.need_id;
				this.formData.need_number = this.formData.depart_need !== 0 ? 0 : 1;
				this.formData.staff_standard = res.data.staff_standard;
			}).catch(err => {
			});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs['form'].validateAndScroll(valid => {

				if (valid) {
					if (this.formData.depart_need === 0 && this.formData.need_number < 1) {
						this.$Message.warning('新增职位急需人数最小为1');
						return;
					}
					this.$request({
						url: 'HR_ACADEMY_TRANSFER_STATISTIC_DEMAND_MODIFY_POST',
						type: "POST",
						param: {
							is_train: 1,
							need_id: this.need_id,
							depart_id: this.info.depart_id,
							position_id: this.formData.position_id,
							need_number: this.formData.need_number,
							staff_standard: this.formData.staff_standard
						},
						loading: false
					}).then(res => {
						this.$Message.success("操作成功");
						this.$emit("sure");
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
export const modifyPModal = CreatePortal({}, module.exports.default);
</script>


