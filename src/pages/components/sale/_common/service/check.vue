<template>
	<div 
		:style="!list.length ? 'height:calc(100% - 60px);' : 'height:auto;'"
		class="g-relative"
	>
		<oa-loading v-if="loading"/>
		<div class="v-sale-quality-check">
			<div class="_detail-content">
				<div 
					v-if="!list.length" 
					class="g-flex g-jc-c g-ai-c"
					style="height:100%"
				>
					<div style="width:416px;">
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">暂无质检跟进记录~</div>
					</div>
				</div>
				<div v-else>
					<div>
						<div class="__content g-m-tb-20 g-m-r-20">
							<i-table 
								:height="tableHeight"
								:columns="columns" 
								:data="list" 
								stripe
								row-key
								@on-row-click="handleRowClick"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Table } from 'iview';
import Loading from '@components/_common/loading/loading';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { tableHeight } from '@extends/mixins/tableHeight';
import { ServiceRoyaltyReturn } from './royalty-return';
import { ServiceQualityCheckRecord } from './check-record';

export default {
	name: "oa-quality-check",
	components: {
		'i-table': Table,
		'oa-loading': Loading
	},
	mixins: [
		tableHeight({ 
			containerClass: 'v-sale-quality-check', 
			expand: false, 
			extra: 30 
		})
	],
	props: {
		contractCompanyId: [String, Number],
		fromOther: Boolean
	},
	data() {
		return {
			loading: false,
			list: [], // 质检跟进列表
			OSS_SEARCH_EMPTY,
			columns: [// 质检跟进
				{
					type: "expand",
					minWidth: 20,
					render: (h, { row }) => {
						return (
							<div>
								<ServiceQualityCheckRecord 
									current={row} 
									fromOther={this.fromOther}
									onReload={() => { this.loadData(); }}
								/>
							</div>
						);
					}
				},
				{
					title: '质检日期',
					key: 'create_time',
					minWidth: 180,
					renderHeader: (h) => {
						return <div style="padding-left:52px">质检日期</div>;
					},
					render: (h, { row }) => {
						return (
							<div>
								{
									row.follow_status === 1 && <span 
										class="g-c-orange-dark g-m-r-5" 
										style="background-color: rgba(237,143,74,0.3);border-radius: 2px;padding: 1px 5px;"
									>
									需跟进
									</span>
								}
								{
									row.follow_status === 2 && <span 
										class="g-c-green-mid g-m-r-5" 
										style="background-color: rgba(69,208,47,0.3);border-radius: 2px;padding: 1px 5px;"
									>
									已解决
									</span>
								}
								<span>{row.create_time}</span>
							</div>
						);
					}
				},
				{
					title: '质检人',
					key: 'quality_staff_name',
					minWidth: 80
				},
				{
					title: '接通情况',
					key: 'call_status',
					minWidth: 80,
					render: (h, { row }) => {
						return (
							<div>
								<span>
									{['正常接通', '未接', '无效', '雷区', '非雷', '1正常', '2非雷', 
										'2雷区', '不回访', '暂不回访', '到期', '已退', '未评', '完结'][+row.call_status - 1]}
								</span>
							</div>
						);
					}
				},
				{
					title: '客户评分',
					key: 'score',
					minWidth: 80
				},
				{
					title: '操作',
					key: 'opt',
					width: 110,
					render: (h, { row }) => {
						return (
							<div>
								{
									row.is_need_again_quality === 1 && !this.fromOther && <span 
										class="g-operation"
										onClick={(e) => { 
											e.stopPropagation();
											this.handleReturn(row);
										}}
									>
									要求重新回访
									</span>
								}
								{
									row.is_need_again_quality === 2 && <span class="g-c-black7">已要求重新回访</span>
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
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.list = [];
			this.$request({
				url: '_SALE_SERVICE_QUALITY_RECORD_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;

				if (res.data.list.length) {
					this.list = res.data.list;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 单击单行时触发
		 */
		handleRowClick(row, index) {
			row._expanded = !row._expanded;
			this.list.splice(index, 1, row);
	
			if (row._expanded) {
				this.list.forEach((item, item_index) => {
					if (+item_index === +index) {
						item._expanded = true;
					} else {
						item._expanded = false;
					}
				});
			}
		},
		/**
		 * 要求重新回访
		 */
		handleReturn(row) {
			ServiceRoyaltyReturn.popup({
				contractCompanyId: this.contractCompanyId
			}).then(() => {
				this.loadData();
			}).catch((error) => {
				error && console.error(error);
			});
		},
	}
};

export const ServiceQualityCheck = module.exports.default;

</script>

<style lang="scss">
.v-sale-quality-check {
	width: 100%;
	height: 100%;
	._detail-content {
		padding: 0 16px;
		height: 100%;
	}
	.ivu-table th {
		font-weight: normal;
	}
	td.ivu-table-expanded-cell {
		padding: 0;
	}
	.ivu-icon-ios-arrow-forward::before {
		content: '\F341';
		font-size: 18px;
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
