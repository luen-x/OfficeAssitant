<template>
	<div class="v-sale-customer-base-info g-relative" style="min-height:110px">
		<template v-if="showContacts">
			<div class="_title">
				<oa-title class="g-m-r-5">联系人</oa-title>
				<!-- <span class="__title-bar g-bg-red-mid"/>
				<span class="g-fs-14 g-m-lr-5">联系人</span> -->
				<span
					v-if="!readOnly"
					class="g-operation g-m-lr-5 g-fs-14"
					@click="handleAddRao"
				>
					添加
				</span>
				<span
					v-if="baseInfo.business_type==1 && baseInfo.company_name && baseInfo.company_name.length>=6 && updateInfo.can_update"
					class="g-fr"
				>
					<span v-if="updateInfo.update_time" class="g-m-r-10">上一次更新时间：{{ updateInfo.update_time }}</span>
					<span
						v-if="showUpdate"
						class="g-m-r-5 g-red-btn-line"
						@click="handleUpdateCustonmer"
					>
						<span>
							<i-tooltip 
								v-if="coinTip && !baseInfo.is_update"
								:content="coinTip"
								placement="top"
								max-width="220"
								transfer>
								<img :src="OSS_PROP_ICON2" style="height:18px;width:18px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
							</i-tooltip>
							<span>
								更新资料
							</span>
						</span>
					</span>
				</span>
			</div>
			<div class="g-m-b-20 g-m-t-20">
				<i-table
					:columns="connectorColumns"
					:data="connectorList"
					stripe
				/>
			</div>
		</template>

		<div class="_title g-flex" style="height:30px">
			<oa-title class="g-m-r-5">基本信息</oa-title>
			<!-- <span><span class="g-detail-title g-m-r-5">基本信息</span></span> -->
			<!-- <span class="__title-bar g-bg-red-mid"/>
			<span class="g-fs-14 g-m-lr-5">基本信息</span> -->
			<div
				v-if="canEdit"
				style="margin-top:2px;"
			>
				<span v-if="isEdit" class="g-operation g-m-lr-5 g-fs-14" @click="handleSave">保存</span>
				<span v-if="isEdit" class="g-operation g-m-lr-5 g-fs-14" @click="handleCancelEdit">取消</span>
				<span v-else class="g-operation g-m-lr-5 g-fs-14" @click="isEdit=true">编辑</span>
			</div>
			<span
				v-if="!showContacts && baseInfo.business_type==1 && baseInfo.company_name && baseInfo.company_name.length>=6 && updateInfo.can_update"
				class="g-col g-tr"

			>
				<span v-if="updateInfo.update_time" class="g-m-r-10">上一次更新时间：{{ updateInfo.update_time }}</span>
				<span
					v-if="showUpdate"
					class="g-m-r-5 g-red-btn-line"
					@click="handleUpdateCustonmer"
				>
					<span>
						<i-tooltip 
							v-if="coinTip && !baseInfo.is_update" 
							:content="coinTip"
							placement="top"
							max-width="220"
							transfer>
							<img :src="OSS_PROP_ICON2" style="height:18px;width:18px;position: relative;top: 4px;" class="g-m-r-5 g-pointer">
						</i-tooltip>
						<span>
							更新资料
						</span>
					</span>
				</span>
			</span>
		</div>
		<template v-if="!isEdit">
			<oa-info-block :show-title="false">
				<template v-if="baseInfo.business_type==2">
					<oa-info-item :content="baseInfo.customer_name" tooltip label="客户姓名"/>
					<oa-info-item :content="baseInfo.tel" tooltip label="联系电话">
						<span
							v-if="showCall && $global.staff.seat_number"
							class="_value g-operation"
							@click.stop="handleCalOut(baseInfo.tel)">
							{{ baseInfo.tel }}
							<i class="icon iconfont icon-call2 g-m-l-5" />
						</span>
					</oa-info-item>

					<oa-info-item :content="baseInfo.location" label="地区"/>
					<oa-info-item :content="baseInfo.address" tooltip label="详细地址"/>
				</template>
				<template v-else>
					<oa-info-item :content="baseInfo.company_name" tooltip label="公司名称"/>
					<oa-info-item :content="baseInfo.customer_name" tooltip label="客户姓名"/>
					<oa-info-item :content="baseInfo.tel" tooltip label="客户电话">
						<span
							v-if="showCall && $global.staff.seat_number"
							class="_value g-operation"
							@click.stop="handleCalOut(baseInfo.tel)">
							{{ baseInfo.tel }}
							<i class="icon iconfont icon-call2 g-m-l-5" />
						</span>
					</oa-info-item> 
					<oa-info-item :content="baseInfo.url" label="官网">
						<oa-auto-tooltip v-if="baseInfo.url" :content="baseInfo.url" :max-width="220" @click-label="handleLink(companyUrl)" />
						<span v-else>--</span>
					</oa-info-item>
		
					<oa-info-item :content="baseInfo.location" label="地区"/>
					<oa-info-item :content="baseInfo.address" tooltip label="详细地址"/>
						
					<oa-info-item :content="baseInfo.capital" label="注册资本"/>
					<oa-info-item :content="baseInfo.industry" label="所属行业"/>
					<oa-info-item :content="baseInfo.scale" label="人员规模"/>
					<oa-info-item :content="baseInfo.manage_range" tooltip label="经营范围"/>
					<oa-info-item :content="baseInfo.intellectual_property_right" label="知识产权"/>
					<oa-info-item :content="baseInfo.remarks" tooltip label="备注"/>
					
					<vc-expand ref="expand" v-model="expandDetail" style="width:100%" class="g-flex g-fw-w">
						<oa-info-item :content="baseInfo.email" tooltip label="邮箱"/>
						<oa-info-item :content="baseInfo.manage_state" label="经营状态"/>
						<oa-info-item :content="baseInfo.paid_in_capital" label="实缴资本"/>
						<oa-info-item :content="baseInfo.approval_date" label="核准日期"/>
						<oa-info-item :content="baseInfo.establishment_date" label="成立日期"/>
						<oa-info-item :content="baseInfo.taxpayer_number" label="纳税人识别号"/>
						<oa-info-item :content="baseInfo.credit_code" label="社会信用代码"/>
						<oa-info-item :content="baseInfo.organization_code" label="组织机构代码"/>
						<oa-info-item :content="baseInfo.registration_number" label="注册号"/>
						<oa-info-item :content="baseInfo.used_name" label="曾用名"/>
						<oa-info-item :content="baseInfo.company_type" label="企业类型"/>
					</vc-expand>
					<div class="g-c-blue-mid g-pointer g-tc g-m-t-10" style="width:100%;padding-right: 60px;" @click="handleExpand" >
						{{ expandDetail?'收起':"展开" }}详情
						<i 
							:class="expandDetail?'icon-pack-up':'icon-pack-down'"
							class="icon iconfont g-dp-ib g-fs-12 "
							style="position:relative;top:0px"
						/>
					</div>
						
				</template> 
			</oa-info-block>
		
			
		</template>
		<i-form
			v-else-if="showForm"
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="100"
			class="v-sale-customer-form g-m-t-20"
			inline
		>
			<div class="g-flex g-fw-w">
				<template v-if="baseInfo.business_type==2">
					<i-form-item v-if="$global.staff.is_charge || config.customer_name.show " label="客户姓名：" prop="customer_name">
						<i-input
							v-model="formData.customer_name"
							:maxlength="10"
							clearable
							style="width:220px"
							placeholder="请输入客户姓名"
						/>
					</i-form-item>
					<i-form-item
						v-if="$global.staff.is_charge || config.tel.show"
						label="联系电话："
						prop="tel"
					>
						<i-input
							v-model="formData.tel"
							placeholder="请输入联系电话"
							style="width:220px"
							@input="handleInputTel"
						/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.location.show" label="地区：" prop="location">
						<i-cascader
							:data="region3"
							v-model="formData.location"
							placeholder="请选择地区"
							style="width:220px"
							clearable/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.address.show" label="详细地址：" prop="address">
						<oa-limit-words
							v-model="formData.address"
							:max="50"
							width="220px"
							placeholder="请输入详细地址"
						/>
					</i-form-item>
				</template>
				<template v-else>
					<i-form-item
						v-if="$global.staff.is_charge || config.company_name.show"
						label="公司名称："
						prop="company_name"
					>
						<i-input
							v-model="formData.company_name"
							:maxlength="50"
							:disabled="isDisabled&&dealStatus==1"
							placeholder="请输入公司名称"
							style="width:220px"
							@on-change="handleCompanyNameChange"
						/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.customer_name.show" label="客户姓名：" prop="customer_name">
						<i-input
							v-model="formData.customer_name"
							:maxlength="10"
							clearable
							style="width:220px"
							placeholder="请输入客户姓名"/>
					</i-form-item>
					<i-form-item
						v-if="$global.staff.is_charge || config.tel.show"
						label="客户电话："
						prop="tel"
					>
						<i-input
							v-model="formData.tel"
							type="tel"
							placeholder="请输入客户电话"
							style="width:220px"
							@input="handleInputTel"
						/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.url.show" label="官网：" prop="url">
						<i-input
							v-model="formData.url"
							:maxlength="100"
							style="width:220px"
							clearable
							placeholder="请输入公司官网"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.email.show" label="邮箱：" prop="email">
						<i-input
							v-model="formData.email"
							:maxlength="100"
							style="width:220px"
							clearable
							placeholder="请输入邮箱"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.location.show" label="地区：" prop="location">
						<i-cascader
							:data="region3"
							v-model="formData.location"
							style="width:220px"
							placeholder="请选择地区"
							clearable/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.address.show" label="详细地址：" prop="address">
						<oa-limit-words
							v-model="formData.address"
							:max="50"
							width="220px"
							placeholder="请输入详细地址"
						/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.capital.show" label="注册资本：" prop="capital">
						<i-input-number
							v-model="formData.capital"
							:max="999999999"
							:min="0"
							placeholder="请输入注册资金"
							style="width:220px !important"
						/>
						<span class="_number-append">万元</span>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.paid_in_capital.show" label="实缴资本：" prop="paid_in_capital">
						<i-input-number
							v-model="formData.paid_in_capital"
							:max="999999999"
							:min="0"
							placeholder="请输入实缴资本"
							style="width:220px !important"
						/>
						<span class="_number-append">万元</span>
					</i-form-item>
					<i-form-item 
						v-if="$global.staff.is_charge || config.intellectual_property_right.show" 
						label="知识产权：" 
						prop="intellectual_property_right"
					>
						<i-input
							v-model="formData.intellectual_property_right"
							:maxlength="4"
							clearable
							style="width:220px"
							placeholder="请输入知识产权"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.manage_state.show" label="经营状态：" prop="manage_state">
						<i-input
							v-model="formData.manage_state"
							:maxlength="200"
							clearable
							style="width:220px"
							placeholder="请输入经营状态"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.establishment_date.show" label="成立日期：" prop="establishment_date">
						<i-date-picker
							v-model="formData.establishment_date"
							:options="{disabledDate:disableDate}"
							style="width:220px"
							clearable
							placeholder="请选择成立日期"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.approval_date.show" label="核准日期：" prop="approval_date">
						<i-date-picker
							v-model="formData.approval_date"
							:options="{disabledDate:disableDate}"
							style="width:220px"
							clearable
							placeholder="请选择核准日期"/>
					</i-form-item>

					<i-form-item v-if="$global.staff.is_charge || config.credit_code.show" label="社会信用代码：" prop="credit_code">
						<i-input
							v-model="formData.credit_code"
							:maxlength="50"
							style="width:220px"
							clearable
							placeholder="请输入社会信用代码"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.taxpayer_number.show" label="纳税人识别号：" prop="taxpayer_number">
						<i-input
							v-model="formData.taxpayer_number"
							:maxlength="50"
							style="width:220px"
							clearable
							placeholder="请输入纳税人识别号"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.registration_number.show" label="注册号：" prop="registration_number">
						<i-input
							v-model="formData.registration_number"
							:maxlength="50"
							style="width:220px"
							clearable
							placeholder="请输入注册号"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.organization_code.show" label="组织机构代码：" prop="organization_code">
						<i-input
							v-model="formData.organization_code"
							:maxlength="50"
							style="width:220px"
							clearable
							placeholder="请输入组织机构代码"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.company_type.show" label="企业类型：" prop="company_type">
						<i-input
							v-model="formData.company_type"
							:maxlength="200"
							style="width:220px"
							clearable
							placeholder="请输入企业类型"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.industry.show" label="所属行业：" prop="industry">
						<i-input
							v-model="formData.industry"
							:maxlength="100"
							style="width:220px"
							clearable
							placeholder="请输入行业"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.scale.show" label="人员规模：" prop="scale">
						<i-input-number
							v-model="formData.scale_min"
							:min="0"
							:max="999999999"
							clearable
							placeholder="最小人数"
							style="width:85px !important;"
							@on-blur="validateScale"

						/>
						<span style="margin-left:15px;margin-right:15px">～</span>
						<i-input-number
							v-model="formData.scale_max"
							:min="0"
							:max="999999999"
							clearable
							placeholder="最大人数"
							style="width:85px !important;"
							@on-blur="validateScale"
						/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.used_name.show" label="曾用名：" prop="used_name">
						<i-input
							v-model="formData.used_name"
							:maxlength="50"
							clearable
							style="width:220px"
							placeholder="请输入曾用名"/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.manage_range.show" label="经营范围：" prop="manage_range">
						<oa-limit-words
							v-model="formData.manage_range"
							:max="2000"
							width="220px"
							placeholder="请输入经营范围"
						/>
					</i-form-item>
					<i-form-item v-if="$global.staff.is_charge || config.remarks.show" label="备注：" prop="remarks">
						<oa-limit-words
							v-model="formData.remarks"
							:max="255"
							width="220px"
							placeholder="请输入备注"
						/>
					</i-form-item>
				</template>
			</div>
		</i-form>
	</div>
