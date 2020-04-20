<template>
	<div 
		:style="!contract_list.length ? 'height:calc(100% - 60px);' : 'height:auto;'"
		class="g-relative"
	>
		<oa-loading v-if="loading"/>
		<div class="g-m-b-30 v-sale-service-royalty">
			<div class="_detail-content">
				<div 
					v-if="!contract_list.length" 
					class="g-flex g-jc-c g-ai-c"
					style="height:100%"
				>
					<div style="width:416px;margin-top: 50px">
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">该客户的合同中暂不包含服务提成~</div>
					</div>
				</div>
				<div v-else>
					<div 
						v-for="(item, index) in contract_list" 
						:key="index"
					>
						<div class="g-m-tb-20 g-fs-14 g-flex g-jc-sb g-ai-c g-pd-r-20">
							<div class="g-c-black6">
								<span class="__title-bar g-m-r-5"/>
								<span>合同编号：</span>
								<span 
									v-for="(it, i) in item.contract" 
									:key="i"
								>
									<span>{{ it.contract_type_name + it.contract_num }}</span>
									<span v-if="it.invalid_type">（已失效）</span>
									<span v-if="i !== item.contract.length - 1">、</span>
								</span>
							</div>
							<i-poptip 
								transfer 
								trigger="click"
								placement="left-start"
								width="330"
								word-wrap
								popper-class="v-sale-service-royalty"
								@on-popper-show="handleContent(item.contract_id)"
							>
								<i-button v-if="item.show_change_record" class="__btn">服务提成变更记录</i-button>
								<oa-record 
									slot="content" 
									:records="popContent[item.contract_id]"
									max-height="300px"
								>
									<div slot-scope="{data}" style="margin-top: -18px;">
										<div class="g-flex">
											<span>{{ data.create_time }}</span>
											<span class="g-m-l-10">{{ data.type_name }}</span>
										</div>
										<div>{{ data.content }}</div>
									</div>
								</oa-record>
							</i-poptip>
						</div>
						<div class="g-flex g-fs-12">
							<div class="__info g-c-black6">
								<span>合作项目：</span>
								<i-tooltip 
									v-if="item.product_names.length > 15"
									transfer 
									placement="bottom-start"
									max-width="300"
								>
									<span>{{ item.product_names.substring(0, 15) + '...' }}</span>
									<div slot="content">
										<span>{{ item.product_names }}</span>
									</div>
								</i-tooltip>
								<span v-else>{{ item.product_names }}</span>
							</div>
							<div class="__info g-c-black6">
								<span>总实付金额：</span>
								<span>{{ '￥' + item.payment_amount }}</span>
							</div>
						</div>
						<div class="g-flex g-fs-12 g-m-t-10">
							<div class="__info g-c-black6">
								<span>服务提成：</span>
								<span>{{ '￥' + item.need_service_amount_total }}</span>
							</div>
							<div class="__info g-c-black6">
								<span>已发服务提成：</span>
								<i-tooltip 
									v-if="item.service_amount_total !== '0.00'"
									transfer 
									placement="bottom-start"
									max-width="300"
								>
									<span class="g-c-blue-mid g-pointer">{{ '￥' + item.service_amount_total }}</span>
									<div slot="content">
										<div 
											v-for="(it, i) in item.service_amount_grant_assign" 
											:key="i"
										>
											<span>{{ it.staff_name }}：</span>
											<span>{{ it.service_amount }}</span>
										</div>
									</div>
								</i-tooltip>
								<span v-else>{{ '￥' + item.service_amount_total }}</span>
							</div>
						</div>
						<div class="__content g-m-r-20 g-m-t-20">
							<i-table v-if="item.stage_list.length" :columns="stage_info" :data="item.stage_list" stripe/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Table, Button, Tooltip, Poptip } from 'iview';
import Loading from '@components/_common/loading/loading';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { ServiceComplain } from './complain';
import Record from "../record";

