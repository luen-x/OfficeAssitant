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
				<i-form-item label="注册资金：" prop="capital">
					<i-input
						v-model="formData.capital"
						placeholder="请输入注册资金"
						disabled
						style="width: 220px;"/>
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
				<i-form-item label="是否老板：" prop="is_boss">
					<i-radio-group v-model="formData.is_boss" class="g-flex g-jc-sa">
						<div class="g-flex" style="width: 300px;">
							<div>
								<i-radio :label="1">是</i-radio>
							</div>
							<div>
								<i-radio :label="0">否</i-radio>
							</div>
						</div>
					</i-radio-group>
				</i-form-item>
			</i-form>
		</div>

	</i-modal>
</template>

<script>
import moment from 'moment';
import API_ROOT from "@stores/apis/root";
import { Modal, DatePicker, Form, FormItem, Select, Option, Input, Radio, RadioGroup } from "iview";
import { CreatePortal, Copy } from "wya-vc";
import { dataValidity, formatMoment } from "@utils/utils";

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
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
	},
	props: {
		detail: Object,
		type: String,
		action: String,
		staff_id: String | Number,
		choose_day: String,
	},
	data() {
		let validateName = (rule, value, callback) => {
			if (!objRegex.validName10.regex.test(value)) {
				callback(new Error("请输入合适的公司名称"));
			} else if (this.data.action === 'add' || this.name !== this.sysForm.name) {
				// 判断名称是否重复
				// this.$request({
				// 	url: '',
				// 	type: "GET",
				// 	param: {
				// 	},
				// 	loading: false
				// }).then(res => {
				// 	if (res.data.is_have) {
				// 		callback(new Error("此公司已添加，不能重复添加！"));
				// 	} else {
				// 		callback();
				// 	}
				// }).catch(err => {
				// 	this.$Message.error(err.msg);
				// });
				callback();
			} else {
				callback();
			}
		};

		return {
			visible: false,
			title: '',
			company_name: '',
			isLoading: false,
			relation_type: '',
			companyList: [],
			formData: {
				is_boss: 1
			},
			list: [],
			rule: {
				relation_id: [
					{ required: true, message: "请输入公司名称", pattern: /.+/, trigger: "blur" }
					// { validator: validateName, trigger: "blur" }
				],
				industry: [{ required: true, message: "请输入所属行业", trigger: "blur" }],
				capital: [{ required: true, message: "请输入注册资金", trigger: "blur" }],
				product: [
					{ required: true, message: "请输入产品", trigger: "blur" },
					{ type: 'validName', validator: dataValidity }
				],
				area: [{ required: true, message: "请选择地区", trigger: "blur" }],
			}
		};
	},
	mounted() {
		this.visible = true;

		switch (this.type) {
			case '1':
				this.title = '加微信客户';
				break;
			case '2':
				this.title = '维护客户';
				break;
			case '3':
				this.title = '维护出来客户';
				break;
			case '5':
				this.title = '绕前台';
				break;
			default:
				break;
		}

		// 编辑时请求详情
		if (this.action === 'edit') {
			this.title = '编辑';
			// 初始化公司
			this.handleSearchCompany(this.detail.company_name);

			// 初始化数据
			this.formData = { ...this.detail };
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
				this.formData.capital = sed.capital;
				this.formData.area = sed.province + sed.city + sed.area;
			} else {
				this.relation_type = '';
				this.formData.industry = '';
				this.formData.capital = '';
				this.formData.area = '';
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
				// 	if (this.company_name === this.formData.company_name) {
				// 		// 编辑保存
				// 		this.$request({
				// 			url: '',
				// 			type: "GET",
				// 			param: {
				// 			},
				// 			loading: false
				// 		}).then(res => {
				// 			this.$emit("sure");
				// 			this.$Message.success("操作成功");
				// 		}).catch(err => {
				// 			this.$Message.warning(err.msg);
				// 			this.$refs.modal.buttonLoading = false;
				// 		});
				// 	} else {
				// 		// 判断名称是否重复
				// 		this.$request({
				// 			url: '',
				// 			type: "GET",
				// 			param: {
				// 			},
				// 			loading: false
				// 		}).then(res => {
				// 			// 不重复时保存请求
				// 			this.$request({
				// 				url: '',
				// 				type: "GET",
				// 				param: {
				// 				},
				// 				loading: false
				// 			}).then(res1 => {
				// 				this.$emit("sure");
				// 				this.$Message.success("操作成功");
				// 			}).catch(err => {
				// 				this.$Message.warning(err.msg);
				// 				this.$refs.modal.buttonLoading = false;
				// 			});
				// 			// {
				// 			// 		this.$Message.warning(
				// 			// 			"此公司已添加，不能重复添加！"
				// 			// 		);
				// 			// 		this.$refs.modal.buttonLoading = false;

				// 			// }
				// 		}).catch(err => {
				// 			this.$Message.warning(err.msg);
				// 			this.$refs.modal.buttonLoading = false;
				// 		});
				// 	}

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
export const employeePModal = CreatePortal({}, module.exports.default);
</script>


