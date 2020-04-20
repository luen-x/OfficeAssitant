<template>
	<div>
		<div class="v-sale-service-do">
			<div class="g-flex g-jc-sb g-ai-c _top">
				<span
					class="__left __name g-fs-16 g-pd-l-20 g-pointer"
					@click="handleDetail"
				>
					{{ company_name }}
				</span>
				<div class="__right">
					<i-button
						v-if="$auth[489]"
						class="__btn g-m-r-5"
						@click="handleCommitRecordAll"
					>
						提交记录
					</i-button>
					<i-button
						v-if="$auth[490]"
						class="__btn g-m-r-20"
						@click="handleClose"
					>
						申请关闭服务项
					</i-button>
				</div>
			</div>
			<div class="_content">
				<i-collapse
					v-if="customer_type === 1"
					v-model="arrowArr"
				>
					<i-panel
						v-for="(item, index) in list"
						:key="index"
						:hide-arrow="true"
						:name="index + ''"
						:class="{'__stage-panel': item.type === 2}"
						class="g-pointer"
					>
						<div class="g-flex g-jc-sb g-fs-14 __header g-m-b-10">
							<div>
								<div>
									<span>合同编号：{{ item.contract_num }}</span>
									<span v-if="item.status === 3" class="g-pd-lr-10">-</span>
									<span v-if="item.status === 3" class="__status">已失效</span>
								</div>
								<div class="g-flex __tip g-lh-25">
									<div>
										<span>服务提成：</span>
										<span>
											<span style="color:#E84854">{{ item.service_amount_total || 0 }}</span>
											<span>/{{ item.need_service_amount_total || 0 }}</span>
										</span>
									</div>
									<span class="g-pd-lr-20 g-c-light7">|</span>
									<div>
										<span>下单产品：</span>
										<span>{{ item.product_names }}</span>
									</div>
									<span class="g-pd-lr-20 g-c-light7">|</span>
									<div>
										<span>下单时间：</span>
										<span>{{ item.order_time }}</span>
									</div>
								</div>
							</div>
							<div style="line-height:50px;">
								<span v-if="arrowArr.includes(index + '')">收起</span>
								<span v-else>展开</span>
								<i
									v-if="arrowArr.includes(index + '')"
									class="icon iconfont icon-triangle-up g-fs-10"/>
								<i v-else class="icon iconfont icon-triangle-down g-fs-10"/>
							</div>
						</div>
						<div
							v-if="item.type === 2"
							slot="content"
						>
							<div>
								<div
									v-for="_item in item.contract_items"
									:key="_item.service_item_id"
									class="__notice g-flex g-jc-sb g-pd-tb-10">
									<div class="__left">
										<div>
											<oa-explain 
												v-if="_item.service_memo"
												:content="_item.service_memo"
												placement="left-start"
												class="g-relative"
												icon="tishi"
												style="transform: translateY(2px);top:-2px;"
											/>
											<span
												class="g-fs-14"
												style="color:#484F57"
											>
												{{ _item.service_name }}
											</span>
											<span
												v-if="_item.set_type === 1"
												class="g-fs-14"
												style="color:#484F57"
											>
												（{{ _item.reference_num }}次/{{ _item.reference_period }}个月）
											</span>
											<span v-else-if="_item.set_type === 2">（选做）</span>
										</div>
									</div>
									<div class="__right g-flex g-jc-fe g-ai-c">
										<i-button 
											v-if="_item.is_close === 1" 
											type="text" 
											style="border: none;"
										>
											已关闭
										</i-button>
										<i-button 
											v-if="$auth[491] && !_item.enable_supply"
											:disabled="_item.submit_btn ? false : true" 
											type="primary" 
											class="g-m-l-10"
											@click="handleSubmit(_item, index, 0)"
										>
											提交服务
										</i-button>
										<i-button 
											v-if="$auth[491] && _item.enable_supply"
											type="primary" 
											class="g-m-l-10"
											@click="handleSubmit(_item, index, 1)"
										>
											补交服务
										</i-button>
										<i-button
											v-if="$auth[489]"
											class="__btn g-m-l-10"
											@click="handleCommitRecord(_item, index)"
										>
											提交记录
										</i-button>
										<i-dropdown
											trigger="hover"
											placement="bottom-start"
											@on-click="handleMore($event, index)"
										>
											<a
												href="javascript:void(0)"
												class="g-m-l-10 __more"
											>
												更多
												<i class="iconfont icon-triangle-down g-fs-12" />
											</a>
											<i-dropdown-menu slot="list">
												<i-dropdown-item
													v-if="$auth[492]"
													:name="'strategy-' + _item.service_id + '-'
														+ _item.service_item_id + '-'
													+ _item.service_name + '-' + _item.set_id"
												>
													查看攻略
												</i-dropdown-item>
												<i-dropdown-item
													v-if="_item.is_close === 1 && $auth[493]"
													:name="'start-' + _item.service_id + '-'
														+ _item.service_item_id + '-'
													+ _item.service_name + '-' + _item.set_id"
												>
													开启服务项
												</i-dropdown-item>
												<i-dropdown-item
													v-if="_item.set_type === 3"
													:name="'del-' + _item.service_id + '-'
														+ _item.service_item_id + '-'
													+ _item.service_name + '-' + _item.set_id"
												>
													删除
												</i-dropdown-item>
											</i-dropdown-menu>
										</i-dropdown>
									</div>
								</div>
							</div>
							<div
								class="__add g-flex g-jc-c g-ai-c g-m-t-20 g-pointer g-c-blue-mid"
								@click="handleAddSelf(item.contract_id, index)"
							>
								<i class="icon iconfont icon-add3 g-fs-12" />
								<span class="g-pd-lr-10">添加自定义服务项</span>
							</div>
						</div>
						<div
							v-else
							slot="content"
						>
							<oa-service-stage
								:list="item.service_stage"
								:contract-id="item.contract_id"
								:cur-index="index"
								:contract-company-id="$route.query.contractCompanyId"
							/>
						</div>
						<div class="_tri"/>
					</i-panel>
				</i-collapse>
				<div 
					v-else 
					class="g-m-20 g-pd-b-30 g-pd-t-5" 
					style="box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);"
				>
					<div>
						<div
							v-for="_item in company_service_item"
							:key="_item.service_item_id"
							class="__notice g-flex g-jc-sb g-pd-tb-10 g-m-lr-20">
							<div class="__left">
								<div>
									<oa-explain 
										v-if="_item.service_memo"
										:content="_item.service_memo"
										placement="left-start"
										class="g-relative"
										icon="tishi"
										style="transform: translateY(2px);top:-1px;"
									/>
									<span
										class="g-fs-14"
										style="color:#484F57"
									>
										{{ _item.service_name }}
									</span>
									<span v-if="_item.set_type === 1">
										<span
											v-if="_item.is_show_reference"
											class="g-fs-14"
											style="color:#484F57"
										>
											（{{ _item.reference_num }}次/{{ _item.reference_period }}个月）
										</span>
									</span>
									<span v-else-if="_item.set_type === 2">（选做）</span>
								</div>
							</div>
							<div class="__right g-flex g-jc-fe g-ai-c">
								<i-button 
									v-if="_item.is_close === 1" 
									type="text" 
									style="border: none;"
								>
									已关闭
								</i-button>
								<i-button 
									v-if="$auth[491] && !_item.is_close && !_item.enable_supply"
									:disabled="_item.submit_btn ? false : true" 
									type="primary" 
									class="g-m-l-10"
									@click="handleSubmit(_item, undefined, 0)"
								>
									提交服务
								</i-button>
								<i-button 
									v-if="$auth[491] && !_item.is_close && _item.enable_supply"
									type="primary" 
									class="g-m-l-10"
									@click="handleSubmit(_item, undefined, 1)"
								>
									补交服务
								</i-button>
								<i-button
									v-if="$auth[489]"
									class="__btn g-m-l-10"
									@click="handleCommitRecord(_item)"
								>
									提交记录
								</i-button>
								<i-dropdown
									trigger="hover"
									placement="bottom-start"
									@on-click="handleMore($event)"
								>
									<a
										href="javascript:void(0)"
										class="g-m-l-10 __more"
									>
										更多
										<i class="iconfont icon-triangle-down g-fs-12" />
									</a>
									<i-dropdown-menu slot="list">
										<i-dropdown-item
											v-if="$auth[492]"
											:name="'strategy-' + _item.service_id + '-'
												+ _item.service_item_id + '-'
											+ _item.service_name + '-' + _item.set_id"
										>
											查看攻略
										</i-dropdown-item>
										<i-dropdown-item
											v-if="_item.is_close === 1 && $auth[493]"
											:name="'start-' + _item.service_id + '-'
												+ _item.service_item_id + '-'
											+ _item.service_name + '-' + _item.set_id"
										>
											开启服务项
										</i-dropdown-item>
										<i-dropdown-item
											v-if="_item.set_type === 3"
											:name="'del-' + _item.service_id + '-'
												+ _item.service_item_id + '-'
											+ _item.service_name + '-' + _item.set_id"
										>
											删除
										</i-dropdown-item>
									</i-dropdown-menu>
								</i-dropdown>
							</div>
						</div>
					</div>
					<div
						class="__add g-flex g-jc-c g-ai-c g-m-t-20 g-m-lr-20 g-pointer g-c-blue-mid"
						@click="handleAddSelf(0)"
					>
						<i class="icon iconfont icon-add3 g-fs-12" />
						<span class="g-pd-lr-10">添加自定义服务项</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Button, Collapse, Panel, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Confirm } from '@components/_common/confirm/confirm';
