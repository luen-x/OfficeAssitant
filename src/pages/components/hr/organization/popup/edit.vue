<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-org-edit-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				修改部门
			</div>
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100" 
				class="g-m-t-20"
			>
				<i-formitem label="上级部门:">
					{{ parentName }}
				</i-formitem>
				<i-formitem 
					prop="depart_name"
					label="部门名称:"
				>
					<i-input
						v-model="formValidate.depart_name"
						:maxlength="10"
						autofocus
						clearable
						style="width: 90%"
						placeholder="请输入部门名称"
					/>
				</i-formitem>
				<i-formitem 
					prop="abbreviation"
					label="部门简称:"
				>
					<i-input
						v-model="formValidate.abbreviation"
						:maxlength="5"
						clearable
						style="width: 90%"
						placeholder="请输入部门简称"
					/>
				</i-formitem>
				<i-formitem 
					prop="contract_company_name"
					label="关联公司:"
				>
					<i-select
						v-model="formValidate.contract_company_id" 
						placeholder="请选择关联公司" 
						style="width: 90%"
						transfer
						clearable 
					>
						<i-option 
							v-for="item of company"
							:key="item.contract_company_id"
							:value="item.contract_company_id"
						>{{ item.company_name }}</i-option>
					</i-select>
				</i-formitem>
				<i-formitem 
					v-if="level === 1"
					:rules="ruleValidate['sort']"
					prop="sort"
					label="排序:"
				>
					<i-input-number
						v-model="formValidate.sort"
						:min="1"
						:max="999"
						clearable
						style="width: 90%"
						placeholder="请输入排序(仅数字)"
					/>
				</i-formitem>
			</i-form>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Message, InputNumber, Select, Option } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from "lodash";
import API_ROOT from '@stores/apis/root';
import net from '@utils/net';

export default {
	name: 'hr-org-edit-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		title: String,
		type: String,
		departId: String | Number,
		level: Number
	},
	data() {
		let info = this.$options.propsData.data;
		return {
			visible: false,
			parentName: info.parent_name,
			formValidate: {
				depart_name: info.depart_name || '',
				abbreviation: info.abbreviation || '',
				sort: info.sort || 1,
				contract_company_id: info.contract_company_id || undefined
			},
			ruleValidate: {
				depart_name: [
					{ required: true, message: '请输入部门名称', trigger: 'blur' }
				],
				sort: [
					{ required: true, type: 'number', message: '请输入排序', trigger: 'blur' },
					{ validator: this.validateSort, trigger: 'blur' }
				],
			},
			company: []
		};
	},
	mounted() {
		this.visible = true;
		this.loadCompany();
	},
	methods: {
		validateSort: debounce(function (rule, value, callback) {
			this.$request({
				url: "_HR_ORGANIZATION_SORT_GET",
				type: "GET",
				loading: false,
				param: {
					sort: value,
					depart_id: this.departId,
				}
			}).then(res => {
				callback();
			}).catch(err => {
				return callback(new Error(err.msg));
			});
		}, 200),
		loadCompany() {
			this.$request({
				url: API_ROOT._HR_ORGANIZATION_COMPANY_GET,
				type: 'GET',
				param: {}
			}).then(res => {
				this.company = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleOk() {
			this.$refs.formValidate.validate((valid) => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit('close');
		},
		handleSave() {
			app.$store.dispatch("request", {
				url: "HR_ORGANIZATION_EDIT_POST", // eslint-disable-line
				type: 'POST',
				param: {
					depart_id: this.departId,
					depart_name: this.formValidate.depart_name,
					abbreviation: this.formValidate.abbreviation,
					sort: this.formValidate.sort,
					contract_company_id: this.formValidate.contract_company_id
				}
			}).then((res) => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const OrganizationEditModal = CreatePortal({
	onBefore({ departId }) {
		return net.ajax({
			url: API_ROOT["_HR_ORGANIZATION_INFO_GET"], // eslint-disable-line
			type: 'POST',
			param: {
				depart_id: departId
			}
		});
	}
}, module.exports.default);
</script>

<style lang="scss">
.c-org-edit-modal-container {
	.ivu-modal-wrap .ivu-modal {
		width: 400px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 0 !important;
	}
}
</style>