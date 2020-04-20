<template>
	<div class="g-m-t-20 v-academy-support-case-add">
		<div class="g-flex g-jc-c" style="min-width:850px;">
			<i-form
				ref="form"
				:model="formData"
				:rules="rules"
				:label-width="100"
				class="g-pd-l-10"
				style="max-width:845px;margin-bottom:120px"
				inline
			>
				<i-form-item label="案例标题：" prop="title">
					<i-input
						v-model="formData.title"
						:maxlength="30"
						clearable
						placeholder="请输入案例标题"
						style="width:300px"
					/>
				</i-form-item>
				<i-form-item label="案例公司：" prop="contract_company_id">
					<i-select
						v-model="formData.contract_company_id"
						:remote-method="loadCompanyList"
						:loading="companySearchLoading"
						:disabled="isCollect"
						placeholder="请输入案例公司"
						style="width:300px"
						filterable
						remote
						clearable
						ransfer
						@on-change="handleCompanyChange"
					>
						<i-option
							v-for="(item) in companyList"
							:key="item.contract_company_id"
							:value="item.contract_company_id"
						>
							{{ item.contract_company_name }}
						</i-option>
					</i-select>
				</i-form-item>
				<div class="_gray-bg g-m-b-20">
					<i-form-item ref="location" label="客户地区：" prop="location" >
						<i-cascader
							:data="region3"
							v-model="formData.location"
							:disabled="isCollect"
							placeholder="请选择客户地区"
							style="width:300px"
							clearable
							transfer
						/>
					
					</i-form-item>
					<i-form-item ref="industry_id" label="具体行业：" prop="industry_id">
						<i-select
							v-model="formData.industry_id"
							:disabled="isCollect"
							placeholder="请选择具体行业"
							style="width:300px"
							clearable
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
							v-model="formData.product_type_id"
							:disabled="isCollect"
							placeholder="请选择产品类型"
							style="width:300px"
							clearable
							ransfer
						>
							<i-option
								v-for="(item) in productTypeList"
								:key="item.product_type_id"
								:value="item.product_type_id"
							>
								{{ item.product_type_name }}
							</i-option>
						</i-select>
						<i 
							v-if="!isCollect"
							class="icon iconfont icon-edit1 g-fs-14 g-pointer g-c-blue-mid" 
							style="position:absolute;right:-18px" 
							@click="handleEditProductType"
						/>
					</i-form-item>
					<i-form-item ref="product_name" label="具体产品：" prop="product_name">
						<i-input
							v-model="formData.product_name"
							:disabled="isCollect"
							clearable
							placeholder="请输入产品名称"
							style="width:300px"
						/>
					</i-form-item>
					<i-form-item ref="customer_type" label="客户类型：" prop="customer_type">
						<i-select
							v-model="formData.customer_type"
							:disabled="isCollect"
							placeholder="请选择客户类型"
							style="width:300px"
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
					<i-form-item ref="age" label="客户微龄：" prop="age">
						<i-select
							v-model="formData.age"
							:disabled="isCollect"
							placeholder="请选择客户客户微龄"
							style="width:300px"
							clearable
						>
							<i-option
								v-for="item in weAgeList"
								:value="item.age_id"
								:key="item.age_id"
							>
								{{ item.age_name }}
							</i-option>
						</i-select>
					</i-form-item>
					<i-form-item ref="capital" label="注册资金：" prop="capital">
						<i-input-number 
							v-model="formData.capital"
							:disabled="isCollect"
							:max="999999.99"
							:min="0"
							:precision="2"
							:active-change="false"
							placeholder="请输入注册资金" 
							style="width:300px"
						/>
						<span class="_number-append">万元</span>
					
					</i-form-item>
					<i-form-item label="合作金额：" prop="-">
						{{ formData.payment_amount }} 元
					
					</i-form-item>

				</div>
				<i-form-item label="回款情况：" prop="money_back">
					<i-input-number 
						v-model="formData.money_back"
						:max="999999.99"
						:min="0"
						:precision="2"
						:active-change="false"
						:disabled="isCollect"
						placeholder="请输入回款情况" 
						style="width:300px"
					/>
					<span class="_number-append">万元</span>
					
				</i-form-item>
				<i-form-item label="代理人数：" prop="agent_num">
					<i-input-number 
						v-model="formData.agent_num"
						:max="999999"
						:min="0"
						:precision="0"
						:disabled="isCollect"
						style="width:300px"
						placeholder="请输入代理人数" 
					/>
					<span class="_number-append">人</span>
					
				</i-form-item>
				<i-form-item v-if="!isCollect" label="查看职位：" prop="position_list">
					<oa-tree-select-check
						ref="treeSelectCheck"
						v-model="formData.position_list"
						:data="departPosition"
						:width="300"
						:max-width="220"
						placeholder="请选择职位"
					/>
					
				</i-form-item>
				<i-form-item v-if="!isCollect" label="工龄限制：" prop="-">
					<i-input-number 
						v-model="formData.work_age_min"
						:max="999"
						:min="0"
						:precision="0"
						style="width:120px"
						placeholder="请输入数值" 
					/>
					<span>～</span>
					<i-input-number 
						v-model="formData.work_age_max"
						:max="999"
						:min="0"
						:precision="0"
						style="width:120px"
						placeholder="请输入数值" 
					/>
					<span class="_number-append" style="right:-35px">个月</span>
				</i-form-item>
				<i-form-item v-if="!isCollect" label="案例提供人：" prop="provider_staff_ids">
					<i-select
						v-model="formData.provider_staff_ids"
						:remote-method="loadStaffList"
						:loading="staffSearchLoading"
						placeholder="请选择案例提供人"
						style="width:300px"
						multiple
						filterable
						remote
						clearable
						transfer
					>
						<i-option
							v-for="(item) in staffList"
							:key="item.staff_id"
							:value="item.staff_id"
						>
							{{ item.staff_name }}
						</i-option>
					</i-select>
				
				</i-form-item>
				<i-form-item label="案例封面：" prop="image">
					<oa-upload
						v-model="formData.image"
						:max="1"
						:show-title="false"
						accept=".jpg, .png"
						style="width: 300px"
						placeholder="请上传案例封面"
					/>
				</i-form-item>
				<!-- style="min-width:400px;width:722px;" -->
				<i-form-item label="案例内容：" prop="content">
					<vc-editor
						ref="editor"
						v-model="formData.content"
						:options="options"
						style="min-width:400px;width:722px;"
						@file-error="handleError"
					/>	
				</i-form-item>
				
				<i-form-item label="案例附件：" prop="attachment_list" >
					<oa-content-upload
						ref="upload"
						v-model="formData.attachment_list"
						:size="100"
						:max="20"
						style="margin:0;width:350px;"
						accept=".doc, .docx, .pdf, .jpg, .png, .ppt, .MP3, .MP4, .xlsx, .avi, .wmv, .flv, .vob, .dat, .mkv, .asf, .asx"
						@error="handleFileError"
						
					>
						<div slot="trigger" class="g-flex">
							<i-button>本地上传</i-button>
						</div>
						<!-- <div slot="top" class="g-c-black4 g-m-t-5" style="line-height: 16px">
							本地上传支持扩展名：.rar .zip .doc .docx .pdf .jpg .png .ppt .MP3 .xlsx .mp4 .avi .wmv .flv
						</div> -->
					</oa-content-upload>
				</i-form-item>
			</i-form>
		</div>
		<div class="_footer">
			<i-button @click="handleCancel">取消</i-button>
			<i-button @click="handlePreview">预览</i-button>
			<i-button :loading="saveLoading" type="primary" @click="handleSave">
				{{ formData.old_case_id ? '保存并生成副本':"保存" }}
			</i-button>
		</div>
	</div>
