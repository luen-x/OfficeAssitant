<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-collage-distribute-nest-edit"
		@on-ok="handleOk"
		@on-close="handleCancel"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<i-form 
			ref="form" 
			:model="formData" 
			:rules="rules" 
			:label-width="110"
			@submit.native.prevent
		>
			<i-form-item label="套系名称：" prop="lecture_set_id">
				<i-select
					v-model="formData.lecture_set_id"
					:multiple="isEdit ? false : true"
					filterable
					style="width: 220px;"
					class="g-m-r-5"
					clearable
					transfer
					placeholder="请选择套系名称"
					@on-change="handleLectureChange"
				>
					<!--防止空格产生BUG-->
					<i-option 
						v-for="(item, index) in lectureList" 
						:value="item.lecture_set_id" 
						:key="index"
					>{{ item.name }}</i-option>
				</i-select>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-distribute-nest-edit",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option
	},
	mixins: [orderModal],
	props: {
		title: String,
		isEdit: Boolean,
		lessonId: [String, Number],
		projectId: [String, Number],
		lessonType: [String, Number],
		lectureSetId: [String, Number]
	},
	data() {
		return {
			visible: false,
			lectureListLoading: false,
			lectureList: [],
			formData: {// 表单
				lecture_set_id: this.isEdit ? this.lectureSetId : []
			},
			rules: {// 表单验证
				lecture_set_id: [
					{ required: true, type: (this.isEdit ? "number" : "array"), message: "请选择套系", trigger: "change" }
				]
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		loadData() {
			return this.$request({
				url: '_COLLAGE_BUSINESS_LECTURE_SET_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					type: 1
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data)) {
					this.lectureList = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		/**
		 * 监听套系搜索的change事件
		 */
		handleLectureChange(e) {
			this.$nextTick(() => {
				if (this.formData.lecture_set_id.length > 10) {
					const v = [...this.$refs.lecture.values];
					this.$refs.lecture.$children[0].removeTag(v[v.length - 1]);
				}
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					let param = { ...this.formData };
					let url = '';
					if (this.isEdit) {
						url = '_COLLAGE_BUSINESS_CHANGE_LESSON_POST';
						param = {
							...param,
							lesson_id: this.lessonId
						};
					} else {
						url = '_COLLAGE_BUSINESS_ADD_LESSON_POST';
						param = {
							...param,
							project_id: this.projectId,
							lesson_type: this.lessonType,
						};
					}

					this.$request({
						url,
						type: "POST",
						loading: false,
						param,
						autoTip: true
					}).then(res => {
						this.$refs.modal.buttonLoading = false;
						this.visible = false;
						this.$emit('sure');
					}).catch(error => {
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		}
	}
};

export const DistributeNestEdit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-collage-distribute-nest-edit {
	.ivu-select {
		width: 220px;
	}
	.ivu-select-input::placeholder {
		color: #333;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

