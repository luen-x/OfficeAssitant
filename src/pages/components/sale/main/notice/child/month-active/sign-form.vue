<template>
	<div>
		<!-- 已合作客户 单个表单 -->
		<div class="_head">
			<span class="_title-bar g-bg-red-mid"/>
			<span class="_title">客户{{ index+1 }}</span>
			<span v-if="!editDate.customer_type" class="g-operation g-m-l-20" @click="$emit('delete')">删除</span>
		</div>
		<i-form
			ref="form"
			:model="formData"
			:label-width="110"
			:rules="rules"
			inline
			style="margin-top: 20px;"
		>
			<i-form-item
				:rules="rules.source"
				label="选择客户："
				prop="source"

			>
				<i-select
					v-model="formData.source"
					style="width:300px"
					transfer
					clearable
					@on-change="handleChangeSource">
					<i-option
						v-for="(item,index ) in entrylist"
						:value="item.value"
						:key="index"
					>{{ item.label }}</i-option>
				</i-select>
				<i-form-item
					v-if="formData.source==1"
					prop="customer_company"
					style="width:300px;margin-bottom: 0 !important;margin-right: 0"
				>
					<i-input
						:maxlength="25"
						v-model="formData.customer_company"
						clearable
						placeholder="请输入公司名称"
						@on-enter="()=>{formData.customer_company&&handleIsSelf()}"
						@on-blur="()=>{formData.customer_company&&handleIsSelf()}"
					/>
				</i-form-item>
				<i-form-item
					v-else-if="formData.source==2"
					prop="cus_id"
					style="width:300px;margin-bottom: 0 !important;margin-right: 0">

					<i-select
						ref="select"
						v-model="formData.cus_id"
						:remote-method="searchCompany"
						:loading="searchLoading"
						placeholder="请输入公司名称"
						clearable
						filterable
						transfer
						remote
						@on-change="loadCustomerInfo"
						@on-query-change="handleQueryChange">
						<i-option
							v-for="(item, index) in companyList"
							:value="type==1?item.contract_company_id:item.customer_id"
							:key="index"
							:label="item.company_name"
						/>
					</i-select>
				</i-form-item>
			</i-form-item>
			<template v-if="customer_type == 3||formData.source==1">
				<i-form-item prop="industry_id" clearable label="公司行业：">
					<i-select v-model="formData.industry_id" transfer style="width: 300px">
						<i-option
							v-for="(item, index) in industryList"
							:value="item.industry_id"
							:key="index"
						>{{ item.industry_name }}</i-option>
					</i-select>
				</i-form-item>
			</template>
			<i-form-item prop="boss_name" label="客户姓名：">
				<i-input
					v-model="formData.boss_name"
					:maxlength="10"
					clearable
					placeholder="请输入客户姓名"
					style="width: 300px"
				/>
			</i-form-item>
			<i-form-item prop="boss_tel" label="客户电话：">
				<i-input
					v-model="formData.boss_tel"
					:maxlength="13"
					clearable
					placeholder="请输入客户电话"
					style="width: 300px"
				/>
			</i-form-item>


			<div v-if=" formData.source==2&&formData.cus_id&&type!=3" class="g-flex _body">
				<div>
					<div>
						公司名称
						<span>{{ customerInfo.company_name }}</span>
					</div>
					<div>
						老板姓名
						<span>{{ customerInfo.customer_name }}</span>
					</div>
					<div>
						合作时间
						<span>{{ customerInfo.time_str?customerInfo.time_str:'暂未合作' }}</span>
					</div>
				</div>
				<div>
					<div>
						老板行业
						<span>{{ customerInfo.industry_name }}</span>
					</div>
					<div>
						老板电话
						<span>{{ customerInfo.tel }}</span>
					</div>
				</div>
			</div>
			<i-form-item
				v-if="activity_detail.write_retrain_num==1"
				prop="retrain_number"
			>
				<span slot="label">
					<span>复训次数</span>
					<oa-explain
						style="transform: translateY(1px); margin-right: -3px"
						content="该客户参加过此类活动的次数，例如已经参加过实操班1次，再次报名的话则复训次数为1"
					/>：
				</span>
				<i-select
					v-model="formData.retrain_number"
					clearable
					transfer
					style="width:300px"
					placeholder="请选择复训次数"
				>
					<i-option
						v-for="(item,i) in retrainingList"
						:value="item.value"
						:key="i"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>

			<i-form-item
				v-if="activity_detail.write_category==1"
				prop="cooperate_category"
			>
				<span slot="label">
					<span>合作类别</span>
					<oa-explain
						style="transform: translateY(1px); margin-right: -3px"
						content="如果合作过则根据合作的金额选择相应等级，如99800元为A++；未合作过为D；赠送的为S"
					/>：
				</span>
				<i-select
					v-model="formData.cooperate_category"
					clearable
					transfer
					placeholder="请选择合作类别"
					style="width:300px"
				>
					<i-option
						v-for="item in cooperateList"
						:value="item.value"
						:key="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>

			<i-form-item
				v-if="activity_detail.write_listen_finish==1"
				:rules="rules.listen_finish"
				prop="listen_finish"
			>
				<span slot="label">
					<span>是否听完</span>
					<oa-explain
						content="提前了解客户在活动期间能否全程参加，并听完活动