</template>

<script>
import { Form, FormItem, Input, Select, Option, InputNumber, Button, Cascader } from 'iview';
import { Editor } from "wya-vc";
import TreeSelectCheck from '@components/_common/tree-select-check/tree-select-check';
import Upload from '@components/_common/upload/upload';
import ProgressUpload from '@components/content/_common/upload';
import { services as commonServices } from '@stores/services/common';
import { services as saleServices } from '@stores/services/sale';
import { services as contentServices } from '@stores/services/content';
import { setData, getLocationStr } from '@components/sale/_common/util';
import moment from 'moment';
import { CasePreview } from '@components/sale/_common/customer/case-preview.vue';
import { EditProductType } from './edit-product-type';

export default {
	name: 'oa-academy-support-case-add',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-select': Select,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-option':	Option,
		'i-cascader': Cascader,
		'oa-tree-select-check': TreeSelectCheck,
		'oa-upload': Upload,
		'vc-editor': Editor,
		'oa-content-upload': ProgressUpload
	},
	mixins: [
		saleServices.region3(),
		saleServices.industryList(), 		
		saleServices.customerTypeList(),
		saleServices.weAgeList(),
		contentServices.departPosition()
		
	],
	data() {
		const query = this.$route.query || {};
		return {
			mode: query.mode,
			formData: {
				case_id: query.case_id || '', // 案例ID
				old_case_id: query.old_case_id || '', // 如果是编辑源案例则有
				collection_id: query.collection_id || '', // 如果是编辑源案例则有
				customer_id: '',
				title: "",
				contract_company_id: '', // 案例公司ID
				contract_company_name: "", // 公司名称
				capital: null, // 注册资金
				location: [],
				// "province": 110000, // 省
				// "city": 110100, // 市
				// "area": 110101, // 区
				industry_id: '', // 行业ID
				product_type_id: '',
				product_name: "", // 具体产品
				customer_type: '', // 客户类型 1 传统客户 2 小司机 3 老司机 4 初创企业
				age: '', // 客户微龄：1：1年不到，2：1-3年，3：3-5年，4:5年以上
				money_back: null, // 回款金额：万元
				payment_amount: 0, // 合作金额：元
				agent_num: null, // 代理人数
				work_age_min: null, // 工龄最小
				work_age_max: null, // 工龄最大
				provider_staff_ids: [], // 提供人ids
				image: [], // 封面url
				content: "", // 案例内容
				position_list: [], // 查看职位
				attachment_list: []// 附件
				// 	{
				// 		"id": 1,
				// 		"relation_id": 1,
				// 		"attachment_name": "timg.jpeg",
				// 		"attachment_url": "https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190921/1569032188654/timg.jpeg",
				// 		"file_size": 0
				// 	},
				// 	{
				// 		"id": 2,
				// 		"relation_id": 1,
				// 		"attachment_name": "001.jpg",
				// 		"attachment_url": "https://wyatest.oss-cn-hangzhou.aliyuncs.com/oa2/20190921/1569047495796/001.jpg",
				// 		"file_size": 0
				// 	}
				// ]
			},
			rules: {
				title: [{ required: true, type: 'string', message: "请输入案例标题", trigger: "blur" }],
				contract_company_id: [{ required: true, type: 'number', message: "请选择案例公司", trigger: "change" }],
				money_back: [{ required: true, type: 'number', message: "请输入回款金额", trigger: "blur" }],
				agent_num: [{ required: false, type: 'number', message: "请输入代理人数", trigger: "blur" }],
				content: [{ required: true, type: 'string', message: "请输入案例内容", trigger: "change" }],
				location: [{ required: true, type: 'array', message: "请选择客户地区", trigger: "change" }],
				industry_id: [{ required: true, type: 'number', message: "请选择行业", trigger: "change" }],
				product_type_id: [{ required: true, type: 'number', message: '请选择产品类型', trigger: "change" }],
				product_name: [{ required: true, type: 'string', message: "请输入产品名称", trigger: "blur" }],
				customer_type: [{ required: true, type: 'number', message: '请选择客户类型', trigger: "change" }],
				age: [{ required: true, type: 'number', message: '请选择客户微龄', trigger: "change" }],
				capital: [{ required: true, type: 'number', message: "请输入注册资金", trigger: "blur" }],

			},
			companyList: [],
			companySearchLoading: false,
			staffList: [],
			staffSearchLoading: false,
			productType: [],
			options: {
				modules: {
					toolbar: '#toolbar',
				},
			},
			saveLoading: false,
			watchIndustry: true
		};
	},
	computed: {
		productTypeList() {
			const industry = this.productType.find(i => i.industry_id === this.formData.industry_id);
			if (industry && industry.product_type_list) {
				return industry.product_type_list;
			} else return [];
		},
		isCollect() {
			return this.mode == 'collect';
		}

	},
	watch: {
		'formData.industry_id': function () {
			if (this.watchIndustry) this.$refs.product_type_id.resetField();
			
		}

	},
	created() {
		this.loadProductType();
		const query = this.$route.query || {};
		if (query.action == 'update') {
			this.formData.case_id = +query.case_id;
			this.loadCaseDetail(this.formData.case_id || this.formData.old_case_id);
		}
	},
	methods: {
		loadProductType() {
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_PRODUCT_TYPE_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(res => {
				this.productType = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});

		},
		loadCompanyList(query) {
			
			if (!query) return;
			this.companySearchLoading = true;
			this.$request({
				url: "_SALE_TICKET_COMPANY_NAME_GET",
				type: "GET",
				param: { company_name: query },
				loading: false,
			}).then(res => {
				this.companyList = res.data;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => this.companySearchLoading = false);
		},
		handleCompanyChange(companyId) {
			if (companyId) {
				const company = this.companyList.find(com => com.contract_company_id === companyId);
				this.formData.contract_company_name = company.contract_company_name;
				this.formData.customer_id = company.customer_id;
				this.$request({
					url: "_SALE_INVOICE_CUSTOMER_INFO_GET",
					type: "GET",
					param: { contract_company_id: companyId },
					loading: false,
				}).then(({ data }) => {
					
					data.location = data.area ? [data.province, data.city, data.area] : '';
					data.age = data.wei_age;
					data.capital = +data.capital;
					if (data.capital == -1) {
						data.capital = null;
					}
					['customer_type', 'industry_id', 'location', 'product_type_id', 'product_name', 'wei_age', 'capital'].forEach(key => {
						if (data[key]) {
							this.formData[key] = data[key];
							this.$refs.form.validateField(key);
						} else {
							this.$refs[key] && this.$refs[key].resetField();
						}
					});
					this.formData.payment_amount = +data.payment_amount;
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			} else {
				this.formData.contract_company_name = '';
				this.formData.customer_id = '';
			}

		},
		loadStaffList(query) {
			if (!query) return;
			this.staffSearchLoading = true;
			this.$request({
				url: "SALE_CUSTOMER_INTENTION_DISTRIBUTE_LIST_GET",
				type: "GET",
				param: {
					is_page: 0,
					search: query,
					is_charge: 1
				},
				loading: false,
			}).then(res => {
				this.staffList = res.data.list;
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => this.staffSearchLoading = false);
		},
		handleError(e) {
			this.$Message.warning(e.msg);
		},
		handleFileError(e) {
			this.$Message.warning(e.msg);

		},
		handleCancel() {
			this.$router.go(-1);
		},
		validateAndScroll() {
			return new Promise(resolve => {
				this.$refs.form.validateAndScroll(valid => {
					if (!valid) {
						this.saveLoading = false;
						resolve(0);
						return;
					}
					if (this.formData.work_age_min !== null 
					&& this.formData.work_age_max !== null 
					&& this.formData.work_age_min > this.formData.work_age_max
					) {
						this.$Message.warning('最大工龄应大于等于最小工龄');
						this.saveLoading = false;
						resolve(0);
						return;
					}
					resolve(1);

				});
			}).catch(e => {
				console.error(e);
				this.saveLoading = false;
				resolve(0);
				return;

			});

		},
		async handleSave() {
			this.saveLoading = true;
			const valid = await this.validateAndScroll();
			if (!valid) return;
			const param = { ...this.formData };
			param.province = param.location[0]; // 省
			param.city = param.location[1]; // 市
			param.area = param.location[2]; // 区
			delete param.location;
			param.image = (param.image[0] && param.image[0].url) || '';
			const checkedTags = (this.$refs.treeSelectCheck && this.$refs.treeSelectCheck.checkedTags) || [];
			const position_list = checkedTags.map(ele => ele.parent_id && ele.value).filter(Boolean).map(i => +i.replace('position_id-', ''));
			param.position_list = position_list;
			param.attachment_list = param.attachment_list.map(i => i.url).filter(Boolean);
			if (this.mode == 'collect') {
				delete param.position_list;
				delete param.work_age_min;
				delete param.work_age_max;
				delete param.provider_staff_ids;
				if (param.old_case_id) {
					delete param.case_id;
				}
			}
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_ADD_POST",
				type: "POST",
				param,
				loading: false,
			}).then(res => {
				this.$Message.success(res.msg);
				this.$router.go(-1);
				
			}).catch((res) => {
				this.$Message.error(res.msg);
			}).finally(() => this.saveLoading = false);
		},
		async handlePreview() {
			const valid = await this.validateAndScroll();
			if (!valid) return;
			const f = this.formData;
			const previewData = {
				title: f.title,
				browse_num: 0,
				collection_num: 0,
				attachment_num: f.attachment_list.map(i => i.url).filter(Boolean).length,
				staff_name: this.$global.staff.staff_name,
				create_time: moment().format("YYYY-MM-DD HH:mm:ss"),
				contract_company_name: f.contract_company_name,
				province_name: getLocationStr(this.region3, [f.location[0], f.location[1]].filter(Boolean)),
				city_name: '',
				industry_name: (this.industryList.find(i => i.industry_id === f.industry_id) || { industry_name: '-' }).industry_name,
				capital: f.capital,
				product_type_name: (this.productTypeList.find(i => i.product_type_id === f.product_type_id) 
				|| { product_type_name: '-' }).product_type_name,
				product_name: f.product_name,
				customer_type_name: (this.customerTypeList.find(i => i.customer_type_id === f.customer_type) 
				|| { customer_type_str: '-' }).customer_type_str,
				age_name: (this.weAgeList.find(i => i.age_id === f.age) || { age_name: '-' }).age_name,
				payment_amount: f.payment_amount,
				agent_num: f.agent_num,
				money_back: f.money_back,
				content: f.content,
				attachment_list: f.attachment_list.map(i => i.url).filter(Boolean)
			};
			CasePreview.popup({
				caseList: [previewData],
				index: 0,
				showCollect: false
			}).catch(e => e && console.error(e));
			
		},
		handleEditProductType() {
			EditProductType.popup().catch(e => e && console.error(e)).finally(() => {
				// setTimeout(() => {
				this.loadProductType();
				// }, 100);
				
			});
			
		},
		loadCaseDetail(caseId) {
			this.watchIndustry = false;
			this.$request({
				url: "_ACADEMY_SUPPORT_CASE_DETAIL_GET",
				type: "GET",
				param: { case_id: caseId },
				loading: false,
			}).then(({ data }) => {
				this.companyList = [{ contract_company_id: data.contract_company_id, contract_company_name: data.contract_company_name }];
				this.staffList = data.provider_staffs;
				this.formData.provider_staff_ids = data.provider_staffs.map(i => i.staff_id);
				data.position_list = data.position_list.map(i => 'position_id-' + i);
				data.image = data.image ? [data.image] : [];
				data.capital = +data.capital;
				data.money_back = +data.money_back;
				// data.payment_amount = +(data.payment_amount / 1000).toFixed(2);
				data.location = [data.province, data.city, data.area];
				data.attachment_list = data.attachment_list.map(i => {
					const arr = i.split('/');
					const title = arr[arr.length - 1];
					return { percent: '100.00', title, url: i };
				});
				setData(this.formData, data);
				if (this.mode == 'collect' && this.formData.old_case_id) { // 编辑源源案例时新增副本，删除源案例id
					this.formData.case_id = '';
				}
				this.$nextTick(() => this.watchIndustry = true);
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
		// hadnleIndustryChange(id) {
		// 	this.$refs.productType.resetField();
		// }

	},
};
</script>

<style lang="scss">
.v-academy-support-case-add{
	._gray-bg {
        background: #f5f5f6;
        padding: 20px 0px 0 0px;
        max-width: 935px;
        // .ivu-form-item {
        //     &:nth-of-type(2n-1) {
		// 		margin-right: 54px;
        //         // border: 1px red solid;
        //     }
        // }
	}
	._number-append {
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 1px;
		vertical-align: bottom;
		color: #4b4f57;
	}
	.ivu-input-number .ivu-input-number-handler-wrap {
		display: none;
	}
	._footer {
		width: calc(100% - 160px);
		height: 60px;
		position: fixed;
		bottom: 0;
		left: 160px;
		box-shadow: 0 -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		padding: 10px 16px;
		background: #fff;
		z-index: 3;
		.ivu-btn {
			margin-left: 5px;
			margin-right: 5px;
		}
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
