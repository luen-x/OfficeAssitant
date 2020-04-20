<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="新增分类"
		width="400px"
		class="v-activity-classify-add"
		@on-ok="handleSubmit('formValidate')"
		@on-cancel="handleCancel"
	>
		<i-form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
			<i-form-item label="分类名称" prop="name">
				<i-input v-model="formValidate.name" :maxlength="8" placeholder="请输入分类名称"/>
			</i-form-item>

			<i-form-item label="上传封面图片" prop="image">
				<vc-imgs-picker 
					v-model="formValidate.image" 
					:max="1"
					@error="handleError"
				/>
				<div class="g-absolute" style="top: 18px; left: -90px">
					<p class="_tip">(作为报名时展示</p>
					<p class="_tip">&nbsp;&nbsp;&nbsp;的活动封面)</p>
				</div>
			</i-form-item>	

		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Input } from 'iview';
import { CreatePortal, ImgsPicker } from 'wya-vc';
import API_ROOT from '@stores/apis/root';

export default {
	name: "oa-activity-classify-add",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'vc-imgs-picker': ImgsPicker
	},
	data() {
		return {
			visible: false,
			formValidate: {
				name: '',
				image: []
			},
			ruleValidate: {
				name: [
					{ required: true, message: '请输入分类名称', trigger: 'blur' }
				],
				image: [
					{ required: true, type: 'array', message: '请上传封面图片', trigger: 'change' }
				],
			}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit(name) {
			this.$refs[name].validateAndScroll((valid) => {
				if (valid) {
					this.$request({
						url: API_ROOT._CONTENT_ACTIVITY_CLASSIFY_ADD_POST,
						type: "POST",
						param: {
							category_name: this.formValidate.name,
							image_url: this.formValidate.image[0]
						} }).then(res => {
						this.visible = false;
						this.$Message.success(res.msg);
						app.$store.commit('CONTENT_ACTIVITY_CLASSIFY_LIST_RESET', { type: '' });
					}).catch(err => this.$Message.error(err.msg));
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
					this.$Message(err.msg);
					this.$emit('sure');
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};
export const PModalAddNew = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.v-activity-classify-add {
	._tip {
		height: 15px;
		color: #bbb;
	}
}	
</style>

