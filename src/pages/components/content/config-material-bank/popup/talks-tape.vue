<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="谈判录音"
		class-name="v-content-config-talks-tape"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="ruleValidate"
			:label-width="123"
			inline>
			<i-form-item label="素材名称：" prop="tape_material_name">
				<i-input v-model="formData.tape_material_name" style="width: 300px" placeholder="录制时间+主述人+客户公司/品名"/>
			</i-form-item>
			<i-form-item label="录音日期：" prop="date_time">
				<i-date-picker
					v-model="formData.date_time"
					type="date"
					placeholder="请选择时间"
					style="width: 300px"
					@on-change="handleChangeTime"
				/>
			</i-form-item>
			<i-form-item label="录音者：" prop="tape_person_id">
				<i-select
					ref="tape"
					v-model="formData.tape_person_id"
					:remote-method="remote1"
					:loading="loading"
					placeholder="请输入关键字搜索"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					style="width: 300px"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(option, index) in tapeData"
						:value="option.staff_id"
						:key="index">{{ option.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="客户产品：" prop="customer_product">
				<i-input v-model="formData.customer_product" style="width: 300px" placeholder="请填写客户产品"/>
			</i-form-item>
			<i-form-item label="谈判手：" prop="negotiator_id">
				<i-select
					ref="negotiator"
					v-model="formData.negotiator_id"
					:remote-method="remote"
					:loading="loading1"
					placeholder="请输入关键字查询对应谈判手"
					filterable
					clearable
					transfer
					remote
					label-in-value
					class="g-m-r-5"
					style="width: 300px"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(option, index) in negotiatorData"
						:value="option.staff_id"
						:key="index">{{ option.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="沟通地点：" prop="communicate_place">
				<i-input v-model="formData.communicate_place" style="width: 300px" placeholder="请填写沟通地点"/>
			</i-form-item>
			<i-form-item label="客户基本情况：" prop="base_situation">
				<i-checkbox-group v-model="formData.base_situation" style="width: 300px" >
					<i-checkbox
						v-for="(item,index) in basicInfor"
						:key="index"
						:label="item.value"
					>{{ item.name }}</i-checkbox>
				</i-checkbox-group>
			</i-form-item>
			<i-form-item label="客户信息：" prop="customer_info">
				<oa-limit-words
					v-model="formData.customer_info"
					:placeholder="'请输入公司、对方姓名和职位'"
					:max="200"
					style="width: 300px"
				/>
			</i-form-item>
			<i-form-item class="g-m-t-20" label="沟通结果：" prop="communicate_result">
				<oa-limit-words
					v-model="formData.communicate_result"
					:placeholder="'请说明客户现场是否有签合同/打款合作、客户的认可情况、客户是否为决策人、是否需要回去告知等'"
					:max="200"
					style="width: 300px"
				/>
			</i-form-item>
			<i-form-item class="g-m-t-20" label="业务流程：" prop="operation_flow">
				<oa-limit-words
					v-model="formData.operation_flow"
					:placeholder="'请说明这个客户是第几次约见/沟通（如不是首次，请简述之前的沟通基本情况）、客户是否是参加了半天总裁策略班后的约见（或预约后的沟通等）'"
					:max="200"
					style="width: 300px"
				/>
			</i-form-item>
			<i-form-item class="g-m-t-20" label="沟通前客户存在问题：" prop="customer_problem">
				<oa-limit-words
					v-model="formData.customer_problem"
					:placeholder="'请说明客户面谈或者电话沟通前主要存在的问题是什么、此次沟通客户的意图是什么'"
					:max="200"
					style="width: 300px"
				/>
			</i-form-item>
			<i-form-item class="g-m-t-20" label="面谈前同事做了什么：" prop="colleague_do">
				<oa-limit-words
					v-model="formData.colleague_do"
					:placeholder="'请说明客户面谈前同事的价值传递做到什么程度'"
					:max="200"
					style="width: 300px"
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
import { Modal, Form, FormItem, DatePicker, Input, Select,
	Option, Button, Cascader, InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";

export default {
	name: "v-talks-tape",
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
		data: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			negotiatorData: [], // 谈判名单
			tapeData: [], // 录音者名单
			visible: false,
			loading: false,
			loading1: false,
			options1: [],
			basicInfor: [],
			formData: {
				tape_id: "", // 录音id，编辑时才有
				material_id: "", // 素材id，编辑时才有
				type: "1", // 录音类型：1-谈判录音，2-内训录音，3-咨询服务录音，4-市场支持服务中心素材
				tape_material_name: "", // 录音表单的素材名称
				tape_date: "", // 录音日期
				tape_person_id: null,
				customer_info: "",
				date_time: "",
				base_situation: [],
				customer_product: "",
				negotiator_id: null,
				communicate_place: "",
				communicate_result: "",
				operation_flow: "",
				customer_problem: "",
				colleague_do: "",
			},
			ruleValidate: {
				tape_material_name: { required: true, message: '请输入素材名称', trigger: 'blur' },
				date_time: { required: true, type: "date", message: '请选择时间', trigger: 'change' },
				tape_person_id: { required: true, type: 'number', message: '请输入关键字搜索', trigger: 'change' },
				customer_info: { required: true, message: '请输入客户信息', trigger: 'blur' },
				base_situation: { required: true, type: 'array', message: '请选择客户基本情况', trigger: 'change' },
				customer_product: { required: true, message: '请输入客户产品', trigger: 'blur' },
				communicate_result: { required: true, message: '请输入沟通结果', trigger: 'blur' },
				operation_flow: { required: true, message: '请输入业务流程', trigger: 'blur' },
				customer_problem: { required: true, message: '请输入沟通前客户存在问题', trigger: 'blur' },
				colleague_do: { required: true, message: '请输入面谈前同事做了什么', trigger: 'blur' },
				communicate_place: { required: true, message: '请输入沟通地点', trigger: 'blur' },
				negotiator_id: { required: true, type: 'number', message: '请输入谈判手', trigger: 'blur' },

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
			this.$nextTick(() => {
				this.remote(this.content.negotiator);
				this.remote1(this.content.tape_person);
				// this.$refs.negotiator.clearSingleSelect();
				// this.$refs.tape.clearSingleSelect();
			});
		}
	},
	mounted() {
		this.visible = true;
		this.loadbasic();
	},
	methods: {
		loadbasic() {
			this.$request({
				url: API._CONTENT_CONFIG_MATERIAL_GET_tape_data_GET,
				type: "get",
			}).then(res => {
				this.basicInfor = res.data.base_situation;
			});
		},
		remoteMethod1(query) {
			if (query !== '') {
				this.loading1 = true;
				setTimeout(() => {
					this.loading1 = false;
				}, 200);
			} else {
				this.options1 = [];
			}
		},
		loadData(api) {
			this.$request({
				url: API.CONTENT_PRODUCT_SKU_COMPONENT_TYPE_GET,
				type: "get",
			}).then(res => {
				this.stuffList = res.data;
			});
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
		remote1(query) {
			if (query !== '') {
				this.loading1 = true;
				this.handleLoadStaffData(query, 1);
			}
		},
		remote(query) {
			if (query !== '') {
				this.loading = true;
				this.handleLoadStaffData(query, 2);
			}
		},


		handleChangeTime(t) {
			this.formData.tape_date = t;
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
					this.negotiatorData = res.data;
				}
			});
		},
		handleQueryChange(query = '') {
			return;
		},
	}
};
export const TalksTape = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
    .v-content-config-talks-tape {
		.ivu-modal-body {
            height: 500px;
			overflow: auto;
			padding-left: 40px;
        }
        .ivu-form-item {
            width: 343px;
        }
        .ivu-checkbox-group-item {
			margin-bottom: 10px;
			margin-right: 40px;
        }
    }
</style>

