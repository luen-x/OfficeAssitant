<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="市场支持服务中心素材"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="123">
			<i-form-item label="素材名称：" prop="tape_material_name">
				<i-input v-model="formData.tape_material_name" style="width: 220px" placeholder="请输入提供人+内容板块+品牌商或同行名称"/>
			</i-form-item>

			<i-form-item label="内容简介：" prop="content_validity">
				<oa-limit-words
					v-model="formData.content_validity"
					:placeholder="'请填写内容简介'"
					:max="200"
					style="width: 220px;margin-bottom:20px"
				/>
			</i-form-item>

			<i-form-item label="所属板块：" prop="belong_plate">
				<i-select v-model="formData.belong_plate" style="width: 220px" placeholder="请选择所属板块" >
					<i-option :value="1">同行信息</i-option>
					<i-option :value="2">品牌商</i-option>
				</i-select>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">提交</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option, Button, Cascader, InputNumber, RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";

export default {
	name: "v-service-material",
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
			formData: {
				tape_id: "", // 录音id，编辑时才有
				material_id: "", // 素材id，编辑时才有
				type: "4", // 录音类型：1-谈判录音，2-内训录音，3-咨询服务录音，4-市场支持服务中心素材
				tape_material_name: "", // "编辑素材名称", // 录音表单的素材名称
				content_validity: "", // "编辑内容简介", // 内容简介
				belong_plate: null, // "1"// 所属板块，1-同行信息，2-品牌商
			},
			ruleValidate: {
				tape_material_name: { required: true, message: '请输入素材名称', trigger: 'blur' },
				content_validity: { required: true, message: '请选择录音者', trigger: 'blur' },
				belong_plate: { required: true, type: "number", message: '请选择客户公司类型', trigger: 'change' },

			},
		};
	},
	computed: {
		content() {
			return this.data.content || '';
		}
	},
	created() {

	},
	mounted() {
		this.visible = true;
		if (this.content) {
			Object.keys(this.content).forEach(key => {
				this.formData[key] = this.content[key];
			});
		}
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
	}
};
export const ServiceMaterial = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>