举例：假如活动进行2天，但是了解到客户已经安排只能来听1天，则此处选择“否”"
						style="transform: translateY(1px); margin-right: -3px"
					/>：
				</span>
				<i-radio-group
					v-model="formData.listen_finish"
					style="width:300px"
				>
					<i-radio :label="1">
						<span>否</span>
					</i-radio>
					<i-radio :label="2" class="g-m-l-20">
						<span>是</span>
					</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item
				v-if="activity_detail.write_join_strategy==1"
				:rules="rules.is_join_strategy"
				prop="is_join_strategy"
			>
				<span slot="label" >
					<span>参加过策略班：</span>
				</span>
				<i-radio-group
					v-model="formData.is_join_strategy"
					style="width:300px">
					<i-radio :label="1">
						<span>否</span>
					</i-radio>
					<i-radio :label="2" class="g-m-l-20">
						<span>是</span>
					</i-radio>
				</i-radio-group>
			</i-form-item>
			<i-form-item
				v-if="activity_detail.write_lift_plate==1"
				:rules="rules.is_lift_plate"
				prop="is_lift_plate"
				label="是否起盘："
			>
				<i-select
					v-model="formData.is_lift_plate"
					style="width:300px"
					transfer
					clearable>
					<i-option :value="1" label="否"/>
					<i-option :value="2" label="是"/>
				</i-select>

				<i-form-item
					v-if="formData.is_lift_plate==2"
					:rules="rules.lift_plate_month"
					prop="lift_plate_month"
					style="width:330px;margin-bottom: 0 !important;" >
					<i-input
						v-model="formData.lift_plate_month"
						:maxlength="20"
						clearable
						placeholder="请输入起盘几个月了"
						style="width: 300px;margin-bottom:0 !important"
					/>个月
				</i-form-item>
			</i-form-item>
			<i-form-item
				v-if="activity_detail.write_proxy_num==1"
				label="已招代理数："
				prop="proxy_num"
			>
				<i-select
					v-model="formData.proxy_num"
					clearable
					transfer
					placeholder="请选择已招代理数"
					style="width:300px"
				>
					<i-option
						v-for="item in proxyList"
						:value="item.value"
						:key="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</i-form-item>
			<div v-for="(user, index) in formData.user_list" :key="index">
				<i-form-item :label="'报名人'+(index+1)+'：'" class="_user-list" required style="margin-bottom: 0 !important;">
					<div class="g-flex" style="width: 95%;position: relative;">
						<div>
							<i-form-item
								:prop="'user_list.'+index+'.username'"
								:rules="rules.user_list.username"
								class="g-col g-m-r-10"
								style="width:220px"
							>
								<i-input
									:maxlength="10"
									v-model="user.username"
									clearable
									placeholder="请输入姓名"
								/>
							</i-form-item>
							<i-form-item
								:prop="'user_list.'+index+'.position'"
								:rules="rules.user_list.position"
								class="g-col g-m-r-10"
								style="width:220px"

							>
								<i-select
									v-model="user.position"
									style="width:220px"
									placeholder="请选择职位"
									transfer
									clearable>
									<i-option v-for="(item,index) in positionList" :key="index" :value="item.value" :label="item.label"/>
								</i-select>
							</i-form-item>
							<i-form-item
								:prop="'user_list.'+index+'.id_card'"
								:rules="rules.user_list.id_card"
								class="g-col g-m-r-10"
								style="width:220px"
							>
								<i-input
									:maxlength="18"
									v-model="user.id_card"
									placeholder="请输入身份号码"
									clearable
								/>
							</i-form-item>
							<i-form-item
								:prop="'user_list.' + index + '.phone'"
								:rules="rules.user_list.phone"
								class="g-col g-m-r-10"
								style="width:220px"
							>
								<i-input
									v-model="user.phone"
									:maxlength="11"
									placeholder="请输入手机号码"
									clearable
									style="width: 220px;" 
								/>
							</i-form-item>
						</div>
						<div
							v-if="(extra_apply > 0 || apply_limit > 0||formData.user_list.length>apply_limit)"
							style="position: absolute; left: 100%;"
						>
							<div class="g-flex g-jc-sb">
								<i
									v-if="index !== 0"
									class="g-c-red-light iconfont icon-remove-circle g-m-r-10"
									@click="handleDeluser(index)"
								/>
								<i
									v-if="1||formData.user_list.length !== parseInt(extra_apply) + parseInt(apply_limit)"
									:style="{display:formData.user_list.length>1&&index == 0?'none':''}"
									class="g-c-blue-light iconfont icon-add1"
									@click="handleAdduser(index)"
								/>
							</div>
						</div>
						<div v-else style="visibility: hidden;">
							<div class="g-flex g-jc-sb">
								<i
									class="g-c-red-light iconfont icon-remove-circle"
									@click="handleDeluser(index)"
								/>
								<i
									class="g-c-blue-light iconfont icon-add1 g-m-l-10"
									@click="handleAdduser(index)"
								/>
							</div>
						</div>
					</div>
				</i-form-item>
			</div>
			<i-form-item
				v-if="activity_detail.has_voucher==1"
				prop="voucher_list"
				label="打款凭证："
				style="width: 800px;"
			>
				<vc-imgs-picker
					:max="5"
					v-model="formData.voucher_list"
					@error="handleError"
				/>
				<div>最多5张</div>
			</i-form-item>
			<template v-if="type==1&&activity_detail.write_is_renew">
				<i-form-item label="是否续费客户" prop="is_renew">
					<i-radio-group
						v-model="formData.is_renew"
						style="width:300px"
					>
						<i-radio :label="1">
							<span>否</span>
						</i-radio>
						<i-radio :label="2" class="g-m-l-20">
							<span>是</span>
						</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item
					v-if="formData.is_renew==2"
					prop="renew_type"
					label="续费类型"
					class="g-col g-m-r-10"
					style="width:220px"	>
					<i-select
						v-model="formData.renew_type"
						style="width:220px"
						placeholder="请选择续费类型"
						transfer
						clearable>
						<i-option :value="1" label="只续费软件"/>
						<i-option :value="2" label="续费软件+大课+咨询"/>
					</i-select>
				</i-form-item>
			</template>
		</i-form>
	</div>
