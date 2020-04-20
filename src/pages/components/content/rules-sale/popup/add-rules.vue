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
			class="g-pd-l-10"
			@submit.native.prevent
		>
			<i-form-item v-if="type=='record'" label="次数限制:" prop="frequency">
				<i-input-number v-model="formData.frequency" :min="1" :max="100" style="width: 220px" />
				<span>次/人/天</span>
			</i-form-item>
			<i-form-item v-if="type=='relation'" label="次数限制:" prop="frequency">
				<i-input-number v-model="formData.frequency" :min="1" :max="100" style="width: 220px" />
				<span>次/人/天</span>
			</i-form-item>
			<i-form-item v-if="type=='protect'||type=='sign'" label="原因:" prop="reason">
				<i-input v-model="formData.reason" :maxlength="15" placeholder="请输入原因" style="width: 220px" />
			</i-form-item>
			<i-form-item v-if="type=='timeReport'" label="辩护期时长:" prop="prop">
				<i-input-number v-model="formData.time_limit" :min="1" :max="999" style="width: 220px" />
				<span>h</span>
			</i-form-item>
			<i-form-item v-if="type=='timeCall'" label="通话时长:" prop="prop">
				<span>≥</span>
				<i-input-number v-model="formData.time_limit" :min="1" :max="999" style="width: 220px" />
				<span>秒</span>
			</i-form-item>
			<template v-if="type=='audit'">
				<i-form-item label="战区:" prop="depart_ids">
					<i-select
						v-model="formData.depart_ids"
						placeholder="请选择战区"
						style="width: 220px"
						multiple
						clearable
						label-in-value
						transfer
						@on-change="handleSelectDepart">
						<i-option
							v-for="item in departList"
							:key="item.value"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="审核人:" prop="staff_ids">
					<i-select
						v-model="formData.staff_ids"
						placeholder="请选择审核人"
						filterable
						clearable
						label-in-value
						transfer
						multiple
						style="width: 220px"
						@on-change="handleSelectStaff">
						<i-option
							v-for="(option, index) in staffList"
							:value="option.staff_id"
							:key="index"
						>{{ option.staff_name }} <span v-if="option.depart_name">({{ option.depart_name }})</span>
						</i-option>
					</i-select>
				</i-form-item>
			</template>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, InputNumber, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';

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
		'i-input-number': InputNumber
	},
	props: {
		data: Object, // customer_id
		type: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: '标题'
		}
	},
	data() {
		const staffValid = function (rule, value, callback) {
			if (value.length > 8) {
				return callback(new Error("最多选择8个"));
			} else {
				callback();
			}
		};
		return {
			visible: false,
			departList: [],
			staffList: [],
			formData: {
				frequency: null,
				depart_ids: [],
				staff_ids: [],
				depart_names: [],
				staff_names: [],
				time_limit: this.data.time_limit || null,
				reason: ''
			},
			rules: {
				frequency: [
					{ required: true, type: 'number', message: '请选择是否需要主负责人', trigger: 'blur' }
				],
				reason: [
					{ required: true, message: '请输入原因', trigger: 'blur' },
					{ validator: this.reasonValidator, trigger: 'blur' }

				],
				depart_ids: [
					{ required: true, type: 'array', message: '请选择战区', trigger: 'change' }
				],
				staff_ids: [
					{ required: true, type: 'array', message: '请选择审核人', trigger: 'change' },
					{ validator: staffValid, message: '最多选择8个' }
				]
			}
		};
	},
	created() {
		this.loadDepartList();
		this.loadStaffList();
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
		handleSelectStaff(v) {
			this.formData.staff_names = v.map(ele => ele.label);
		},
		handleSelectDepart(v) {
			this.formData.depart_names = v.map(ele => ele.label);
		},
		loadDepartList() {
			this.$request({
				url: '_HR_ARCHIVES_ACHIE_TREND_SEARCH_DEPART_GET',
				type: "GET",
				param: {},
				loading: false
			}).then(res => {
				this.departList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$emit('sure', this.formData);
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		loadStaffList(query) {
			return this.$request({
				url: "_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET",
				type: 'GET',
				loading: false
			}).then((res) => {
				this.staffList = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		reasonValidator(rule, value, callback) {
			if (/^[\u4e00-\u9fa5/]*$/.test(value)) {
				callback();
			} else {
				callback("只能输入中文和/");
			}

		}
	}
};
export const AddRules = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>