export default {
	name: "oa-service-royalty",
	components: {
		'i-table': Table,
		'i-button': Button,
		'i-poptip': Poptip,
		'i-tooltip': Tooltip,
		'oa-loading': Loading,
		'oa-record': Record,
	},
	props: {
		fromOther: Boolean,
		contractCompanyId: [String, Number],
		name: String
	},
	data() {
		return {
			loading: false,
			popContent: {},
			is_need_again_quality: '', // 是否需要重新回访
			contract_list: [], // 服务提成列表
			OSS_SEARCH_EMPTY,
			stage_info: [// 服务阶段信息
				{
					title: '服务阶段',
					key: 'stage',
					minWidth: 220,
					render: (h, { row }) => {
						return (
							<div>
								<span>{['第一阶段', '第二阶段', '第三阶段'][+row.stage - 1]}</span>
								<span>{'（' + row.start_time + '-' + row.end_time + '）'}</span>
							</div>
						);
					}
				},
				{
					title: '服务提成',
					key: 'amount',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.service_amount !== '0.00' ? (
										<Tooltip 
											transfer 
											placement="bottom-start"
											maxWidth="300"
										>
											<span class="g-c-blue-mid">
												{row.service_amount + '/' + row.need_service_amount}
											</span>
											<div slot="content">
												{
													row.service_amount_assign.length && (
														row.service_amount_assign.map(it => {
															return <p>{it.staff_name + '：' + it.service_amount}</p>;
														})
													)
												}
											</div>
										</Tooltip>
									) : <span>{row.service_amount + '/' + row.need_service_amount}</span>
								}
							</div>
						);
					}
				},
				{
					title: '质检评分',
					key: 'score',
					minWidth: 110
				},
				{
					title: '回款金额',
					key: 'return_amount',
					minWidth: 110
				},
				{
					title: '服务完成情况',
					key: 'finished',
					minWidth: 110,
					render: (h, { row }) => {
						return (
							<div>
								<span>{row.finish_num}/{row.need_service_num}</span>
							</div>
						);
					}
				},
				{
					title: '发放状态',
					key: 'is_grant',
					minWidth: 110,
					render: (h, { row }) => {
						return (
							<div class={{
								'g-c-green-mid': row.is_grant === 0,
								'g-c-blue-mid': row.is_grant === 1,
								'g-c-orange-mid': row.is_grant === 2
							}}>
								{['未发放', '已发放', '部分发放'][+row.is_grant]}
							</div>
						);
					}
				},
				{
					title: '操作',
					key: 'opt',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								{
									(row.is_appeal === 1 && !this.fromOther) && <span class="g-c-blue-mid g-pointer" onClick={() => {
										ServiceComplain.popup({
											serviceId: row.service_id,
											contractCompanyId: this.contractCompanyId
										}).catch((error) => {});
									}}>发起提成申诉</span>
								}
								{
									row.is_appeal === 2 && '已发起提成申诉'
								}
								{
									!row.is_appeal && '--'
								}
							</div>
						);
					}
				}
			]
		};
	},
	watch: {
		contractCompanyId() {
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.name === "servicesCommission" && this.stage_info.pop();
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.contract_list = [];
			this.$request({
				url: '_SALE_SERVICE_AMOUNT_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;
				this.is_need_again_quality = res.data.is_need_again_quality;
				if (Array.isArray(res.data)) {
					this.contract_list = res.data;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		handleContent(contract_id) {
			if (this.popContent[contract_id]) return;
			this.$request({
				url: '_SALE_SERVICE_AMOUNT_CHANGE_RECORD_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_id
				},
				autoTip: false
			}).then(res => {
				if (res.data.length) {
					this.$set(this.popContent, contract_id, res.data);
				} else {
					this.$set(this.popContent, contract_id, [{ type_name: '暂无服务提成变更记录' }]);
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};

export const ServiceRoyalty = module.exports.default;

</script>

<style lang="scss">
.v-sale-service-royalty {
	// width: 100%;
	// height: 100%;
	._detail-content {
		position: relative;
		padding: 0 16px;
		height: 100%;
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
		.__btn {
			border-color: #e84854;
			color: #e84854;
			&:hover {
				background-color: #e84854!important;
				color: #fff!important;
			}
		}
		.__info {
			width: 300px;
		}
	}
	.ivu-table th {
		font-weight: normal;
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
	.ivu-poptip-inner {
		background: rgb(88, 94, 107)!important;
		color: #fff!important;
	}
	.ivu-poptip-inner {
		background:rgb(88, 94, 107);
			.ivu-poptip-body{
				background:rgb(88, 94, 107);
				border-radius: 4px;
				color: #fff;
				padding: 8px 5px;
			}
	}
	.ivu-poptip-arrow:after{
		border-left-color: rgb(88, 94, 107)!important;
	}	
}
</style>
