<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="咨询服务录音"
		class-name="v-content-config-inform-tape"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="123">
			<i-form-item label="素材名称：" prop="tape_material_name">
				<i-input v-model="formData.tape_material_name" placeholder="请输入录制的时间+主持人+客户公司/品名"/>
			</i-form-item>
			<i-form-item label="录音日期：" prop="date_time">
				<i-date-picker
					v-model="formData.date_time"
					type="date"
					placeholder="请选择时间"
					style="width: 220px"
					@on-change="handleChangeTime"
				/>
			</i-form-item>
			<i-form-item label="录音者：" prop="tape_person_id">
				<i-select
					ref="tape"
					v-model="formData.tape_person_id"
					:remote-method="remote"
					:loading="loading"
					placeholder="请输入录音者"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					style="width: 220px"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(option, index) in tapeData"
						:value="option.staff_id"
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="客户信息：" prop="customer_info">
				<oa-limit-words
					v-model="formData.customer_info"
					:placeholder="'公司、对方的姓名和职位'"
					:max="200"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="主述人：" prop="chief_prosecutor_id">
				<i-select
					ref="chief"
					v-model="formData.chief_prosecutor_id"
					:remote-method="remote1"
					:loading="loading1"
					placeholder="请输入主述人"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					style="width: 220px"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(option, index) in chiefData"
						:value="option.staff_id"
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="客户公司类型：" prop="company_type">
				<i-select v-model="formData.company_type" style="width: 220px" placeholder="请选择">
					<i-option :value="1">传统企业</i-option>
					<i-option :value="2">微信企业</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="咨询信息：" prop="advisory_information">
				<oa-limit-words
					v-model="formData.advisory_information"
					:placeholder="'请说明这是第几次预约咨询。如果不是第一次，请简述前几次预约咨询沟通的问题'"
					:max="200"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="预约目的：" prop="reservation_purpose">
				<oa-limit-words
					v-model="formData.reservation_purpose"
					:placeholder="'请说明客户本次预约的主要目的的是什么，本次咨询主要帮客户解决了什么问题'"
					:max="200"
					style="width: 220px"
				/>
			</i-form-item>
			<i-form-item label="客户所处阶段：" prop="customer_stage">
				<oa-limit-words
					v-model="formData.customer_stage"
					:placeholder="'请说明目前客户做微商是处于哪个阶段'"
					:max="200"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">提交</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input,
	Select, Option, DatePicker, Button, Cascader,
	InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";

export default {
	name: "v-inform-tape",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-checkbox-group": CheckboxGroup,
		"i-checkbox": Checkbox,
		'i-cascader': Cascader,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		"i-button": Button
	},
	mixins: [
		services.departMy()
	],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			loading1: false,
			loading: false,
			tapeData: [], //
			chiefData: [], //
			formData: {
				tape_id: '', // "录音ID",
				material_id: '', // "素材ID",
				type: 3, // "录音类型",
				tape_material_name: '', // "素材名称",
				tape_date: '', // "录音日期",
				tape_person_id: '', // "录音者",
				chief_prosecutor_id: '', // "主述人ID",
				customer_info: '', // "客户信息",
				company_type: '', // "1", // 1-传统企业，2-微商企业
				advisory_information: '', // "咨询信息",
				reservation_purpose: '', // "预约目的",
				customer_stage: '', // "客户所处阶段",
				date_time: "",
			},
			ruleValidate: {
				tape_material_name: { required: true, message: '请输入素材名称', trigger: 'blur' },
				date_time: { required: true, type: "date", message: '请选择时间', trigger: 'change' },
				chief_prosecutor_id: { required: true, type: 'number', message: '请选择主述人', trigger: 'change' },
				tape_person_id: { required: true, type: 'number', message: '请选择录音者', trigger: 'change' },
				company_type: { required: true, type: 'number', message: '请选择客户公司类型', trigger: 'change' },
				advisory_information: { required: true, message: '请输入咨询信息', trigger: 'blur' },
				reservation_purpose: { required: true, message: '请输入预约目的', trigger: 'blur' },
				customer_stage: { required: true, message: '请输入客户所处阶段', trigger: 'blur' },

			},
		};
	},
	computed: {
		content() {
			return this.data.content;
		}
	},
	created() {
		if (this.content) {
			Object.keys(this.content).forEach(key => {
				this.formData[key] = this.content[key];
			});
			this.formData.date_time = this.formData.tape_date;
			this.formData.company_type = this.formData.company_type;
			this.remote1(this.content.chief_prosecutor_name);
			this.remote(this.content.tape_person_name);
			this.$nextTick(() => {
				this.$refs.chief.clearSingleSelect();
				this.$refs.tape.clearSingleSelect();
			});
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData(api) {
			this.$request({
				url: API.CONTENT_PRODUCT_SKU_COMPONENT_TYPE_GET,
				type: "get",
			}).then(res => {
				this.stuffList = res.data;
			});
		},
		remote(query) {
			if (query !== '') {
				this.loading = true;
				this.handleLoadStaffData(query, 1);
			}
		},
		remote1(query) {
			if (query !== '') {
				this.loading1 = true;
				this.handleLoadStaffData(query, 2);
			}
		},
		handleLoadStaffData(query, type) {
			return this.$request({
				url: API._CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET,
				type: 'GET',
				param: {
					search: query // 为了能搜索到全部的员工数据（手机号码必定有1）
				},
				loading: false
			}).then((res) => {
				this.loading1 = false;
				this.loading = false;
				// this.staffData = initTreeData(res.data, 'staff_id', 'staff_name');
				if (type == 1) {
					this.tapeData = res.data;
				} else if (type == 2) {
					this.chiefData = res.data;
				}
			});
		},
		handleQueryChange(query = '') {
			return;
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.visible = false;
					this.$emit('sure', this.formData);
				} else {
					this.$Message.error('内容请填写完整');
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleChangeTime(t) {
			this.formData.tape_date = t;
		},
	}
};
export const InformTape = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
    .v-content-config-inform-tape {
        .ivu-modal-body {
            height: 500px;
            overflow: auto;
        }
    }
</style>

