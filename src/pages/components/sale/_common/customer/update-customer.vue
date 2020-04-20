<template>
	<i-modal 
		ref="modal"
		v-model="visible"
		:loading="true"  
		:mask-closable="false"
		:footer-hide="step==1"
		title="更新资料"
		width="720"
		ok-text="更新"
		class="v-sale-customer-update-customer-modal"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div slot="header">
			{{ companyName }} <span class="g-m-l-20" >数据更新</span>
			<span v-for="item in tabs" :key="item.value" class="g-operation g-m-l-10" @click="handleLink(item)" >{{ item.label }}</span>
			<!-- 只是为了调cascader的方法 -->
			<i-cascader
				v-show="false"
				ref="location"
				:data="region3"
				:disabled="disableForm"
				v-model="formData.location"
				placeholder="-"
				clearable
				filterable
				transfer
				style="width: 220px"
			/> 
		</div>
		<div v-if="step==1">
			<oa-paste-pane
				v-model="content" 
				:rows="15" 
				:width="600"
				:before-load-state="beforeLoadState"
				@get-info="handleGetInfo" 
			/>
		</div>
		<div v-else>
			<div class="g-form-title" style="margin-left:30px">基本信息</div>
			<i-form 
				ref="form"
				:model="formData" 
				:rules="rules"
				:label-width="100" 
				class="g-m-t-20"
				inline
			>
				<i-form-item label="官网：" prop="url">
					<i-input 
						v-model="formData.url" 
						:maxlength="30"
						:disabled="disableForm"
						clearable
						style="width: 220px"
						placeholder="请输入官网"
					/>
				</i-form-item>
				<i-form-item label="邮箱：" prop="email">
					<i-input 
						v-model="formData.email" 
						:maxlength="30"
						:disabled="disableForm"
						clearable
						style="width: 220px"
						placeholder="请输入邮箱"
					/>
				</i-form-item>
				
				<i-form-item label="地区：" prop="location">
					<i-cascader
						:data="region3"
						:disabled="disableForm"
						v-model="formData.location"
						placeholder="-"
						clearable
						filterable
						transfer
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item label="详细地址：" prop="address">
					<oa-limit-words 
						v-model="formData.address"
						:max="500"
						:disabled="disableForm"
						style="width: 220px"
						placeholder="请输入详细地址"
					/>
				</i-form-item>
				<i-form-item label="注册资本：" prop="capital">
					<i-input
						v-model="formData.capital" 
						:disabled="disableForm"
						clearable
						style="width: 220px"
						placeholder="请输入注册资本"
					/>
					<span class="_number-append">万元</span>
				</i-form-item>
				<i-form-item label="实缴资本：" prop="paid_in_capital">
					<i-input
						v-model="formData.paid_in_capital" 
						:disabled="disableForm"
						clearable
						style="width: 220px"
						placeholder="请输入实缴资本"
					/>
					<span class="_number-append">万元</span>
				</i-form-item>
				<i-form-item label="知识产权：" prop="intellectual_property_right">
					<i-input
						v-model="formData.intellectual_property_right" 
						:maxlength="200"
						:disabled="disableForm"
						clearable
						style="width: 220px"
						placeholder="请输入知识产权"
					/>
				</i-form-item>
				<i-form-item label="经营状态：" prop="manage_state">
					<i-input
						v-model="formData.manage_state" 
						:maxlength="200"
						:disabled="disableForm"
						clearable
						style="width: 220px"
						placeholder="请输入经营状态"
					/>
				</i-form-item>
				<i-form-item label="成立日期：" prop="establishment_date">
					<i-date-picker
						v-model="formData.establishment_date"
						:disabled="disableForm"
						clearable
						transfer
						placeholder="-"
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item label="核准日期：" prop="approval_date">
					<i-date-picker
						v-model="formData.approval_date"
						:disabled="disableForm"
						clearable
						transfer
						placeholder="-"
						style="width: 220px"
					/>
				</i-form-item>
				<i-form-item label="社会信用代码：" prop="credit_code">
					<i-input 
						v-model="formData.credit_code"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入社会信用代码"
					/>
				</i-form-item>
				<i-form-item label="纳税人识别码：" prop="taxpayer_number">
					<i-input 
						v-model="formData.taxpayer_number"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入纳税人识别码"
					/>
				</i-form-item>
				<i-form-item label="注册号：" prop="registration_number">
					<i-input 
						v-model="formData.registration_number"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入注册号"
					/>
				</i-form-item>
				<i-form-item label="组织机构代码：" prop="organization_code">
					<i-input 
						v-model="formData.organization_code" 
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入组织机构代码"
					/>
				</i-form-item>
				<i-form-item label="企业类型：" prop="company_type">
					<i-input 
						v-model="formData.company_type" 
						:disabled="disableForm"
						:maxlength="200"
						clearable
						style="width: 220px"
						placeholder="请输入企业类型"
					/>
				</i-form-item>
				<i-form-item label="所属行业：" prop="industry">
					<i-input 
						v-model="formData.industry" 
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入所属行业"
					/>
				</i-form-item>
				<i-form-item label="人员规模：" prop="scale">
					<i-input 
						v-model="formData.scale"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入人员规模："
					/>
				</i-form-item>
				<i-form-item label="曾用名：" prop="used_name">
					<i-input 
						v-model="formData.used_name" 
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 220px"
						placeholder="请输入曾用名"
					/>
				</i-form-item>
				<i-form-item label="经营范围：" prop="manage_range">
					<oa-limit-words 
						v-model="formData.manage_range" 
						:disabled="disableForm"
						:row="10"
						:max="2000"
						style="width: 220px"
						placeholder="请输入经营范围"
					/>
				</i-form-item>
			</i-form>
			<i-form 
				v-if="type==3"
				ref="footForm"
				:model="footFormData" 
				:rules="footRule"
				:label-width="100" 
				class="g-m-t-20"
				style="max-width:765px"
				inline
			>
				<i-form-item label="客户类型：" prop="customer_type">
					<i-select 
						v-model="footFormData.customer_type" 
						style="width:220px"
						placeholder="请选择客户类型" 
						clearable
					>
						<i-option
							v-for="item in customerTypeList"
							:value="item.customer_type_id"
							:key="item.customer_type_str"
						>
							{{ item.customer_type_str }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item label="具体行业：" prop="industry_id">
					<!-- <i-cascader
								:data="industryTree || []"
								v-model="footFormData.industry"
								style="width:220px"
								placeholder="请选择具体行业"
								clearable
								filterable
								transfer
							/> -->
					<i-select
						v-model="footFormData.industry_id"
						clearable
						transfer
						placeholder="请选择行业"
						class="g-m-r-5"
						style="width: 220px"
						@on-change="handleIndustryChange"
					>
						<i-option
							v-for="item in industryList"
							:value="item.industry_id"
							:key="item.industry_id"
						>
							{{ item.industry_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<i-form-item ref="product_type_id" label="产品类型：" prop="product_type_id" >
					<i-select
						v-model="footFormData.product_type_id"
						placeholder="请选择产品类型"
						style="width:220px"
						clearable
						transfer
					>
						<i-option
							v-for="(item) in productTypeList"
							:key="item.product_type_id"
							:value="item.product_type_id"
						>
							{{ item.product_type_name }}
						</i-option>
					</i-select>
					<!-- <i 
								class="icon iconfont icon-edit1 g-fs-14 g-pointer g-c-blue-mid" 
								style="position:absolute;right:-18px" 
								@click="handleEditProductType"
							/> -->
				</i-form-item>
					

			</i-form>

		</div>
	
	</i-modal>
</template>
<script>
import { Modal, Input, InputNumber, DatePicker, Form, FormItem, Button, Poptip, Select, Option, Cascader } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import Explain from '@components/_common/explain/explain';
import { dataValidity, objRegex } from '@utils/utils';
import PastePane from '@components/sale/customer-intention-add/paste-pane';
import { services } from '@stores/services/sale';
import { formatFormData } from '@components/sale/customer-intention-add-confirm';
import { Confirm } from '../../../_common/confirm/confirm.vue';
import { OverrideCustomerInfo } from './override-customer-info';
import { getLocationStr, setData } from '../util';
import { getCustomerFormData } from '../../customer-intention-add/search';

export default {
	name: "oa-sale-customer-update-customer",
	components: {
		'i-modal': Modal,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-paste-pane': PastePane,
		'i-input-number': InputNumber,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
	},
	mixins: [
		services.region3(),
		// // services.industryTree(), 
		// services.roleList()
		services.customerTypeList(), 
		services.industryList(),
		services.editCustomerConfig(),
		services.customerProductType()

	],
	props: {
		companyName: String,
		customerId: Number,
		type: Number, // 客户类型 1 意向客户 2 公海 3 成交客户
		// oldCustomerInfo: Object, // 原来的客户信息
	},
	data() {
		return {
			visible: false,
			formData: {
				company_name: "", // 公司名
				url: "", // 官网
				email: "", // email
				// "province": 110000, // 省code
				// "city": 110100, // 市code
				// "area": 110101, // 区code
				address: "", // 详细地址
				capital: '', // 注册资金
				paid_in_capital: '', // 实缴资本
				manage_state: "", // 经营状态
				establishment_date: "", // 成立日期
				approval_date: "", // 核准日期
				credit_code: "", // 统一社会信用代码
				taxpayer_number: "", // 纳税人识别号
				registration_number: "", // 注册号
				organization_code: "", // 组织机构代码
				company_type: "", // 企业类型
				industry: "", // 所属行业
				scale: '',
				// scale_min: 100, // 人员规模（小）
				// scale_max: 999, // 人员规模（大）
				used_name: "", // 曾用名
				manage_range: "", // 经营范围
				tel: '',
				// update_type: 1,
				location: [],
				intellectual_property_right: ''
			},
			
			rules: {
			},
			footFormData: {
				customer_type: '',
				// industry: [],
				industry_id: '',
				product_type_id: ""

			},
			footRule: {
				customer_type: [{ required: true, type: 'number', message: '请选择客户类型', trigger: 'change' }],
				// industry: [{ required: true, type: 'array', message: '请选择行业', trigger: 'change' }],
				industry_id: [{ required: true, type: 'number', message: '请选择行业', trigger: 'change' }]
			},
			content: '',
			step: 1,
			disableForm: true,
			tabs: [
				{ 
					label: '企查查', 
					value: '1', 
					url: "https://www.qichacha.com/search?key=" 
				},
				{ 
					label: '天眼查', 
					value: '2',
					url: "https://www.tianyancha.com/search?key=" 
				}
			],
			unCheckKeys: ['customer_name', 'tel', 'remarks'], // 不用比对的字段
			info: {},
			oldCustomerInfo: {
				"customer_id": 0, // 主键
				"company_name": "", // 公司名
				"customer_name": "", // 客户名
				"tel": "", // 电话
				"url": "", // 官网
				"email": "", // email
				location: [],
				"province": 0, // 省code
				"city": 0, // 市code
				"area": 0, // 区code
				"address": "", // 详细地址
				"capital": null, // 注册资金
				"paid_in_capital": null, // 实缴资本
				"manage_state": "", // 经营状态
				"establishment_date": "", // 成立日期
				"approval_date": "", // 核准日期
				"credit_code": "", // 统一社会信用代码
				"taxpayer_number": "", // 纳税人识别号
				"registration_number": "", // 注册号
				"organization_code": "", // 组织机构代码
				"company_type": "", // 企业类型
				"industry": "", // 所属行业
				"scale_min": null, // 人员规模（小）
				"scale_max": null, // 人员规模（大）
				"used_name": "", // 曾用名
				"manage_range": "", // 经营范围
				intellectual_property_right: '' // 知识产权
			},
			preventWatchIndustry: true
		};
	},
	computed: {
		productTypeList() {
			const industry = this.customerProductType.find(i => i.industry_id === this.footFormData.industry_id);
			if (industry && industry.product_type_list) {
				return industry.product_type_list;
			} else return [];
		}
		
		
	},
	watch: {
		'footFormData.industry_id': function (val) {
			if (this.preventWatchIndustry) return;
			this.footFormData.product_type_id = '';

		}
		
		

	},
	created() {
		if (this.customerId) {
			this.loadOldCustomerInfo(this.customerId);
		} else console.error('缺少customer_id');
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		beforeLoadState(info) {
			// 只比较中英文
			const regx = /[\u4e00-\u9fa5a-zA-Z]+/g;
			const name1 = (info.company_name.match(regx) || []).join('');
			const name2 = ((this.companyName || '').match(regx) || []).join('');
			if (name1 !== name2) {
				Confirm.popup({ msg: "该数据非“" + this.companyName + "”，请核实后再提交更新", okText: '确认，并清空数据' }).then(() => {
					this.content = '';
				}).catch(e => e && console.error(e));
				return false;
			} else {
				return true;
			}
		},
		loadOldCustomerInfo(customerId) {
			this.$request({
				url: "_SALE_CUSTOMER_CUSTOMER_BASIC_INFO_GET",
				type: "GET",
				param: {
					customer_id: customerId
				},
				loading: false,
			}).then(res => {
				const customer = res.data;
				customer.location = [customer.province, customer.city, customer.area].filter(Boolean);
		
				setData(this.oldCustomerInfo, customer);
				this.oldCustomerInfo.capital = parseFloat(this.oldCustomerInfo.capital) >= 0 ? parseFloat(this.oldCustomerInfo.capital) : null;
				if (this.oldCustomerInfo.scale_max == -1) {
					this.oldCustomerInfo.scale_max = null;
				}
				if (this.oldCustomerInfo.scale_min == -1) {
					this.oldCustomerInfo.scale_min = null;
				}
				this.oldCustomerInfo.paid_in_capital = parseFloat(this.oldCustomerInfo.paid_in_capital) >= 0 
					? parseFloat(this.oldCustomerInfo.paid_in_capital) : null;
				customer.product_type_id && (this.footFormData.product_type_id = customer.product_type_id);

			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		async handleSave() {
			let valid = true;
			if (this.$refs.footForm) {
				valid = await this.$refs.footForm.validateAndScroll();
			}
			if (!valid) return 	this.$refs.modal.buttonLoading = false;
			// 比对信息差异
			const newData = formatFormData(this.formData);
			
			const param = await getCustomerFormData({
				newData,
				oldData: this.oldCustomerInfo,
				editConfig: this.editCustomerConfig,
				customerType: (this.type == 1 || this.type == 3) ? 1 : 2,
				region3: this.region3
			});
			if (!param) return this.$refs.modal.buttonLoading = false;
			if (param.scale_max === null) {
				param.scale_max = -1;
			}
			if (param.scale_min === null) {
				param.scale_min = -1;
			}		
			return this.$request({
				url: '_SALE_CUSTOMER_SAVE_COMPANY_POST',
				type: "POST",
				param: {
					...param,
					...this.footFormData,
					customer_id: this.customerId,
					

				},
				loading: false,
			}).then((res) => {
				this.$Message.success(res.msg);
				this.handleOk();
			}).catch(res => {
				this.$Message.error(res.msg);
				this.$refs.modal.buttonLoading = false;				
			});
			

		},
		handleGetInfo({ data, info }) {
			// 检查data todo
			info.capital = parseFloat(info.capital) || '-';
			info.paid_in_capital = parseFloat(info.paid_in_capital) || '-';
			if (info.customer_name == '-') info.customer_name = '';
			if (info.tel == '-') info.tel = '';
			this.formData = { ...this.formData, ...info };
			this.setLocation();
			if (this.type == 3) {
				this.footFormData.industry_id = data.industry_id || '';
				this.footFormData.customer_type = data.customer_type || '';
				// this.footFormData.product_type_id = data.product_type_id || '';
			}
			this.step = 2;
			this.info = info;
			setTimeout(() => {
				this.preventWatchIndustry = false;
			}, 100);
			
		},
		async setLocation() {
			let address = this.formData.sign_address + this.formData.address.substr(0, 15);
			address = address.replace(/政/g, '');

			if (!address || !this.$refs.location) return;
			await this.loadRegion3Promise;
			
			this.$nextTick(() => {
				const vm = this.$refs.location;
				const results = vm.getLocationFromQuery(vm.getSelections(vm.data) || [], address.substr(0, 15));
				if (results[0] && results[0].value) {
					this.formData.location = results[0].value.split(',').map(Number);
				}

			});
		},
		handleLink(item) {
			window.open(item.url + this.companyName);	
		},
		handleIndustryChange() {
			this.$refs.product_type_id.resetField();
		}
	}
};
export const UpdateCustonmer = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-customer-update-customer-modal {
	._number-append {
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 1px;
		vertical-align: bottom;
		color: #4b4f57;
	}
	.c-limit-words {
		._remain {
			display: none
		}
		textarea {
			border-radius: 0;
			resize: none;

		}
	}
	._clear-btn {
		width:600px;
		border: 1px solid #e7e7e7;
		border-top: none;
		transition: color .2s ease;
		// &:hover{
		// 	color: #2296f9
		// }
	}

}


</style>