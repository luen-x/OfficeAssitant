<template>
	<div class="v-sale-customer-intention-add-confirm v-sale-customer-form g-flex g-jc-c">
		<div style="max-width:925px;margin-bottom:240px">
			<div class="g-m-t-40 " style="margin-left:60px">
				<span class="g-fs-16" style="font-weight:600"> {{ formData.company_name }} </span>
				<span class="g-c-red-mid g-pointer">{{ updateTypeName }}</span>
			</div>
			<div class="g-c-red-mid _customer-form-title" style="margin-left:60px">基本信息</div>
			<i-form 
				ref="form"
				:model="formData" 
				:rules="rule"
				:label-width="144" 
				class="g-m-t-20"
				inline
			>
				<template v-if="query.update_type==3 || query.update_type==4">
					<i-form-item label="客户姓名：" prop="customer_name">
						<i-input 
							v-model="formData.customer_name" 
							:maxlength="30"
							:disabled="disableForm"
							clearable
							style="width: 300px"
							placeholder="请输入客户姓名"
						/>
					</i-form-item>
					<i-form-item label="电话：" prop="tel">
						<i-input 
							v-model="formData.tel" 
							:maxlength="30"
							:disabled="disableForm"
							clearable
							style="width: 300px"
							placeholder="请输入公开电话"
						/>
					</i-form-item>
				</template>
				<i-form-item label="官网：" prop="url">
					<i-input 
						v-model="formData.url" 
						:maxlength="30"
						:disabled="disableForm"
						clearable
						style="width: 300px"
						placeholder="请输入官网"
					/>
				</i-form-item>
				<i-form-item label="邮箱：" prop="email">
					<i-input 
						v-model="formData.email" 
						:maxlength="30"
						:disabled="disableForm"
						clearable
						style="width: 300px"
						placeholder="请输入邮箱"
					/>
				</i-form-item>
				<i-form-item label="地区：" prop="location">
					<i-cascader
						ref="location"
						:data="region3"
						:disabled="disableForm"
						v-model="formData.location"
						placeholder="-"
						clearable
						filterable
						transfer
						style="width: 300px"
					/>
				</i-form-item>
				<i-form-item label="详细地址：" prop="address">
					<oa-limit-words 
						v-model="formData.address"
						:max="500"
						:disabled="disableForm"
						style="width: 300px"
						placeholder="请输入详细地址"
					/>
				</i-form-item>
				<i-form-item label="注册资本：" prop="capital">
					<i-input
						v-model="formData.capital" 
						:disabled="disableForm"
						clearable
						style="width: 300px"
						placeholder="请输入注册资本"
					/>
					<span class="_number-append">万元</span>
				</i-form-item>
				<i-form-item label="实缴资本：" prop="paid_in_capital">
					<i-input
						v-model="formData.paid_in_capital" 
						:disabled="disableForm"
						clearable
						style="width: 300px"
						placeholder="请输入实缴资本"
					/>
					<span class="_number-append">万元</span>
				</i-form-item>
				<i-form-item label="经营状态：" prop="manage_state">
					<i-input 
						v-model="formData.manage_state" 
						:maxlength="200"
						:disabled="disableForm"
						clearable
						style="width: 300px"
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
						style="width: 300px;"
					/>
				</i-form-item>
				<i-form-item label="核准日期：" prop="approval_date">
					<i-date-picker
						v-model="formData.approval_date"
						:disabled="disableForm"
						clearable
						transfer
						placeholder="-"
						style="width: 300px;"
					/>
				</i-form-item>
				<i-form-item label="统一社会信用代码：" prop="credit_code">
					<i-input 
						v-model="formData.credit_code"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入统一社会信用代码"
					/>
				</i-form-item>
				<i-form-item label="纳税人识别码：" prop="taxpayer_number">
					<i-input 
						v-model="formData.taxpayer_number"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入纳税人识别码"
					/>
				</i-form-item>
				<i-form-item label="注册号：" prop="registration_number">
					<i-input 
						v-model="formData.registration_number"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入注册号"
					/>
				</i-form-item>
				<i-form-item label="组织机构代码：" prop="organization_code">
					<i-input 
						v-model="formData.organization_code" 
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入组织机构代码"
					/>
				</i-form-item>
				<i-form-item label="企业类型：" prop="company_type">
					<i-input 
						v-model="formData.company_type" 
						:disabled="disableForm"
						:maxlength="200"
						clearable
						style="width: 300px"
						placeholder="请输入企业类型"
					/>
				</i-form-item>
				<i-form-item label="所属行业：" prop="industry">
					<i-input 
						v-model="formData.industry" 
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入所属行业"
					/>
				</i-form-item>
				<i-form-item label="人员规模：" prop="scale">
					<i-input 
						v-model="formData.scale"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入人员规模："
					/>
				</i-form-item>
				<i-form-item label="知识产权：" prop="intellectual_property_right">
					<i-input 
						v-model="formData.intellectual_property_right"
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入知识产权"
					/>
				</i-form-item>
				<i-form-item label="曾用名：" prop="used_name">
					<i-input 
						v-model="formData.used_name" 
						:disabled="disableForm"
						:maxlength="30"
						clearable
						style="width: 300px"
						placeholder="请输入曾用名"
					/>
				</i-form-item>
				<i-form-item label="经营范围：" prop="manage_range">
					<oa-limit-words 
						v-model="formData.manage_range" 
						:disabled="disableForm"
						:row="10"
						:max="2000"
						style="width: 300px"
						placeholder="请输入经营范围"
					/>
				</i-form-item>
			</i-form>
		</div>

		<div class="_footer" style="display:block;height:auto">
			<!-- <div 
				v-if="query.update_type!=4" 
				class="g-c-red-mid g-tc" 
				style="margin-bottom: -10px;">
				* 请如实填写以下信息，乱填写者被他人举报或被管理员抽查后，将受到处罚。
			</div> -->
			<div class="g-flex g-jc-c">
				<i-form 
					ref="footForm"
					:model="footFormData" 
					:rules="footRule"
					:label-width="120" 
					class="g-m-t-20"
					style="max-width:765px"
					inline
				>
					<template v-if="query.update_type==1">
						<i-form-item label="客户角色：" prop="customer_role">
							<i-select 
								v-model="footFormData.customer_role" 
								style="width:220px"
								placeholder="请选择客户角色" 
								clearable
							>
								<i-option
									v-for="item in roleList"
									:value="item.customer_role_id"
									:key="item.customer_role_id"
								>
									{{ item.customer_role_str }}
								</i-option>
							</i-select>
						</i-form-item>
						<i-form-item label="客户姓名：" prop="customer_name">
							<i-input 
								v-model="footFormData.customer_name" 
								:maxlength="30"
								clearable
								style="width: 220px"
								placeholder="请输入客户姓名"
							/>
						</i-form-item>
						<i-form-item label="电话：" prop="tel">
							<i-input 
								v-model="footFormData.tel" 
								:maxlength="13"
								:disabled="telDisable"
								clearable
								style="width: 220px"
								placeholder="请输入客户电话"
							/>
						</i-form-item>
						<!-- <i-form-item label="微信：" prop="wechat">
							<i-input 
								v-model="footFormData.wechat" 
								:maxlength="20"
								clearable
								style="width: 220px"
								placeholder="请输入客户微信"
							/>
						</i-form-item> -->
						<i-form-item label="具体行业：" prop="industry_id">
							<i-select
								v-model="footFormData.industry_id"
								placeholder="请选择具体行业"
								style="width:220px"
								clearable
								@on-change="handleIndustryChange"
							>
								<i-option
									v-for="item in industryList"
									:key="item.industry_id"
									:value="item.industry_id"
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
						<i-form-item ref="customerType" label="客户类型：" prop="customer_type">
							<i-select
								v-model="footFormData.customer_type"
								placeholder="请选择客户类型"
								style="width:220px"
								clearable
								transfer
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
					</template>
					<template v-else-if="query.update_type==2 || query.update_type==3">
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
					</template>
				</i-form>
			</div>
			<div class="g-tc">
				<i-button @click="handleCancel">取消</i-button>
				<i-button :loading="saveLoading" type="primary" @click="handleSave">
					{{ query.update_type==1?'保存':'更新' }}
				</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import { 
	Form, FormItem, Input, InputNumber, 
	Select, Option, DatePicker, Cascader, Message, Button
} from 'iview';
import { objRegex, dataValidity, getItem, setItem } from '@utils/utils';
import moment from 'moment';
import { services } from '@stores/services/sale';
import { Confirm } from '@common/confirm/confirm';
import _s from '../_common/customer/cus-form/style.scss';
import { getLocationStr, setData } from '../_common/util';
import { OverrideCustomerInfo } from '../_common/customer/override-customer-info';
import { getCustomerFormData } from '../customer-intention-add/search';

