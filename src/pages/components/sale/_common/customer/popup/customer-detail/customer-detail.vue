<template>
	<i-drawer
		v-model="visible"
		:mask-closable="false"
		:mask="false"
		class="v-sale-customer-detail-side v-sale-customer-detail"
	>
		<span slot="close"/>
		<span :style="closeBtnStyle" class="g-pointer iconfont icon-clear" style="font-size: 14px;" @click="handleClose"/>
		<div
			class="_head-title"
			style="height:60px"
		>
			{{ headData.company_name }}
			<oa-customer-time-tip
				v-if="isOwn && !isDealed && $auth[833]"
				ref="timeTip"
				:key="data.customer_id"
				:value="headData.remind_time"
				:customer-id="data.customer_id"
				class="g-m-l-10"
				@on-ok="handleSaveRemindTime"
				@on-clear="handleSaveRemindTime"
			/>
			<!-- <span class="g-fs-12 g-fr g-m-r-10" style="line-height:27px" >保护时间至：{{ headData.expiration_time || '--' }}</span> -->
		</div>
		<div class="_title-wrapper">
			<span class="_span1">
				<span class="_left-text">负责人：</span>
				<span class="_right-text">{{ headData.staff_name || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">客户类型：</span>
				<template v-if="inEditCustomerType">
					<i-select
						v-model="headData.customer_type"
						style="width:75px"
						placeholder="请选择"
					>
						<i-option
							v-for="item in customerTypeList"
							:value="item.customer_type_id"
							:key="item.customer_type_str"
						>
							{{ item.customer_type_str }}
						</i-option>
					</i-select>
					<i class="icon iconfont g-c-green-mid g-pointer icon-completed" @click="handleSaveCustomerType"/>
					<i class="icon iconfont g-c-black4 g-pointer icon-uncomplete" @click="handleCancelCustomerType"/>

				</template>
				<template v-else >
					<span class="_right-text">{{ headData.customer_type_str || '--' }}</span>
					<i
						class="iconfont icon-bianji g-c-blue-mid g-fs-12 g-pointer"
						@click="handleEditCustomerType"
					/>
				</template>
			</span>
			<span class="_span1">
				<span class="_left-text">具体行业：</span>
				<template v-if="inEditIndustry">
					<!-- <i-cascader
						:data="industryTree"
						v-model="headData.industry"
						style="width:150px"
						placeholder="请选择具体行业"
						transfer
					/> -->
					<i-select
						v-model="headData.industry_id"
						placeholder="请选择行业"
						style="width:75px"
					>
						<i-option
							v-for="item in industryList"
							:value="item.industry_id"
							:key="item.industry_id"
						>
							{{ item.industry_name }}
						</i-option>
					</i-select>
					<i class="icon iconfont g-c-green-mid g-pointer icon-completed" @click="handleSaveIndustry"/>
					<i class="icon iconfont g-c-black4 g-pointer icon-uncomplete" @click="handleCancelIndustry"/>

					<!-- <span class="g-operation" @click="handleCancelIndustry">保存</span> -->

				</template>
				<template v-else >
					<span class="_right-text">{{ headData.industry_id_str || '--' }}</span>
					<i
						class="iconfont icon-bianji g-c-blue-mid g-fs-12 g-pointer"
						@click="handleEditIndustry"
					/>
				</template>
			</span>
			<span class="_span1">
				<span class="_left-text">产品类型：</span>
				<template v-if="inEditProductType">
					<i-select
						v-model="headData.product_type_id"
						placeholder="请选择类型"
						style="width:75px"
					>
						<i-option
							v-for="item in productTypeList"
							:value="item.product_type_id"
							:key="item.product_type_id"
						>
							{{ item.product_type_name }}
						</i-option>
					</i-select>
					<i class="icon iconfont g-c-green-mid g-pointer icon-completed" @click="handleSaveProductType"/>
					<i class="icon iconfont g-c-black4 g-pointer icon-uncomplete" @click="handleCancelProductType"/>

					<!-- <span class="g-operation" @click="handleCancelIndustry">保存</span> -->

				</template>
				<template v-else >
					<span class="_right-text">{{ headData.product_type_name || '--' }}</span>
					<i
						class="iconfont icon-bianji g-c-blue-mid g-fs-12 g-pointer"
						@click="handleEditProductType"
					/>
				</template>
			</span>
			<span class="_span1">
				<span class="_left-text">客户来源：</span>
				<span class="_right-text">{{ headData.info_source || '--' }}</span>
			</span>
			<span class="_span1">
				<span class="_left-text">客户级别：</span>
				<span class="_right-text">{{ headData.level_str || '--' }}</span>
				<i
					v-if="!data.readOnly && data.deal_status =='2' && headData.can_upgrade == 1 && getAuth(isOwn,388,399)"
					class="iconfont icon-arrow-up g-c-blue-mid g-fs-12 g-pointer"
					@click="handleUpgrade"
				/>
			</span>
			<!-- <span class="_span1">
				<span class="_left-text">信息来源：</span>
				<span class="_right-text">{{ headData.source || '--' }}</span>
			</span> -->

			<span class="_span1" style="min-width:170px;width:auto;">
				<span class="_left-text">上次跟进时间：</span>
				<span class="_right-text" style="margin-right: 20px;" >{{ headData.visit_time || '--' }}</span>
			</span>

			<span v-if="headData.is_deal==0" class="_span1" style="min-width:170px;width:auto">
				<span class="_left-text">保护时间至：</span>
				<span class="_right-text" >{{ headData.expiration_time || '--' }}</span>
			</span>


		</div>
		<i-tabs v-model="curTab" :style="tabsStyle" @on-click="handleTabChange" >
			<i-tab-pane :label="'客户信息'" name="customerInfo">
				<oa-sale-customer-info
					v-if="tabs.customerInfo"
					ref="customerInfo"
					:customer-id="data.customer_id"
					:is-own="isOwn"
					:staff-id="data.staff_id"
					:own-id="data.own_id"
					:deal-status="headData.is_deal?1:2"
					:config="config"
					:show-call="showCall"
					:read-only="readOnly"
					:show-contacts="showContacts"
					@change="handleCustomerInfoChange"
				/>
			</i-tab-pane>
			<i-tab-pane label="跟进记录" name="followRecord">
				<oa-sale-follow-record 
					v-if="tabs.followRecord" 
					:customer-id="data.customer_id"
					:is-own="isOwn"
					:read-only="readOnly"
					@change="handleFollowRecordChange"
				/>

			</i-tab-pane>
			<i-tab-pane label="关联客户" name="relateCustomer">
				<oa-sale-relate-customer
					v-if="tabs.relateCustomer"
					:customer-id="data.customer_id"
					:is-own="isOwn"
					:read-only="readOnly"

				/>

			</i-tab-pane>
			<i-tab-pane label="资料转手记录" name="turnRecord">
				<oa-sale-turn-record v-if="tabs.turnRecord" :customer-id="data.customer_id" :read-only="readOnly"/>
			</i-tab-pane>
			<i-tab-pane label="相关案例" name="case">
				<oa-sale-case 
					v-if="tabs.case"
					ref="case"
					:customer-id="data.customer_id"
					:show-apply-case="showApplyCase"
					:read-only="readOnly"
				/>
			</i-tab-pane>
		</i-tabs>
		<div v-if="!data.readOnly" class="_footer">
			<i-button v-if="getAuth(isOwn,389,400)" @click="handleAddRecord">
				<i-tooltip
					v-if="coinConfig.tip_6_1"
					:content="coinConfig.tip_6_1"
					:max-width="220"
					transfer 
					placement="top"
					style="position:relative;top:1px;"
				>
					<img :src="OSS_PROP_ICON4">
				</i-tooltip>

				<span style="position:relative;top:-3px;">
					录入到账
				</span>

			</i-button>
			<template v-if="!data.hideOption">
				<i-button v-if="getAuth(isOwn,390,401)" @click="handleBack">归还</i-button>
				<i-button v-if="getAuth(isOwn,391,402)" @click="handleDistribute">指派</i-button>
				<i-button v-if="getAuth(isOwn,392,403)" @click="handleToWhiteList">添加进白名单</i-button>
				<i-dropdown
					v-if="headData.level!=0 && getAuth(isOwn,1679,1686)"
					placement="top"
					style="position: relative;top: 1px;"
					@on-click="handleDropMethod"
				>
					<span class="g-gray-btn-line _drop-btn" >
						延长保护期
						<i class="iconfont icon-up g-pointer"/>
					</span>
					<i-dropdown-menu slot="list">
						<i-dropdown-item 
							v-if="headData.level==2 && !headData.has_apply_extend && getAuth(isOwn,1680,1687)" 
							name="handleApplyProtect" 
						>
							申请保护期延长
						</i-dropdown-item>
						<i-dropdown-item v-if="headData.has_apply_extend && getAuth(isOwn,1680,1687)" name="handleViewProtectApply" >
							查看我的申请
						</i-dropdown-item>
						<i-dropdown-item v-if="getAuth(isOwn,1681,1688)" name="handleUseShield" >
							使用盾牌
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
				<i-button v-if="getAuth(isOwn,393,404)" @click="handleDelete">删除</i-button>
			</template>
		</div>
	</i-drawer>
</template>

<script>
import { Modal, Icon, Drawer, TabPane, Tabs, Steps, Step, Tooltip, Dropdown, DropdownMenu, DropdownItem } from "iview";
import { CreatePortal } from "wya-vc";
import { debounce } from 'lodash';
import API from '@stores/apis/root';
import orderModal from '@extends/mixins/orderModal';
import callService from "@components/sale/call-manage/call/service";
import { getHashUrl } from '@utils/utils';
import moment from 'moment';
import { Confirm } from '@common/confirm/confirm';
import { services } from '@stores/services/sale';
import { OSS_PROP_ICON4 } from '@constants/constants';
import iview from "../../../iview";
import { ChooseStaff } from '../../choose-staff';
import { Upgrade } from '../../upgrade';
import { DrawBack } from '../../draw-back';
import CustomerInfo from './parts/customer-info';
import Contacts from './parts/contacts';
import SaleRecords from './parts/sale-records';
import CallRecords from './parts/call-records';
import FollowRecord from './parts/follow-record';
import TurnRecord from './parts/turn-record';
import RelateCustomer from './parts/relate-customer';
import Case from './parts/case';
import _s from '../../cus-form/style';
import { getAuth } from '../../../util';
import TimeTip from '../components/time-tip';
import { ApplyProtect } from '../../apply-protect.vue';
import { PropertyCard } from '../../../property/property-card.vue';
import { Distribute } from '../../distribute.vue';
import { UpdateCustonmer } from '../../update-customer.vue';

const config = {
	intention: {
		headUrl: '_SALE_CUSTOMER_PUBLIC_INFO_GET',
		customerInfoUrl: '_SALE_CUSTOMER_CUSTOMER_INFO_GET'

	},
	relate: {
		headUrl: '_SALE_RELATE_CUSTOMER_INFO_HEAD_GET', // todo
		customerInfoUrl: "_SALE_RELATE_CUSTOMER_CUSTOMER_INFO_GET"

	}

};

export default {
	name: "oa-sale-customer-detail",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		'i-tooltip': Tooltip,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		"oa-customer-time-tip": TimeTip,
		'oa-sale-customer-info': CustomerInfo,
		'oa-sale-contacts': Contacts,
		'oa-sale-sale-records': SaleRecords,
		'oa-sale-call-records': CallRecords,
		'oa-sale-relate-customer': RelateCustomer,
		'oa-sale-follow-record': FollowRecord,
		'oa-sale-turn-record': TurnRecord,
		'oa-sale-case': Case
	},
	mixins: [
		iview,
		orderModal,
		services.customerTypeList(),
		// services.industryTree(),
		services.industryList(),
		services.coinConfig(),
		services.customerProductType()

	],
	props: {
		data: {
			type: Object,
			default: () => {
				return {
					own_id: undefined,
					staff_id: undefined,
					invite_staff_id: '',
					customer_id: undefined,
					staff_name: undefined,
					deal_status: '',
					is_own: '',
					contract_company_id: '',
					hideOption: '',
					readOnly: false,
				};
			}
		},
		mode: {
			type: String,
			default: 'intention',
			validator: (val) => {
				return ['intention', 'relate'].includes(val);
			}
		},
		showCall: {
			type: Boolean,
			default: false
		},
		showContacts: {
			type: Boolean,
			return: false,
		},
		readOnly: {
			type: Boolean,
			default: true,
		}
	},
	data() {
		return {
			OSS_PROP_ICON4,
			visible: false,
			curTab: 'customerInfo',
			auth: false, // 修改公司名称的权限,以后加
			closeBtnStyle: 'position: absolute;right: 20px;',
			changed: false,
			tabs: {
				customerInfo: true,
				relateCustomer: false,
				followRecord: false,
				turnRecord: false,
				case: false
			},
			tabsStyle: {
				marginBottom: this.data.readOnly ? '0px' : '',
				// paddingBottom: this.data.readOnly ? '20px' : ''

			},
			headData: {
				company_name: " ", // 公司名称
				staff_name: " ", // 负责人
				info_source: " ", // 客户来源
				visit_time: " ", // 跟进时间
				source: " ", // 信息来源
				level: " ", // 客户等级
				can_upgrade: 0, // 是否可以升级 0 不可 1 可以
				expiration_time: " ", // 保护期
				customer_name: '',
				remind_time: '',
				customer_type: '',
				customer_type_str: '',
				// industry: [],
				industry_id: '',
				industry_id_str: '',
				// industry_name: '',
				is_deal: 0,
				has_apply_extend: 0,
				product_type_id: '',
				product_type_name: ''


			},
			config: config[this.mode],
			inEditCustomerType: false,
			originCustomerType: '',
			inEditIndustry: false,
			originIndustry: '',
			inEditProductType: false,
			originProductType: '',
			// customerTypeList: [
			// 	{ type_id: 1, type_name: '其他类型' },
			// 	{ type_id: 2, type_name: '传统行业客户' },
			// 	{ type_id: 3, type_name: '新手' },
			// 	{ type_id: 4, type_name: '老司机' },
			// 	{ type_id: 5, type_name: '小司机' }
			// ] 
		};
	},
	computed: {
		isOwn() {
			return this.data.is_own;
		},
		isDealed() {
			return this.$route.path != "/sale/customer/intention";
		},
		productTypeList() {
			const industry = this.customerProductType.find(i => i.industry_id === this.headData.industry_id);
			if (industry && industry.product_type_list) {
				return industry.product_type_list;
			} else return [];
		
		},
		showApplyCase() {
			const headData = this.headData;
			return !!(headData.province && headData.industry_id && headData.customer_type && headData.product_type_id);

		}
	},
	watch: {
		'data.customer_id': function (v1, v2) {
			Object.keys(this.tabs).forEach(key => {
				this.tabs[key] = (key == this.curTab);
			});
			this.tabs.customerInfo = true;
			this.inEditCustomerType = false;
			this.inEditIndustry = false;
			this.loadHead();
		}
	},
	beforeCreate() {
		this.getAuth = getAuth;
	},
	created() {
		this.loadHead();
		callService.callEmitter.on('add-record', this.loadHead, this);

	},
	mounted() {
		this.visible = true;
		setTimeout(() => {
			this.closeBtnStyle = 'position:fixed;top:68px;right:34px';
		}, 200);
		// 清除自动弹出的url参数
		this.$vc.on('SALE_CLOSE_CUSTOMER_DETAIL', () => {
			this.visible = false;
			this.$emit('close');
		});
		this.$route.query.customer_id && this.$router.replace(getHashUrl(this.$route.path, { ...this.$route.query, customer_id: '' }));
	},
	beforeDestroy() {
		this.closeBtnStyle = 'position: absolute;right: 20px;';
		callService.callEmitter.off('add-record', this.loadHead, this);
		this.$vc.off('SALE_CLOSE_CUSTOMER_DETAIL');
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit("sure");
		},
		handleCancel() {
			this.visible = false;
			this.$emit("close");
		},
		initTabs() {
			this.curTab = 'customerInfo';
			this.tabs = {
				customerInfo: true,
				relateCustomer: false,
				followRecord: false,
				turnRecord: false
			};
		},
		handleTabChange(val) {
			this.tabs[val] = true;
		},
		handleClose() {
			if (this.$refs.customerInfo && this.$refs.customerInfo.isEdit) {
				return Confirm.popup({
					msg: "当前页面信息未进行保存，离开后将会丢失，是否保存？",
					title: "提示",
					okText: '保存'
				}).then(() => {
					this.$refs.customerInfo.handleSave();
				}).catch((err) => {
					console.error(err);
					this.handleOk();
				});

			} else {
				return new Promise((resolve, reject) => {
					this.handleOk();
					resolve();
				});

			}
		},
		handleBack() {
			DrawBack.popup({
				own_id: this.data.own_id, // 记录主键ID
				customer_id: this.data.customer_id, // 客户主键ID
				staff_id: this.data.staff_id,
				is_own: !!this.isOwn
			}).then(res => {
				this.handleResetCur();
				this.handleOk();
			}).catch(res => {
			});
		},
		handleUpgrade() {
			Upgrade.popup({ customer: { customer_id: this.data.customer_id, level: this.headData.level || 0 } }).then(() => {
				this.loadHead();
				this.$refs.customerInfo.loadCustomerInfo();
				this.handleResetCur();
			}).catch(() => {});
		},
		async handleAddRecord() {
			if (this.$global.staff.is_charge && this.data.staff_id == this.$global.staff.staff_id) {
				this.$Message.error('不允许超管对自己的客户录入到账');
				return;
			}
			if (!(this.$refs.customerInfo && this.$refs.customerInfo.baseInfo.is_update) 
				&& !this.$global.staff.is_charge
				&& this.headData.company_name.length >= 6) {

				let ok = await Confirm.popup({
					msg: '请先更新' + this.headData.company_name + '的资料信息，再进行录账操作',
					okText: '确定并去更新'
				}).then(() => 1).catch(e => e && console.error(e));
				if (ok) {
					ok = await UpdateCustonmer.popup({
						companyName: this.headData.company_name,
						customerId: this.data.customer_id,
						type: this.headData.is_deal ? 3 : 1, // 客户类型 1 意向客户 2 公海 3 成交客户

					}).then(() => 1).catch(e => e && console.error(e));
				}
				if (!ok) return;
				

			}
			this.handleClose().then(() => {
				setTimeout(() => {
					this.$router.push(
						getHashUrl("/sale/customer/intention/record/add", {
							// 成交客户的客户公司下录入到账，不加载原客户信息
							customer_id: this.data.customer_id,
							staff_id: this.data.staff_id || this.data.invite_staff_id,
							staff_name: this.headData.staff_name,
							deal_status: this.headData.is_deal ? 1 : 2,
							company_name: this.headData.company_name,
							contract_company_id: this.data.contract_company_id || '',
							customer_name: this.headData.customer_name,
							action: 'add'
						})
					);
				}, 400);
			}).catch(() => { });
		},
		loadHead() {
			this.$request({
				url: this.config.headUrl,
				type: "GET",
				loading: false,
				param: {
					customer_id: this.data.customer_id
				}
			}).then(({ data }) => {

				// data.industry = [data.industry_id, data.industry_id_second, data.industry_id_third];
				// data.industry_name = [data.industry_id_str, data.industry_id_second_str, data.industry_id_third_str].join(' ');
				data.industry_id;
				data.industry_id_str;
				delete data.industry_id_second;
				delete data.industry_id_second_str;
				delete data.industry_id_third;
				delete data.industry_id_third_str;
				this.headData = data;
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
		handleDistribute() {
			Distribute.popup({
				customerIds: [this.data.customer_id],
			}).then(() => {
				// 进行指派
				this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_RESET", {});
				this.handleOk();


			}).catch((e) => {
				e && console.error(e);
			});

		},
		handleToWhiteList() {
			Confirm.popup({
				title: "添加到白名单",
				msg: "确认添加到白名单吗？"
			}).then(() => {
				this.$request({
					url: API._SALE_WHITE_LIST_ADD_POST,
					type: "POST",
					loading: false,
					param: {
						type: 2, // 意向客户添加到白名单请求示例
						own_id: this.data.own_id
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					this.handleOk();
				}).catch(res => {
					this.$Message.error(res.msg);
				});
			}).catch(() => {
			});
		},
		handleDelete() {
			Confirm.popup({
				title: "删除提示",
				msg: "确认删除该客户吗？",
				showIcon: true
			}).then(() => {
				this.$request({
					url: API._SALE_INTENTION_DEL_CUSTOMER_POST,
					type: "POST",
					loading: false,
					param: {
						own_id: this.data.own_id, // 记录主键ID
						customer_id: this.data.customer_id // 客户主键ID
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetCur();
					this.handleCancel();
				}).catch(res => {
					console.error(res);
					this.$Message.error(res.msg);
				});
			}).catch((res) => {
				console.error(res);
			});
		},
		handleResetCur() {
			const path = this.$route.path;
			if (path == "/sale/customer/intention") {
				this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_RESET", {
					type: this.$route.query.type
				});
			} else if (path == "/sale/customer/deal/deal/detail") {
				this.$store.commit("SALE_CUSTOMER_DEAL_DEAL_DETAIL_LIST4_RESET", {
					type: this.$route.query.type
				});
			}
		},
		handleCustomerInfoChange() {
			this.loadHead();
			this.handleResetCur();
		},
		handleRecordsChange() {
			this.loadHead();
			this.handleResetCur();
		},
		handleSaveRemindTime(val) {
			const param = val
				? {
					customer_id: this.data.customer_id,
					remind_time: moment(val).format('YYYY-MM-DD HH:mm:ss')
				} : {
					customer_ids: [this.data.customer_id]
				};
			this.$request({
				url: val ? "_SALE_INTENTION_SET_OWN_REMIND" : '_SALE_INTENTION_CLEAR_OWN_REMIND_POST',
				type: "POST",
				param,
				loading: false,
			}).then(res => {
				this.loadHead();
				this.$Message.success(res.msg);
				
			}).catch((res) => {
				this.$Message.error(res.msg);
				this.$refs.timeTip.back();
			});
		},
		freshRelateCase() {
			this.$refs.case && this.$refs.case.freshData();

		},
		handleSaveCustomerType() {

			this.$request({
				url: "_SALE_CUSTOMET_EDIT_CUSTOMER_TYPE_POST",
				type: "POST",
				param: {
					customer_id: this.data.customer_id,
					customer_type: this.headData.customer_type
				},
				loading: false,
				autoTip: true,
			}).then(res => {
				this.inEditCustomerType = false;
				this.loadHead();
				this.freshRelateCase();
			}).catch((res) => {
				console.error(res);
			});
		},
		handleSaveIndustry() {
			if (this.headData.industry_id === this.originIndustry) return;
			Confirm.popup({
				title: '提示',
				msg: '修改客户行业将会清空客户的产品类型，确认修改行业吗？'

			}).then(() => {
				this.handleCancelProductType();
				this.$request({
					url: "_SALE_CUSTOMER_EDIT_CUSTOMER_INDUSTRY_POST",
					type: "POST",
					param: {
						customer_id: this.data.customer_id,
						industry_id: this.headData.industry_id
					// industry_id: this.headData.industry[0], // 一级行业
					// industry_id_second: this.headData.industry[1], // 二级行业
					// industry_id_third: this.headData.industry[2], // 三级行业

					},
					loading: false,
					autoTip: true,
				}).then(res => {
					this.inEditIndustry = false;
					this.loadHead();
					this.freshRelateCase();
				}).catch((res) => {
					console.error(res);
				});

			}).catch();
		},
		handleSaveProductType() {
			this.$request({
				url: "_SALE_CUSTOMER_INTENTION_EDIT_PRODUCT_TYPE_POST",
				type: "POST",
				param: {
					customer_id: this.data.customer_id,
					product_type_id: this.headData.product_type_id
				},
				loading: false,
				autoTip: true,
			}).then(res => {
				this.inEditProductType = false;
				this.loadHead();
				this.freshRelateCase();
			}).catch((res) => {
				console.error(res);
			});

		},
		handleDropMethod(method) {
			this[method]();
		},
		async handleUseShield() {
			const propInfo = await this.$request({
				url: "_SALE_CUSTOMER_PROTECT_PROP_INFO_GET",
				type: "GET",
				param: {
					customer_id: this.data.customer_id
				},
				loading: false,
			}).then(res => {
				return res;
			
			}).catch((res) => {
				this.$Message.error(res.msg);
				return res;
			});
			
			if (propInfo.status == 0) return;
			
			if (propInfo.data.is_used) {
				Confirm.popup({
					msg: '同一客户只能使用一张保护期延长盾牌，无法再使用',
					status: 'info',
					showIcon: true,
					okText: '去申请延长保护期'
				}).then(() => {
					if (this.headData.level != 2) {
						this.$Message.error('只有重要客户可以申请延长保护期');
						return;
					}
					this.handleApplyProtect();
				}).catch(e => e && console.error(e));
				return;
			}
			if (propInfo.data.surplus_num === 0) {
				Confirm.popup({
					msg: '请前往“道具中心”购买保护期延长盾牌！',
					status: 'info',
					showIcon: true,
					okText: '立即前往!'
				}).then(() => {
					this.$router.push({
						path: '/sale/property/center',
					});
				}).catch(e => e && console.error(e));
				return;
			}
			PropertyCard.popup({
				typeId: 6,
				tip: '同一客户最多使用1次保护期延长盾牌'
			}).then(() => {
				this.$request({
					url: "_SALE_CUSTOMER_PROTECT_USE_PROP_POST",
					type: "POST",
					param: {
						customer_id: this.data.customer_id,
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadHead();
					this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_RESET", { type: 1 });
				}).catch((res) => {
					this.$Message.error(res.msg);
				});

			});
		
			

		},
		handleApplyProtect() {
			ApplyProtect.popup({
				action: 'add',
				data: {
					...this.headData,
					customer_id: this.data.customer_id,
					end_time: this.headData.expiration_time.split(' 剩')[0]
				}
			}).then(() => {
				this.loadHead();
			});
		},
		handleViewProtectApply() {
			ApplyProtect.popup({
				action: 'view',
				data: {
					...this.headData,
					customer_id: this.data.customer_id
				}
			}).then(res => {
				if (res) {
					if (res.applyReadd) {
						this.handleApplyProtect();
					} else if (res.drawBack) {
						this.loadHead();
					}
				}
			}).catch(e => e && console.error(e));
		},
		handleFollowRecordChange() {
			this.loadHead();
			this.handleResetCur();

		},
		handleEditCustomerType() {
			this.inEditCustomerType = true;
			this.originCustomerType = this.headData.customer_type;
		},
		handleCancelCustomerType() {
			this.inEditCustomerType = false;
			this.headData.customer_type = this.originCustomerType; 

		},
		handleEditIndustry() {
			this.inEditIndustry = true;
			this.originIndustry = this.headData.industry_id;
		},
		handleCancelIndustry() {
			this.inEditIndustry = false;
			this.headData.industry_id = this.originIndustry; 

		},
		handleEditProductType() {
			this.inEditProductType = true;
			this.originProductType = this.headData.product_type_id;
		},
		handleCancelProductType() {
			this.inEditProductType = false;
			this.headData.product_type_id = this.originProductType; 

		}

	}
};
export const CustomerDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss" >
.v-sale-customer-detail {
	._ellipsis{
		width:198px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	._drop-btn {
		height: auto;
		line-height: 28px;
		color:#515a6e;
		position: relative;
		top: -1px;
		&:hover {
			color: #e84c57
		}

	}
}
</style>
