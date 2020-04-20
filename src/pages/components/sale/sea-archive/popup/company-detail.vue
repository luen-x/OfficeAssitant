<template>
	<i-drawer
		v-model="visible"
		:mask="false"
		:mask-closable="false"
		class="v-sale-sea-company-detail"
	>
		<span slot="close"/>
		<span
			class="g-pointer iconfont icon-clear"
			style="font-size: 14px;position: absolute;top: 20px;right: 20px;"
			@click="handleClose"
		/>
		<h2 class="_detail-header g-fs-16">
			{{ company_name || '--' }}
			<span v-if="headInfo.turn_max && !$global.staff.is_charge" class="_company-tag __red">转手上限</span>
			<span v-if="headInfo.is_sign" class="_company-tag __yellow">被标记资料</span>
		</h2>
		<div
			class="g-m-t-5 g-fs-12 g-flex g-fw-w"
			style="padding:0 16px"
		>
			<div class="_basic">
				<span class="__info g-c-black4">收回时间：</span>
				<span class="g-c-black2">{{ recovery_time || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="g-c-black4">客户类型：</span>
				<span class="g-c-black2">{{ headInfo.customer_type_str || '--' }}</span>
			</div>
			<div class="_basic">
				<span class="__info g-c-black4">具体行业：</span>
				<span class="g-c-black2">
					{{ headInfo.industry_id_str ?
					`${headInfo.industry_id_str}  ${headInfo.industry_id_second_str}  ${headInfo.industry_id_third_str}`:'--' }}</span>
			</div>
		</div>
		<i-tabs
			:style="tabs == 'customerInfo'?'height:calc(100% - 162px)':'height:calc(100% - 102px)'"
			value="customerInfo"
			@on-click="handleChangeTab"
		>
			<i-tab-pane
				label="客户信息"
				name="customerInfo"
				class="_detail-content"
			>
				<keep-alive>
					<oa-sea-customer-info
						v-if="tabs == 'customerInfo'"
						ref="customerInfo"
						:customer-id="customerId"
						:read-only="isAttention || readOnly"
						@reset="handleRestData"
					/>
				</keep-alive>
			</i-tab-pane>
			<!-- <i-tab-pane
				label="联系人"
				name="contact"
				class="_detail-content"
			>
				<keep-alive>
					<oa-sea-contact
						v-if="tabs == 'contact'"
						:customer-id="customerId"
						@reset="loadData"
					/>
				</keep-alive>
			</i-tab-pane> -->
			<i-tab-pane
				label="跟进记录"
				name="saleRecord"
				class="_detail-content"
			>
				<keep-alive>
					<oa-sale-follow-record
						v-if="tabs =='saleRecord'"
						:customer-id="customerId"
						:is-own="false"
						:show-publish="false"
						:show-like="false"
						:show-tel="false"
						style="margin-bottom:70px"
						@change="handleFollowRecordChange"
					/>
				</keep-alive>
			</i-tab-pane>
		</i-tabs>
		<div
			v-if="!isPrivate && !isAttention && !readOnly"
			class="_btn-box g-flex g-ai-c"
		>
			<vc-debounce-click
				v-if="$auth[478] && !headInfo.turn_max"
				:tag="Button"
				type="primary"
				@click="handleReceive"
			>
				领取
			</vc-debounce-click>
			<i-button
				v-if="$auth[685] && !headInfo.turn_max"
				class="g-m-l-10"
				@click="handleMark"
			>
				标记资料
			</i-button>
			<i-button
				v-if="$auth[479]"
				class="g-m-l-10"
				@click="handleAdd"
			>
				添加进白名单
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Tabs, TabPane, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import { setTimeout } from 'timers';
import orderModal from '@extends/mixins/orderModal';
import { Confirm } from '@common/confirm/confirm';
import service from '@utils/service';
import { services } from "@stores/services/sale";
import SeaCustomerInfo from "./customer-info";
import { SeaContact } from "./contact";
import { SeaRecord } from './record';
import { SeaMark } from './mark';
import { DrawBack } from '../../_common/customer/draw-back.vue';
import FollowRecord from '../../_common/customer/popup/customer-detail/parts/follow-record';



export default {
	name: "oa-sea-company-detail",
	components: {
		'i-drawer': Drawer,
		'oa-sea-customer-info': SeaCustomerInfo,
		'oa-sea-contact': SeaContact,
		'oa-sea-record': SeaRecord,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-button': Button,
		'oa-sale-follow-record': FollowRecord
	},
	mixins: [orderModal, services.coinConfig()],
	props: {
		customerId: [String, Number],
		isPrivate: Boolean,
		isAttention: Boolean,
		readOnly: Boolean
	},
	data() {
		return {
			visible: false,
			tabs: 'customerInfo',
			company_name: '',
			recovery_time: '',
			staff_name: '',
			info_source_name: '',
			headInfo: {},
		};
	},
	watch: {
		customerId() {
			this.loadData();
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	destroyed() {
		this.handleClose();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		handleRestData() {
			this.loadData();
			//
		},
		loadData() {
			this.$request({
				url: '_SALE_SEA_INFO_HEAD_GET',
				type: 'GET',
				loading: false,
				param: {
					customer_id: this.customerId
				},
				autoTip: false
			}).then(res => {
				this.headInfo = res.data;
				this.company_name = res.data.company_name;
				this.recovery_time = res.data.recovery_time;
				this.staff_name = res.data.staff_name;
				this.info_source_name = res.data.info_source_name;

			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleClose() {
			if (this.$refs.customerInfo && this.$refs.customerInfo.isEdit) {
				Confirm.popup({
					msg: "当前页面信息未进行保存，离开后将会丢失，是否保存？",
					title: "提示",
					upper: this,
					btnName2: '保存'
				}).then(() => {
					this.$refs.customerInfo.handleSave('basicForm');
				}).catch((err) => {
					err && console.error(err);
					this.handleCancel();
				});
			} else {
				this.handleCancel();
			}
		},
		/**
		 * 切换tab
		 */
		handleChangeTab(name) {
			this.tabs = name;
		},
		/**
		 * 点击领取
		 */
		handleReceive() {
			if (this.isPrivate) {
				this.$request({
					url: "_SALE_CUSTOMER_INTENTION_PRIVATE_SIGN",
					type: 'POST',
					loading: false,
					param: {
						customer_id: this.customerId
					},
					autoTip: false
				}).then(res => {
					if (res.data.error_code) {
						this.handleCancel();
						setTimeout(() => {
							this.$Message.error(res.data.error_msg);
						}, 300);
					} else {
						this.$store.commit('SALE_CUSTOMER_INTENTION_PRIVATE_LIST_RESET', {});
						this.$Message.success(res.msg);
						this.handleCancel();
					}
				}).catch(error => {
					console.error(error);
					this.$Message.error(error.msg);
						
				});
			} else {
				service.getCustomer(this.customerId).then(() => {
					this.$vc.emit("SALE_SEA_CUSTOMER_UPDATE_LIST_SILENCE");
					// this.$Message.success(res.msg);
					this.handleCancel();
				}).catch(console.error);
			}
		},
		/**
		 * 标记资料
		 */
		handleMark() {
			Confirm.popup({
				title: '温馨提示',
				renderContent: (h) => {
					return <div class="g-fs-14 g-c-black3">
						{this.coinConfig.tip_11_1}
						<br/><br/>
						<span class="g-fs-12 g-c-black4">
							此类型的举报必须提供凭证，例如已合作证明截图、工商信息截图等相关材料
						</span>
					</div>;
				},
				cancelText: '',
				okText: '确定'
			}).then(() => {
				DrawBack.popup({
					mode: 'sign',
					customer_id: this.customerId
				}).then(() => {
					this.$store.commit('SALE_SEA_ARCHIVE_LIST_RESET', { type: '1' });
				}).catch(e => e && console.error(e));
			}).catch(e => e && console.error(e));
		
			// SeaMark.popup({
			// 	customerId: this.customerId
			// }).then(res => {
			// 	if (res.status == 1) {
			// 		this.handleCancel();
			// 		setTimeout(() => {
			// 			this.$store.commit('SALE_SEA_ARCHIVE_LIST_RESET', { type: '1' });
			// 		}, 300);
			// 	}
			// }).catch(error => {
			// 	error && console.error(error);
			// });
		},
		/**
		 * 点击添加进白名单
		 */
		handleAdd() {
			Confirm.popup({
				title: '添加进白名单',
				msg: '确定将该用户添加进白名单吗！'
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_WHITE_ADD_POST',
					type: "POST",
					loading: false,
					param: {
						type: 1,
						customer_ids: [this.customerId]
					},
					autoTip: true
				}).then(() => {
					this.handleCancel();
					setTimeout(() => {
						this.$store.commit('SALE_SEA_ARCHIVE_LIST_RESET', { type: '1' });
					}, 300);
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleFollowRecordChange() {
			
		}
	}
};

export const SeaCompanyDetail = CreatePortal({ alive: true }, module.exports.default);
</script>
<style lang="scss">
.v-sale-sea-company-detail {
	._detail-header {
		color: #000;
		padding: 16px 40px 16px 16px;
		font-weight: normal;
	}
	._basic {
		margin-right: 50px;
		margin-bottom: 12px;
	}
	._detail-content {
		padding: 0 16px;
	}
	._btn-box {
		width: 100%;
		height: 60px;
		position: absolute;
		bottom: 0;
		left: 0;
		padding: 0 16px;
		background-color: #fff;
		border-top: 1px solid #e8e8e8;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
	}
	.ivu-drawer.ivu-drawer-right {
		width: 720px !important;
	}
	.ivu-tabs-tab {
		padding: 6px 0;
		margin: 0 15px;
	}
	.ivu-drawer-body {
		padding: 0;
	}
	.ivu-tabs-bar {
		background-color:#f6f6f6;
		margin-bottom: 0;
	}
	.ivu-tabs-tab:hover {
		color: #e84854;
	}
	.ivu-tabs-nav .ivu-tabs-tab-active {
		color: #e84854;
	}
	.ivu-tabs-ink-bar {
		background-color:#e84854;
		display: none;
	}
	.ivu-tabs-tab-focused,
	.ivu-tabs-nav-container:focus .ivu-tabs-tab-focused {
		color: #e74854;
		border-color: #e74854!important;
		border-bottom: 3px #e74854 solid !important;
	}
	.ivu-tabs-tabpane {
		overflow-y: auto;
		overflow-x: hidden;
		max-height: 100%;
	}
	.ivu-tabs-content {
		height: calc(100% - 34px);
	}
	._company-tag{
		border-radius: 5px;
		padding: 3px 8px;
		color: white;
		font-size: 12px;
		margin-left: 10px;
		&.__red {
			background: #e74854;

		}
		&.__yellow {
			background: #fbb837;

		}
	}
}
</style>