</template>

<script >
import { Tooltip, Table } from 'iview';
import { Expand } from 'wya-vc';
import LimitWords from '@common/limit-words/limit-words';
import Loading from '@components/_common/loading/loading';
import { dataValidity, objRegex } from '@utils/utils';
import { OSS_PROP_ICON2 } from '@constants/constants';
import callService from "@components/sale/call-manage/call/service";
import { ViewErrorLink } from "@components/sale/_common/customer/view-error-link";
import { debounce } from 'lodash';
import { Confirm } from '@common/confirm/confirm';
import Title from '@common/title/title';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import moment from 'moment';
import { services } from '@stores/services/sale';
import InfoBlock from '@common/info-block/info-block';
import InfoItem from '@common/info-item/info-item';
import iview from "./iview";
import { AddRao } from './customer/add-rao';
import { getAuth, setData } from './util';
import { UpdateCustonmer } from './customer/update-customer.vue';


export default {
	name: "oa-customer-info",
	components: {
		'i-tooltip': Tooltip,
		"oa-limit-words": LimitWords,
		'oa-info-block': InfoBlock,
		'oa-info-item': InfoItem,
		'oa-loading': Loading,
		'oa-auto-tooltip': AutoTooltip,
		'oa-title': Title,
		'i-table': Table,
		'vc-expand': Expand
	},
	mixins: [
		iview,
		services.industryList(),
		services.scaleList(),
		services.region3(),
		services.coinConfig(),
		services.editCustomerConfig()

	],
	props: {
		basicInfo: Object,
		updateInfo: {
			type: Object,
			default: () => ({})
		},
		contacts: Array,
		isOwn: Boolean,
		customerId: Number,
		ownId: Number,
		staffId: Number,
		dealStatus: Number, // 1-已成交 2-未成交
		saveBasicInfoApi: {
			type: String,
			default: ''
		},
		readOnly: Boolean,
		showCall: {
			type: Boolean,
			default: false,
		},
		showContacts: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		const connectorColumns = [
			{
				title: ' ',
				key: '-',
				width: 30,
				render: (h, { row }) => {
					return (row.sign_count
					&& <Tooltip content={"标记错误" + row.sign_count + "次"} placement="top-start" offset="-14">
						<span 
							style="margin-right:-10px" 
							class="_circle g-pointer" 
							onClick={() => this.handleViewErrorLink(row)}
						>
							{row.sign_count}
						</span>
					</Tooltip>);

				},
			},
			{
				title: '角色',
				key: 'customer_type_str',
				width: 70,
			},
			{
				title: '姓名',
				key: 'customer_name',
				width: 70
			},
			{
				title: '联系电话',
				key: 'original_tel',
				minWidth: 120,
				render: (h, { row }) => {
					if (_global.staff.seat_number && this.showCall) {
						return (
							<span
								class="_value g-operation"
								onClick={
									() => {
										window.event.stopPropagation();
										callService.prepareToCallOut(row.original_tel);
									}
								}
							>
								{row.original_tel}
								<i class="icon iconfont icon-call2 g-m-l-5" />
							</span>
						);
					} else {
						return (
							<span>{row.original_tel}</span>
						);
					}
				}
			},
			{
				title: '微信号',
				key: 'wechat',
				minWidth: 100,
				render: (h, params) => {
					return (
						<AutoTooltip content={params.row.wechat} theme="dark" placement="bottom" labelClass=" "/>
					);
				}
			},
			{
				title: '添加人',
				key: 'staff_name',
				width: 80
			},
			{
				title: '更新时间',
				key: 'update_time',
				width: 90,
				render: (h, params) => {
					return (
						<AutoTooltip content={params.row.update_time} theme="dark" placement="bottom" labelClass=" "/>
					);
				}
			}
		];
		if (!this.readOnly) {
			connectorColumns.push(
				{
					title: '操作',
					key: 'type_str',
					width: this.$global.staff.is_charge ? 90 : 50,
					render: (h, { row }) => {
						return (
							<div class={(this.$global.staff.is_charge || row.is_own) ? "g-operation"
							 : 'g-operation-disable'} >
								 <span onClick={() => this.handleEditConnector(row)}>编辑</span>
								{!!this.$global.staff.is_charge && row.tel_type == 2
								 && <span class="g-m-lr-5"> | </span>}
								{!!this.$global.staff.is_charge && row.tel_type == 2
								&& <span onClick={() => this.handleDeleteConnector(row)}>删除</span>}
							</div>
						);
					}
				}
			);
		}
		return {
			OSS_PROP_ICON2,
			isEdit: false,
			loadingShow: false,
			changed: false,
			seat_number: _global.staff.seat_number,
			baseInfo: {
				"company_type": 1, // 客户类型 1 企业客户 2 个人客户
				business_type: 2,
				"company_name": "", // 公司名
				"customer_name": "", // 客户名
				"tel": "", // 电话
				"url": "", // 网址
				"email": "", // email
				"address": "", // 详细地址
				"capital": "", // 注册资本
				"paid_in_capital": "", // 实缴资本
				"manage_state": "", // 经营状态
				"establishment_date": "", // 成立时间
				"approval_date": "", // 核准日期
				"credit_code": "", // 社会信用代码
				"taxpayer_number": "", // 纳税人识别号
				"registration_number": "", // 注册号
				remarks: '',
				"organization_code": "", // 组织机构代码
				"industry": "", // 所属行业
				"scale": "", // 人员规模
				"used_name": "", // 曾用名
				"manage_range": "", // 经营范围
				"exist_time": "", // 存在时间 单位天
				intellectual_property_right: '', // 知识产权
				is_update: 1,
			},
			showForm: false,
			formData: {
				business_type: '',
				"customer_id": '', // 主键
				"company_name": "", // 公司名
				"customer_name": "", // 客户名
				"tel": "", // 电话
				"url": "", // 官网
				"email": "", // email
				location: [],
				"province": '', // 省code
				"city": '', // 市code
				"area": '', // 区code
				"address": "", // 详细地址
				"capital": '', // 注册资金
				"paid_in_capital": '', // 实缴资本
				"manage_state": "", // 经营状态
				"establishment_date": "", // 成立日期
				"approval_date": "", // 核准日期
				"credit_code": "", // 社会信用代码
				"taxpayer_number": "", // 纳税人识别号
				"registration_number": "", // 注册号
				"organization_code": "", // 组织机构代码
				"company_type": "", // 企业类型
				"industry": "", // 所属行业
				"scale_min": null, // 人员规模（小）
				"scale_max": null, // 人员规模（大）
				"used_name": "-", // 曾用名
				"manage_range": "", // 经营范围
				remarks: '',
				intellectual_property_right: '', // 知识产权
			},
			formDataBackup: {},
			orignCompanyName: '',
			orignTel: '',
			nameTips: [],
			telTips: [],
			rules: {

			},

			connectorList: [],
			connectorColumns,
			update_info: {
				can_update: 1,
				update_time: ""
			},
			expandDetail: false
		};
	},
	computed: {
		companyUrl() {
			return objRegex.validURLScheme.regex.test(this.baseInfo.url) ? this.baseInfo.url : `http://${this.baseInfo.url}`;
		},
		isDisabled() {
			return this.$route.name == "sale-customer-deal-deal-detail";
		},
		inIntention() {
			return	this.$route.path == '/sale/customer/intention';
		},
		inBlack() {
			return	this.$route.path == '/sale/sea/black';
		},
		inDeal() {
			return this.$route.path == '/sale/customer/deal/deal/detail';
		},
		inSea() {
			return this.$route.path == '/sale/sea/archive';
		},
		inRelate() {
			return this.$route.path == '/sale/customer/deal/relation/detail';
		},
		coinTip() {
			if (this.dealStatus === 1) return this.coinConfig.tip_1_5;
			return (this.sourceType == 1 && this.coinConfig.tip_1_4) || (this.sourceType == 2 && this.coinConfig.tip_1_3);
		},
		sourceType() {
			if (this.inIntention || this.inDeal || this.inRelate) return 1;
			if (this.inSea || this.inBlack) return 2;
			return '';

		},
		config() {
			if (this.inIntention || this.inDeal || this.inRelate) return this.editCustomerConfig.private_fields;
			if (this.inSea || this.inBlack) return this.editCustomerConfig.normal_fields;
		},
		canEdit() {
			if (this.readOnly) return false;
			if (this.$global.staff.is_charge) return true;
			if (!this.config) return false;
			if (this.baseInfo.business_type == 2) {
				return (this.config.customer_name.show || this.config.tel.show || this.config.location.show || this.config.address.show);
			} else {
				return this.config.showLength;

			}
		},
		showUpdate() {
			if (this.inIntention) {
				return getAuth(this.isOwn, 1682, 1689);
			} else if (this.inSea) {
				return this.$auth[1696];
			} else if (this.inDeal) {
				if (this.dealStatus === 1) {
					return getAuth(this.isOwn, 1693, 1695);
				} else {
					return getAuth(this.isOwn, 1682, 1689);
				}
			} else if (this.inRelate) {
				return getAuth(this.isOwn, 1724, 1725);

			} else return false;

		}


	},
	watch: {
		customerId(newVal, oldVal) {
			// this.loadData();
			this.isEdit = false;
			this.changed = false;
		},
		contacts(val) {
			if (val) {
				this.connectorList = [...val];
				this.connectorList.sort((a, b) => b.tel_type - a.tel_type);
			}
		},
		basicInfo(newVal, oldVal) {
			if (newVal) {
				newVal.location = newVal ? [newVal.province, newVal.city, newVal.area] : '';
				Object.keys(this.baseInfo).forEach(key => {
					this.baseInfo[key] = newVal[key];
				});
				setData(this.baseInfo, newVal);
				setData(this.formData, newVal);
				this.baseInfo.location = newVal.province_name + newVal.city_name + newVal.area_name;
				this.formData.capital = parseFloat(this.formData.capital) >= 0 ? parseFloat(this.formData.capital) : null;
				this.baseInfo.capital = parseFloat(this.baseInfo.capital) < 0 ? '--' : this.baseInfo.capital;
				this.baseInfo.paid_in_capital = parseFloat(this.baseInfo.paid_in_capital) < 0 ? '--' : this.baseInfo.paid_in_capital;
				if (this.formData.scale_max == -1) {
					this.formData.scale_max = null;
					this.baseInfo.scale_max = '-';
				}
				if (this.formData.scale_min == -1) {
					this.formData.scale_min = null;
					this.baseInfo.scale_min = '-';
				}
				this.formData.paid_in_capital = parseFloat(this.formData.paid_in_capital) >= 0 ? parseFloat(this.formData.paid_in_capital) : null;

				this.formDataBackup = { ...this.formData, location: [...this.formData.location] };

			}
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	mounted() {
		this.setRules();

	},
	methods: {
		handleEditConnector(data) {
			if (!data.is_own && !this.$global.staff.is_charge) return this.$Message.error('只能编辑自己添加的联系人');
			AddRao.popup({
				data: { ...data, customer_id: this.customerId },
				action: 'update',
				tels: this.connectorList.map(i => i.original_tel).filter(i => i != data.original_tel),
				isDeal: this.dealStatus == 1
			}).then(() => {
				this.$emit("change");
			}).catch((err) => { err && console.error(err); });

		},
		handleDeleteConnector(data) {
			Confirm.popup({ msg: '确认删除该联系人吗？' }).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_LINK_DELETE_POST",
					type: "POST",
					param: {
						link_id: data.link_id
					},
					loading: false,
					autoTip: true
				}).then(res => {
					this.$emit("change");
				}).catch(err => console.error(err));
			}).catch(err => err && console.error(err));

		},
		async handleAddRao() {
			const ok = await Confirm.popup({
				title: '温馨提示',
				renderContent: (h) => {
					return (
						<div class="g-fs-14" style="color: #4b4f57;">
							添加虚假的联系人信息经核实后会扣除微币，请如实添加。
							{this.coinConfig.tip_10_1 && <span>（{this.coinConfig.tip_10_1}）</span>}
						</div>
					);
				},
				cancelText: '',
				okText: '确定'
			}).then(() => {
				return 1;
			}).catch(e => e && console.error(e));
			ok && AddRao.popup({
				data: { customer_id: this.customerId },
				tels: this.connectorList.map(i => i.original_tel),
				action: "add",
			}).then(() => {
				this.$emit("change");
			}).catch(e => e && console.error(e));
		},
		handleCalOut(v) {
			callService.prepareToCallOut(v);
		},
		handleInputTel(v) {
			this.formData.tel = v.replace(/-/g, '');

		},
		handleCancelEdit() {
			Confirm.popup({ msg: '确认取消修改吗？' }).then(() => {
				this.formData = { ...this.formDataBackup, location: [...this.formDataBackup.location] };
				this.isEdit = false;
			}).catch(() => {});
		},
		handleSave: debounce(function () {
			return this.$refs.form.validate().then(valid => {
				if (!valid) return 0;
				let temp = { ...this.formData };
				if (this.baseInfo.company_type == 2) {
					temp = {
						customer_id: this.customerId, // 客户ID
						customer_name: temp.customer_name, // 客户名
						tel: temp.tel, // 电话
						province: temp.location[0], // 省code
						city: temp.location[1], // 市code
						area: temp.location[2], // 区code
						address: temp.address // 详细地址
					};
				} else {
					if (temp.scale_max == null) temp.scale_max = -1;
					if (temp.scale_min == null) temp.scale_min = -1;
					if (temp.capital == null) temp.capital = -1;
					if (temp.paid_in_capital == null) temp.paid_in_capital = -1;
					if (temp.scale_max !== -1 && temp.scale_min !== -1 && temp.scale_max < temp.scale_min) {
						this.$Message.error('人员规模最大人数必须大于等于最小人数');
						return;
					}
					temp.province = temp.location[0];
					temp.city = temp.location[1];
					temp.area = temp.location[2];
					temp.customer_id = this.customerId;
					delete temp.location;
					temp.establishment_date && (temp.establishment_date = moment(temp.establishment_date).format('YYYY-MM-DD'));
					temp.approval_date && (temp.approval_date = moment(temp.approval_date).format('YYYY-MM-DD'));
				}
				return this.$request({
					url: this.baseInfo.business_type == 2
					 ? '_SALE_CUSTOMER_EDIT_CUSTOMER_PERSONAL_POST' : '_SALE_CUSTOMER_EDIT_CUSTOMER_COMPANY_POST',
					type: "POST",
					param: {
						...temp,
						tel: temp.tel ? temp.tel.replace(/-/g, '') : '',
						type: this.sourceType,
						customer_id: this.customerId
					},
					loading: false,
				}).then((res) => {
					this.$Message.success(res.msg);
					this.$emit("change");
					this.changed = true;
					this.isEdit = false;
					return 1;
				}).catch(res => {
					this.$Message.error(res.msg);
					return 0;
				});
			});

		}, 200),
		handleCompanyNameChange(val) {
			val = val.target.value;
			if (val.includes(' ')) {
				setTimeout(() => {
					this.formData.company_name = val.replace(/ /g, '');
				}, 10);
			}
		},
		handleLink(url) {
			window.open(url, '_blank');
		},
		disableDate(date) {
			return date.getTime() > new Date().getTime();
		},
		handleViewErrorLink(link) {
			ViewErrorLink.popup({ linkId: link.link_id }).then(res => {
			}).catch(err => err && console.error(err));
		},
		handleUpdateCustonmer() {
			let type;
			if (this.inIntention) {
				type = 1;
			} else if (this.inSea) {
				type = 2;
			} else if (this.inDeal || this.inRelate) {
				if (this.dealStatus == 1) {
					type = 3;
				} else {
					type = 1;
				}
			}
			UpdateCustonmer.popup({
				companyName: this.baseInfo.company_name,
				customerId: this.customerId,
				type,
				oldCustomerInfo: this.formDataBackup
			}).then(() => {
				this.$emit('change');
			}).catch(e => e && console.error(e));
		},
		async setRules() {
			this.showForm = false;
			await this.loadEditCustomerConfigPromise;
			const config = this.config;
			if (!config) return;
			this.rules = {
				company_name: [
					//
					{ required: config.company_name.required, trigger: 'blur', message: '请输入公司姓名' },
					{ pattern: /[\u4e00-\u9fa5a-zA-Z()（）]{1,51}/, message: "企业类型只能填写中、英文和括号", trigger: "blur" }
				],
				customer_name: [
					{ required: config.customer_name.required, message: '请输入客户姓名', trigger: 'blur' },
					{ type: 'validName', validator: dataValidity, message: "客户姓名只能填写中文和英文", trigger: "blur" }
				],
				tel: [
					{ required: config.tel.required, message: "请输入客户电话", trigger: 'blur', },
					{ validator: dataValidity, type: 'validTel', trigger: 'blur' }
				],
				url: [
					{ required: config.url.required, message: "请输入网址", trigger: 'blur' },
					{ validator: dataValidity, type: 'validUrl', message: '请输入正确的网址' }
				], // 官网
				email: [
					{ required: config.email.required, message: "请输入 邮箱", trigger: 'blur' },
					{ validator: dataValidity, type: 'validEmail', message: '请输入正确格式的邮箱' }
				], // email
				location: [{ required: config.location.required, type: 'array', message: '请选择所在地区', trigger: 'change' }],
				address: [
					{ required: config.address.required, trigger: 'blur', message: "请输入详细地址" }
				],
				capital: [
					{ required: config.capital.required, type: 'number', trigger: 'blur', message: "请输入注册资本" }
				],
				paid_in_capital: [
					{ required: config.paid_in_capital.required, type: 'number', trigger: 'blur', message: "请输入实缴资本" }
				], // 实缴资本
				manage_state: [
					{ required: config.manage_state.required, message: '请输入经营状态', trigger: 'blur' }
				 ], // 经营状态
				establishment_date: [
					{
						required: config.establishment_date.required,
						validator: this.dateValidator,
						type: 'date',
						message: '请选择成立日期',
						trigger: 'change'
					}
				], // 成立日期
				approval_date: [
					{ required: config.approval_date.required, validator: this.dateValidator, type: 'date', message: '请选择核准日期', trigger: 'change' }
				], // 核准日期
				credit_code: [
					{ required: config.credit_code.required, message: '请输入社会信用代码', trigger: 'blur' },
					{ validator: dataValidity, type: "validSocialCode" }
				], // 社会信用代码
				taxpayer_number: [
					{ required: config.taxpayer_number.required, message: '请输入纳税人识别号', trigger: 'blur' },
					{ validator: dataValidity, type: "validSocialCode" }
				], // 纳税人识别号
				registration_number: [
					{ required: config.registration_number.required, message: '请输入注册号', trigger: 'blur' },
					{ validator: dataValidity, type: "validSocialCode" }
				], // 注册号
				organization_code: [
					{ required: config.organization_code.required, message: '组织机构代码', trigger: 'blur' },
					{ validator: dataValidity, type: "validSocialCode" }
				], // 组织机构代码
				company_type: [
					{ required: config.company_type.required, message: '请输入企业类型', trigger: 'blur' }
				], // 企业类型
				industry: [
					{ required: config.industry.required, message: '请输入所属行业', trigger: 'blur' }
				], // 所属行业
				"scale_min": [], // 人员规模（小）
				"scale_max": [], // 人员规模（大）
				scale: [{ required: config.scale.required, validator: this.scaleValidator }],
				used_name: [
					{ required: config.used_name.required, pattern: /[\u4e00-\u9fa5a-zA-Z()（）]/, message: "曾用名只能输入中英文和括号", trigger: "blur" }
				], // 曾用名
				manage_range: [
					{ required: config.manage_range.required, message: '请输入经营范围', trigger: 'blur' }
				], // 经营范围
				remarks: [
					{ required: config.remarks.required, message: '请输入备注', trigger: 'blur' }
				], // 经营范围
				intellectual_property_right: [
					{ required: config.intellectual_property_right.required, message: '请输入知识产权', trigger: 'blur' },
					{ validator: this.intellectualValidator, trigger: 'blur' }
				]

			};
			this.showForm = true;
		},
		scaleValidator(rule, value, cb) {
			if (!rule.required) return cb();
			if (this.formData.scale_min > 0 || this.formData.scale_max > 0) {
				cb();
			} else {
				cb('请输入人员规模');
			}
		},
		validateScale() {
			this.$refs.form.validateField('scale');
		},
		dateValidator(rule, value, callback) {
			if (rule.required) {
				if (value instanceof Date) {
					callback();
				}
			} else if (value === '' || value instanceof Date) {
				callback();
			} else callback(rule.message);
		},
		handleExpand() {
			this.$refs.expand.toggle();
		},
		intellectualValidator(rule, val, cb) {
			if (!val) cb();
			if (/^[0-9]{1,3}[+]?$/.test(val)) cb();
			else cb('知识产权最多999+');
		}
	}
};
</script>

<style lang="scss">
.v-sale-customer-base-info {
	._title {
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			top: 2px;
			position: relative;
			background-color: #e84854;
		}
	}
	.v-sale-customer-form ._form-block {
        .ivu-form-item:nth-of-type(2n-1) {
            margin-right: 40px;
        }
        .ivu-form-item {
            width: 320px;
        }
	}
    ._number-append {
	        display: inline-block;
	        position: absolute;
	        right: 7px;
	        vertical-align: bottom;
	        z-index: 1;
	        color: gray;
	    }
	    .ivu-input-number {
	        width: 100% !important;

	        .ivu-input-number-handler-wrap {
	            display: none !important;
	        }
		}
	._circle {
		height: 16px;
		width: 16px;
		background: #E74854;
		border-radius: 8px;
		display: inline-block;
		text-align: center;
		color: white;
	}
	.ivu-table-cell{
		padding-left: 10px !important;
		padding-right: 10px !important;
	}
}
</style>
