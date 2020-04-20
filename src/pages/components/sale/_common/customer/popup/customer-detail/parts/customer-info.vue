<template>
	<div class="v-sale-customer-info g-relative" style="min-height:260px">
		<oa-loading v-if="loadingShow"/>
		<!-- <div class="_title">
			<span class="_title-bar g-bg-red-mid"/>
			<span class="g-fs-14 g-m-lr-5">联系人</span>
			<span
				v-if="!readOnly"
				class="g-operation g-m-lr-5 g-fs-14"
				@click="handleAddRao"
			>
				添加
			</span>
		</div>
		<div>
			<i-table
				:columns="connectorColumns"
				:data="connectorList"
				stripe
			/>
		</div> -->
		<oa-customer-base-info
			:contacts="connectorList"
			:customer-id="customerId"
			:read-only="readOnly"
			:basic-info="baseInfo"
			:update-info="updateInfo"
			:show-call="showCall"
			:show-contacts="showContacts"
			:deal-status="dealStatus"
			:is-own="isOwn"
			class="g-m-tb-20"
			@change="()=>{loadData();this.$emit('change')}"
		/>

		<oa-info-block title="系统记录" class="g-m-b-20">
			<oa-info-item :content="systemRecord.staff_name" label="创建人"/>
			<oa-info-item :content="systemRecord.update_time" label="最近更新"/>
			<oa-info-item :content="systemRecord.create_time" label="创建时间"/>
			<oa-info-item :content="systemRecord.change_times" label="转手次数">
				<span class="g-c-black2" style="font-weight:bold">
					{{ systemRecord.change_times }}
				</span>
			</oa-info-item>
			<oa-info-item :content="systemRecord.get_time" label="领取时间"/>
		</oa-info-block>
		<template v-if="signList && signList.length">
			<oa-title class="g-m-b-20">标记记录</oa-title>
			<!-- <div class="_title g-m-t-20 g-m-b-30">
				<span class="__title-bar"/>
				<span class="g-pd-l-5 g-fs-14">标记记录</span>
			</div> -->
			<div class="g-m-l-10 g-m-b-20 g-fs-14 g-c-black3">
				<i-table
					:columns="signColumn"
					:data="signList"
					stripe
				/>
			</div>
		</template>
	</div>
</template>

<script >
import { Poptip, Table } from 'iview';
import LimitWords from '@common/limit-words/limit-words';
import callService from "@components/sale/call-manage/call/service";
import { services } from '@stores/services/sale';
import Loading from '@components/_common/loading/loading';
import { dataValidity, objRegex } from '@utils/utils';
import { debounce } from 'lodash';
import { Confirm } from '@common/confirm/confirm';
import Title from '@common/title/title';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import CustomerBaseInfo from "@components/sale/_common/customer-base-info";
import { handleCopyPhone } from '@components/sale/call-manage/call/util';
import moment from 'moment';
import InfoBlock from '@common/info-block/info-block';
import InfoItem from '@common/info-item/info-item'; 
import { AddRao } from '../../../add-rao';
import { ViewRao } from '../../../view-rao';
import iview from "../../../../iview";
import { getAuth, setData } from '../../../../util';


