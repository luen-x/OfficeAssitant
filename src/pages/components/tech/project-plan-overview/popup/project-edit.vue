<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-tech-project-plan-overview-edit"
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
			:label-width="120"
			@submit.native.prevent
		>
			<i-form-item label="项目名称：" prop="project_name">
				<i-input
					v-model="formData.project_name"
					:maxlength="10"
					clearable
					placeholder="请输入项目名称"
					style="width: 220px;"
				/>
			</i-form-item>
			<i-form-item label="产品负责人：" prop="product_owner_id">
				<i-select
					v-model="formData.product_owner_id"
					:remote-method="(search)=>loadStaffList(search)"
					:loading="staffListLoading"
					clearable
					filterable
					remote
					transfer
					placeholder="请输入姓名搜索"
					style="width: 220px;"
				>
					<i-option 
						v-for="(item, index) in staffList" 
						:key="index" 
						:value="item.staff_id">{{ item.staff_name }}</i-option>
				</i-select>
			</i-form-item>
			<i-form-item label="项目说明：">
				<oa-limit-words 
					v-model="formData.project_description"
					placeholder="请输入功能描述"
					clearable
					style="width: 220px;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Input, Button, Form, FormItem, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: "oa-project-plan-overview-edit",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords
	},
	mixins: [orderModal],
	props: {
		title: String,
		data: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			visible: false,
			staffListLoading: false,
			staffList: [],
			formData: {// 表单
				project_id: this.data.project_id || '',
				product_owner_id: '',
				project_name: this.data.project_name || '', 
				project_description: this.data.project_description || ''
			},
			rules: {// 表单验证
				project_name: [
					{ required: true, message: '请输入项目名称', trigger: 'blur' }
				],
				product_owner_id: [
					{ required: true, type: 'number', message: '请选择产品负责人', trigger: 'change' }
				]
			},
		};
	},
	async mounted() {
		this.visible = true;
		await this.loadStaffList(this.data.product_owner_name);
		this.$nextTick(() => {
			this.formData.product_owner_id = this.data.product_owner_id || '';
		});
	},
	methods: {
		loadStaffList(search) {
			this.staffList = [];
			this.staffListLoading = true;
			return this.$request({
				url: '_CONTENT_CONFIG_GET_ALL_STAFF_BY_SEARCH_GET',
				type: 'GET',
				loading: false,
				param: { search },
				autoTip: false
			}).then((res) => {
				if (Array.isArray(res.data) && res.data.length) {
					this.staffList = res.data;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			}).finally(() => {
				this.staffListLoading = false;
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$request({
						url: '_TECH_PROJECT_PLAN_OVERVIEW_ADD_POST',
						type: 'POST',
						loading: false,
						param: { ...this.formData },
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
		}
	}
};

export const ProjectPlanOverviewEdit = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-tech-project-plan-overview-edit {
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

