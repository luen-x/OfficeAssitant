<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		title="工作登记"
		width="400px"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="ruleData"
			:label-width="115"
			class="g-m-t-20"
		>
			<i-form-item label="服务公司：" prop="">
				<i-select
					v-model="formData.contract_company_id"
					:remote-method="handleRemoteSearch"
					:loading="loading"
					clearable
					transfer
					filterable
					remote
					style="width:220px;"
					class="g-m-r-10"
					placeholder="请选择公司"
				>
					<i-option
						v-for="item in contractCompany"
						:value="item.contract_company_id"
						:key="item.contract_company_id"
					>
						{{ item.contract_company_name }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="合同编号：" prop="">
				<i-select
					v-model="formData.contract_id"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择合同编号"
				>
					<i-option
						v-for="item in contractList"
						:value="item.contract_id"
						:key="item.contract_id"
					>
						{{ item.contract_num }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="选择产品：" prop="">
				<i-select
					v-model="formData.project_id"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择产品"
				>
					<i-option
						v-for="item in projectList"
						:value="item.project_id"
						:key="item.project_id"
					>
						{{ item.product_name }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="品牌名称：" prop="">
				<div>{{ brandName }}</div>
			</i-form-item>

			<i-form-item label="提交类型：" prop="type">
				<i-select
					v-model="formData.type"
					clearable
					transfer
					style="width:220px;"
					placeholder="请选择提交类型"
				>
					<i-option
						v-for="item in submits"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="海报完成时间：" prop="complete_time">
				<i-date-picker
					v-model="formData.complete_time"
					clearable
					transfer
					type="date"
					placeholder="请选择完成日期"
					style="width: 220px;"
				/>
			</i-form-item>

			<i-form-item label="海报完成数量：" prop="complete_num">
				<i-input-number
					v-model="formData.complete_num"
					:min="1"
					:max="999"
					clearable
					placeholder="请输入文案数量"
					style="width: 220px;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Select, Option, DatePicker, InputNumber } from 'iview';
import { CreatePortal } from 'wya-vc';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import moment from "moment";

export default {
	name: "sc-customer-distribute",
	components: {
		'i-modal': Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-input-number": InputNumber
	},
	props: {
		staff_work_id: Number,
		work: Object
	},
	data() {
		return {
			visible: false,
			formData: {
				contract_company_id: null,
				contract_id: null,
				project_id: null,
				product_id: null,
				type: "",
				complete_time: "",
				complete_num: null
			},
			brandName: '', // 品牌名称
			ruleData: {
				type: [
					{ required: true, message: '请选择提交类型', trigger: 'change' }
				],
				complete_time: [
					{ required: true, type: 'date', message: '请选择海报完成时间', trigger: 'change' }
				],
				complete_num: [
					{ required: true, type: 'number', message: '海报完成数量', trigger: 'blur' }
				]
			},
			submits: [
				{
					value: "0",
					label: '品牌视觉海报'
				},
				{
					value: "1",
					label: '海报配套文案'
				},
				{
					value: "2",
					label: '朋友圈配套文案'
				}
			],
			contractCompany: [], // 服务公司
			contractList: [], // 合同编号
			projectList: [], // 产品
			loading: false, // 当前是否正在远程搜索
			flag: true, // 判断是否是第一次进来
			load: true
		};
	},
	watch: {
		'formData.contract_company_id': {
			deep: true,
			handler(value) {
				this.contractList = [];
				this.projectList = [];

				if (!this.load) {
					this.formData.contract_id = null;
					this.formData.project_id = null;
					this.formData.product_id = null;
					this.brandName = '';
					this.load = false;
				}
					
				value && this.contractCompany.forEach(item => {
					if (+item.contract_company_id === +value) {
						this.contractList = item.contract;
					}
				});
			}
		},

		'formData.contract_id': {
			deep: true,
			handler(value) {
				this.projectList = [];

				if (!this.load) {
					this.formData.project_id = null;
					this.formData.product_id = null;
					this.brandName = '';
				}
					
				value && this.contractList.forEach(item => {
					if (+item.contract_id === +value) {
						this.projectList = item.project;
						this.brandName = item.brand_name;
					}
				});
			}
		}
	},
	mounted() {
		this.staff_work_id && this.loadData();
		this.work && this.handleRemoteSearch("");

		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll(valid => {
				if (valid) {
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		handleSave() {
			this.projectList.forEach(item => {
				if (+item.project_id === +this.formData.project_id) {
					this.formData.product_id = item.product_id;
				}
			});

			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_WORK_ADD_POST",
				type: "POST",
				param: {
					...this.formData,
					staff_work_id: this.staff_work_id,
					product_id: this.formData.product_id,
					complete_time: moment(this.formData.complete_time).format("YYYY-MM-DD")
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure");
				this.$store.commit('SC_CUSTOMER_COOPERATE_DISTRIBUTE_LIST_RESET', { type: "" });
			}).catch(error => {
				this.visible = true;
				this.$refs.modal.buttonLoading = false;
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		
		loadData() {
			this.$request({
				url: "_SC_CUSTOMER_COOPERATE_WORK_INFO_GET",
				type: "GET",
				param: {
					staff_work_id: this.staff_work_id
				}
			}).then(async res => {
				this.load = true;
				await this.handleRemoteSearch(res.data.contract_company_name);

				this.formData.contract_company_id = +res.data.contract_company_id;
				this.formData.contract_id = +res.data.contract_id;
				this.formData.project_id = +res.data.project_id;
				this.formData.product_id = +res.data.product_id;
				this.formData.type = res.data.type + "";
				this.formData.complete_time = res.data.complete_time + "";
				this.formData.complete_num = +res.data.complete_num;
				this.brandName = +res.data.brand_name;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleRemoteSearch(query) {
			if (this.flag) {
				this.flag = false;
				return;
			}

			this.loading = true;
					
			return this.$request({
				url: "_SC_CUSTOMER_COOPERATE_COMPANY_SEARCH_GET",
				type: "GET",
				param: {
					contract_company_name: query,
					...this.work
				},
				loading: false
			}).then(res => {
				this.loading = false;
				this.contractCompany = Array.isArray(res.data) ? res.data : [];
				if (this.work) {
					this.formData.contract_company_id = +this.work.contract_company_id;
					this.formData.contract_id = +this.work.contract_id;
					this.formData.project_id = +this.work.project_id;
					this.formData.product_id = +this.work.product_id;
				}
			}).catch(error => {
				this.loading = true;
				this.$Message.error(error.msg);
			});
		}
	}
};
export const WorkRegister = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>