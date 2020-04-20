<template>
	<div class="g-flex-cc">
		<div class="v-sale-pages-ticket-apply-content g-m-t-40">
			<div class="_prompt">
				<i-poptip
					ref="know"
					width="500"
					class="_konw-tip g-fr"
					placement="bottom-end"
					popper-class="oa-sale-ticket-apply-content-poptip"
					transfer
					word-wrap
				>
					<span class="g-pointer">开票须知</span>
					<div slot="content">
						<!-- eslint-disable -->
                        <div>
开票流程：
1. OA申请，提交客户的开票信息和开票类型，上传客户的开票资料、打款凭证、电子合同；
2. 准备要开票客户的纸质版合同，一式两份的找叶方燕；一式三份和商学院的合同找出纳（516室陈佳丽）；
3. 开票时间：OA提交后，线下相关资料齐全的，次日可为客户开具发票，针对比较急的客户，也可以当天及时开具；
4. 发票开具完成后，会计点对点通知到申请人；
5.开票四流一致原则：合同主体（甲方）、资金流（汇款方）、开票主体（购货方）、交付主体（实际使用项目方）必须一致；
5.1.开甲方A公司发票：合同主体须为A公司；汇款人须为A公司，个人刷POS机（签订《委托付款三方协议》），个人网银转微一案公户｛网银转账时备注：代A公司（须为公司全称）付款，比如“代北京京东世纪贸易有限公司付款”｝；
5.2.开甲方A公司关联公司B公司发票：合同主体须为B公司，汇款人须为B公司，个人刷POS机（签订《委托付款三方协议》），个人网银转微一案公户｛网银转账时备注：代B公司（须为公司全称）付款，比如“代北京京东世纪贸易有限公司付款”，备注不全的，走账退款重新汇款｝；
5.3.开个人（张三）发票：合同主体须为其个人（张三）；汇款人须为张三，个人刷POS机（不限定刷卡人是否为合同主体）；
5.4.特殊情况：a.开公司发票，合同主体为个人，个人汇款，重新签合同，退款重新汇款(签合同解除协议）。b.开公司发票，合同主体为个人，公司汇款，重新签合同；
温馨提醒：发票类型：增值税普通发票-客户可为一般纳税人、小规模纳税人、个人；增值税专用发 票-客户必须为一般纳税人（若会计在全国企业一般纳税人查询网站查询不到该企业一般纳税人资格，须客户提供一般纳税人证明）。
                        </div>
                        <!-- eslint-enable -->
						<div
							class="g-tc g-pointer g-m-t-10"
							style="height:30px;font-size:13px"
							@click="handleCloseKnow"
						>
							<span class="__know-btn">知道了</span>
						</div>
					</div>
				</i-poptip>
			</div>
			<i-form
				ref="form"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="140"
				class="v-tpl-form"
				position="left"
				style="width:880px"
			>
				<div class="g-flex g-jc-sb">
					<i-form-item
						:rules="ruleValidate.invoice_title"
						label="发票抬头："
						prop="invoice_title"
						style="width: 420px"
					>
						<i-select
							ref="select"
							v-model="formValidate.invoice_title"
							:remote-method="handleSelectInvoice"
							:loading="loading"
							placeholder="请输入开票公司名称"
							filterable
							clearable
							remote
							@on-change="handleGetTitle"
							@on-query-change="handleQueryChange"
						>
							<i-option
								v-for="(option, index) in company_list"
								:value="option.contract_company_name"
								:key="index"
							>{{ option.contract_company_name }}</i-option>
						</i-select>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="合同主体的公司名称"
						/>
					</i-form-item>
					<i-form-item label="汇款方式：" style="width: 420px">
						<div v-for="(item,index) of formValidate.payment_type_amount" :key="index" class="g-flex" style="position: relative;">
							<i-form-item
								:prop="'payment_type_amount.'+index+'.payment_type'"
								:rules="{required: true, type:'number', message: '请选择汇款方式', trigger: 'change'}"
								style="width: 150px"
								class="g-m-r-10">
								<i-select
									v-model="item.payment_type"
									placeholder="请选择汇款方式"
									clearable
								>
									<i-option
										v-for="(ele,i) in payment_list"
										:key="i"
										:disabled="formValidate.payment_type_amount.some(item => item.payment_type === ele.value)"
										:value="ele.value"
									>{{ ele.label }}</i-option>
								</i-select>
							</i-form-item>
							<i-form-item
								:prop="'payment_type_amount.'+index+'.amount'"
								:rules="{required: true, type:'number', message: '请输入发票金额', trigger: 'blur'}"
								style="width: 150px"
							>
								<span class="_number-append">元</span>
								<i-input-number
									:max="99999999.99"
									:precision="2"
									:active-change="false"
									v-model="item.amount"
									class="_input"
									placeholder="请输入发票金额"
									@on-change="handleAmount"
								/>
							</i-form-item>
							<i
								v-if="formValidate.payment_type_amount.length !== 1"
								class="icon-remove-circle iconfont g-c-red-light"
								style="display: inline-block;vertical-align: middle;"
								@click="()=>{formValidate.payment_type_amount.splice(index, 1);handleAmount()}"
							/>
							<i
								v-if="formValidate.payment_type_amount.length - 1 === index"
								:class="{_explain:index>0}"
								class="icon-add1 iconfont g-c-blue-light g-m-l-5 "
								style="display: inline-block;vertical-align: middle;"
								@click="()=>{formValidate.payment_type_amount.push(
									{	payment_type: null,
										amount: null }
								)}"
							/>
						</div>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="客户以公司名义进行合作并打款则选择公司对公司；客户以个人名义合作并打款则选择个人对公司；客户以个人名义刷卡的，则选择个人刷卡"
						/>
					</i-form-item>
				</div>
				<div class="g-flex g-jc-sb">
					<i-form-item label="客户姓名：" prop="customer_name" style="width: 420px">
						<i-input
							v-model="formValidate.customer_name"
							disabled
							placeholder="请输入客户姓名"
						/>
					</i-form-item>
					<i-form-item prop="invoice_type" style="width: 420px">
						<span slot="label">
							<span>发票类型</span>
							<oa-explain style="transform: translateY(1px);" content="根据客户公司财务的需求"/>：
						</span>
						<i-radio-group
							v-model="formValidate.invoice_type"
							@on-change="handleInvoiceType"
						>
							<i-radio :label="1">
								<span>增值税专用发票</span>
							</i-radio>
							<i-radio :label="2">
								<span>增值税普通发票</span>
							</i-radio>
						</i-radio-group>
					</i-form-item>
				</div>
				<div class="g-flex g-jc-sb">
					<i-form-item label="客户电话：" prop="customer_phone" style="width: 420px">
						<i-input
							v-model="formValidate.customer_phone"
							disabled
							placeholder="请输入客户电话"
						/>
					</i-form-item>
					<i-form-item label="发票金额：" style="width: 420px" prop="invoice_money">
						<span class="_number-append">元</span>
						<i-input-number
							:max="99999999.99"
							:precision="2"
							:active-change="false"
							v-model="formValidate.invoice_money"
							disabled
							class="_input"
							placeholder="请输入发票金额"
						/>
					</i-form-item>
				</div>

				<div class="g-flex g-jc-sb">
					<i-form-item label="合同编号：" prop="contract_num" style="width: 420px">
						<i-input
							v-model="formValidate.contract_num"
							:maxlength="100"
							placeholder="请输入合同编号"
						/>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="合同主体的合同编号"
						/>
					</i-form-item>
					<i-form-item label="纳税人识别号：" prop="ratepayer_number" style="width: 420px">
						<i-input
							v-model="formValidate.ratepayer_number"
							:maxlength="32"
							placeholder="请输入纳税人识别号"
						/>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="即合作客户营业执照上的“统一社会信用代码"
						/>
					</i-form-item>
				</div>
				<div class="g-flex g-jc-sb">
					<i-form-item
						:class="{_required:!required}"
						label="客户地址："
						prop="customer_address"
						style="width: 420px"
					>
						<i-input
							:maxlength="50"
							v-model="formValidate.customer_address"
							placeholder="请输入客户地址"
						/>
					</i-form-item>
					<i-form-item
						:class="{_required:!required}"
						label="开户行："
						prop="open_bank"
						style="width: 420px"
					>
						<i-input
							:maxlength="32"
							v-model="formValidate.open_bank"
							placeholder="请输入开户行"
						/>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="即开票客户的开户许可证上的开户行"
						/>
					</i-form-item>
				</div>
				<div class="g-flex g-jc-sb">
					<i-form-item label="合作项目：" prop="project" style="width: 420px">
						<i-input
							:maxlength="30"
							v-model="formValidate.project"
							placeholder="请输入合作项目"
						/>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="与开票金额相关联的合同中的产品名称，请注意填写详细的产品名，可参考下单表上的产品名"
						/>
					</i-form-item>
					<i-form-item
						:class="{_required:!required}"
						label="对公账号："
						prop="public_account"
						style="width: 420px"
					>
						<i-input
							:maxlength="32"
							v-model="formValidate.public_account"
							placeholder="请输入对公账号"
						/>
						<oa-explain
							class="g-m-l-5 _explain"
							style="transform: translateY(2px);"
							content="即开票客户的开户许可证上的银行账号"
						/>
					</i-form-item>
				</div>
				<i-form-item label="我方合同公司：" prop="our_company_id" style="width: 420px">
					<i-select
						v-model="formValidate.our_company_id"
						style="width:280px"
						clearable
						placeholder="请选择我方合同公司"
						class="_our-company"
					>
						<i-option
							v-for="(item,index) in ourContractCompanys"
							:key="index"
							:value="item.contract_company_id"
						>
							{{ item.company_name }}
						</i-option>
					</i-select>
					<oa-explain
						style="position: absolute;left: 285px;top: 0px"
						placement="bottom-start"
						content="签订合同时我方使用的公司名称"
					/>
				</i-form-item>
				<div class="g-flex g-jc-sb">
					<i-form-item prop="voucher_list" label="打款凭证：" style="width: 420px">
						<div>
							<vc-imgs-picker
								:max="3"
								v-model="formValidate.voucher_list"
								@error="handleError"
							/>
						</div>
						<div>最多3张</div>
					</i-form-item>
					<i-form-item prop="invoice_list" label="开票资料：" style="width: 420px">
						<span slot="label">
							<span>开票资料</span>
							<oa-explain
								style="transform: translateY(1px);"
								content="客户所能提供的开票资料，例如客户的开票信息截图"
							/>：
						</span>
						<div>
							<vc-imgs-picker
								:max="3"
								v-model="formValidate.invoice_list"
								@error="handleError"
							/>
						</div>
						<div>最多3张</div>
					</i-form-item>
				</div>
				<div class="g-flex g-jc-sb">
					<i-form-item label="电子合同：" prop="contract_list" style="width:420px">
						<div>
							<vc-imgs-picker
								:max="10"
								v-model="formValidate.contract_list"
								@error="handleError"
							/>
						</div>
						<div>最多10张</div>
					</i-form-item>
					<!-- <div v-if="formValidate.payment_type_amount.some(it=>[3,6].includes(it.payment_type))"> -->
					<i-form-item
						ref="entrusted_payment_list"
						label="委托付款三方协议："
						prop="entrusted_payment_list"
						style="width:420px"
					>
						<div>
							<vc-imgs-picker
								:max="10"
								v-model="formValidate.entrusted_payment_list"
								@error="handleError"
							/>
						</div>
						<div>最多10张</div>
					</i-form-item>
					<!-- </div> -->
				</div>
			</i-form>
			<footer class="g-flex-cc">
				<vc-debounce-click :tag="Button" class="g-m-l-10" @click="handleClear">取消</vc-debounce-click>
				<vc-debounce-click
					:tag="Button"
					type="primary"
					class="g-m-l-10"
					@click="handleSubmit"
				>保存</vc-debounce-click>
			</footer>
		</div>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message,
	RadioGroup, Radio, Button, Poptip
} from 'iview';
// utils
import { dataValidity } from '@utils/utils';
import API from "@stores/apis/root";
import { ImgsPicker, ImgsPreview } from 'wya-vc';
import Explain from '@components/_common/explain/explain';
import { PModalDelete } from './popup/delete';


