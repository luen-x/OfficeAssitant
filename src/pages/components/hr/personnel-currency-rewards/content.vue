<template>
	<div class="v-hr-personnel-currency-rewards">
		<div v-if="!edit">
			<div class="g-tr g-m-t-20 g-m-r-20">
				<span 
					v-if="showEdit" 
					class="g-red-btn-line"
					@click="handleEdit"
				>
					编辑
				</span>
			</div>
			<oa-editor-preview :content="url_text" style="padding: 20px 200px 20px 200px" />
		</div>
		<div v-else class="g-flex-cc">
			<i-form 
				ref="form" 
				:model="formData"
				:rules="formDataRule" 
				:label-width="0" 
				class="g-m-b-30 g-m-t-30"
				position="left"
				@submit.native.prevent
			>
				<i-form-item label="" prop="url_text">
					<vc-editor
						ref="editor"
						v-model="formData.url_text"
						:options="options"
						style="min-width:400px;width:825px;"
						@file-error="handleError"
					/>	
				</i-form-item>
			</i-form>
			<div class="_footer g-flex-cc">
				<div
					class="g-gray-btn-small g-m-r-10"
					style="font-size: 12px;"
					@click="handleCancel"
				>
					取消
				</div>
				<i-button
					type="primary"
					@click="handleOk"
				>
					保存
				</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import { 
	Form, FormItem, Button
} from 'iview';
import { Editor } from "wya-vc";
import { Confirm } from '@common/confirm/confirm';
import EditorPreview from '@common/editor-preview/editor-preview';
import { ImgModal } from './popup/img-modal';

export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		"vc-editor": Editor,
		"i-button": Button,
		'oa-editor-preview': EditorPreview
	},
	data() {
		return {
			edit: false,
			url_text: '',
			formData: {
				url_text: ''
			},
			formDataRule: {
				url_text: [
					{ required: true, message: '请填写微币奖惩政策', trigger: 'change' }
				],
			},
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
		};
	},
	computed: {
		showEdit() {
			return this.$route.path.includes('sale');
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		handleCancel() {
			Confirm.popup({
				title: "",
				msg: '取消后，所填写的内容将不会保存，是否确认取消？',
				showIcon: true
			}).then(() => {
				this.edit = false;
			}).catch(error => {
			});
		},
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		loadData() {
			this.$request({
				url: '_HR_PERSONNEL_CURRENCY_COIN_POLICY_IMG_GET',
				type: 'GET',
			}).then((res) => {
				this.formData.url_text = res.data.url_text;
				this.url_text = res.data.url_text;
			}).catch((error) => {
				console.error(error, 'error');
			});
		},
		handleEdit() {
			this.edit = true;
		},
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.handleSave();
				}
			});
		},
		handleSave() {
			this.$request({
				url: `_SALE_PROPERTY_CONTROL_PROPERTY_CONIN_IMAGE_SAVE_POST`, // eslint-disable-line
				type: "POST",
				param: {
					url_text: this.formData.url_text
				}
			}).then((res) => {
				this.$Message.success('保存成功');
				this.edit = false;
				this.loadData();
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-personnel-currency-rewards {
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 45px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	em{
		font-style:italic;
	}

	b, strong{
		em{
			font-weight: bolder;
			font-style:italic;
		}
	}
}
</style>