import Explain from '@components/_common/explain/explain';
import { ServiceCommitRecord } from './commit';
import { ServiceCommitRecordAll } from './commit-all';
import { ServiceStrategy } from './strategy';
import { ServiceClose } from './close';
import { ServiceStage } from './stage';
import { ServiceDetail } from "./detail";
import { ServiceSubmit } from './submit';
import { ServiceSelfAdd } from './self-add';

export default {
	name: "oa-service-do",
	components: {
		'oa-service-stage': ServiceStage,
		'oa-explain': Explain,
		'i-button': Button,
		'i-collapse': Collapse,
		'i-panel': Panel,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
	},
	data() {
		return {
			company_name: '', // 公司名称
			item_apply_id: '', // 服务项申请id
			list: [], // 服务阶段
			arrowArr: [],
			company_service_item: [],
			customer_type: ''
		};
	},
	mounted() {
		this.loadData();
		this.$vc.on('SALE_SERVICE_DO_EDIT', ({ index = null, changed = false }) => {
			if (changed) {
				this.loadData(index);
			} else {
				this.arrowArr = ['' + index];
			}
		});
	},
	beforeDestroy() {
		this.$vc.off('SALE_SERVICE_DO_EDIT');
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(index = null) {
			let { query = {} } = getParseUrl();

			this.$request({
				url: '_SALE_SERVICE_CUSTOMER_SERVICE_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: query.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.company_name = res.data.company_name;
				this.item_apply_id = res.data.item_apply_id;
				this.company_service_item = res.data.company_service_item;
				this.customer_type = res.data.customer_type;

				if (Array.isArray(res.data.list) && res.data.list.length) {
					this.list = res.data.list;
					this.$nextTick(() => {
						if (index != null) {
							this.arrowArr = ['' + index];
						} else {
							const i = res.data.list.findIndex(it => it.status !== 3);
							this.arrowArr = ['' + i];
						}
					});
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 关闭服务
		 */
		handleClose() {
			let { query = {} } = getParseUrl();

			ServiceClose.popup({
				contractCompanyId: query.contractCompanyId
			}).then(() => {
				this.loadData();
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 跳转详情
		 */
		handleDetail() {
			let { query = {} } = getParseUrl();

			ServiceDetail.popup({
				...query,
				companyName: this.company_name
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 点击更多
		 */
		handleMore(value, index = null) {
			if (typeof value != 'undefined') {
				if (value.split('-')[0] == 'del') {
					this.handleDelete(value.split('-')[2], index);
				} else if (value.split('-')[0] == 'strategy') {
					this.handleStrategy(value, index);
				} else if (value.split('-')[0] == 'start') {
					this.handleStartService(value.split('-')[2], index);
				}
			}
		},
		/**
		 * 提交服务项
		 */
		handleSubmit(item, index = null, is_supply) {
			let { query = {} } = getParseUrl();

			if (item.enable_supply === 2) {
				this.$Message.warning('服务素材只能在阶段结束后的第二个月12号前补交，目前已过服务素材补交时间，不可补交服务');
				return;
			}
			
			ServiceSubmit.popup({
				setId: item.set_id,
				isSupply: is_supply,
				serviceName: item.service_name,
				serviceItemId: item.service_item_id,
				contractCompanyId: query.contractCompanyId,
			}).then(res => {
				if (res.changed) {
					this.loadData(index);
				} else {
					this.arrowArr = ['' + index];
				}
			}).catch(res => {
				if (res.changed) {
					this.loadData(index);
				} else {
					this.arrowArr = ['' + index];
				}
			});
		},
		/**
		 * 提交记录 查看所有
		 */
		handleCommitRecordAll() {
			let { query = {} } = getParseUrl();
			
			ServiceCommitRecordAll.popup({
				contractCompanyId: query.contractCompanyId
			}).catch((res) => {
				error && console.error(error);
			});
		},
		/**
		 * 提交记录  查看单个
		 */
		handleCommitRecord(item, index = null) {
			let { query = {} } = getParseUrl();

			ServiceCommitRecord.popup({
				curIndex: index,
				serviceItemId: item.service_item_id,
				contractCompanyId: query.contractCompanyId
			}).catch((res) => {
				this.$vc.emit('SALE_SERVICE_DO_EDIT', { index, changed: false });
			});
		},
		/**
		 * 添加自定义服务
		 */
		handleAddSelf(contract_id, index = null) {
			let { query = {} } = getParseUrl();
			
			ServiceSelfAdd.popup({
				serviceId: 0,
				contractId: contract_id,
				contractCompanyId: query.contractCompanyId
			}).then(res => {
				if (res.changed) {
					this.loadData(index);
				} else {
					this.arrowArr = ['' + index];
				}
			}).catch(res => {
				if (res.changed) {
					this.loadData(index);
				} else {
					this.arrowArr = ['' + index];
				}
			});
		},
		/**
		 * 删除自定义服务
		 */
		handleDelete(service_item_id, index) {
			Confirm.popup({
				title: '删除自定义服务项',
				msg: '确定删除该自定义服务项吗！'
			}).then(() => {
				this.$request({
					url: '_SALE_SERVICE_DEL_CUSTOM_POST',
					type: 'POST',
					loading: false,
					param: {
						service_item_id
					},
					autoTip: true
				}).then(res => {
					this.loadData(index);
					this.arrowArr = ['' + index];
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 查看攻略
		 */
		handleStrategy(value, index) {
			let { query = {} } = getParseUrl();

			ServiceStrategy.popup({
				serviceId: value.split('-')[1],
				curIndex: index,
				serviceItemId: value.split('-')[2],
				contractCompanyId: query.contractCompanyId,
				serviceName: value.split('-')[3],
				setId: value.split('-')[4]
			}).catch(res => {
				this.$vc.emit('SALE_SERVICE_DO_EDIT', { index, changed: false });
			});
		},
		/**
		 * 开启服务项
		 */
		handleStartService(service_item_id, index) {
			Confirm.popup({
				title: '开启服务项',
				msg: '确定开启该服务项吗！'
			}).then(() => {
				this.$request({
					url: '_SALE_SERVICE_OPEN_ITEM_POST',
					type: 'POST',
					loading: false,
					param: {
						service_item_id
					},
					autoTip: true
				}).then(res => {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index, changed: true });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

export const ServiceDo = module.exports.default;

</script>

<style lang="scss" scoped>
.v-sale-service-do {
	._top {
		width: 100%;
		margin-top: 15px;
		.__left {
			font-weight: bold;
		}
		.__name {
			color: #000;
			&:hover {
				color: #2397f9;
			}
		}
		.__btn {
			border-color: #e84854;
			color: #e84854;
			&:hover {
				background-color: #e84854!important;
				color: #fff!important;
			}
		}
	}
	.ivu-collapse {
		position: relative;
	}
	.ivu-collapse > .ivu-collapse-item {
		border: 1px solid #e8e8e8;
		border-radius: 5px;
		margin-bottom: 10px;
		width: 98%;
		padding: 17px 0 0 0;
		margin: 10px auto;
		-webkit-box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		overflow: hidden;
		&:hover {
			background-color: #EFF4F7;
		}
	}
	._tri {
		position: absolute;
		width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #e84854;
        box-sizing: border-box;
		top: -18px;
		left: -6px;
		transform:rotate(-45deg);
		border-top-left-radius: 5px;
	}
	.__notice {
		height: 60px;
		border-bottom: 1px solid #e8e8e8;
		.__left {
			line-height: 40px;
			a {
				color: #000;
			}
		}
		.__right {
			a {
				color: #000;
			}
			.__btn {
				border-color: #e84854;
				color: #e84854;
				&:hover {
					background-color: #e84854!important;
					color: #fff!important;
				}
			}
			.__more {
				border: 1px solid #e84854;
				padding: 7px 10px;
				border-radius: 4px;
				color:#e84854;
			}
		}
	}
	.__add {
		height: 44px;
		border-radius: 5px;
		border: 1px dashed #2397f9;
	}
	.__header {
		line-height: 24px;
		padding-right: 10px;
	}
	.__status {
		color: #e84854;
	}
	.__tip {
		color: #818794;
	}
	.__stage-panel {
		/deep/ .ivu-collapse-content > .ivu-collapse-content-box {
			padding-top: 0!important;
		}
	}
	/deep/ .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
		height: auto;
	}
	/deep/ .ivu-collapse {
		width: 100%;
		border: none;
		background-color: #fff;
	}
	/deep/ .ivu-select-selection {
        border: 1px solid #e84854;
    }
	/deep/ .ivu-icon-ios-arrow-down:before {
        color: #e84854;
    }
	/deep/ .ivu-select-placeholder {
		color: #e84854!important;
	}
}
</style>

