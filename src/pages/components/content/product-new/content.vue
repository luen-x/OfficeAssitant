<template>
	<div class="v-product-new-form g-flex g-jc-c" style="height: inherit; overflow: auto">
		<i-form
			ref="form"
			:model="formValidate"
			:rules="ruleValidate"
			:label-width="120"
			position="left"
		>
			<div class="_title g-c-red-mid">产品信息</div>
			<div class="g-flex">
				<div>
					<i-form-item label="产品名称：" prop="product_name" style="width:422px">
						<i-input
							:maxlength="20"
							v-model="formValidate.product_name"
							placeholder="请输入产品名称"
						/>
					</i-form-item>
					<i-form-item label="产品介绍：" prop="product_describe">
						<oa-limit-words
							:placeholder="placeholder"
							v-model="formValidate.product_describe"
							:max="200"
							style="width: 300px"
						/>
					</i-form-item>
					<i-form-item label="审核板块：" prop="audit_type">
						<i-select v-model="formValidate.audit_type" clearable placeholder="请选择制作板块">
							<i-option
								v-for="(item) in audit_type_all"
								:key="item.audit_type "
								:value="item.audit_type "
							>{{ item.audit_type_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="产品分类：" prop="category_id">
						<i-select
							v-model="formValidate.category_id"
							clearable
							placeholder="请选择产品分类"
						>
							<i-option
								v-for="(item) in category"
								:key="item.category_id"
								:value="item.category_id "
							>{{ item.category_name }}</i-option>
						</i-select>
					</i-form-item>
					<i-form-item label="支持单卖：" prop="is_single_sale">
						<i-radio-group v-model="formValidate.is_single_sale">
							<i-radio :label="1" class="_radio">是</i-radio>
							<i-radio :label="0" class="_radio">否</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="成本分期：" prop="is_cost_instalment">
						<i-radio-group v-model="formValidate.is_cost_instalment">
							<i-radio :label="1" class="_radio">是</i-radio>
							<i-radio :label="0" class="_radio">否</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="附件上传：">
						<vc-files-picker
							ref="filesPicker"
							v-model="imglist"
							:upload="{multiple: true, max: 10, size: 20}"
							:max="10"
							@error="handleError"
						>
							<template slot-scope="slotProps">
								<div
									v-for="(item, index) in slotProps.files"
									:key="index"
									:style="{marginTop: index == 0 ? '13px' : '17px'}"
								>
									<div
										:style="{color:item.error_time?'red':''}"
										style="line-height: 12px;"
									>
										<i class="iconfont icon-accessory"/>
										<span>{{ item.title }}</span>
										<span
											class="g-fr g-operation"
											@click="handleDel(item,index)"
										>删除</span>
									</div>
									<i-progress :percent="parseInt(item.percent)"/>
								</div>
							</template>
							<i-button slot="trigger" class="_upload" >
								<i class="iconfont icon-upload"/>上传
							</i-button>

						</vc-files-picker>
						<div>支持扩展：rar,zip,doc,jpg,ppt,excel,等</div>
					</i-form-item>
				</div>
				<div>
					<i-form-item label="成本归属：" prop="own_depart_id">
						<i-cascader
							v-model="formValidate.own_depart_id"
							:data="departAll"
							:change-on-select="true"
							style="width:300px"
							placeholder="请选择成本归属部门"
							trigger="click"
							clearable
							transfer
						/>
					</i-form-item>
					<i-form-item v-if="!loading" label="制作部门：" prop="make_depart_id">
						<oa-tree-select
							v-model="formValidate.make_depart_id"
							:data-source="departAll"
							:width="300"
							:max-width="300"
							placeholder="请选择制作部门"
							filterable
						/>
						<!-- <i-cascader
							v-model="formValidate.make_depart_id"
							:width="300"
							:data="departAll"
							style="width:300px"
							placeholder="请选择制作部门"
							change-on-select/>
						<div>{{ formValidate.make_depart_id }}</div> -->
					</i-form-item>
					<i-form-item
						label="协助部门："
						style="margin-bottom: 9px !important;"
						prop="assist_depart_id"
					>
						<oa-tree-select
							v-model="formValidate.assist_depart_id"
							:data-source="departAll"
							:width="300"
							:max-width="300"
							placeholder="请选择协助部门"
							filterable
						/>
					</i-form-item>
					<i-form-item label="服务提成：" prop="has_service_amount">
						<i-radio-group v-model="formValidate.has_service_amount">
							<i-radio :label="1" class="_radio">有</i-radio>
							<i-radio :label="0" class="_radio">无</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="成本分单：" prop="is_cost_share">
						<i-radio-group v-model="formValidate.is_cost_share">
							<i-radio :label="1" class="_radio">是</i-radio>
							<i-radio :label="0" class="_radio">否</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="支持赠送：" prop="is_gift">
						<i-radio-group v-model="formValidate.is_gift">
							<i-radio :label="1" class="_radio">是</i-radio>
							<i-radio :label="0" class="_radio">否</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="主负责人：" prop="has_main_person">
						<i-radio-group v-model="formValidate.has_main_person">
							<i-radio :label="1" class="_radio">需要</i-radio>
							<i-radio :label="0" class="_radio">不需要</i-radio>
						</i-radio-group>
					</i-form-item>
					<i-form-item label="产品分工：" >
						<div class="g-flex-ac">
							<i-radio-group v-model="formValidate.has_category" @on-change="handleAddClass">
								<i-radio :label="1" class="_radio">开</i-radio>
								<i-radio :label="0" class="_radio">关</i-radio>
							</i-radio-group>
							<span
								v-if="formValidate.has_category == 1"
								class="g-pointer"
								style="color: #2397F9;"
								@click="handleCategory"
							>
								{{ has_divide_depart == 0 ? "添加分工部门" : "取消分工部门" }}
							</span>
						</div>
					</i-form-item>
					<i-form-item v-if="formValidate.has_category==1">
						<template slot="label">
							<span class="_cost-type">添加分工：</span>
						</template>
						<div v-for="(item,i) in formValidate.subclass" :key="i" class="g-flex">
							<i-form-item
								:prop="'subclass.'+i+'.subclass_name'"
								:rules="{required: true, message: '请输入子类名称', trigger: 'blur'}"
								style="margin-bottom: 20px !important"
							>
								<i-input
									v-model="item.subclass_name"
									:maxlength="20"
									:style="has_divide_depart == 1 ? {width: '160px'} : {width: '300px'}"
									class="g-m-r-10"
									style="vertical-align: middle;width: 160px;"
									placeholder="请输入子类名称"
								/>
							</i-form-item>
							<i-form-item
								v-if="has_divide_depart == 1 && item.depart_ids"
								:prop="'subclass.'+i+'.depart_ids'"
								:rules="{required: true, type:'array', message: '请选择分工部门', trigger: 'change'}"
								style="margin-bottom: 20px !important"
							>
								<oa-tree-select
									v-model="item.depart_ids"
									:data-source="departAll"
									:width="160"
									class="g-m-r-10"
									placeholder="请选择分工部门"
									filterable
								/>
							</i-form-item>
							<i
								v-if="formValidate.subclass.length !== 1"
								class="icon-remove-circle iconfont g-c-red-light"
								style="display: inline-block;vertical-align: middle;"
								@click="()=>{formValidate.subclass.splice(i, 1)}"
							/>
							<i
								v-if="formValidate.subclass.length - 1 === i"
								class="icon-add1 iconfont g-c-blue-light"
								style="display: inline-block;vertical-align: middle;"
								@click="()=>{formValidate.subclass.push({subclass_name:'',depart_ids: []})}"
							/>
						</div>
					</i-form-item>
				</div>
			</div>
			<div class="_title g-c-red-mid">价格成本</div>
			<!-- 多规格产品 -->
			<oa-double-specs v-if="!loading" ref="doubleSpecs" :pro_sku="pro_sku" :all_specs="all_specs"/>
			<div v-if="formValidate.has_sku==0&&0">
				<i-form-item label="续费功能" class="_label" style="padding-right: 22px;"/>
			</div>
			<div v-if="formValidate.has_sku==0&&0">
				<i-form-item prop="customer_name">
					<template slot="label">
						<span class="_cost-type">续费功能：</span>
					</template>
					<i-radio-group v-model="formValidate.renew_status" class="g-flex">
						<i-radio :label="1" class="g-co1 _radio">开</i-radio>
						<i-radio :label="0" class="g-co1 _radio">关</i-radio>
					</i-radio-group>
				</i-form-item>
			</div>
			<div v-if="formValidate.renew_status==1&&0" class="g-flex">
				<div>
					<i-form-item label="续费成本：" style="width:422px" prop="customer_name">
						<i-radio-group v-model="formValidate.renew.cost_type">
							<i-radio :label="1" class="_radio">标准价成本</i-radio>
							<i-radio :label="2" class="_radio">成交金额成本</i-radio>
							<i-radio :label="3" class="_radio">固定成本</i-radio>
						</i-radio-group>
						<i-form-item :rules="ruleValidate.cost" prop="renew.cost">
							<span
								v-if="formValidate.renew.cost_type==3&&formValidate.first_purchase.price_unit!==''"
								class="_number-append"
							>
								{{
									formValidate.first_purchase.price_unit?price_unit_all[formValidate.first_purchase.price_unit-1].price_unit_name:''
								}}
							</span>
							<span v-else class="_number-append">%</span>
							<i-input-number
								v-model="formValidate.renew.cost"
								:max="formValidate.renew.cost_type == 3 ? 99999999 : 100"
								:min="0"
								:precision="2"
								:active-change="false"
								class="_input"
								placeholder="请输入续费成本"
							/>
						</i-form-item>
					</i-form-item>
				</div>
				<div>
					<i-form-item
						:rules="ruleValidate.price"
						label="续费价格："
						style="width:422px"
						prop="renew.price"
					>
						<div class="g-flex">
							<i-input-number
								v-model="formValidate.renew.price"
								:min="0"
								:precision="2"
								:active-change="false"
								placeholder="请输入续费价格"
							/>
							<span
								v-if="formValidate.first_purchase.price_unit!==''"
								style="width:50px"
								class="g-m-l-10"
							>
								{{
									formValidate.first_purchase.price_unit?price_unit_all[formValidate.first_purchase.price_unit-1].price_unit_name:''
								}}
							</span>
						</div>
					</i-form-item>
				</div>
			</div>
			<div class="_title g-c-red-mid">制作信息</div>
			<div class="g-flex">
				<div>
					<i-form-item
						:rules="ruleValidate.request_id"
						label="项目需求："
						style="width:422px"
						prop="request_id"
					>
						<i-select
							v-model="formValidate.request_id"
							clearable
							placeholder="项目需求名称"
							@on-change="handleGetProcess(arguments[0], 'requestList')"
						>
							<i-option
								v-for="(item) in pro_request"
								:key="item.process_id"
								:value="item.process_id"
							>{{ item.process_name }}</i-option>
						</i-select>
						<div>
							<span
								v-for="(item,index) in requestList"
								:key="index"
							>{{ index - 0 + 1 }}.{{ item.component_label }}</span>
							<span
								v-show="requestList.length>0"
								class="g-fr g-operation"
								@click="handlePreview(formValidate.request_id,1)"
							>查看详情</span>
						</div>
					</i-form-item>
				</div>
				<div>
					<i-form-item
						:rules="ruleValidate.customer_info_id"
						label="客户需求："
						style="width:422px"
						prop="customer_info_id"
					>
						<i-select
							v-model="formValidate.customer_info_id"
							clearable
							placeholder="客户信息名称"
							@on-change="handleGetProcess(arguments[0], 'customerList')"
						>
							<i-option
								v-for="(item) in customer_info"
								:key="item.process_id"
								:value="item.process_id"
							>{{ item.process_name }}</i-option>
						</i-select>
						<div>
							<span
								v-for="(item,index) in customerList"
								:key="index"
							>{{ index - 0 + 1 }}.{{ item.component_label }}</span>
							<span
								v-show="customerList.length>0"
								class="g-fr g-operation"
								@click="handlePreview(formValidate.customer_info_id,2)"
							>查看详情</span>
						</div>
					</i-form-item>
				</div>
			</div>
			<div class="g-m-b-40" style="padding-bottom:30px">
				<i-form-item
					:rules="ruleValidate.process_id"
					label="流程分类："
					style="width:422px"
					prop="process_id"
				>
					<i-select
						v-model="formValidate.process_id"
						clearable
						placeholder="流程名称"
						@on-change="handleGetProcess(arguments[0], 'processList')"
					>
						<i-option
							v-for="item in process"
							:key="item.process_id"
							:value="item.process_id"
						>{{ item.process_name }}</i-option>
					</i-select>
					<div>
						<span
							v-for="(item,index) in processList"
							:key="index"
						>{{ index - 0 + 1 }}.{{ item.step_name }}</span>
						<span
							v-show="processList.length>0"
							class="g-fr g-operation"
							@click="handlePreview(formValidate.process_id,3)"
						>查看详情</span>
					</div>
				</i-form-item>
			</div>
		</i-form>
		<!-- footer -->
		<footer class="g-flex-cc">
			<div class="g-gray-btn-small g-m-r-10" @click="handleCancel">取消</div>
			<vc-debounce-click class="g-red-btn-small" @click="handleSubmit">提交</vc-debounce-click>
		</footer>
	</div>
</template>

<script>
import {
	Form, FormItem, Input, InputNumber,
	Select, Option, DatePicker, Cascader, Message, RadioGroup, Radio, Progress, Button
} from 'iview';
// utils
import { dataValidity } from '@utils/utils';
import { ImgsPicker, FilesPicker } from 'wya-vc';
import API from "@stores/apis/root";
import { services } from '@stores/services/sale';
import { setTimeout } from 'timers';
import { Confirm } from "@components/_common/confirm/confirm";
import upload from '../_common/upload';
import treeSelect from "../../_common/tree-select/tree-select";
import { PreviewForm } from './popup/preview-form';
import { SaveConfirm } from './popup/save-confirm';
import doubleSpecs from './popup/double-specs';
import { AddStuffs } from './popup/add-stuffs';

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
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'vc-imgs-picker': ImgsPicker,
		'vc-files-picker': FilesPicker,
		'oa-tree-select': treeSelect,
		'i-progress': Progress,
		'oa-upload': upload,
		'i-button': Button,
		'oa-double-specs': doubleSpecs,

	},
	mixins: [services.departAll()],
	data() {
		let validateArraydDpart = (rule, value, callback) => {
			if (value.length > 15) {
				callback(new Error('必填'));
			} else {
				callback();
			}
		};
		return {
			type: 3,
			loading: false,
			has_divide_depart: '0', // 添加分工部门 / 取消分工部门
			components: {}, // 多规格数据
			placeholder: '请输入产品介绍',
			childClass: [{ subclass_name: '', depart_ids: [] }], // 添加子类
			requestList: [], //
			customerList: [],
			processList: [],
			imglist: [], // 上传附件
			formValidate: {
				has_service_amount: 0,
				is_gift: 1,
				has_main_person: 1,
				is_cost_share: 1, // 是否成本分单：0-不分，1-分
				is_single_sale: 1, // 是否单卖：0-不支持。1-支持
				is_cost_instalment: 0, // 是否成本分期：0-不分，1-分
				has_sku: 0, // 0-单规格，1-多规格
				attachment: [],
				product_id: "",
				product_name: "", // 产品名称
				product_describe: "", // 介绍
				product_type: "", // 0-非组合产品，1-组合产品
				category_id: '', // 分类
				audit_type: '', // 审核板块：1-立客户中心，2-商学院
				make_depart_id: [], // 制作部门
				assist_depart_id: [], // 协助部门
				own_depart_id: [], // 成本归属部门
				service_amount: null, // 服务提成
				has_category: 0, // 子类开关：1-开，0-关
				subclass: [{ subclass_name: '', depart_ids: [] }],
				renew_status: 0, // 续费开关：1-开，0-关
				request_id: "", // 项目需求id
				customer_info_id: "", // 客户信息id
				process_id: "", // 流程id
				product_sku: []
			},
			product_sku: [],
			pro_sku: [], // 编辑时用
			all_specs: [], // 编辑时用
			subclass: ["1"], // 产品子类
			audit_type_all: [], // 审核板块
			category: [], // 产品分类
			process: [], // 所有流程
			pro_request: [], // 所有请求
			customer_info: [], // 所有客户信息
			price_unit_all: [], // 所有单位
			cost_type_all: [], // 所有成本
			ruleValidate: {
				product_name: [
					{ required: true, message: '请输入产品名称', trigger: 'change' }
				],
				product_describe: [
					{ required: false, message: '请输入产品介绍', trigger: 'change' }
				],
				imglist: [
					{ required: true, type: 'array', message: '请上传文件', trigger: 'change' }
				],
				price: [
					{ required: true, type: 'number', message: '请输入价格', trigger: 'change' }
				],
				price_quantity: [
					{ required: true, message: '请输入价格', trigger: 'change' }
				],
				price_unit: [
					{ required: true, message: '请输入单位', trigger: 'change' }
				],
				audit_type: [
					{ required: true, type: 'number', message: '请选择制作板块', trigger: 'change' }
				],
				category_id: [
					{ required: true, type: 'number', message: '请选择产品分类', trigger: 'change' }
				],
				has_service_amount: [
					{ required: true, type: 'number', message: '请选择有无服务提成', trigger: 'change' }
				],
				own_depart_id: [
					{ required: true, type: 'array', message: '请选择成本归属部门', trigger: 'change' }
				],
				make_depart_id: [
					{ required: true, type: 'array', message: '请选择制作归属部门', trigger: 'change' }
				],
				assist_depart_id: [
					{ validator: validateArraydDpart, message: '协助部门不得超过15个', trigger: 'change' }
				],
				request_id: [
					{ required: true, type: 'number', message: '请选择项目需求', trigger: 'change' }
				],
				customer_info_id: [
					{ required: true, type: 'number', message: '请选择客户需求', trigger: 'change' }
				],
				process_id: [
					{ required: true, type: 'number', message: '请选择流程需求', trigger: 'change' }
				],
				service_amount: [
					{ required: true, type: 'number', message: '请输入服务提成', trigger: 'change' }
				],
				subclass_name: [
					{ required: true, message: '请添加子类', trigger: 'change' }
				],
				cost: [
					{ required: true, type: 'number', message: '请输入成本', trigger: 'change' }
				],
				is_cost_instalment: [
					{ required: true, type: 'number', message: '请选择是否成本分期', trigger: 'change' }
				],
				is_single_sale: [
					{ required: true, type: 'number', message: '请选择是否支持单卖', trigger: 'change' }
				],
				is_gift: [
					{ required: true, type: 'number', message: '请选择是否支持赠送', trigger: 'change' }
				],
				has_main_person: [
					{ required: true, type: 'number', message: '请选择是否需要主负责人', trigger: 'change' }
				],
				is_cost_share: [
					{ required: true, type: 'number', message: '请选择是否成本分单', trigger: 'change' }
				],
			},
			valuefiles: [],
		};
	},
	computed: {
	},
	watch: {
		// 成本类型为固定成本才能输入小数
	},
	created() {
		let { product_id } = this.$route.query || {};
		product_id ? this.loadProInfo(product_id) : this.loadBaseInfo();
	},
	mounted() {
		this.handleTitleActive();
	},
	beforeDestroy() {
		this.handleTitleUnactive();
	},
	methods: {
		handleAddClass(v) {
			if (!v) return;
			this.formValidate.subclass = [{ subclass_name: '', depart_ids: [] }];
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleTitleActive() {
			this.$nextTick(() => {
				const FirstTitle = document.getElementsByClassName('__menu-item')[0];
				FirstTitle.classList.remove('__menu-item-unactive');
				FirstTitle.classList.add('__menu-item-active');
			});
		},
		handleTitleUnactive() {
			const FirstTitle = document.getElementsByClassName('__menu-item')[0];
			FirstTitle.classList.remove('__menu-item-active');
			FirstTitle.classList.add('__menu-item-unactive');
		},
		handlePreview(val, i) {
			PreviewForm.popup({ data: { process: val, type: i } });
		},
		loadProInfo(product_id) {
			this.loading = true;
			this.$request({
				url: API._CONTENT_PRODUCT_EDIT_GET,
				type: "GET",
				param: {
					product_id
				}
			}).then(res => {
				this.loading = false;
				this.pro_sku = res.data.product.product_sku;
				// this.formValidate = res.data.product;
				this.category = res.data.category;
				this.audit_type_all = res.data.audit_type_all;
				this.cost_type_all = res.data.cost_type_all;
				this.price_unit_all = res.data.price_unit_all;
				this.customer_info = res.data.customer_info;
				this.pro_request = res.data.request;
				this.process = res.data.process;
				res.data.product.service_amount = parseFloat(res.data.product.service_amount);
				Object.keys(this.formValidate).forEach(key => {
					this.formValidate[key] = res.data.product[key];
				});
				this.handleGetProcess(this.formValidate.customer_info_id, 'customerList');
				this.handleGetProcess(this.formValidate.process_id, 'processList');
				this.handleGetProcess(this.formValidate.request_id, 'requestList');
				this.childClass = [];
				this.has_divide_depart = res.data.product.has_divide_depart;
				this.all_specs = res.data.all_specs;
				if (res.data.product.has_category == 1 && res.data.product.subclass && res.data.product.subclass.length > 0) {
					res.data.product.subclass.forEach((el, index) => {
						if (this.has_divide_depart === '1') {
							this.childClass.push({ subclass_name: el.product_sub, depart_ids: el.depart_ids });
						} else {
							this.childClass.push({ subclass_name: el.product_sub, depart_ids: [] });
						}
					});
				} else {
					this.childClass = [{ subclass_name: '', depart_ids: [] }];
				}
				res.data.product.attachment.forEach(ele => {
					this.imglist.push({
						percent: "100.00",
						title: ele && ele.attachment_name,
						url: ele && ele.attachment_url });
				});
			}).catch(error => {
				console.error(error);
			});
		},
		loadBaseInfo(val) {
			this.$request({
				url: API._CONTENT_PRODUCT_NEW_GET,
				type: "GET",
				param: {
					id: val
				}
			}).then(res => {
				// this.formValidate = res.data.product;
				this.category = res.data.category;
				this.audit_type_all = res.data.audit_type_all;
				this.cost_type_all = res.data.cost_type_all;
				this.price_unit_all = res.data.price_unit_all;
				this.customer_info = res.data.customer_info;
				this.pro_request = res.data.request;
				this.process = res.data.process;
			}).catch(error => {
				console.error(error);
			});
		},
		handleGetProcess(process_id, list) {
			if (!process_id) {
				this[list] = [];
				return;
			}
			this.$request({
				url: API._CONTENT_PRODUCT_PROCESS_DETAIL_GET,
				type: "GET",
				param: {
					process_id
				}
			}).then(res => {
				this[list] = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		// 附件删除
		handleDel(item, index) {
			this.$refs.filesPicker && this.$refs.filesPicker.handleDel(item, index);
		},
		handleSubmit(name) {
			let sku = [];
			this.$refs.doubleSpecs.$refs.form.forEach(ele => {
				ele.$refs.formData.validateAndScroll((valid) => {
					if (valid) {
						sku.push(ele.formData);
					} else {
						sku = false;
					}
				});
			});
			this.formValidate.attachment = [];
			this.imglist.forEach(element => {
				this.formValidate.attachment.push({ attachment_url: element.url, attachment_name: element.title });
			});
			this.$refs.form.validateAndScroll((isValid) => {
				if (isValid && sku) {
					if (this.$route.query.product_id) {
						Confirm.popup({
							title: '确定保存',
							msg: '产品信息更改后不会对已经下单的产品产生影响,后续新下单的产品将使用本次设置的内容，请知悉'
						 }).then(data => {
							this.handleSave();
						}).catch(data => { });
					} else {
						this.handleSave();
					}
				} else {
					Message.error('信息请填写完整！');
				}
			});
			this.product_sku = sku;

		},
		handleSave(val) {
			setTimeout(() => {
				this.formValidate.product_sku = this.product_sku;
				this.formValidate.has_sku = this.$refs.doubleSpecs.specs.length ? 1 : 0;// 多规格
				this.formValidate.product_sku.length && this.$request({
					url: API._CONTENT_PRODUCT_SAVE_GET,
					type: "post",
					loading: false,
					param: {
						...this.formValidate,
						has_divide_depart: this.has_divide_depart
					},
					autoTip: true
				}).then(res => {
					this.$router.go(-1);
				}).catch(error => {
					console.error(error);
				});
			}, 100);
		},
		handleClear() {
			this.$router.push({ name: 'content-product-list' });
		},
		handleDelfiles(v) {
			this.valuefiles.splice(v, 1);
		},
		handleCancel() {
			Confirm.popup({
				title: '确认取消',
				msg: '取消后系统将不会保存此次编辑的内容，确认取消？'
			 }).then(data => {
				this.$router.back();
			}).catch(data => { });
		},
		parseInt(i) {
			return parseInt(i, 10);
		},
		parseFloat(val) {
			return parseFloat(this.formValidate.service_amount - 0).toFixed(2);
		},
		handleCategory() {
			this.has_divide_depart = (this.has_divide_depart == '1' ? '0' : '1');
		}
	},
};
</script>

<style lang="scss" scoped>
    .v-product-new-form {
        padding-bottom: 60px;
        /deep/ .vc-tree-select .__placeholder {
            color: #515a6e;
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
        /deep/ .ivu-progress-show-info .ivu-progress-outer {
            padding-right: 26px !important;
        }
        /deep/ .ivu-progress-text {
            float: right !important;
        }
        ._title {
            margin-bottom: 20px;
            font-size: 16px;
        }
        ._cost-type::before {
            content: "*";
            display: inline-block;
            line-height: 1;
            font-family: SimSun;
            font-size: 12px;
            color: #ed4014;
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
        .vcp-files-picker {
            box-sizing: border-box;
            margin: -8px 0 0px 0 !important;
            display: flex;
            flex-direction: column-reverse;
			.c-upload{
				width: 90px !important;
			}
        }
        ._upload {
            margin-top: 10px;
            width: 80px;
            text-align: center;
            height: 32px;
            background: #fafafa;
            border: 1px solid #d4d7d8 !important;
            color: #999 !important;
            border-radius: 4px;
        }
        ._upload:hover {
            border: 1px solid #e74854 !important;
            color: #e74854 !important;
        }
        ._input {
            display: inline-block;
            width: 300px !important;
        }
        ._radio {
            margin-right: 16px;
        }
        ._button {
            width: calc(100% - 180px);
            position: fixed;
            left: 180px;
            bottom: 0;
            z-index: 8;
            border-top: 1px solid #e8e8e8;
            padding: 10px 0;
            background: #fff;
            text-align: center;
            box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
        }
        ._label {
            /deep/ .ivu-form-item-label {
                color: #333333 !important;
                padding-right: 23px;
                font-weight: 600;
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
</style>
