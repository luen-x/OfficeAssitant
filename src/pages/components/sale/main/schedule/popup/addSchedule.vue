<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加日程"
		width="400"
		class-name="v-sale-main-schedule-add-schedule"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="110"
		>
			<i-form-item label="事项名称：" prop="matter_name">
				<i-input v-model="formData.matter_name" :maxlength="50" placeholder="请输入事项名称" style="width: 220px"/>
			</i-form-item>
			<i-form-item label="事项时间：" prop="matter_time">
				<i-date-picker
					v-model="formData.matter_time"
					type="datetimerange"
					placeholder="请选择事项时间"
					transfer
					style="width: 220px"/>
			</i-form-item>
			<i-form-item label="备注信息：" prop="remark">
				<i-input
					v-model="formData.remark"
					:rows="4"
					:maxlength="200"
					style="width:220px;font-size:12px"
					type="textarea"
					placeholder="请输入备注信息" />
			</i-form-item>
			<i-form-item label="是否提醒自己：" prop="reminder_time">
				<i-date-picker
					v-model="formData.reminder_time"
					:options="remindDateOption"
					type="datetime"
					placeholder="请设置提醒时间"
					clearable
					transfer
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item v-if="$auth[1499]" label="推送范围设置：" prop="push_range">
				<i-radio-group v-model="formData.push_range">
					<i-radio :label="1">仅自己可见</i-radio>
					<i-radio :label="2">推送给其他人</i-radio>
				</i-radio-group>
				<i-form-item v-if="formData.push_range==2" class="g-m-t-10" prop="depart_ids">
					<oa-tree-select
						v-model="formData.depart_ids"
						:data-source="departAll"
						:width="180"
						:max-width="220"
						:disabled="formData.is_all_depart"
						clearable
						placeholder="请选择推送部门"
					/>
					<i-checkbox v-model="formData.is_all_depart" @on-change="handleIsAllDepartChange">所有部门</i-checkbox>
				</i-form-item>
				<i-form-item v-if="formData.push_range==2" prop="position_ids">
					<oa-tree-select-check
						ref="treeSelectCheck"
						v-model="formData.position_ids"
						:data="departPosition"
						:width="180"
						:max-width="220"
						:disabled="formData.is_all_position"
						placeholder="请选择职位范围"
					/>
					<i-checkbox 
						v-model="formData.is_all_position" 
						style="vertical-align: top;" 
						@on-change="handleIsAllPositionChange"
					>
						所有职位
					</i-checkbox>
				</i-form-item>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, DatePicker, Checkbox } from 'iview';
import Explain from '@components/_common/explain/explain';
import treeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import { services } from "@stores/services/sale";
import { services as contentServices } from "@stores/services/content";
import treeSelect from "@common/tree-select/tree-select";
import moment from 'moment';
import { setData } from '../../../_common/util';

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
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'oa-tree-select-check': treeSelectCheck,
		'oa-tree-select': treeSelect,
		'i-checkbox': Checkbox
	},
	mixins: [
		services.departAll(),
		contentServices.departPosition()
	],
	props: {
		matterId: Number,
		action: String, // add | update
	},
	data() {
		return {
			visible: false,
			formData: {
				matter_id: this.matterId || '',
				matter_name: "",
				start_time: "", // 事项开始时间
				end_time: "", // 事项结束时间
				reminder_time: '', // 事项提醒时间
				matter_time: [],
				remark: "", // 备注信息
				push_range: 1, // 1-仅自己可见，2-推送其他人
				depart_ids: [], // push_range=2时必填
				is_all_depart: false,
				position_ids: [], // push_range=2时必填
				is_all_position: false
			},
			rules: {
				matter_name: [
				  { required: true, message: '请输入事项名称', trigger: 'blur' }
				],
				remark: [
				  { required: true, type: 'string', message: '请输入备注信息', trigger: 'blur' }
				],
				matter_time: [
				  { required: true, type: 'array', message: '请选择事项时间', validator: this.matterTimeValidator, trigger: 'change' }
				],
				push_range: [
				  { required: true, type: 'number', message: '请选择推送范围', trigger: 'change' }
				]
			},
			curDate: new Date(),
			remindDateOption: { 
				disabledDate: (date) => {
					return date.getTime() < this.curDate.getTime() - 24 * 60 * 60 * 1000;
				} }
		};
	},
	created() {
		this.action == 'update' && this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		 loadData() {
			this.$request({
				url: "_SALE_MAIN_MATTER_DETAIL_GET",
				type: "GET",
				param: {
					matter_id: this.matterId
				},
				loading: false,
			}).then(res => {
				res.data.position_ids = res.data.position_ids.map(i => 'position_id-' + i);
				res.data.matter_time = [res.data.start_time + ":00", res.data.end_time + ":00"];
				res.data.is_all_depart = !!res.data.is_all_depart;
				res.data.is_all_position = !!res.data.is_all_position;
				setData(this.formData, res.data);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleSave() {
			let checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const position_ids = checkedTags.map(ele => ele.parent_id && ele.value).filter(Boolean).map(i => +i.replace('position_id-', ''));
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.formData.reminder_time) {
						if (moment(this.formData.reminder_time).isBefore(moment(), 'second')) {
							this.$Message.error('提醒时间应大于当前时间');
							this.$refs.modal.buttonLoading = false;
							return;
						} else {
							this.formData.reminder_time = moment(this.formData.reminder_time).format('YYYY-MM-DD HH:mm:ss');
						}
					}
					this.formData.start_time = moment(this.formData.matter_time[0]).format('YYYY-MM-DD HH:mm');
					this.formData.end_time = moment(this.formData.matter_time[1]).format('YYYY-MM-DD HH:mm');
				
					const param = {
						...this.formData,
						depart_ids: this.formData.push_range == 1 ? [] : this.formData.depart_ids,
						position_ids: this.formData.push_range == 1 ? [] : position_ids,
						is_all_depart: this.formData.is_all_depart ? 1 : 0,
						is_all_position: this.formData.is_all_position ? 1 : 0
					};
					delete param.matter_time;
					this.$request({
						url: '_SALE_MAIN_MATTER_SAVE_POST',
						type: "POST",
						param,
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
		},
		handleIsAllDepartChange(val) {
			if (val) {
				this.formData.depart_ids = [];
			}
		},
		handleIsAllPositionChange(val) {
			if (val) {
				this.$refs.treeSelectCheck.handleClear();
			}
		},
		matterTimeValidator(rule, value, cb) {
			if (value && value.filter(Boolean).length > 0) {
				cb();
			} else {
				cb('请选择事项时间');
			}
		}
	}
};
export const addSchedule = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
	.v-sale-main-schedule-add-schedule{
		.vc-tree-select-check{
			// .__input{
			// 	width:220px !important;
			// }
		}
		.ivu-input{
			font-size: 12px !important;
		}
		.ivu-modal-body {
			padding-right: 0
		}
	}
</style>