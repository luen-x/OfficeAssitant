<template>
	<div class="v-sale-service-stage">
		<i-collapse v-model="arrowArr1" accordion>
			<i-panel 
				v-for="(_item,_index) in list"
				:key="_item.service_id"
				:name="_index + ''"
				:hide-arrow="true"
			>
				<div class="g-m-b-10">
					<div class="g-flex g-jc-sb __txt g-pd-l-10">
						<div class="__stage g-flex">
							<div class="__icon">
								<div class="__square g-tc">
									<span>{{ _item.stage }}</span>
									<div class="__tri"/>
								</div>
							</div>
							<div class="g-flex g-pd-tb-10">
								<div class="__line g-pd-lr-30">
									<div class="__name g-flex g-fw-w">
										<span class="g-pd-r-10 g-fs-14 g-c-black1">
											第{{ ['一','二','三'][ +_item.stage - 1] }}阶段
										</span>
										<span 
											v-if="+_item.last_days > 0 && +_item.last_days <= 30" 
											style="color:#E84854"
											class="g-fs-14"
										>
											还剩{{ _item.last_days }}天到期
										</span>
									</div>
									<div class="g-fs-12 g-fw-w">
										{{ _item.start_time }} - {{ _item.end_time }}
									</div>
								</div>
								<div class="__line g-pd-lr-30" style="width: 480px;">
									<div class="g-fs-14 __tip">服务成果</div>
									<div class="g-fs-12 g-flex g-fw-w">
										<span>
											<span>必做项：</span>
											<span style="color:#E84854">
												{{ _item.finish_num }}
											</span>
											<span>/{{ _item.need_service_num }}</span>
										</span>
										<span class="g-pd-lr-20 g-c-light7">|</span>
										<span>
											<span>质检打分：</span>
											<span>{{ _item.score }}</span>
										</span>
										<span class="g-pd-lr-20 g-c-light7">|</span>
										<span>
											<span>服务提成：</span>
											<span style="color:#E84854">
												{{ _item.service_amount }}
											</span>
											<span>/{{ _item.need_service_amount }}</span>
										</span>
									</div>
								</div>
								<div 
									class="g-pd-l-30" 
									style="line-height: 23px;"
								>
									<div class="g-fs-14 __tip">服务提成获取条件（满足其一即可）</div>
									<div 
										v-if="_item.stage !== 3" 
										class="g-flex g-fw-w g-fs-12"
									>
										<div class="g-flex g-ai-c">
											<span class="g-pd-r-5">完成阶段内所有必做服务项</span>
											<i 
												v-if="_item.is_completed" 
												class="icon iconfont icon-selected g-c-green-mid g-fs-14"
											/>
											<i 
												v-else
												class="icon iconfont icon-close2 g-c-red-mid g-fs-14"
											/>
										</div>
										<span class="g-pd-lr-20 g-c-light7">|</span>
										<div class="g-flex g-ai-c">
											<span class="g-pd-r-5">质检打分大于等于8分</span>
											<i 
												v-if="+_item.score >= 8" 
												class="icon iconfont icon-selected g-c-green-mid g-fs-14"
											/>
											<i 
												v-else
												class="icon iconfont icon-close2 g-c-red-mid g-fs-14"
											/>
											<span class="g-pd-lr-20 g-c-light7">|</span>
										</div>
										<div class="g-flex g-ai-c">
											<span class="g-pd-r-5">客户累计回款达到100万</span>
											<i 
												v-if="+_item.return_amount >= 100" 
												class="icon iconfont icon-selected g-c-green-mid g-fs-14"
											/>
											<i 
												v-else
												class="icon iconfont icon-close2 g-c-red-mid g-fs-14"
											/>
										</div>
									</div>
									<div 
										v-else 
										class="g-flex g-fw-w g-fs-12"
									>
										<div class="g-flex g-ai-c">
											<span class="g-pd-r-5">完成阶段内所有必做服务项</span>
											<i 
												v-if="_item.is_completed" 
												class="icon iconfont icon-selected g-c-green-mid g-fs-14"
											/>
											<i 
												v-else
												class="icon iconfont icon-close2 g-c-red-mid g-fs-14"
											/>
										</div>
										<span class="g-pd-lr-20 g-c-light7">|</span>
										<div class="g-flex g-ai-c">
											<span class="g-pd-r-5">该阶段客户投诉记录为0</span>
											<i 
												v-if="_item.is_zero_complaint" 
												class="icon iconfont icon-selected g-c-green-mid g-fs-14"
											/>
											<i 
												v-else
												class="icon iconfont icon-close2 g-c-red-mid g-fs-14"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div 
							v-if="!_item.status" 
							class="__progress g-flex g-jc-fe g-ai-c g-pd-r-20">
							<i-circle 
								:percent="+_item.process" 
								:stroke-width="10"
								:trail-width="10"
								stroke-color="#eb8f4a"
							>
								<i class="icon iconfont icon-exclamation __alert" />
							</i-circle>
						</div>
						<div 
							v-if="_item.status === 1" 
							class="__progress g-flex g-jc-fe g-ai-c g-pd-r-20">
							<i-circle 
								:percent="+_item.process" 
								:stroke-width="10"
								:trail-width="10"
								stroke-color="#4fc43d"
							>
								<i class="icon iconfont icon-checked __success" />
							</i-circle>
						</div>
						<div 
							v-if="_item.status === 2" 
							class="__progress g-flex g-jc-fe g-ai-c g-pd-r-20">
							<i-circle 
								:percent="+_item.process" 
								:stroke-width="10"
								:trail-width="10"
								stroke-color="#2397f9"
							>
								<span class="g-fs-12 __normal">{{ +_item.process }}%</span>
							</i-circle>
						</div>
					</div>
				</div>
				<div slot="content">
					<div>
						<div 
							v-for="__item in _item.items" 
							:key="__item.service_item_id"
							class="__notice g-flex g-jc-sb g-pd-tb-10">
							<div class="__left">
								<oa-explain 
									v-if="__item.service_memo"
									:content="__item.service_memo"
									placement="left-start"
									class="g-relative"
									icon="tishi"
									style="transform: translateY(2px);top:-2px;"
								/>
								<span 
									v-if="__item.set_type === 1" 
									class="g-fs-14 g-m-l-5" 
									style="color:#484F57"
								>
									{{ __item.service_name }}
									（{{ __item.now_service_times }}
									/{{ __item.required_service_times }}）
								</span>
								<span 
									v-else-if="__item.set_type === 2" 
									class="g-fs-14" 
									style="color:#484F57"
								>
									{{ __item.service_name }}（选做）
								</span>
								<span 
									v-else
									class="g-fs-14" 
									style="color:#484F57"
								>
									{{ __item.service_name }}
								</span>
							</div>
							<div class="__right g-flex g-jc-fe g-ai-c">
								<i-button 
									v-if="__item.is_close === 1" 
									type="text"
									style="border: none;"
								>
									已关闭
								</i-button>
								<i-button 
									v-if="$auth[491] && !__item.is_close && !__item.enable_supply"
									:disabled="_item.submit_btn ? false : true" 
									type="primary" 
									class="g-m-l-10"
									@click="handleSubmit(__item,0)"
								>
									提交服务
								</i-button>
								<i-button 
									v-if="$auth[491] && !__item.is_close && __item.enable_supply"
									type="primary" 
									class="g-m-l-10"
									@click="handleSubmit(__item,1)"
								>
									补交服务
								</i-button>
								<i-button
									v-if="$auth[489]"
									class="__btn g-m-l-10"
									@click="handleCommitRecord(__item)"
								>
									提交记录
								</i-button>
								<i-dropdown
									trigger="hover" 
									placement="bottom-start"
									@on-click="handleMore"
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
												+ __item.service_item_id + '-'
											+ __item.service_name + '-' + __item.set_id"
										>
											查看攻略
										</i-dropdown-item>
										<i-dropdown-item
											v-if="__item.is_close === 1 && _item.submit_btn && $auth[493]"
											:name="'start-' + _item.service_id + '-'
												+ __item.service_item_id + '-'
											+ __item.service_name + '-' + __item.set_id"
										>
											开启服务项
										</i-dropdown-item>
										<i-dropdown-item
											v-if="__item.set_type === 3"
											:name="'del-' + _item.service_id + '-'
												+ __item.service_item_id + '-'
											+ __item.service_name + '-' + __item.set_id"
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
						@click="handleAddSelf(_item.service_id)"
					>
						<i class="icon iconfont icon-add3 g-fs-12" />
						<span class="g-pd-lr-10">添加自定义服务项</span>
					</div>
				</div>
			</i-panel>
		</i-collapse>
	</div>
