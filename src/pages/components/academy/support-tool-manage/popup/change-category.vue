<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="标题"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="80"
			class="g-pd-l-20"
		>
			<i-form-item label="原类目:" prop="prop">
				<div>{{ oldCategoryName }}</div>
			</i-form-item>
			<i-form-item :label-width="84" label="目标类目：" prop="category_id" >
				<oa-input-tree
					:width="220"
					:title="category_name"
					v-model="formData.category_id"
					:data-source="categoryList"
					@on-change="handleclear"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import inputTree from '../../_common/study-manage/input-tree';


export default {
	name: "oa-sale-",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-input-tree': inputTree,
	},
	props: {
		data: Object, // customer_id，
		material_ids: Array,
		old_category_name: String,
	},
	data() {
		const { query } = this.$route;
		return {
			visible: false,
			oldCategoryName: query.category_name || this.old_category_name,
			category_name: '',
			categoryList: [],
			formData: {
				category_id: null,
				material_ids: this.material_ids
			},
			rules: {
				category_id: [{ required: true, type: 'number', message: '请选择目标类目', trigger: 'change' }]
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
		this.loadCategoryList();
	},
	methods: {
		handleclear(v) {
			if (!v.target.value) this.formData.category_id = null;
		},
		loadCategoryList() {
			this.$request({
				url: '_ACADEMY_SUPPORT_TOOL_CATEGORY_ALL_GET',
				type: 'GET',
				param: { },
			}).then((res) => {
				let listString = '';
				listString = (JSON.stringify(res.data)).replace(/category_name/g, 'title');
				this.categoryList = JSON.parse(listString);
			});
		},
		handleMaterialAdjust() {
			this.$request({
				url: '_ACADEMY_SUPPORT_TOOL_MATERIAL_ADJUST_GET',
				type: 'GET',
				param: {
					...this.formData
				 },
			}).then((res) => {
				this.$Message.success(res.msg);
				this.visible = false;
				this.$emit('sure');
			}).catch(err => {
				err && console.error(err);
			});
		},
		handleOk() {
			this.$refs.form.validate(valid => {
				if (valid) { this.handleMaterialAdjust(); }
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$request({
						url: '_ACADEMY_SUPPORT_TOOL_MATERIAL_ADJUST_GET',
						type: "POST",
						param: {
							...this.formData
						},
						loading: false
					}).then(res => {
						this.$Message.success(res.msg);
						this.visible = false;
						this.$emit('sure');
					}).catch((res) => {
						this.$Message.error(res.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		}
	}
};
export const changeCategory = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
</style>