export default {
	name: "oa-customer-info",
	components: {
		'i-poptip': Poptip,
		'i-table': Table,
		"oa-limit-words": LimitWords,
		'oa-info-block': InfoBlock,
		'oa-title': Title,
		'oa-info-item': InfoItem,
		'oa-loading': Loading,
		'oa-auto-tooltip': AutoTooltip,
		'oa-customer-base-info': CustomerBaseInfo
	},
	mixins: [
		iview, services.region3(),
		services.industryList(),
		services.scaleList()
	],
	props: {
		isOwn: Boolean,
		customerId: Number,
		ownId: Number,
		staffId: Number,
		dealStatus: Number,
		config: {
			type: Object,
			default: () => ({
				headUrl: '_SALE_INTENTION_INFO_HEAD_GET',
				customerInfoUrl: '_SALE_CUSTOMER_CUSTOMER_INFO_GET'
			})
		},
		readOnly: Boolean,
		showCall: {
			type: Boolean,
			default: false
		},
		showContacts: {
			type: Boolean,
			default: false,
		}
	},
	data() {
		const connectorColumns = [
			{
				title: '角色',
				key: 'customer_type_str',
				minWidth: 80
			},
			{
				title: '姓名',
				key: 'customer_name',
				minWidth: 80
			},
			{
				title: '联系电话',
				key: 'original_tel',
				minWidth: 160,
				render: (h, { row }) => {
					if (!_global.staff.seat_number) {
						return (
							<span>{row.original_tel}</span>
						);
					} else {
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
					}
				}
			},
			{
				title: '微信号',
				key: 'wechat',
				minWidth: 110,
				render: (h, params) => {
					return (
						<AutoTooltip content={params.row.wechat} theme="dark" placement="bottom" labelClass=" "/>
					);
				}
			},
			{
				title: '添加人',
				key: 'staff_name',
				minWidth: 80
			},
			{
				title: '更新时间',
				key: 'update_time',
				minWidth: 110,
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
					width: 120,
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
			isEdit: false,
			loadingShow: false,
			changed: false,
			seat_number: _global.staff.seat_number,
			baseInfo: {},
			updateInfo: {},
			systemRecord: {
				staff_name: '',
				create_time: '',
				get_time: '',
				update_time: '',
				change_times: ''
			},
			formData: {
				"customer_id": 399603, // 主键
				"company_name": "璧婵海狸舒氏有限公司", // 公司名
				"customer_name": "张五分", // 客户名
				"tel": "13269502231", // 电话
				"url": "www.baidu.com", // 官网
				"email": "123456@qq.com", // email
				location: [],
				"province": 110000, // 省code
				"city": 110100, // 市code
				"area": 110101, // 区code
				"address": "而我认同与", // 详细地址
				"capital": 100, // 注册资金
				"paid_in_capital": 80, // 实缴资本
				"manage_state": "续存", // 经营状态
				"establishment_date": "2019-01-01", // 成立日期
				"approval_date": "2019-01-01", // 核准日期
				"credit_code": "1644123456789", // 统一社会信用代码
				"taxpayer_number": "098765432", // 纳税人识别号
				"registration_number": "74185296312", // 注册号
				"organization_code": "1646461318746", // 组织机构代码
				"company_type": "怒爱大你", // 企业类型
				"industry": "所有行业", // 所属行业
				"scale_min": 100, // 人员规模（小）
				"scale_max": 999, // 人员规模（大）
				"used_name": "-", // 曾用名
				"manage_range": "第三部的方便的说法", // 经营范围
			},
			formDataBackup: {},
			orignCompanyName: '',
			orignTel: '',
			nameTips: [],
			telTips: [],
			
			signList: [],
			signColumn: [
				{
					title: '标记原因',
					key: 'type_str',
					minWidth: 120
				},
				{
					title: '备注',
					key: 'remark',
					minWidth: 140,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.remark ? <AutoTooltip
										content={params.row.remark}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '-'
								}

							</div>
						);
					}
				},
				{
					title: '标记人',
					key: 'staff_name',
					minWidth: 150,
					render: (h, params) => {
						const staff_name = `${params.row.staff_name}（${params.row.depart_name}）`;
						return (
							<div>
								{
									staff_name ? <AutoTooltip
										content={staff_name}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '-'
								}
							</div>
						);
					}
				},
				{
					title: '标记时间',
					key: 'create_time',
					minWidth: 220,
					render: (h, prams) => {
						return (
							<div>
								<span>{prams.row.create_time}</span>
								<span class="g-m-l-10 g-c-red-mid">{prams.row.delete_str}</span>
							</div>
						);
					}
				}
			],
			connectorList: [],
			connectorColumns
		};
	},
	computed: {
		companyUrl() {
			return objRegex.validURLScheme.regex.test(this.baseInfo.url) ? this.baseInfo.url : `http://${this.baseInfo.url}`;
		}
	},
	watch: {
		customerId(newVal, oldVal) {
			this.loadData();
			this.isEdit = false;
			this.changed = false;
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
		this.loadData();
		callService.callEmitter.on('add-record', this.loadData, this);
	},
	destroyed() {
		callService.callEmitter.off('add-record', this.loadData, this);
	},
	methods: {
		loadData() {
			this.loadCustomerInfo();
		},
		handleCallOut(tel) {
			callService.prepareToCallOut(tel);
		},
		handleCancelEdit() {
			Confirm.popup({ msg: '确认取消修改吗？' }).then(() => {
				this.formData = { ...this.formDataBackup, location: [...this.formDataBackup.location] };
				this.isEdit = false;
			}).catch(() => {

			});
		},
		loadCustomerInfo() {
			this.loadingShow = true;
			this.$request({
				url: this.config.customerInfoUrl,
				type: "GET",
				loading: false,
				param: {
					customer_id: this.customerId
				}
			}).then((res) => {
				// tel_type 首次添加客户的公司的tel_type为2，新加的电话tel_type为1，首次的电话放到最后
				res.data.link_tel_list.sort((a, b) => a.tel_type - b.tel_type);
				res.data.basic_info.location = [res.data.basic_info.province_name, res.data.basic_info.city_name, res.data.basic_info.area_name];
				this.connectorList = res.data.link_tel_list;
				this.signList = res.data.sign_list;
				this.baseInfo = res.data.basic_info;
				this.updateInfo = res.data.update_info;
				setData(this.systemRecord, res.data.system);
				this.loadingShow = false;

			}).catch((res) => {
				console.error(res);
				this.loadingShow = false;
				this.$Message.error(res.msg);
			});
		},
		companyNameValidator: debounce(function (rule, val, callback) {
			if (!val) return callback('请输入公司名称');
			if (/[\u4e00-\u9fa5a-zA-Z()（）]{1,51}/.test(val)) {
				callback('公司名称只能包含中英文和括号');
			}

			// if (val == '') {
			// 	this.nameTips = [{ tips: "请输入公司名称" }];
			// 	return callback(new Error('请输入公司名称'));
			// }
			// if (val == this.orignCompanyName) {
			// 	this.nameTips = [];
			// 	return callback();
			// }
			// this.$request({
			// 	url: "_SALE_INTENTION_CHECK_NAME_GET",
			// 	type: "GET",
			// 	loading: false,
			// 	param: {
			// 		company_name: val
			// 	}
			// }).then((res) => {
			// 	this.nameTips = res.data;
			// 	if (res.data.length > 0) {
			// 		return callback(new Error(res.data[0].tips));
			// 	} else {
			// 		return callback();
			// 	}
			// }).catch((res) => {});
		}, 100),
		telValidator: debounce(function (rule, val, callback) {
			if (!val) return callback(new Error('请输入客户电话'));
			if (val == '') {
				this.telTips = [{ tips: "请输入客户电话" }];
				return callback(new Error('请输入客户电话'));
			}
			if (val == this.orignTel) {
				this.telTips = [];
				return callback();
			}
			// this.$request({
			// 	url: "_SALE_INTENTION_CHECK_TEL_GET",
			// 	type: "GET",
			// 	loading: false,
			// 	param: {
			// 		tel: val
			// 	}
			// }).then((res) => {
			// 	this.telTips = res.data;
			// 	if (res.data.length > 0) {
			// 		return callback(new Error('error'));
			// 	} else {
			// 		return callback();
			// 	}
			// }).catch((res) => {
			// });
		}, 100),
		handleCompanyNameChange(val) {
			val = val.target.value;
			if (val.includes(' ')) {
				setTimeout(() => {
					this.formData.company_name = val.replace(/ /g, '');
				}, 10);
			}
		},
		handleViewRao() {
			this.baseInfo.link_tel.length > 0 && ViewRao.popup({ customerId: this.customerId }).catch(() => {});
		},
		handleAddRao() {
			AddRao.popup({
				data: { customer_id: this.customerId },
				tels: this.connectorList.map(i => i.original_tel),
				action: "add"
			}).then(() => {
				this.loadData();
			}).catch(() => {});
		},
		handleCopyRao(event) {
			handleCopyPhone(event, { customer_id: this.customerId, relation_type: 2 });
		},
		handleLink(url) {
			window.open(url, '_blank');
		},
		handleEditConnector(data) {
			if (!data.is_own && !this.$global.staff.is_charge) return this.$Message.error('只能编辑自己添加的联系人');
			AddRao.popup({
				data: { ...data, customer_id: this.customerId },
				action: 'update',
				tels: this.connectorList.map(i => i.original_tel).filter(i => i != data.original_tel)
			}).then(() => {
				this.loadData();
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
					this.loadData();
				}).catch(err => console.error(err));
			}).catch(err => err && console.error(err));

		},
		disableDate(date) {
			return date.getTime() > new Date().getTime();
		},

	}
};
</script>

<style lang="scss">
.v-sale-customer-info {
    .v-sale-customer-form ._form-block {
        .ivu-form-item:nth-of-type(2n-1) {
            margin-right: 40px;
        }
        .ivu-form-item {
            width: 300px;
        }
	}
	._cus-error-tip {
		.ivu-form-item-error-tip {
			position: relative;
			margin-bottom: -20px;
			line-height: 18px;
			top: -2px;
		}
	}
	._title {
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
	}
}

</style>