export default {
	name: 'oa-content',
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-cascader': Cascader,
		'vc-imgs-picker': ImgsPicker,
		'vc-imgs-preview': ImgsPreview,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		'i-poptip': Poptip,
		'oa-explain': Explain
	},
	data() {
		return {
			loading: false,
			paymentShow: false,
			invoice_money: 0, // 发票金额
			company_list: [], // 公司名称
			contract_list: [], // 可选的合同编号
			company_id: '', // 公司Id
			payment_list: [{ label: '公司-公司', value: 1 }, { label: '个人-公司', value: 3 }, { label: '个人刷卡', value: 6 }], //
			required: true,
			ourContractCompanys: [],
			formValidate: {
				our_company_id: '',
				payment_type: "", // 汇款方式
				invoice_title: '', // 发表抬头
				invoice_type: "", // 发票类型
				customer_name: '', //
				customer_phone: '', // 客户电话
				contract_num: '', // 合同编号
				invoice_money: null, // 发票金额
				voucher_list: [], // 打款凭证
				invoice_list: [], // 电子合同
				contract_list: [], // 开票资料
				entrusted_payment_list: [], // 委托付款三方协议
				ratepayer_number: '', // 纳税识别号
				open_bank: '', // 开户行
				project: "", // 合作项目
				customer_address: "", // 客户地址
				public_account: "", // 对公账号
				contract_company_id: '', //
				invoice_id: '',
				staff_id: "",
				payment_type_amount: [
					{ payment_type: null,
					  amount: null }
				]
			},
			ruleValidate: {
				invoice_title: [
					{ required: true, message: '请输入开票公司名称' }
				],
				payment_type: [
					{ required: true, message: '请选择汇款方式' }
				],
				our_company_id: [
					{ required: true, type: "number", message: '请选择汇款方式', trigger: 'change' }
				],
				invoice_type: [
					{ required: true, message: '请选择发表类型' }
				],
				customer_name: [
					{ required: true, message: '请输入客户姓名' }
				],
				customer_phone: [
					{ required: true, message: '请输入客户电话' }
				],
				invoice_money: [
					{ required: true, message: '输入发票金额' }
				],
				contract_num: [
					{ required: true, type: "string", message: '请输入合同编号', trigger: 'blur' },
					{ pattern: /^[0-9a-zA-Z,]+$/, message: '请输入英文或数字或英文逗号', trigger: 'blur' }
				],
				ratepayer_number: [
					{ required: true, message: '请输入纳税人识别号', trigger: 'blur' },
					{ pattern: /^[a-zA-Z0-9]+$/, message: '请输入英文或数字', trigger: 'blur' }
				],
				customer_address: [
					{ required: true, message: '请输入客户地址', trigger: 'blur' }
				],
				project: [
					{ required: true, message: '请输入合作项目', trigger: 'blur' }
				],
				public_account: [
					{ required: true, message: '请输入对公账号' },
					{ pattern: /^[\d]+$/, message: '请输入数字', trigger: 'blur' }
				],
				voucher_list: [
					{ required: true, type: 'array', message: '请上传打款凭证' }
				],
				invoice_list: [
					{ required: true, type: 'array', message: '请上传开票资料' }
				],
				entrusted_payment_list: [
					{ required: false, type: 'array', message: '请上传委托付款三方协议' }
				],
				contract_list: [
					{ required: true, type: 'array', message: '请上传电子合同' }
				],
				open_bank: [
					{ required: true, message: '请输入开户行', trigger: 'blur' },
					{ pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/, message: '请输入中文或英文', trigger: 'blur' }
				]
			}
		};
	},
	computed: {
		// 如果发票选择了非个人公司 并且 汇款方式选了个人公司或个人刷卡，委托付款三方协议为必填，其他情况委托付款三方协议为选填
		entrustedPaymentRequired() {
			const curCompany = this.company_list.find(company => company.contract_company_name === this.formValidate.invoice_title);
			const personalPayment = this.formValidate.payment_type_amount.find(item => item.payment_type === 3 || item.payment_type === 6);
			return curCompany && !curCompany.is_personal && personalPayment;		
		}
	},
	watch: {
		entrustedPaymentRequired(newVal) {
			this.ruleValidate.entrusted_payment_list[0].required = !!newVal;
			this.$refs.entrusted_payment_list.setRules();
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		const { query } = this.$route || {};
		if (query.invoice_id) {
			this.loadData();
		}
		if (query.type == 'sale') {
			this.formValidate.customer_phone = query.phone;
			this.formValidate.customer_name = query.customer_name;
			this.formValidate.contract_num = query.contract_num.toString();
			this.formValidate.contract_company_id = query.contract_company_id;
			this.company_list.push({ contract_company_name: query.contract_company_name, option: 1, is_personal: +query.is_personal });
			this.$nextTick(() => {
				this.formValidate.invoice_title = query.contract_company_name;
			});
		}
		this.loadOurContractCompanys();
	},
	methods: {
		loadOurContractCompanys(v) {
			this.$request({
				url: "_SALE_PAYMENT_OUR_CONTRACT_COMPANY_GET",
				type: "GET",
				loading: false,
			}).then(res => {
				this.ourContractCompanys = res.data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleCloseKnow() {
			this.$refs.know.handleClose();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.formValidate.invoice_title || '';
			if (targetQuery.length > query.length) {
				this.formValidate.invoice_title = '';
				this.$refs.select.clearSingleSelect();
			}
		},
		handleSelectOpenChange(val) {
			if (!val && !this.formValidate.invoice_title && this.company_list.length > 0) {
				this.formValidate.invoice_title = this.company_list[0].contract_company_name;
				this.handleGetTitle();
			}
		},
		handleInvoiceType(v) {
			if (v == 2) {
				this.ruleValidate.customer_address[0].required = false;
				this.ruleValidate.open_bank[0].required = false;
				this.ruleValidate.public_account[0].required = false;
				this.required = false;
			} else {
				this.ruleValidate.customer_address[0].required = true;
				this.ruleValidate.open_bank[0].required = true;
				this.ruleValidate.public_account[0].required = true;
				this.required = true;
			}
		},
		loadData() {
			this.$request({
				url: API._SALE_TICKET_INVOICE_DETAIL_GET,
				type: "post",
				param: {
					invoice_id: this.$route.query.invoice_id
				}
			}).then(res => {
				Object.keys(this.formValidate).forEach(key => {
					this.formValidate[key] = res.data[key] || this.formValidate[key];
				});
				this.formValidate.invoice_money = Number(this.formValidate.invoice_money);
				this.company_list.push({ 
					contract_company_name: this.formValidate.invoice_title, 
					option: 1, 
					is_personal: +this.$route.query.is_personal 
				});
				this.company_id = res.data.contract_company_id;
				this.formValidate.voucher_list = res.data.voucher_list;
				this.formValidate.invoice_list = res.data.invoice_list;
				this.formValidate.contract_list = res.data.contract_list;
				this.handleInvoiceType(this.formValidate.invoice_type);
				this.handleGetInvoice();
			}).catch(error => {
				console.error(error);
			});
		},
		handleSelectInvoice(v) {
			if (v !== '') {
				this.loading = true;
				this.$request({
					url: API._SALE_TICKET_COMPANY_NAME_GET,
					type: "GET",
					param: {
						company_name: v,
					},
					loading: false
				}).then(res => {
					this.loading = false;
					this.company_list = res.data;
				}).catch(error => {
					console.error(error);
				});
			} else {
				this.loading = false;
			}
		},
		getimgurl(array) {
			if (!array) {
				return [];
			}
			let i = [];
			array.forEach(ele => {
				i.push(ele.image_url);
			});
			return i;
		},
		handleRelationCompanyChange(arr) {
			if (this.formValidate.contract_num.length > 3) {
				this.formValidate.contract_num.pop();
			}

		},
		handleGetInvoice(V) {
			this.$request({
				url: API._SALE_TICKET_CONTRACT_Id_GET,
				type: "GET",
				loading: false,
				param: {
					company_id: this.company_id,
				}
			}).then(res => {
				this.contract_list = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		SetApply(V) {
			this.$request({
				url: API._SALE_TICKET_INVOICE_CREATE_POST,
				type: "post",
				param: {
					...this.formValidate,
					parent_invoice_id: this.$route.query.type == 4 ? this.$route.query.parent_invoice_id : '',
				}
			}).then(res => {
				this.$router.push({ name: 'sale-ticket' });
			}).catch(error => {

				this.$Message.error(error.msg);
			});
		},
		handleSubmit(name) {
			this.$refs.form.validate((isValid) => {
				if (isValid) {
					this.SetApply();
				} else {
					Message.error('内容请填写完整');
				}
			});
		},
		handleGetTitle(v) {
			if (this.company_list.length > 0) {
				this.company_list.forEach(ele => {
					if (ele.contract_company_name == this.formValidate.invoice_title) {
						this.company_id = ele.contract_company_id;
						this.formValidate.contract_company_id = this.company_id;
						this.formValidate.staff_id = ele.staff_id;
					}
				});
			}
			this.handleGetInvoice(v);
			this.company_list.forEach(ele => {
				if (ele.contract_company_id == this.company_id) {
					this.formValidate.customer_name = ele.customer_name;
					this.loadOurContractCompanys(ele.customer_id);
					this.formValidate.customer_phone = ele.phone;
				}
			});
		},
		handleClear() {
			PModalDelete.popup({
			}).then((res) => {
				this.$router.go(-1);
			}).catch((res) => {
			});

		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		paymentSelect(i, type) {
			const v = this.formValidate.payment_type_amount.findIndex(ele => {
				return i == ele.payment_type;
			});
			return v != -1 && v != type;
		},
		handleAmount() {
			let num = 0;
			this.formValidate.payment_type_amount.forEach(ele => {
				if (ele.amount >= 0) {
					num += ele.amount;
				}
			});
			this.formValidate.invoice_money = num;
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-sale-pages-ticket-apply-content {
        ._konw-tip {
            right: 40px;
            color: #4b4f57;
            font-size: 12px;
            background: #fff;
            border-radius: 3px;
            border: 1px solid #bfbfbf;
            padding: 6px 10px;
        }
        ._prompt {
            position: fixed;
            padding-right: 40px;
            left: 194px;
            top: 101px;
            right: 0;
            padding-top: 10px;
            z-index: 9;
            background: #fff;

        }
        .btn {
            color: #0085ff;
            cursor: pointer;
        }
        ._explain {
            position: absolute;
            right: -18px;
            top: 0;
        }
        ._right {
            @extend .btn;
            position: absolute;
            right: -30px;
            top: 0;
        }
        ._del {
            @extend .btn;
            display: block;
        }
        ._number-append {
            display: inline-block;
            position: absolute;
            right: 7px;
            vertical-align: bottom;
            z-index: 1;
            color: gray;
        }
        /deep/ .ivu-input-number {
            width: 100% !important;

            .ivu-input-number-handler-wrap {
                display: none !important;
            }
        }
        footer {
            position: absolute;
            bottom: 0;
            z-index: 2;
            left: 0;
            background-color: #ffffff;
            width: 100%;
            height: 60px;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
    }
    .v-tic-apply {
        width: 940px;
        margin-top: 50px;
        margin-bottom: 50px;
        .g-flex {
            & > div:last-child {
                margin-left: 100px;
            }
        }

        // .__button {
        //     width: calc(100% - 160px);
        //     height: 60px;
        //     line-height: 60px;
        //     position: fixed;
        //     right: 0;
        //     bottom: 0;
        //     box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        //     background: #fff;
        // }
        /deep/ .ivu-radio-group {
            vertical-align: bottom !important;
        }
    }
    ._required {
        /deep/ .ivu-form-item-label::before {
            content: "";
        }
    }
</style>
