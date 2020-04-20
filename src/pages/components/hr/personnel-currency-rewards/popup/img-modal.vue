<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="微币政策文件"
		width="400"
		class="v-hr-personnel-currency-rewards-img-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:label-width="100"
			:model="formData" 
			:rules="ruleValidate" 
			class="g-pd-l-10"
		>
			<i-form-item ref="img" label="道具主图：" prop="img_urls">
				<oa-imgs-picker
					v-model="formData.img_urls"
					:max="10"
					@change="handleImgChange"
					@error="handleError"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import ImgsPicker from '@common/imgs-picker/imgs-picker';

export default {
	name: "v-hr-personnel-currency-rewards-img-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'i-input-number': InputNumber,
		'oa-imgs-picker': ImgsPicker,
	},
	props: {
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			formData: {
				img_urls: [],
			},
			ruleValidate: {
				img_urls: [
					{ required: true, type: 'array', message: '请选择主图', trigger: 'change' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			this.$request({
				url: '_HR_PERSONNEL_CURRENCY_COIN_POLICY_IMG_GET',
				type: 'GET',
			}).then((res) => {
				this.formData.img_urls = res.data.map(v => v.url);
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleImgChange(val) {
			this.$refs.form.validateField("img_urls");
		},
		handleOk(res) {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleSave() {
			let param = {
				...this.formData
			};
			this.$request({
				url: `_SALE_PROPERTY_CONTROL_PROPERTY_CONIN_IMAGE_SAVE_POST`, // eslint-disable-line
				type: "POST",
				param
			}).then((res) => {
				this.$Message.success('调整成功');
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const ImgModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-personnel-currency-rewards-img-modal {
    ._select {
        .ivu-form-item-content {
            margin-left: 28px !important;
        }
    }
}
</style>

