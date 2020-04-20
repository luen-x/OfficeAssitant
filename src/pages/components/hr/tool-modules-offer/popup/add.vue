<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ title }}
			</div>
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100" 
				class="g-m-t-20"
			>
				<i-form-item 
					prop="offer_name"
					label="模板名称:"
				>
					<i-input
						v-model="formValidate.offer_name"
						:maxlength="10"
						clearable
						style="width: 220px"
						placeholder="请输入模板名称"
					/>
				</i-form-item>
				<i-form-item 
					prop="type"
					label="模板类型:"
				>
					<i-select 
						v-model="formValidate.type" 
						style="width: 220px" 
						clearable 
						transfer
						placeholder="请选择模板类型"
					>
						<i-option 
							v-for="(item, index) in modulesType"
							:key="index"
							:value="item.value"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item 
					prop="description"
					label="模板简介:"
				>
					<oa-limit-words
						v-model="formValidate.description"
						:max="200"
						style="width: 220px"
						placeholder="请输入模板简介"
					/>
				</i-form-item>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import API_ROOT from '@stores/apis/root';
import { getHashUrl } from '@utils/utils';
import LimitWords from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-tool-module-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords
	},
	props: {
		title: String,
		type: String,
		info: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			modulesType: [
				{ label: '校招Offer', value: 2 },
				{ label: '社招Offer', value: 3 }
			],
			formValidate: {
				offer_name: this.info.offer_name || '',
				type: this.info.type || '',
				description: this.info.description || ''
			},
			ruleValidate: {
				offer_name: [
					{ required: true, message: '请输入模板名称', trigger: 'blur' }
				],
				type: [
					{ required: true, type: 'number', message: '请选择模板类型', trigger: 'change' }
				],
				description: [
					{ required: true, message: '请输入模板简介', trigger: 'blur' }
				],
			}
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) { 
					this.$refs.modal.buttonLoading = false;
					this.visible = false;
					app.$router.push(getHashUrl(`/hr/tool/modules/offer/add`, {
						...this.formValidate,
						offer_id: this.info.offer_id
					})); 
					this.$emit('sure');
				} else {
					this.visible = true;
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
}
</style>