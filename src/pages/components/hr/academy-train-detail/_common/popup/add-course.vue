<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加课题"
		width="400px"
		class="v-hr-academy-elite-add-course"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-tb-30 g-fs-14 g-c-black2">
			<i-form 
				ref="formData" 
				:model="formData" 
				:label-width="80">
				<i-form-item
					v-for="(item, i) in formData.course"
					:prop="'course.' + i + '.title'"
					:rules="courseRule"
					:key="i"
					label="课题名称"
					class="g-relative">
					<i-input
						:key="i"
						v-model="item.title"
						:maxlength="30"
						placeholder="请输入课题名称，限30字"
						style="width: 220px"/>
					<i 
						v-if="formData.course.length >= 2"
						class="g-c-red-light iconfont icon-remove-circle g-pointer"
						style="vertical-align: middle; margin: 0 0 0 5px"
						@click="formData.course.splice(i, 1)"/>
					<i 
						v-if="i + 1 === formData.course.length"
						class="g-c-red-light iconfont icon-add1 g-c-blue-light g-pointer"
						style="vertical-align: middle; margin: 0 0 0 5px"
						@click="handleAddCourse"/>
				</i-form-item>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Input } from 'iview';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from "@utils/utils";

export default {
	name: "oa-hr-train-detail-delete-tip",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
	},
	props: {
		nowLength: Number
	},
	data() {
		return {
			visible: false,
			formData: {
				course: [
					{ title: '' }
				],
			},
			courseRule: [
				{ required: true, message: '请输入课题', trigger: 'blur' }
				// { type: 'validCompellation', message: '请用中英文', validator: dataValidity, trigger: "blur" }
			]
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$refs.formData.validateAndScroll((valid) => {
				if (valid) {
					this.$emit('sure', this.formData.course);
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleAddCourse() {
			if (this.nowLength + this.formData.course.length >= 30) {
				this.$Message.error('您已达到添加课题上限，无法再继续添加');
				return; 
			}
			this.formData.course.push({ title: '' });
		},
	}
};
export const AddCourse = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-hr-academy-elite-add-course {
    .ivu-modal-body {
        max-height: 400px;
        overflow: auto;
    }
}
</style>


