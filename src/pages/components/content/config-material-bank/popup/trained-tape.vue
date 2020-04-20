<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="内训录音"
		width="400"
		class-name="v-content-config-trained-tape"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="123">
			<i-form-item label="素材名称：" prop="tape_material_name">
				<i-input v-model="formData.tape_material_name" style="width: 220px" placeholder="请输入录制的时间+主述人+本次培训主题"/>
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
						:value="option.staff_id "
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
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
						:value="option.staff_id "
						:key="index"
					>{{ option.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="培训主题：" prop="train_theme">
				<i-input v-model="formData.train_theme" :maxlength="50" style="width: 220px" placeholder="请填写培训主题"/>
			</i-form-item>
			<i-form-item label="培训大纲：" prop="train_program">
				<oa-limit-words
					v-model="formData.train_program"
					:placeholder="'请填写本次培训的主要内容大纲'"
					:max="200"
					style="width: 220px;margin-bottom:20px"
				/>
			</i-form-item>
			<i-form-item label="培训对象：" prop="train_object">
				<oa-limit-words
					v-model="formData.train_object"
					:placeholder="'请填写本次培训的主要学习对象'"
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
import { Modal, Form, FormItem, DatePicker, Input, Select, Option,
	Button, Cascader, InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";

export default {
	name: "v-trained-tape",
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
		'i-select': Select,
		'i-option': Option,
		"i-button": Button,
		'i-date-picker': DatePicker
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
			options1: [],
			depart_id: [],
			tapeData: [], //
			chiefData: [], //
			formData: {
				tape_id: "", // "录音ID",
				material_id: "", // "素材ID",
				type: "2", // "录音类型",
				tape_material_name: "", // "素材名称",
				date_time: "",
				tape_date: "", // "2019-04-17",//录音日期
				tape_person_id: "", // "录音者ID",
				chief_prosecutor_id: "", // "主述人ID",
				train_theme: "", // "培训主题",
				train_program: "", // "培训大纲",
				train_object: "", // "培训对象",
			},
			ruleValidate: {
				tape_material_name: { required: true, message: '请输入素材名称', trigger: 'blur' },
				train_theme: { required: true, message: '请输入培训主题', trigger: 'blur' },
				train_program: { required: true, message: '请输入培训大纲', trigger: 'blur' },
				train_object: { required: true, message: '请输入培训对象', trigger: 'blur' },
				date_time: { required: true, type: "date", message: '请选择时间', trigger: 'change' },
				tape_person_id: { required: true, type: 'number', message: '请选择录音者', trigger: 'change' },
				chief_prosecutor_id: { required: true, type: 'number', message: '请选择主述人', trigger: 'change' },
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
			this.remote(this.content.tape_person_name);
			this.remote1(this.content.chief_prosecutor);
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
		handleOk() {
			this.formData.tape_date.toString();
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
	}
};
export const TrainedTape = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
 .v-content-config-trained-tape {
        .ivu-modal-body {
            height: 500px;
            overflow: auto;
        }
    }
</style>

