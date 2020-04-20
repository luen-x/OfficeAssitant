<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:mask-closable="false"
		:loading="true"
		class="v-hr-archives-manager-watch-modal"
		width="400"
		@on-ok="handleOk"
		@on-cancel="handleCancel">

		<div slot="header" class="g-tc">
			{{ title }}
		</div>

		<div class="g-fs-14 _content">
			<i-form
				ref="form"
				:rules="rule"
				:model="formData"
				:label-width="100">
				<i-form-item label="公司名称：" prop="relation_id">
					<i-select
						v-model="formData.relation_id"
						:remote-method="handleSearchCompany"
						:loading="isLoading"
						:multiple="false"
						clearable
						transfer
						filterable
						remote
						style="width: 220px;"
						placeholder="请输入公司名称"
						@on-change="handleCompanyChange"
					>
						<i-option
							v-for="(com, index) in companyList"
							:value="com.relation_id"
							:key="index"
						>{{ com.company_name }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="邀约人：" prop="invite_id">
					<i-select
						ref="invite"
						:value="formData.invite_id"
						:remote-method="loadInvite"
						:loading="inviteLoading"
						style="width: 220px;"
						filterable
						remote
						clearable
						transfer
						label-in-value
						placeholder="请输入邀约人"
						@on-change="handleInviteChange"
						@on-query-change="handleQueryChange"
					>
						<i-option
							v-for="(item, index) in inviteData"
							:key="index"
							:value="item.value"
						>{{ item.label }}</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="所属行业：" prop="industry">
					<i-input
						v-model="formData.industry"
						placeholder="请输入所属行业"
						disabled
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="地区：" prop="area">
					<i-input
						v-model="formData.area"
						placeholder="请选择地区"
						disabled
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="产品：" >
					<i-input
						v-model="formData.product"
						:maxlength="10"
						clearable
						placeholder="请输入产品"
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="客户名称：" prop="customer_name">
					<i-input
						v-model="formData.customer_name"
						:maxlength="10"
						clearable
						placeholder="请输入客户名称"
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="客户类别：" prop="customer_type">
					<i-select
						v-model="formData.customer_type"
						clearable
						transfer
						placeholder="请选择客户类别"
						style="width: 220px;">
						<i-option
							v-for="item in list"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="主跟人：" prop="follow_up_person">
					<i-input
						v-model="formData.follow_up_person"
						:maxlength="5"
						placeholder="请输入主跟人"
						style="width: 220px;"/>
				</i-form-item>
				<i-form-item label="具体情况：" prop="situation">
					<oa-limit-words
						v-model="formData.situation"
						:max="500"
						placeholder="请输入具体情况"
						width="220px"/>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Select, Option, Input } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { dataValidity, formatMoment } from "@utils/utils";
import { createSearch } from '@stores/services/hr';

export default {
	name: "hr-archives-manager-watch-modal",
	components: {
		"i-modal": Modal,
		"vc-copy": Copy,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		'i-date-picker': DatePicker,
	},
	mixins: [
		createSearch({ key: 'invite' })
	],
	props: {
		detail: Object,
		type: String,
		action: String,
		staff_id: Number | String,
		choose_day: String,
	},
	data() {
		let validateName = (rule, value, callback) => {
			if (!objRegex.validName10.regex.test(value)) {
				callback(new Error("请输入合适的公司名称"));
			} else if (this.data.action === 'add' || this.name !== this.sysForm.name) {
				callback();
			} else {
				callback();
			}
		};

		return {
			visible: false,
			title: '',
			invite: '',
			company_name: '',
			isLoading: false,
			relation_type: '',
			companyList: [],
			formData: {},
			list: [
				{ label: 'A', value: 'A' },
				{ label: 'B', value: 'B' },
				{ label: 'C', value: 'C' }
			],
			rule: {
				relation_id: [
					{ required: true, message: "请输入公司名称", pattern: /.+/, trigger: "blur" }
				],
				industry: [{ required: true, message: "请输入所属行业", trigger: "blur" }],
				product: [
					{ required: true, message: "请输入产品", trigger: "blur" },
					{ type: 'validName', validator: dataValidity }
				],
				area: [{ required: true, message: "请选择地区", trigger: "blur" }],
				customer_name: [{ type: 'validName', validator: dataValidity }],
				follow_up_person: [{ type: 'validName', validator: dataValidity }]
			}
		};
	},
	mounted() {
		this.visible = true;
		switch (this.type) {
			case '6':
				this.title = '过客户';
				break;
			case '7':
				this.title = '过出来客户';
				break;
			case '8':
				this.title = '谈判客户';
				break;
			case '9':
				this.title = '跟进客户';
				break;
			default:
				break;
		}

		// 编辑时请求详情
		if (this.action === 'edit') {
			this.title = '编辑';
			// 初始化公司和邀约人
			this.handleSearchCompany(this.detail.company_name);
			this.invite = this.detail.invite_staff_name;

			// 初始化数据
			this.formData = { ...this.detail };
			this.formData.invite_id = this.detail.invite_staff_id;
			this.formData.area = this.detail.region;
			this.relation_type = this.detail.relation_type;
		}
	},
	methods: {
		handleCompanyChange(val) {
			if (val) {
				let sed = this.companyList.filter(item => item.relation_id === val)[0];
				// 根据公司获取行业和地区
				this.relation_type = sed.relation_type;
				this.formData.industry = sed.industry;
				this.formData.area = sed.province + sed.city + sed.area;
			} else {
				this.relation_type = '';
				this.formData.industry = '';
				this.formData.area = '';
			}
		},
		handleInviteChange(obj) {
			this.formData.invite_id = obj && obj.value ? obj.value : '';
			this.formData.invite_name = obj && obj.label ? obj.label : '';
		},
		handleQueryChange(query = '') {
			let targetQuery = this.formData.invite_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.invite.clearSingleSelect();
			}
		},
		// 搜索公司
		handleSearchCompany(query) {
			if (query.replace(/[0-9]/g, '')) {
				this.$request({
					url: '_HR_ARCHIVES_EMPLOYEE_COMPANY_NAME_GET',
					type: "GET",
					param: {
						staff_id: this.staff_id,
						keyword: query
					}
				}).then(res => {
					this.companyList = res.data;
				});
			}
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.$refs['form'].validate(valid => {
				if (valid) {
					this.$refs.modal.buttonLoading = false;
					this.$request({
						url: '_HR_ARCHIVES_EMPLOYEE_DATA_EDIT_POST',
						type: "POST",
						param: {
							...this.formData,
							invite_staff_id: this.formData.invite_id,
							staff_id: this.staff_id,
							relation_type: this.relation_type,
							type: this.type,
							choose_day: this.choose_day,
						},
						loading: false
					}).then(res => {
						this.$emit("sure");
						this.$Message.success("操作成功");
					}).catch(err => {
						this.$Message.warning(err.msg);
					});
				} else {
					this.$refs.modal.buttonLoading = false;
					this.$Message.warning('请按照提示完善表单信息');
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		}
	}
};
export const managerPModal = CreatePortal({}, module.exports.default);
</script>