</template>

<script >
import { ImgsPicker } from 'wya-vc';
import iview from '@components/sale/_common/iview';
import API from "@stores/apis/root";
import Explain from '@components/_common/explain/explain';
import { services } from '@stores/services/sale';
import { dataValidity } from '@utils/utils';
import { AddUser } from './popup/add-user';
import { ChooseAttend } from './popup/choose-attend';

export default {
	name: "oa-main-month-active-form",
	components: {
		'vc-imgs-picker': ImgsPicker,
		'oa-explain': Explain

	},
	mixins: [iview, services],
	props: {
		formCollection: {
			type: Array,
			default: () => {
				return [];
			}
		},
		retrainingList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		proxyList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		cooperateList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		positionList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		industryList: {
			type: Array,
			default: () => {
				return [];
			}
		},
		editDate: {
			type: Object,
			default: () => {
				return {};
			}
		},
		index: Number,
		customer_type: String,
		activity_id: Number,
		extra_apply: Number, // 可多申请人数
		apply_limit: Number, // 限制报名人数
		type: Number, // 合作类型
		activity_detail: Object, // 活动详情
	},
	data() {
		return {
			customer_id: '', // 公司id
			company_name: '', // type为3时请求的公司
			entrylist: [
				{ label: "还没录入OA的客户", value: 1 },
				{ label: "已经录入OA的客户", value: 2 }
			],
			customerInfo: {
				customer_id: undefined,
				company_name: '',
				customer_name: '',
				time_str: '',
				industry_name: '',
				tel: ''
			},
			formData: {
				renew_type: '', // 续费类型
				is_renew: '', // 是否续费
				source: '2', // 客户来源:
				is_lift_plate: '', // 是否起盘：:
				lift_plate_month: '', // 起盘月数:
				is_join_strategy: '', // 是否听过策略班:
				cooperate_date: '', // 合作时间
				cus_id: undefined, // 公司联想是使用的Id
				proxy_num: null,
				contract_company_id: undefined,
				customer_id: undefined,
				customer_company: '',
				activity_id: this.activity_id,
				customer_type: this.customer_type,
				retrain_number: undefined,
				cooperate_category: undefined,
				listen_finish: '',
				industry_id: undefined, // 是否听完
				boss_name: undefined,
				boss_tel: undefined,
				user_list: [ //  报名人
					{
						username: '',
						position: "",
						id_card: "",
						phone: ''
					}
				],
				voucher_list: [] // 打款凭证
			},
			rules: {
				is_renew: [{ required: true, type: 'number', message: "请选择是否续费客户", trigger: "change" }],
				renew_type: [{ required: true, type: 'number', message: "请选择续费类型", trigger: "change" }],

				cus_id: [{ required: true, type: 'number', message: "请选择客户", trigger: "change" }],
				source: [{ required: true, type: 'number', message: "请选择客户来源", trigger: "change" }],
				retrain_number: [{ required: true, type: 'number', message: "请选择复训次数", trigger: "change" }],
				cooperate_category: [{ required: true, type: 'number', message: "请选择合作类别", trigger: "change" }],
				proxy_num: [{ required: true, type: 'number', message: "请选择已招代理数", trigger: "change" }],
				voucher_list: [{ required: true, type: 'array', message: "请上传凭证", trigger: "change" }],
				user_list: {
					username: [
						{ required: true, message: "请输入报名人姓名", trigger: "blur" },
						{ type: 'validName', validator: dataValidity, message: "姓名格式有误", trigger: "blur" }
					],
					position: [
						{ required: true, message: "请输入职位", trigger: "change" }
						// { type: 'validName', validator: dataValidity, message: "职位格式有误", trigger: "blur" }
					],
					id_card: [
						{ required: true, message: '请输入身份证号码', trigger: 'blur' },
						{
							type: 'validLetterAndNumber',
							validator: dataValidity,
							message: "身份证号码格式有误",
							trigger: "blur"
						}
					],
					phone: [
						{ required: true, message: "请输入手机号码", trigger: "blur" },
						{ type: 'validMobile', message: '手机号格式不正确', validator: dataValidity, trigger: "blur" }
					]
				},
				industry_id: [{ required: true, type: 'number', message: "请选择公司行业", trigger: "change" }],
				is_join_strategy: [{ required: true, type: 'number', message: "请选择是否参加过策略班", trigger: "change" }],
				is_lift_plate: [{ required: true, type: 'number', message: "请选择是否起盘", trigger: "change" }],
				lift_plate_month: [
					{ required: true, message: "请输入起盘月数", trigger: "blur" },
					{ type: 'validNum', validator: dataValidity, message: "请输入数字", trigger: "blur" }
				],
				customer_company: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
				listen_finish: [{ required: true, type: 'number', message: "请选择是否听完", trigger: "change" }],
				boss_name: [
					{ required: true, message: "请输入客户名称", trigger: "blur" },
					{ type: 'validName', validator: dataValidity, message: "客户名称格式有误", trigger: "blur" }
				],
				boss_tel: [
					{ required: true, message: "请输入客户电话", trigger: "blur" },
					{ pattern: /^-|\d$/, message: "电话号码格式有误", trigger: "blur" }
				]
			},
			companyList: [],
			searchLoading: false
		};
	},
	computed: {
		'formData.activity_id': function () {
			return this.activity_id;
		}
	},
	created() {
		this.formCollection.push(this);
		if (this.editDate.customer_type) {
			Object.keys(this.formData).forEach(key => {
				this.formData[key] = this.editDate[key] || this.formData[key];
			});
			this.formData.proxy_num = this.formData.proxy_num == null ? 0 : this.formData.proxy_num;
			this.formData.lift_plate_month = this.formData.lift_plate_month.toString();
			this.formData.user_list = this.editDate.apply_users;
			this.formData.voucher_list = this.editDate.voucher.split(',');
			this.formData.cooperate_date = this.editDate.cooperate_date == "--" ? "0000-00-00" : this.editDate.cooperate_date;
			this.formData.cus_id = (this.type == 1 ? Number(this.editDate.contract_company_id) : Number(this.editDate.customer_id));
			this.formData.industry_id = this.formData.industry_id;
			this.searchCompany(this.editDate.customer_company).then(() => {
				if (this.formData.source == 1) {
					this.formData.customer_company = this.editDate.customer_company;
					this.formData.cus_id = '';
					this.formData.contract_company_id = '';
					this.formData.customer_id = '';
				} else {
					this.loadCustomerInfo(this.formData.cus_id);
				}
			});
		}
	},
	destroyed() {
		this.formCollection.splice(this.index, 1);
	},
	methods: {
		handleChangeSource() {
			this.formData.cus_id = "";
			this.formData.cooperate_date = "";
			this.contract_company_id = "";
			this.customer_id = "";
		},
		handleQueryChange(query = "") {
			let tarquery = this.$refs.select.values.length > 0 ? this.$refs.select.values[0].label : '';
			if (tarquery.length > query.length) {
				this.formData.cus_id = '';
			}
		},
		// 删除报名人
		handleDeluser(i) {
			this.formData.user_list.splice(i, 1);
		},
		// 添加报名人
		handleAdduser(i) {
			let v = parseInt(this.apply_limit, 10) + parseInt(this.extra_apply, 10);
			if (this.formData.user_list.length < this.apply_limit) {
				this.formData.user_list.push({
					username: '',
					position: "",
					id_card: "",
					phone: ""
				});
			} else if (this.formData.user_list.length < v) {
				if (this.type == 1 && this.activity_detail.has_voucher) {
					AddUser.popup({
					}).then((res) => {
						this.formData.user_list.push({
							username: '',
							position: "",
							id_card: "",
							phone: ""
						});
					}).catch((res) => {
					});
				} else {
					this.formData.user_list.push({
						username: '',
						position: "",
						id_card: "",
						phone: ""
					});
				}
			} else {
				this.$Message.error("报名人数已达上限");
			}
		},
		// 判断是否是已选客户
		handleIsSelf() {
			this.$request({
				url: API._SALE_MAIN_ACTIVITY_IS_SELF_GET,
				type: "GET",
				loading: false,
				param: {
					company_name: this.formData.customer_company,
					source: this.formData.source,
					customer_type: this.formData.customer_type,
				}
			}).then(res => {
				if (res.data.is_right == 0) {
					this.$Message.error(res.data.message);
				} else if (res.data.is_other == 1) {
					this.$Message.warning(res.data.message);
				}
			});
		},
		loadIndustry() {
			this.$request({
				url: API._SALE_MAIN_ACTIVEITY_APPLY_INDUSTRY_GET,
				type: "GET",
				loading: false,
				param: {

				}
			}).then(res => {
				if (res.data.is_self == 0) {
					this.$Message.error(res.data.message);
				}
			});
		},
		// 判断是否已参加报名
		getIsApply() {
			this.$request({
				url: API._SALE_MAIN_ACTIVITY_IS_APPLY_GET,
				type: "GET",
				loading: false,
				param: {
					contract_company_id: this.formData.contract_company_id,
					customer_id: this.formData.customer_id,
					activity_id: this.activity_id,
				}
			}).then(res => {
				// this.$Message.error("报名人数已达上线");
				// res.status == 0 && this.$Message.error(res.msg);
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		// 公司详情
		loadCustomerInfo(Id) {
			if (this.type == 1) {
				this.formData.contract_company_id = Id;
				this.companyList.forEach(ele => {
					if (ele.contract_company_id == Id) {
						this.formData.customer_id = ele.customer_id;
					}
				});
			} else {
				this.formData.customer_id = Id;
				this.companyList.forEach(ele => {
					if (ele.customer_id == Id) {
						this.formData.contract_company_id = ele.contract_company_id;
						this.formData.customer_company = ele.company_name;
					}
				});
			}

			Id && this.type == 3 && this.handleIsSelf();
			this.type != 3 && this.$request({
				url: '_SALE_MAIN_CUSTOMER_TYPE_GET',
				type: "GET",
				loading: false,
				param: {
					relation_id: this.formData.cus_id,
					customer_type: this.type,
				}
			}).then(res => {
				this.customerInfo = res.data;
				this.formData.customer_company = res.data.company_name;
				this.formData.cooperate_date = res.data.time_str;
				this.formData.boss_name = res.data.customer_name;
				this.formData.boss_tel = res.data.tel;
				this.formData.industry_id = res.data.industry_id;
				this.handleIsSelf();
				// this.getIsApply();
			});
			let customerId;
			if (this.type == 1) {
				const sel = this.companyList.find(com => com.contract_company_id == Id);
				if (sel) {
					customerId = sel.customer_id;
				}
			} else {
				customerId = Id;
			}
			customerId && this.$request({
				url: "_SALE_MAIN_ACTIVITY_APPLY_USERS_GET",
				type: "GET",
				param: {
					customer_id: customerId
				},
				loading: false,
			}).then(res => {
				const max = parseInt(this.apply_limit, 10) + parseInt(this.extra_apply, 10) 
						- this.formData.user_list.filter(u => u.username || u.position || u.id_card).length;
				if (res.data.length > 0 && max > 0) {
					ChooseAttend.popup({
						data: res.data,
						max
					}).then(selects => {
						if (selects.length) {
							this.formData.user_list = this.formData.user_list.filter(u => u.username || u.position || u.id_card);
						}
						selects.forEach(user => {
							if (!this.formData.user_list.find(u => u.id_card == user.id_card)) {
								this.formData.user_list.push({
									username: user.username,
									position: user.position,
									id_card: user.id_card
								});
							}
						});
					}).catch(e => e && console.error(e));
				}
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		// 公司名称模糊查询
		searchCompany(query) {
			if (!query) return;
			this.searchLoading = true;
			return this.$request({
				url: API._SALE_MAIN_VALID_COMPANIES_GET,
				type: "GET",
				loading: false,
				param: {
					keyword: query, customer_type: this.type,
				}
			}).then(res => {
				this.searchLoading = false;
				this.companyList = res.data;
			}).catch(error => {
				this.searchLoading = false;
				console.error(error);
			});

		},
		handleError(err) {
			this.$Message.error(err.msg);
		}
	}
};
</script>

<style scoped lang="scss">
	/deep/ .vcp-imgs-picker .__normal .__img {
		border: none;
	}
	._title::before {
		content: "";
		display: inline-block;
		width: 2px;
		height: 14px;
		background: #e74854;
		margin-right: 15px;
		position: relative;
		bottom: -2px;
	}
    ._head {
        ._title {
            font-size: 14px;
            color: #4b4f57;
        }
        color: #333;
        // border-left: 3px solid #d9444f;
        font-size: 16px;
        span {
            display: inline-block;
            vertical-align: middle;
            color: #2397f9;
        }
        ._user-list {
            margin-bottom: 10 !important;
        }
    }
    ._body {
        margin-top: 10px;
        margin-bottom: 10px;
        background: #fafafa;
        padding: 15px;
        & > div div {
            font-size: 12px;
            width: 350px;
            height: 40px;
            line-height: 40px;
            color: #818794;
            border-bottom: 1px solid #Ebeef1;
            margin-right: 40px;
            & > span {
                margin-left: 40px;
                color: #333;
            }
		}
	}
</style>