</template>

<script>
import { Button, Collapse, Panel, Circle, Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';
import { Confirm } from '@components/_common/confirm/confirm';
import Explain from '@components/_common/explain/explain';
import { ServiceCommitRecord } from './commit';
import { ServiceStrategy } from './strategy';
import { ServiceSubmit } from './submit';
import { ServiceSelfAdd } from './self-add';

export default {
	name: "oa-service-stage",
	components: {
		'oa-explain': Explain,
		'i-button': Button,
		'i-collapse': Collapse,
		'i-panel': Panel,
		'i-circle': Circle,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'i-tooltip': Tooltip
	},
	props: {
		list: Array,
		curIndex: Number,
		contractId: [String, Number],
		contractCompanyId: [String, Number]
	},
	data() {
		return {
			arrowArr1: []
		};
	},
	mounted() {
		this.list.forEach((item, index) => {
			item.items.forEach(_item => {
				this.$set(_item, 'poptipVisible', false);
			});

			if (item.now_stage === 1) {
				this.arrowArr1 = ['' + index];
			}
		});
	},
	methods: {
		/**
		 * 点击更多
		 */
		handleMore(value) {
			if (typeof value != 'undefined') {
				if (value.split('-')[0] == 'del') {
					this.handleDelete(value.split('-')[2]);
				} else if (value.split('-')[0] == 'strategy') {
					this.handleStrategy(value);
				} else if (value.split('-')[0] == 'start') {
					this.handleStartService(value.split('-')[2]);
				}
			}
		},
		/**
		 * 提交服务项
		 */
		handleSubmit(item, is_supply) {
			if (item.enable_supply === 2) {
				this.$Message.warning('服务素材只能在阶段结束后的第二个月12号前补交，目前已过服务素材补交时间，不可补交服务');
				return;
			} 
			
			ServiceSubmit.popup({
				setId: item.set_id,
				isSupply: is_supply,
				serviceName: item.service_name,
				serviceItemId: item.service_item_id,
				contractCompanyId: this.contractCompanyId
			}).then(res => {
				if (res.changed) {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				} else {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: false });
				}
			}).catch(res => {
				if (res.changed) {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				} else {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: false });
				}
			});
		},
		/**
		 * 提交记录
		 */
		handleCommitRecord(item) {
			ServiceCommitRecord.popup({ 
				curIndex: this.curIndex,
				serviceItemId: item.service_item_id,
				contractCompanyId: this.contractCompanyId
			}).catch(res => {
				this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: false });
			});
		},
		/**
		 * 添加自定义服务
		 */
		handleAddSelf(service_id) {
			ServiceSelfAdd.popup({
				serviceId: service_id,
				contractId: this.contractId,
				contractCompanyId: this.contractCompanyId
			}).then(res => {
				if (res.changed) {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				} else {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: false });
				}
			}).catch(res => {
				if (res.changed) {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				} else {
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: false });
				}
			});
		},
		/**
		 * 删除自定义服务
		 */
		handleDelete(service_item_id) {
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
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 查看攻略
		 */
		handleStrategy(value) {
			ServiceStrategy.popup({
				serviceId: value.split('-')[1],
				curIndex: this.curIndex,
				serviceItemId: value.split('-')[2],
				contractCompanyId: this.contractCompanyId,
				serviceName: value.split('-')[3],
				setId: value.split('-')[4]
			}).catch(res => {
				this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: false });
			});
		},
		/**
		 * 开启服务项
		 */
		handleStartService(service_item_id) {
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
					this.$vc.emit('SALE_SERVICE_DO_EDIT', { index: this.curIndex, changed: true });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};

