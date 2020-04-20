<template>
	<div class="v-sale-cus-form v-sale-customer-deal-contract-order">
		<div class="g-flex g-jc-c">
			<div style="width:940px" class="g-m-lr-20 g-m-t-30">
				<oa-header 
					ref="header" 
					:contract-id="query.contract_id" 
					:contract-company-id="query.contract_company_id"
					@balance-change="balance=$event"
				/>
				<div v-show="step==1" >
					<oa-contract-info
						ref="contractInfo"
						:form="form1"
						:contract-company-id="query.contract_company_id"
						:init-staff-list="initStaffList"
						:balance="balance"
						@choose-product="handleChooseProduct"
						@clear-product="handleClearProduct"
					/>
					<oa-project-request 
						ref="projectRequest"
						:product-list="productList" 
						:contract-company-id="query.contract_company_id"
					/>
				</div>
				<oa-customer-info
					v-show="step==2"
					ref="customerInfo"
					:step="step" 
					:form-config="form2Configs"
					:form="form3"
				/>
			</div>
		</div>
		<div class="_footer  g-flex-cc">
			<div v-if="step===1" class=" g-flex-cc">
				<i-button @click="handleCancel">取消</i-button>
				<i-button
					v-if="form1.contract_type ==1 " 
					:loading="saveLoading" 
					type="primary" 
					@click="handleNext"
				>
					保存
				</i-button>
				<i-button v-else :loading="saveLoading" type="primary" @click="handleNext">下一步</i-button>
			</div>
			<div v-else class=" g-flex-cc">
				<i-button @click="handlePre">上一步</i-button>
				<i-button :loading="saveLoading" type="primary" @click="handleSave">保存</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import { ImgsPicker, Fragment } from "wya-vc";
import { Poptip } from 'iview';
import moment from 'moment';
import LimitWords from "@common/limit-words/limit-words";
import { getHashUrl, dataValidity } from '@utils/utils';
import API from '@stores/apis/root';
import { services } from '@stores/services/sale';
import { Confirm } from '@common/confirm/confirm';
import _s from '../_common/customer/cus-form/style';
import iview from "../_common/iview";
import { ChooseProduct } from '../_common/customer/choose-product';
import SaleExpand from '../_common/expand';
import CusForm, { formatProductDetail, formatCheckValue, formatOptions, getFormatValue } from '../_common/customer/cus-form/cus-form';
import Explain from '../../_common/explain/explain';
import Header from './parts/header';
import ContractInfo from './parts/contract-info';
import ProjectRequest from './parts/project-request';
import CustomerInfo from './parts/customer-info';

const routeName = {
	add: "下单",
	update: '编辑下单',
	readd: '重新下单'
	
};
const fieldMaps = [
	{
		infoKey: 'customer_name',
		fieldKey: ['contact_name', 'boss_name'],
	},
	{
		infoKey: 'phone',
		fieldKey: ['contact_tel', 'boss_tel'],
	},
	{
		infoKey: 'location',
		fieldKey: ['address'],
	},
	{
		infoKey: 'capital',
		fieldKey: ['capital'],
	},
	{
		infoKey: 'email',
		fieldKey: ['email'],
	}
];

