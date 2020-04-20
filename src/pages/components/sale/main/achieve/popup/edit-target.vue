<template>
	<div class="page">
		<i-modal
			ref="modal"
			v-model="visible"
			:mask-closable="false"
			:loading="true"
			title="编辑目标"
			width="400"
			@on-ok="handleOk"
			@on-cancel="handleCancel">
			<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="120">
				<i-form-item style="margin-right: 25px;" label="目标类型：" prop="type">
					<i-select v-model="formData.type" @on-change="handleType" >
						<i-option :value="1">月度目标</i-option>
						<i-option :value="2">季度目标</i-option>
						<i-option :value="3">年度目标</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-if="formData.type==2" style="margin-right: 25px;" label="季度时间：" prop="type">
					<i-select v-model="formData.config_id" @on-change="loadData" >
						<i-option v-for="(item) in cofigList" :value="item.config_id" :key="item.config_id" >
							{{ item.start_time+'~'+item.end_time }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item v-else :label="dateLabel[formData.type-1]" style="margin-right: 25px;" prop="type">
					<i-date-picker
						v-model="dateValue"
						:type="dateType[formData.type-1]"
						:options="{disabledDate:dateDisable}"
						:placeholder="datePlaceholder[formData.type-1]"
						transfer
						style="width: 220px;margin-right:2px"
						@on-change="handleChangeMonth"
					/>
				</i-form-item>
				<i-form-item style="margin-right: 25px;" label=" 保底目标：" prop="min_target">
					<span class="_number-append">万</span>
					<i-input-number
						:max="9999.99"
						:disabled="!can_edit"
						:active-change="false"
						v-model="formData.min_target"
						:precision="2"
						:min="0"
						class="_input"
						placeholder="请输入保底目标"
					/>
				</i-form-item>
				<i-form-item style="margin-right: 25px;" label=" 平衡目标：" prop="target">
					<span class="_number-append">万</span>
					<i-input-number
						:max="9999.99"
						:min="0"
						:disabled="!can_edit"
						v-model="formData.target"
						:precision="2"
						:active-change="false"
						class="_input"
						placeholder="请输入平衡目标"
					/>
				</i-form-item>
				<i-form-item style="margin-right: 25px;" label=" 冲刺目标：" prop="max_target">
					<span class="_number-append">万</span>
					<i-input-number
						:max="9999.99"
						:disabled="!can_edit"
						:min="0"
						:precision="2"
						:active-change="false"
						v-model="formData.max_target"
						class="_input"
						placeholder="请输入冲刺目标"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>
<script type="text/ecmascript-6">
import { Modal, Form, FormItem, Input, Button, InputNumber, Select, Option, DatePicker } from 'iview';
import API from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { getLevel } from '@components/sale/_common/util';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-input-number": InputNumber,
	},
	props: {
		data: Object,
		type: {
			type: [String, Number],
			default: 1 // 目标类型 1月度 2季度 3年度
		},
		date: {
			type: [String, Number],
			default: '' // 目标类型 1月度 2季度 3年度
		},
		config_id: {
			type: [String, Number],
			default: '' // 季度时间
		}
	},
	data() {
		return {
			dateType: ['month', '', 'year'],
			datePlaceholder: ['请选择月份', '', '请选择年份'],
			dateLabel: ['月度时间：', '', '年度时间：'],
			visible: false,
			getLevel,
			cofigList: [],
			dateValue: this.date,
			can_edit: 1,
			formData: {
				target_id: '',
				month: '', // 月份
				type: Number(this.type), //  目标类型 1月度 2季度 3年度
				config_id: '',
				year: '',
				min_target: null,
				target: null,
				max_target: null,
			},
			ruleValidate: {
				min_target: [
					{ required: true, type: 'number', message: '请输入保底目标', trigger: 'blur' }
				],
				target: [
					{ required: true, type: 'number', message: '请输入平衡目标', trigger: 'blur' }
				],
				max_target: [
					{ required: true, type: 'number', message: '请输入冲刺目标', trigger: 'blur' }
				],
				type: [
					{ required: true, type: 'number', message: '请选择目标类型', trigger: 'change' }
				],
				time_range: [
					{ required: true, message: '请输入时间类型', trigger: 'change' }
				],
			}
		};
	},
	computed: {
		level() {
			return getLevel();
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	async mounted() {
		this.visible = true;
		this.$nextTick(() => {
			this.dateValue = this.date;
		});
		const { data } = await this.loadTargetConfig();
		this.cofigList = data;
		this.quarter = data.find(it => {
			return it.default == 1;
		}) || {};
		this.formData.config_id = this.config_id || (this.quarter ? this.quarter.config_id : '');
		await this.loadData();
		// this.handleType();

	},
	methods: {
		handleChangeMonth(v) {
			this.dateValue = v;
			this.loadData();
		},
		loadTargetConfig() {
			return 	this.$request({
				url: '_SALE_MAIN_TARGET_CONFIG_GET',
				type: "GET",
				loading: false,
			});
		},
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		dateDisable(date) {
			return this.formData.type == 1 ? !(moment().format('YYYY-MM')
			< moment(date).add(1, 'month').format('YYYY-MM')) : !(moment().format('YYYY') < moment(date).add(1, 'year').format('YYYY'));
		},
		// 查看业绩设置
		loadData() {
			this.$request({
				url: '_SALE_MAIN_TARGET_DETAIL_GET',
				type: "get",
				param: {
					month: moment(this.dateValue).format('YYYY-MM'),
					year: moment(this.dateValue).format('YYYY'),
					config_id: this.formData.config_id,
					type: this.type,
				}
			}).then(res => {
				Object.keys(res.data).forEach(key => {
					this.formData[key] = res.data[key];
				});
				this.can_edit = this.formData.can_edit;
				this.formData.min_target = this.formData.min_target == '0.00' ? 0 : Number(this.formData.min_target);
				this.formData.target = this.formData.target == '0.00' ? 0 : Number(this.formData.target);
				this.formData.max_target = this.formData.max_target == '0.00' ? 0 : Number(this.formData.max_target);
			}).catch(error => {
				console.error(error);
			});
		},
		saveTarget() {
			if ([1, 3].includes(this.formData.type)) {
				this.formData.month = moment(this.dateValue).format('YYYY-MM');
				this.formData.year = moment(this.dateValue).format('YYYY');
			}
			this.$request({
				url: API._SALE_MAIN_TARGET_CREATE_POST,
				type: "post",
				param: {
					...this.formData
				}
			}).then(res => {
				this.$emit('sure');
			}).catch(error => {
				this.$Message.warning(error.msg);
				this.$refs.modal.buttonLoading = false;
				console.error(error);
			});
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			if (!(this.formData.target * this.formData.min_target * this.formData.max_target > 0)) {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('编辑的目标不能为0');
				return;
			}
			if (this.formData.target > this.formData.min_target && this.formData.max_target > this.formData.target) {
				this.saveTarget();
			} else {
				this.$refs.modal.buttonLoading = false;
				this.$Message.error('冲刺目标必须大于平衡目标，平衡目标必须大于保底目标');
			}
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleType(v) {
			this.type = v;
			this.loadData();
		}
	}
};
export const editTarget = CreatePortal({}, module.exports.default);
</script>

<style scoped lang="scss">
	._number-append {
		display: inline-block;
		position: absolute;
		right: 7px;
		vertical-align: bottom;
		z-index: 1;
		color: gray;
	}
	/deep/ .ivu-input-number {
		width: 100% !important;
		.ivu-input-number-handler-wrap {
			display: none !important;
		}
	}
</style>