export const ServiceStage = module.exports.default;

</script>
<style lang="scss">
.v-sale-service-stage {
	.__stage {
		.__icon {
			width: 30px;
		}
		.__square {
			width: 30px;
			height: 35px;
			background-color: #e84854;
			color: #fff;
			line-height: 30px;
			position: relative;
		}
		.__tri {
			width:20px;
			height: 20px;
			background-color: #f5f5f6;
			position: absolute;
			top: 28px;
			left: 5px;
			transform:rotate(45deg);
		}
		.__name {
			font-weight: bold!important;
		}
		.__line {
			padding: 0 30px;
			line-height: 23px;
			border-right: 1px solid #d4d7db;
		}
	}
	.__progress {
		.__success {
			color: #4fc43d;
		}
		.__alert {
			color: #eb8f4a;
		}
		.__normal {
			color: #2397f9;
		}
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
			.__more {
				border: 1px solid #e84854;
				padding: 7px 10px;
				border-radius: 4px;
				color:#e84854;
			}
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
	.__add {
		height: 44px;
		border-radius: 5px;
		border: 1px dashed #2397f9;
	}
	.__txt {
		background-color: #f5f5f6;
		&:hover {
			background-color: #EFF4F7;
		}
		&:hover .__tri {
			background-color: #EFF4F7;
		}
	}
	.__tip {
		color: #818794;
	}
	.ivu-chart-circle {
		width: 40px!important;
		height: 40px!important;
	}
	.ivu-collapse > .ivu-collapse-item {
		border-top: none;
	}
	.ivu-btn-primary[disabled] {
		background-color: #F2A4AA!important;
		border-color: #F2A4AA!important;
		color: #fff;
	}
	.ivu-collapse-content {
		padding: 0;
	}
	.ivu-collapse-content > .ivu-collapse-content-box {
		padding-top: 0;
		margin-top: -8px;
	}
	.ivu-select-selection {
        border: 1px solid #e84854;
    }
	.ivu-icon-ios-arrow-down:before {
        color: #e84854;
    }
	.ivu-select-placeholder {
		color: #e84854!important;
	}
	.ivu-btn-text:hover {
		color: #000;
	}
	.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
		padding: 0;
		border-bottom: none;
		line-height: 14px;
	}
}
</style>

