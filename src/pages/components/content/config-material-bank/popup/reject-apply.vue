<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="驳回申请"
		class-name="v-content-config-reject-apply"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form ref="form" :model="formData" :rules="ruleValidate" :label-width="123">
			<i-form-item label="驳回原因：" prop="refuse_reason">
				<oa-limit-words
					v-model="formData.refuse_reason"
					:placeholder="'请输入驳回原因'"
					:max="200"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";

export default {
	name: "v-trained-tape",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-button": Button,
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
				refuse_reason: '',
				material_id: ''
			},
			ruleValidate: {
				refuse_reason: { required: true, message: '请输入驳回原因', trigger: 'blur' },

			},
		};
	},
	computed: {

	},
	created() {
		if (this.data) {
			this.formData.material_id = this.data.material_id;
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
export const RejectApply = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-content-config-reject-apply{
 .ivu-checkbox-group-item{
	 margin-bottom: 10px;
 }
}

</style>