const updateType = {
	1: "全新客户资料",
	2: '资料已录入300天，转手3次', // 不会出现
	3: '个人已成交客户数据更新',
	4: '旧资料更新' // 包含意向客户，黑名单，白名单
};
export const formatFormData = (data) => {
	const param = { ...data };
	delete param.tips;
	for (let key in param) {
						
		if (param[key] === '-') {
			param[key] = '';
		}
	}

	param.capital = parseFloat(param.capital) || null;
	param.paid_in_capital = parseFloat(param.paid_in_capital) || null;
	param.establishment_date && (param.establishment_date = moment(param.establishment_date).format('YYYY-MM-DD'));
	param.approval_date && (param.approval_date = moment(param.approval_date).format('YYYY-MM-DD'));
	param.province = param.location[0] || 0;
	param.city = param.location[1] || 0;
	param.area = param.location[2] || 0;
	delete param.location;
					
	if (param.scale) {
		const scales = param.scale.match(/[0-9]+/g) || [];
		if (param.scale.includes('小于') || param.scale.includes('少于') || param.scale.includes('低于') || param.scale.includes('以下')) {
			param.scale_min = null;
			param.scale_max = +scales[0] || null;
		} else {
			param.scale_min = +scales[0] || null;
			param.scale_max = +scales[1] || null;
		}
	} else {
		param.scale_min = null;
		param.scale_max = null;
	}
	delete param.scale;
	return param;
};
export default {
	name: 'oa-tpl',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'i-button': Button,
	},
	mixins: [
		services.region3(), 
		services.customerTypeList(), 
		// services.industryTree(), 
		services.industryList(),
		services.roleList(),
		services.editCustomerConfig(),
		services.customerProductType()
	],
	data() {
		const info = getItem('saleAddCustomerInfo_' + _global.version);
		info.capital = parseFloat(info.capital) || '-';
		info.paid_in_capital = parseFloat(info.paid_in_capital) || '-';
		if (info.customer_name == '-') info.customer_name = '';
		if (info.tel == '-') info.tel = '';
		info.tel = objRegex.validTel.regex.test(info.tel) ? info.tel : '99999999999';

		const update_type = this.$route.query.update_type || 1;
		
		return {
			query: {
				...(this.$route.query || {}),
				update_type
			},
			formData: {
				company_name: "", // 公司名
				url: "", // 官网
				email: "", // email
				// "province": 110000, // 省code
				// "city": 110100, // 市code
				// "area": 110101, // 区code
				address: "", // 详细地址
				capital: 0, // 注册资金
				paid_in_capital: 0, // 实缴资本
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
				intellectual_property_right: '',
				...info
			},
			rule: {
				customer_name: [{ required: false, message: '请输入客户姓名', trigger: 'blur' }],
				tel: [
					{ required: false, message: '请输入电话号码', trigger: 'blur' },
					{ type: 'validTel', message: '请填写正确的电话号码', validator: dataValidity, trigger: 'blur' }
				]
			},
			footFormData: {
				// 添加
				customer_role: 1,
				customer_name: info.customer_name || '',
				// wechat: '',
				tel: info.tel,
				// 更新
				customer_type: info.customer_type || '',
				// industry: [],
				industry_id: info.industry_id || '',
				product_type_id: info.product_type_id || ''


			},
			footRule: {
				customer_role: [{ required: true, type: 'number', message: '请选择客户角色', trigger: 'change' }],
				customer_name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
				tel: [
					{ required: true, message: '请输入客户号码', trigger: 'blur' },
					{ validator: this.telValidator, message: '请填写正确的电话号码', trigger: 'blur' }
				],
				// wechat: [{ type: 'validWeChat', message: '微信号格式不正确', validator: dataValidity, trigger: 'blur' }],
				customer_type: [{ required: update_type == 1, type: 'number', message: '请选择客户类型', trigger: 'change' }],
				// industry: [{ required: true, type: 'array', message: '请选择行业', trigger: 'change' }],
				industry_id: [{ required: update_type == 1, type: 'number', message: '请选择行业', trigger: 'change' }]
			},
			saveLoading: false,
			disableForm: true,
			telDisable: info.tel !== '99999999999',
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
			unPermitManageState: ['注销', '吊销'],
		};
	},
	computed: {
		updateTypeName() {
			return updateType[this.query.update_type || 1];
		},
		productTypeList() {
			const industry = this.customerProductType.find(i => i.industry_id === this.footFormData.industry_id);
			if (industry && industry.product_type_list) {
				return industry.product_type_list;
			} else return [];
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.setLocation();
		});
		if (this.query.updateType != '1' && this.formData.customer_id) {
			this.loadCustomerInfo(this.formData.customer_id);
		}
	},
	methods: {
		handleCancel() {
			this.$router.go(-1);
		},
		loadCustomerInfo(customerId) {
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

			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			});
		},
		async handleSave() {
			this.saveLoading = true;
			if (this.$route.query.manual_add) {
				Confirm.popup({ msg: '该客户已被加入黑名单(白名单)，如有问题，请联系超管（张勇）解除限制', okText: '知道了', cancelText: '' }).then(() => {
					this.$router.push('/sale/customer/intention/add');
				}).catch(err => err && console.error(err));
				return;
			}
			if (this.query.update_type == 1 && this.unPermitManageState.includes(this.formData.manage_state)) {
				this.$Message.error('不能录入经营状态为' + this.formData.manage_state + '的客户');
				this.saveLoading = false;
				return; 
			} 
			let ok = await 	this.$refs.footForm.validate();
			if (!ok) return this.saveLoading = false;

			
			let param = formatFormData(this.formData);

			if (this.query.update_type == 1) {
				param.customer_role = this.footFormData.customer_role;
				param.customer_name = this.footFormData.customer_name;
				param.tel = this.footFormData.tel;
				// param.wechat = this.footFormData.wechat;
				param.industry_id = this.footFormData.industry_id;
				param.product_type_id = this.footFormData.product_type_id;
				param.customer_type = this.footFormData.customer_type;

			} else if (this.$route.query.to != 'white') { // 白名单客户直接覆盖旧数据，跳过对比
				// 比对信息差异
				let customerType = 1;
				if (
					this.query.update_type == 2 
					|| (this.query.update_type == 4 && (this.query.to == 'sea' || this.query.to == 'black' || this.query.to == "white"))) {
					customerType = 2;
				}
				param = await getCustomerFormData({
					newData: param, 
					oldData: this.oldCustomerInfo,
					editConfig: this.editCustomerConfig, // 客户信息编辑的配置
					customerType, // 客户类型 1 - 意向，关联，成交， 2-公海，黑名单
					region3: this.region3, // 三级地址);
				});
				if (!param) return this.saveLoading = false;
				param.industry_id = this.footFormData.industry_id;
				param.product_type_id = this.footFormData.product_type_id;
				param.customer_type = this.footFormData.customer_type;
			}
			if (param.scale_max === null) {
				param.scale_max = -1;
			}
			if (param.scale_min === null) {
				param.scale_min = -1;
			}
			this.$request({
				url: "_SALE_CUSTOMER_SAVE_COMPANY_POST",
				type: "POST",
				param,
				loading: false,
				autoTip: true
			}).then(res => {
				this.saveLoading = false;
				if (this.$route.query.to == "sea") {
					this.$router.push({ 
						path: '/sale/customer/intention/add/sea', 
						query: { customer_id: res.data.customer_id || this.$route.query.customer_id 
						} });
				} else if (this.formData.tips) {
					Confirm.popup({ msg: this.formData.tips, okText: '知道了', cancelText: '' }).then(() => {
						this.$router.go(-1);
					//	this.$router.push('/sale/customer/intention/add');
					}).catch(err => err && console.error(err));	
				} else {
					this.$router.go(-1);
					// this.$router.push('/sale/customer/intention/add');
				}
			}).catch((res) => {
				this.saveLoading = false;
				console.error(res);
			});
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
		telValidator(rule, value, callback) {
			if (value === '99999999999') callback();
			else if (objRegex.validTel.regex.test(value)) callback();
			else callback('电话号码格式不正确');
		},
		handleIndustryChange() {
			this.$refs.product_type_id.resetField();
		}
	},
};
</script>

<style lang="scss">
.v-sale-customer-intention-add-confirm {
	
}

</style>