let form2Container = {};
export default {
	name: 'oa-customer-contract-order',
	components: {
		"vc-imgs-picker": ImgsPicker,
		"vc-fragment": Fragment,
		'i-poptip': Poptip,
		"oa-limit-words": LimitWords,
		"oa-sale-expand": SaleExpand,
		'oa-cus-form': CusForm,
		'oa-explain': Explain,
		'oa-header': Header,
		'oa-contract-info': ContractInfo,
		'oa-project-request': ProjectRequest,
		'oa-customer-info': CustomerInfo
	},
	mixins: [iview],
	data() {
		return {
			query: this.$route.query,
			balance: '0.00',
			saveLoading: false,
			productList: [], // 用于保存选择的产品
			parentContract: {},
			form1: {
				has_new_contract: 0,
				payment_amount: null,
				contract_id: this.$route.query.contract_id,
				original_contract_id: this.$route.query.action == 'readd' ? this.$route.query.contract_id : '',
				contract_company_id: this.$route.query.contract_company_id,
				contract_type: (this.$route.query.contract_type && +this.$route.query.contract_type) || 0, // 合同类型 0 新合同 1补充协议 2更换合同 3 续费合同
				parent_contract_id1: undefined,
				parent_contract_id2: undefined,
				parent_contract_id3: undefined,
				contract_num: '',
				contract_amount: null,
				need_amount: null,
				negotiator: [],
				productList: [],
			},
			initStaffList: [{ staff_id: this.$global.staff.staff_id, staff_name: this.$global.staff.staff_name }],
			form2Configs: {
				title: '',
				tip: '',
				list: []
			},
			form3: {
				contract_image: [],
				discount_image: []

			},
			imgUrls: [],
			contractCompanyInfo: {},
			step: 1,
		};
	},
	computed: {
		
	},
	watch: {
		productList(newVal, oldVal) {
			this.form1.productList = newVal.map(item => 1);
			this.$refs.contractInfo.$refs.form.validateField("productList");
			this.form2Configs = this.mixCustomerInfo();
		},
	},
	created() {
		form2Container = {};
		this.$emit('create', [
			{ name: "客户合同", path: "/sale/customer/deal/contract" },
			{ name: routeName[this.$route.query.action], path: '' }
		]);
		if (this.$route.query.contract_id) {
			this.handleEdit(this.$route.query.contract_id);
		}
		if (this.$route.query.action == 'add') {
			this.loadCompanyInfo(this.$route.query.contract_company_id);
		}
	},
	mounted() {
		document.title = '下单';
		
	},
	methods: {
		handleCancel() {
			Confirm.popup({ msg: "取消后你所填写的内容将无法恢复，确认取消？" }).then(() => {
				this.$router.go(-1);
			}).catch(() => { });
		},
		async handleNext() {
			let valid = true;
			this.saveLoading = true;
			const _bool = await this.$refs.contractInfo.$refs.form.validateAndScroll();
			if (!_bool) {
				valid = false;
			}
			if (this.form1.productList.length == 0) {
				this.$Message.warning("请选择产品");
				valid = false;
			} else {
				const cusFormDatas = this.$refs.projectRequest.getFormData();
				const cusForms = this.$refs.projectRequest.getForm();

				for (let i = 0; i < cusForms.length; i++) {
					const _form = cusForms[i];
					const _formData = cusFormDatas[i];
					// eslint-disable-next-line no-await-in-loop
				 const _valid = await _form.validateAndScroll();
					if (!_valid) valid = false;
					if (valid && _formData.cooperate_year && _formData.bill_year && +_formData.cooperate_year > +_formData.bill_year) {
					 valid = false;
					 this.popError("合作年限必须小于等于提单年限"); 
					}
				}
			}
			if (valid) {
				if (this.form1.contract_type == 1) {
					// 补充协议直接保存
					this.handleSave();
				} else {
					// 非补充协议 验证当前页数据是否可提交
					this.handleSave({ validate: true });
				}
			} else {
				this.saveLoading = false;
				return;
				
			}
		},
		handlePre() {
			form2Container = { ...form2Container, ...this.$refs.customerInfo.getFormData() };
			this.step = 1;
		},
		async handleSave(option = { validate: false }) {
			const { validate } = option;
			this.saveLoading = true;
			try {
				if (this.step == 2) {
					const valid = await this.$refs.customerInfo.getForm().validateAndScroll();
					
					if (!valid) {
						this.saveLoading = false;
						return;
					}
					if (this.form3.contract_image.find(it => it.uid)) {
						this.$Message.error("请在电子合同上传完成后保存");
						this.saveLoading = false;
						return;
					}
					if (this.form3.discount_image.find(it => it.uid)) {
						this.$Message.error("请在打折凭证上传完成后保存");
						this.saveLoading = false;
						return;
					}
				}
				// 目标数据
				let targetData = { ...this.form1 };
				if (targetData.contract_type != 0) {
					targetData.parent_contract_id = targetData['parent_contract_id' + targetData.contract_type];
					delete targetData.parent_contract_id1;
					delete targetData.parent_contract_id2;
					delete targetData.parent_contract_id3;
				}
				// 构造项目信息
				const projects = [];
				this.$refs.projectRequest && this.$refs.projectRequest.getCusForm().forEach(form => {
				// 对应一个表单即一个product
					const temp = {};
					const configs = form.getConfigs();
					const formdata = JSON.parse(JSON.stringify(form.getFormData()));
					temp.product_id = configs.product_id;
					temp.project_id = configs.project_id || 0;
					temp.parent_product_id = configs.parent_product_id || 0;
					temp.cost_amount = formdata.cost_amount || 0;
					const product = this.productList.find(item => item.product_id == configs.product_id);
					temp.project_request = product.project_request || product.request.product_component;
					temp.project_request.forEach((item, index) => {
						item.component_value = this.formatField(formdata[item.component_field], item);
						formatCheckValue(item);
						formatOptions(item, configs);
					});
					// 构造规格
					temp.sku_id = form.priceCost && form.priceCost.sku_id;
					temp.is_gift = configs.is_gift ? 1 : 0;
					temp.can_gift = configs.can_gift;
					// 设置客户信息
					if (this.step == 2) {
						const configs2 = this.$refs.customerInfo.$refs.form.getConfigs();
						const formdata2 = JSON.parse(JSON.stringify(this.$refs.customerInfo.$refs.form.getFormData()));
						temp.customer_info = product.customer_info.product_component || product.customer_info;
						temp.customer_info.forEach(item => {
							item.component_value = this.formatField(formdata2[item.component_field], item);
							formatCheckValue(item);
							formatOptions(item, configs2);
						});
					}
					projects.push(temp);
				});
				targetData.project = projects;
				// 电子合同,折扣申请
				targetData = { ...targetData, ...this.form3 };
				let url;
				if (validate) {
					url = "_SALE_CONTRACT_VALIDATE";	
				} else if (this.$route.query.action == 'update') {
					url = "_SALE_CONTRACT_UPDATE_POST";
				} else {
					url = "_SALE_CONTRACT_SAVE_POST";
				}		
				return this.$request({
					url,
					type: "POST",
					loading: false,
					param: targetData
				}).then(res => {
					if (validate) {
						this.form2Configs.list.forEach(item => {
							if (form2Container[item.prop] !== undefined) item.value = form2Container[item.prop];
						});
						this.step = 2;
						this.saveLoading = true;
					} else {
						this.$Message.success(res.msg);
						this.$router.replace({
							path: '/sale/customer/deal/contract/success',
							query: {
								contract_id: res.data.contract_id,
								contract_company_id: this.form1.contract_company_id,
								contract_company_name: this.$refs.header.balances.contract_company_name,
								customer_id: this.query.customer_id,
								contract_type: this.form1.contract_type
							}
						});
					}
					return res;
				}).catch(res => {
					console.error(res);
					this.popError(res.msg);
					return res;
				}).finally(() => {
					this.saveLoading = false;
				});
			} catch (err) {
				this.saveLoading = false;
				console.error(err);
			}
		},
		handleChooseProduct() {
			const selected = this.productList.map(pro => ({
				product_id: pro.product_id,
				product_name: pro.product_name,
				parent_product_id: pro.parent_product_id, 
				parent_product_name: pro.parent_product_name

			}));
			ChooseProduct.popup({ selected, expandProduct: true, isRenew: this.form1.contract_type == 3 }).then(list => {
				// 先删除取消选中的产品
				for (let i = 0; i < this.productList.length; i++) {

					if (!list.find(pro => (
						pro.product_id == this.productList[i].product_id 
						// && pro.parent_product_id == this.productList[i].parent_product_id
					))) {
						this.productList.splice(i, 1);
						i--;
					}
				}
				// 加载选中的商品
				list.forEach(product => {
					const existSame = this.productList.find(pro => (
						pro.product_id == product.product_id 
						//	&& pro.parent_product_id == product.parent_product_id
					));
					if (!existSame) this.loadProductDetail(product.product_id, this.form1.contract_company_id, product.parent_product_id); 
				});
			}).catch(err => console.error(err));
		},
		// 新下单时选择产品后调用
		loadProductDetail(productId, contractCompanyId, parentProductId) {
			this.$request({
				url: API._SALE_PRODUCT_DETAIL_GET,
				type: "GET",
				loading: false,
				param: {
					product_id: productId,
					contract_company_id: contractCompanyId,
					parent_product_id: parentProductId,
					contract_type: this.form1.contract_type
				}

			}).then(res => {
				res.data.configs = formatProductDetail(
					res.data.request.product_component,
					res.data.product_id,
					parentProductId,
					{ 
						sku: res.data.sku,
						selected_sku: undefined, 
						has_sku: res.data.has_sku,
						is_cost_instalment: res.data.is_cost_instalment,
						price_unit_name: res.data.price_unit_name,
						is_gift: !!res.data.is_gift,
						can_gift: res.data.can_gift

					}
				);
				res.data.uuid = Math.random();
				res.data.sku.forEach(sk => {
					sk.key = '';
					sk.specsObj = {};
					sk.specs.forEach(sp => {
						sk.specsObj[sp.specs_field] = sp.specs_value;
					});
					

				});
				this.productList.push(res.data);
			}).catch(res => {
				console.error(res);
			});
		},
		mixCustomerInfo() {
			const result = {
				title: '',
				tip: '',
				list: [],
				components: [],
			};
			this.productList.forEach(data => {
				const temp = formatProductDetail(data.customer_info.product_component || data.customer_info);

				temp.list.forEach(item => {
					const exist = result.list.find(it => {
						return it.label === item.label;
					});
					if (!exist) {
						result.list.push(item);
					}
				});
			});
			return result;
		},
		loadContractInfo(contractId) {
			this.$request({
				url: API._SALE_CONTRACT_INFO_GET,
				type: "GET",
				loading: false,
				param: {
					contract_id: contractId
				}
			}).then(res => {
				if (res.data.contract_type != 0) {
					res.data['parent_contract_id' + res.data.contract_type] = res.data.parent_contract_id;
				}
				Object.keys(this.form1).forEach(key => {
					if (key == "need_amount" || key == "contract_amount" || key == "payment_amount") {
						this.form1[key] = parseFloat(res.data[key]);
					} else this.form1[key] = res.data[key] || this.form1[key];
				});
				this.initStaffList = res.data.negotiator_name;
			
				// 遍历所有项目，重新获取产品信息，
				res.data.project.forEach(item => {
					item.uuid = Math.random();
					const selected_sku = item.sku;
					item.sku = item.product_sku;
					item.sku.forEach(sk => {
						sk.key = '';
						sk.specsObj = {};
						sk.specs.forEach(sp => {
							sk.specsObj[sp.specs_field] = sp.specs_value;
						});
					});
					item.configs = formatProductDetail(
						item.project_request,
						item.product_id,
						item.parent_product_id,
						{
							project_id: item.project_id, 
							selected_sku, 
							payment_amount: item.payment_amount,
							cost_amount: item.cost_amount,
							need_amount: item.need_amount,
							has_sku: item.has_sku,
							sku: item.sku,
							is_cost_instalment: item.is_cost_instalment,
							is_gift: !!item.is_gift,
							can_gift: item.can_gift
						}
					);
					const _index = this.productList.findIndex(_p => {
						return _p.project_id > item.project_id;
					});
					if (_index == -1) {
						this.productList.push(item);	
					} else {
						this.productList.splice(_index, 0, item);
					}
				});
				// 存储原来客户信息的值
				setTimeout(() => {
					this.$nextTick(() => {
						this.form2Configs.list.forEach(item => {
							if (item.value !== undefined) form2Container[item.prop] = item.value;
						});
					});
				}, 100);

				// 设置电子合同，打折凭证
				this.form3.contract_image = res.data.contract_image || [];
				this.form3.discount_image = res.data.discount_image || [];
			});
		},
		handleEdit(contractId) {
			this.loadContractInfo(contractId);
		},
		formatField(value, item) {
			switch (item.component_type) {
				case 4:
					return moment(value).format('YYYY-MM-DD');
				case 5:
					return moment(value).format('YYYY-MM-DD HH:mm:ss');
				default:
					return value;
			}
		},
		// 只是请求产品详情
		getProductDetail(productId, contractCompanyId, parentProductId) {
			return this.$request({
				url: API._SALE_PRODUCT_DETAIL_GET,
				type: "GET",
				loading: false,
				param: {
					product_id: productId,
					contract_company_id: contractCompanyId,
					parent_product_id: parentProductId,
				}
			}).then(res => {
				return res.data;
			});	
		},
		handleNegotiatorChange(val) {
			if (this.form1.negotiator.length > 3) {
				this.form1.negotiator.pop();
			}
		},
		handleCloseKnow() {
			this.$refs.know.handleClose();
		},
		handleClearProduct() {
			if (this.productList.length) this.productList = [];
		},
		popError(msg) {
			if (msg.includes('网络不稳定')) {
				this.$Message.error(msg);
			} else {
				return Confirm.popup({ title: '提示', msg, showIcon: true, status: 'error', cancelText: '', okText: '知道了' });
			}
		},
		// 实付金额需大于等于所有产品的的实扣成本
		validatePaymentAmount(paymentAmount) {
			if (!this.$refs.projectRequest || this.$refs.projectRequest.getCusForm().length == 0) return { status: 1 };
			let totalCostAmount = 0;
			const cusForms = this.$refs.projectRequest.getCusForm();
			cusForms.forEach(f => {
				if (f.configs.is_cost_instalment) {
					totalCostAmount += (+f.formData.cost_amount || 0);
				} else {
					totalCostAmount += (parseFloat(f.priceCost && f.priceCost.cost) || 0);
				}
			});
			if (paymentAmount < totalCostAmount) {
				return { status: 0, msg: '实付金额需大于等于所有产品的的实扣成本' };
			}
			return { status: 1 };
		},
		loadCompanyInfo(contractCompanyId) {
			this.$request({
				url: "_SALE_DEAL_CUSTOMER_BASIC_COMPANY_INFO_GET",
				type: "GET",
				param: {
					contract_company_id: contractCompanyId
				},
				loading: false,
			}).then(res => {
				res.data.location = [res.data.province, res.data.city, res.data.area];
				if (res.data.capital) {
					res.data.capital = parseFloat(res.data.capital);
					if (res.data.capital == -1) {
						res.data.capital = null;
					}
				} else {
					res.data.capital = null;
				}
				this.contractCompanyInfo = res.data;
				fieldMaps.forEach(item => {
					item.fieldKey.forEach(fk => {
						if (res.data[item.infoKey]) {
							form2Container[fk] = res.data[item.infoKey];
						}
					});
					// form2Container[item.infoKey];
				});
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>

<style lang="scss" >
.v-sale-customer-deal-contract-order {
	height: calc(100% - 55px);
	overflow-y: auto;
	margin-top: -6px;
	._left-detail {
		padding: 16px;
		margin-left: 60px;
		padding-top:8px;
		margin-top: 12px;
		margin-bottom: 10px;
		width:860px;
		> span {
			display: inline-block;
			margin-top:8px;
			width: 260px;
		}
	}
	._konw-tip{
		position: absolute;
		right: 40px;
		color: #4B4F57;
		font-size: 12px;
		background: #fff;
		border-radius: 3px;
		border:1px solid #BFBFBF;
		padding: 6px 10px;
	}
}
.v-sale-customer-deal-contract-order-poptip{
	.ivu-poptip-inner {
			background: inherit;
			.ivu-poptip-body{
				background:rgba(0, 0, 0, 0.6);
				border-radius: 4px;
				color: #fff;
				.__know-btn {
					border: 1px solid white;
					background: #dbd9d94f;
					border-radius: 4px;
					padding: 6px 10px;
				}
			}
	}
	.ivu-poptip-arrow:after{
			border-bottom-color: rgb(102, 102, 102) !important;
			border-top-color: rgb(102, 102, 102) !important;
	}	
}
</style>
