<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-org-add-modal-container"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				添加下级部门
			</div>
			<i-form 
				ref="formValidate" 
				:model="formValidate" 
				:rules="ruleValidate"
				:label-width="100" 
				class="g-m-t-20"
			>
				<i-form-item label="当前部门:">
					{{ departName }}
				</i-form-item>
				<div class="_content">
					<div 
						v-for="(depart, index) in formValidate.son_depart"
						:key="depart.depart_id"
						class="g-flex g-fw-w"
					>
						<i-form-item 
							:prop="`son_depart.${index}.depart_name`"
							:rules="ruleValidate['depart_name']"
							label="部门名称:"
						>
							<i-input
								v-model="depart.depart_name"
								:maxlength="10"
								clearable
								style="width: 220px"
								placeholder="请输入部门名称"
							/>
						</i-form-item>
						<i-form-item 
							:prop="`son_depart.${index}.abbreviation`"
							label="部门简称:"
						>
							<i-input
								v-model="depart.abbreviation"
								:maxlength="5"
								clearable
								style="width: 220px"
								placeholder="请输入部门简称(可为空)"
							/>
						</i-form-item>
						<br >
						<i-form-item 
							:prop="`son_depart.${index}.contract_company_name`"
							label="关联公司:"
						>
							<i-select
								v-model="depart.contract_company_id" 
								placeholder="请选择关联公司" 
								style="width: 220px"
								transfer
								clearable 
							>
								<i-option 
									v-for="item of company"
									:key="item.contract_company_id"
									:value="item.contract_company_id"
								>{{ item.company_name }}</i-option>
							</i-select>
						</i-form-item>
						<i-form-item 
							v-if="level === 0"
							:prop="`son_depart.${index}.sort`"
							:rules="ruleValidate['sort']"
							label="排序:"
						>
							<i-input-number
								v-model="depart.sort"
								:min="1"
								:max="999"
								clearable
								style="width: 220px"
								placeholder="请输入排序(仅数字)"
							/>
						</i-form-item>
						<i 
							v-if="index > 0"
							class="iconfont icon-remove-circle g-c-red-dark g-fs-20 g-m-b-20 g-m-l-10"
							@click="handleDel(depart.depart_id)" 
						/>
					</div>
				</div>
				<i-form-item label="">
					<div 
						class="g-red-btn-line"
						@click="handleAdd"
					>
						添加
					</div>
				</i-form-item>
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
	name: 'hr-org-add-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		title: String,
		type: String,
		departName: String,
		departId: String | Number,
		level: Number
	},
	data() {
		return {
			visible: false,
			formValidate: {
				son_depart: [
					{ depart_name: '', abbreviation: '', depart_id: new Date().getTime(), sort: null }
				]
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
		validateSort(rule, value, callback) {
			this.$request({
				url: "_HR_ORGANIZATION_SORT_GET",
				type: "GET",
				loading: false,
				param: {
					sort: value
				}
			}).then(res => {
				callback();
			}).catch(err => {
				callback(new Error(err.msg));
			});
			this.$refs.modal.buttonLoading = false;
		},
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
		handleAdd() {
			this.formValidate.son_depart.push({ 
				depart_name: '', 
				abbreviation: '', 
				depart_id: new Date().getTime(),
				sort: null
			});
		},
		handleDel(id) {
			this.formValidate.son_depart = this.formValidate.son_depart.filter((item) => {
				return item.depart_id != id; 
			});
		},
		handleSave() {
			let arr = this.formValidate['son_depart'].map((item) => {// eslint-disable-line
				return {
					depart_name: item.depart_name, 
					abbreviation: item.abbreviation,
					sort: item.sort,
					contract_company_id: item.contract_company_id
				};
			});
			app.$store.dispatch("request", {
						url: "HR_ORGANIZATION_ADD_POST", // eslint-disable-line
				type: 'POST',
				param: {
					depart_id: this.departId,
					son_depart: arr
				}
			}).then((res) => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure');
			}).catch((error) => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}
	}
};
export const OrganizationAddModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-org-add-modal-container {
	.ivu-form-item {
		margin-bottom: 20px !important;
	}
	.ivu-modal-wrap .ivu-modal {
		width: 680px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	.ivu-modal-body {
		padding: 0 !important;
	}
	._content {
		max-height: 500px;
		overflow-y: auto;
	}
}
</style>