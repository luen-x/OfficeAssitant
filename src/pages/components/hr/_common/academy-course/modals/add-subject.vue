<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加课题"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="90"
			class="g-pd-l-10"
		>
			<i-form-item v-for="(subject,index) in formData.subjects" :key="subject.uuid" label="课题名称:" prop="subject_name">
				<i-cascader
					v-model="subject.subject_id"
					:data="subjectTree"
					transfer
					filterable
					clearable
					class="g-m-r-5"
					placeholder="请选择课题"
					style="width: 220px"
				/>
				<i
					v-if="index>0 ||(formData.subjects.length>1)"
					class="icon iconfont g-c-red-mid g-pointer icon-remove-circle"
					style="position:relative;top:2px"
					@click="handleRemoveSubject(index)"
				/>
				<i
					v-if="formData.subjects.length<5 && index== formData.subjects.length-1 "
					class="icon iconfont g-c-blue-mid g-pointer icon-add1"
					style="position:relative;top:2px"
					@click="handleAddSubject"
				/>
			</i-form-item>
			<!-- <i-form-item>
				<oa-tree-select
					v-model="formData.subject_id"
					:label-in-value="true"
					:data-source="subjectTree"
					:last-select="true"
					placeholder="请选择课题"
					:width="220"
				/>
			</i-form-item> -->
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, Cascader } from 'iview';
import Explain from '@components/_common/explain/explain';
import TreeSelect from "@common/tree-select/tree-select";
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import API from '@stores/apis/root';
import { services } from '@stores/services/hr';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-add-conatct",
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
		'i-cascader': Cascader,
		'oa-tree-select': TreeSelect,
	},
	mixins: [services.subjectTree()],
	props: {
		subjects: Array 
	},
	data() {

		return {
			visible: false,
			searchLoading: false,
			formData: {
				subject_id: [],
				subjects: (this.subjects && this.subjects.length > 0) ? this.subjects.map(item => ({
					subject_id: item,
					uuid: Math.random(),
				})) : [{
					subject_id: [],
					uuid: Math.random(),
				}]
			},
			rules: {
				subject: [{ required: true, type: 'array', message: '请选择课题', trigger: "change" }]
			}
		};
	},
	mounted() {
		this.visible = true;
		// this.searchSelectedDepart(this.subjectTree, this.subjects);
	},
	methods: {
		// searchSelectedDepart(departArr, selectedIds) {
		// 	for (let depart of departArr) {
		// 		if (selectedIds.includes(depart.value + "")) {
		// 			const selectedDepart = {
		// 				value: depart.value,
		// 				label: depart.label
		// 			};

		// 			this.formData.subject_id.push(selectedDepart);

		// 			if (this.formData.subject_id.length === selectedIds.length) return;
		// 		}

		// 		if (depart.children && depart.children.length) {
		// 			this.searchSelectedDepart(depart.children, selectedIds);
		// 		}
		// 	}
		// },
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleRemoveSubject(index) {
			this.formData.subjects.splice(index, 1);
		},
		handleAddSubject() {
			this.formData.subjects.push({
				subject_id: [],
				uuid: Math.random(),
			});

		},
		handleSave: debounce(function () {
			if (this.isDuplicate()) {
				this.$Message.error("不能关联相同的课程");
				this.$refs.modal.buttonLoading = false;
				return;
			}
			this.$refs.form.validate(valid => {
				if (!valid) {
					this.$refs.modal.buttonLoading = false;
					return;
				}
				this.handleOk(this.formData.subjects.map(item => item.subject_id).filter(item => item.length));
			});
		}, 200),
		isDuplicate() {
			const arr = this.formData.subjects;
			for (let i = 0; i < arr.length - 1; i++) {
				for (let j = i + 1; j < arr.length; j++) {
					if (arr[i].subject_id[arr[i].subject_id.length - 1] == arr[j].subject_id[arr[j].subject_id.length - 1]) {
						return true;
					}
				}
			}

		}
	}
};
export const AddSubject = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
</style>

